import api from '../services/api';
import type { Employee,  DashboardStats, TreeNode, OrganizationResponse } from '../types';
import { demoEmployees, demoDashboard, demoForest, filterEmployees, paginate } from '../services/mock-data';
import { EmployeeApiResponse } from '../store/employee.store';

export interface EmployeeQuery {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// In-memory store for demo CRUD when backend is offline
let demoStore: Employee[] = [...demoEmployees];

export const employeeService = {

list: async (
  q: EmployeeQuery
): Promise<EmployeeApiResponse> => {
  try {
    const { data } =
      await api.get<EmployeeApiResponse>(
        "/employees",
        {
          params: q,
        }
      );

    return data;
  } catch {
    const filtered = filterEmployees(
      demoStore,
      q
    );

    const page = q.page ?? 1;
    const limit = q.limit ?? 10;

    const result = paginate(
      filtered,
      page,
      limit
    );

    return {
      success: true,
      message: "Success",
      data: result.data,
      pagination: {
        total: result.total,
        page,
        limit,
        pages: result.pages,
        hasNext: page < result.pages,
        hasPrevious: page > 1,
      },
    };
  }
},

  get: async (id: string): Promise<Employee> => {
    try {
      const { data } = await api.get(`/employees/${id}`);
      return data.data;
    } catch {
      const emp = demoStore.find((e) => e.id === id);
      if (!emp) throw new Error('Employee not found');
      return emp;
    }
  },
getAll: async (params:any) => {
  try {
    const { data } = await api.get(
      "/employees",
      {
        params,
      }
    );

    return {
      data: data.data,
      total: data.pagination.total,
      page: data.pagination.page,
      pages: data.pagination.pages,
      limit: data.pagination.limit,
    };
  } catch {
    let employees = [...demoStore];

    if (params?.status) {
      employees = employees.filter(
        (e) => e.status === params.status
      );
    }

    if (params?.department) {
      employees = employees.filter(
        (e) =>
          e.department ===
          params.department
      );
    }

    if (params?.role) {
      employees = employees.filter(
        (e) =>
          e.role === params.role
      );
    }

    if (params?.search) {
      const search =
        params.search.toLowerCase();

      employees = employees.filter(
        (e) =>
          e.name
            .toLowerCase()
            .includes(search) ||
          e.email
            .toLowerCase()
            .includes(search)
      );
    }

    return {
      data: employees.slice(
        0,
        params?.limit ?? 10
      ),
      total: employees.length,
      page: params?.page ?? 1,
      pages: 1,
      limit: params?.limit ?? 10,
    };
  }
},

  create: async (payload: FormData): Promise<Employee> => {
    try {
      const { data } = await api.post('/employees', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      return data;
    } catch {
      const newEmp: Employee = {
        id: `e${Date.now()}`,
        employeeId: payload.get('employeeId') as string,
        name: payload.get('name') as string,
        email: payload.get('email') as string,
        phone: payload.get('phone') as string,
        department: payload.get('department') as string,
        designation: payload.get('designation') as string,
        salary: Number(payload.get('salary')),
        joiningDate: payload.get('joiningDate') as string,
        status: (payload.get('status') as any) || 'active',
        role: (payload.get('role') as any) || 'employee',
        reportingManager: (payload.get('reportingManager') as string) || null,
        reportingManagerName: null,
        profileImage: null,
      };
      demoStore.push(newEmp);
      return newEmp;
    }
  },

  update: async (id: string, payload: FormData): Promise<Employee> => {
    try {
      const { data } = await api.put(`/employees/${id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      return data;
    } catch {
      const idx = demoStore.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error('Employee not found');
      const updated = { ...demoStore[idx] };
      for (const [k, v] of payload.entries()) {
        (updated as any)[k] = k === 'salary' ? Number(v) : v;
      }
      demoStore[idx] = updated;
      return updated;
    }
  },

  remove: async (id: string): Promise<void> => {
    try {
      await api.delete(`/employees/${id}`);
    } catch {
      demoStore = demoStore.filter((e) => e.id !== id);
    }
  },
reportees: async (id: string): Promise<Employee[]> => {
  try {
    const { data } = await api.get(`/employees/${id}/reportees`);

    return data.data ?? [];
  } catch {
    return demoStore.filter((e) => e.reportingManager === id);
  }
},

  setManager: async (id: string, managerId: string): Promise<Employee> => {
    try {
      const { data } = await api.patch(`/employees/${id}/manager`, { reportingManager: managerId });
      return data;
    } catch {
      const emp = demoStore.find((e) => e.id === id);
      if (!emp) throw new Error('Employee not found');
      emp.reportingManager = managerId || null;
      const mgr = demoStore.find((e) => e.id === managerId);
      emp.reportingManagerName = mgr?.name ?? null;
      return emp;
    }
  },

  tree: async (): Promise<TreeNode> => {
    try {
      const { data } = await api.get('/organization/tree');
      return data;
    } catch {
      // Return first tree; UI handles forest
      return demoForest[0];
    }
  },

forest: async (): Promise<TreeNode[]> => {
  try {
    const { data } = await api.get("/organization/tree");

    console.log("Organization API:", data);

    return data.data;
  } catch (err) {
    console.error(err);
    return demoForest;
  }
},

  dashboard: async (): Promise<DashboardStats> => {
    try {
      const { data } = await api.get('/dashboard/stats');
       return data.data;
    } catch {
      const active = demoStore.filter((e) => e.status === 'active').length;
      const inactive = demoStore.filter((e) => e.status === 'inactive').length;
      const depts = new Map<string, number>();
      demoStore.forEach((e) => depts.set(e.department, (depts.get(e.department) || 0) + 1));
      const roles = new Map<string, number>();
      demoStore.forEach((e) => roles.set(e.role, (roles.get(e.role) || 0) + 1));
      return {
        totalEmployees: demoStore.length,
        activeEmployees: active,
        inactiveEmployees: inactive,
        departmentCount: depts.size,
        departments: [...depts.entries()].map(([department, count]) => ({ department, count })),
        roleDistribution: [...roles.entries()].map(([role, count]) => ({ role, count })),
        monthlyJoinings: demoDashboard.monthlyJoinings,
      };
    }
  },

  importCsv: async (file: File): Promise<{ created: number; updated: number; errors: string[] }> => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/employees/import', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      return data;
    } catch {
      return { created: 0, updated: 0, errors: ['CSV import requires the backend server to be running.'] };
    }
  },
};
