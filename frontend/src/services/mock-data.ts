import type { Employee, DashboardStats, TreeNode, User } from '../types';

export const demoUsers: Record<string, { user: User; password: string }> = {
  'admin@ems.com': {
    user: { id: 'u1', name: 'Super Admin', email: 'admin@ems.com', role: 'super_admin', employee: 'EMP001' },
    password: 'Admin@123',
  },
  'hr@ems.com': {
    user: { id: 'u2', name: 'HR Manager', email: 'hr@ems.com', role: 'hr', employee: 'EMP010' },
    password: 'Hr@12345',
  },
  'alice@ems.com': {
    user: { id: 'u3', name: 'Alice Johnson', email: 'alice@ems.com', role: 'employee', employee: 'EMP001' },
    password: 'Alice@123',
  },
};

export const demoEmployees: Employee[] = [
  { id: 'e1', employeeId: 'EMP001', name: 'Alice Johnson', email: 'alice@ems.com', phone: '+1-555-0101', department: 'Engineering', designation: 'VP Engineering', salary: 180000, joiningDate: '2020-01-15', status: 'active', role: 'employee', reportingManager: null, reportingManagerName: null, profileImage: null },
  { id: 'e2', employeeId: 'EMP002', name: 'Bob Smith', email: 'bob@ems.com', phone: '+1-555-0102', department: 'Engineering', designation: 'Engineering Manager', salary: 140000, joiningDate: '2020-06-01', status: 'active', role: 'employee', reportingManager: 'e1', reportingManagerName: 'Alice Johnson', profileImage: null },
  { id: 'e3', employeeId: 'EMP003', name: 'Carol White', email: 'carol@ems.com', phone: '+1-555-0103', department: 'Engineering', designation: 'Senior Developer', salary: 110000, joiningDate: '2021-03-10', status: 'active', role: 'employee', reportingManager: 'e2', reportingManagerName: 'Bob Smith', profileImage: null },
  { id: 'e4', employeeId: 'EMP004', name: 'Dave Brown', email: 'dave@ems.com', phone: '+1-555-0104', department: 'Engineering', designation: 'Developer', salary: 90000, joiningDate: '2022-07-20', status: 'active', role: 'employee', reportingManager: 'e2', reportingManagerName: 'Bob Smith', profileImage: null },
  { id: 'e5', employeeId: 'EMP005', name: 'Eve Davis', email: 'eve@ems.com', phone: '+1-555-0105', department: 'Sales', designation: 'VP Sales', salary: 160000, joiningDate: '2020-02-01', status: 'active', role: 'employee', reportingManager: null, reportingManagerName: null, profileImage: null },
  { id: 'e6', employeeId: 'EMP006', name: 'Frank Miller', email: 'frank@ems.com', phone: '+1-555-0106', department: 'Sales', designation: 'Sales Manager', salary: 120000, joiningDate: '2021-01-15', status: 'active', role: 'employee', reportingManager: 'e5', reportingManagerName: 'Eve Davis', profileImage: null },
  { id: 'e7', employeeId: 'EMP007', name: 'Grace Lee', email: 'grace@ems.com', phone: '+1-555-0107', department: 'Sales', designation: 'Sales Rep', salary: 75000, joiningDate: '2022-11-01', status: 'active', role: 'employee', reportingManager: 'e6', reportingManagerName: 'Frank Miller', profileImage: null },
  { id: 'e8', employeeId: 'EMP008', name: 'Henry Wilson', email: 'henry@ems.com', phone: '+1-555-0108', department: 'Marketing', designation: 'Marketing Lead', salary: 115000, joiningDate: '2021-09-15', status: 'active', role: 'employee', reportingManager: null, reportingManagerName: null, profileImage: null },
  { id: 'e9', employeeId: 'EMP009', name: 'Ivy Chen', email: 'ivy@ems.com', phone: '+1-555-0109', department: 'Marketing', designation: 'Content Writer', salary: 70000, joiningDate: '2023-02-20', status: 'active', role: 'employee', reportingManager: 'e8', reportingManagerName: 'Henry Wilson', profileImage: null },
  { id: 'e10', employeeId: 'EMP010', name: 'Jack Taylor', email: 'jack@ems.com', phone: '+1-555-0110', department: 'HR', designation: 'HR Specialist', salary: 80000, joiningDate: '2022-04-10', status: 'inactive', role: 'employee', reportingManager: null, reportingManagerName: null, profileImage: null },
  { id: 'e11', employeeId: 'EMP011', name: 'Kate Anderson', email: 'kate@ems.com', phone: '+1-555-0111', department: 'Finance', designation: 'Finance Manager', salary: 125000, joiningDate: '2021-05-01', status: 'active', role: 'employee', reportingManager: null, reportingManagerName: null, profileImage: null },
  { id: 'e12', employeeId: 'EMP012', name: 'Liam Garcia', email: 'liam@ems.com', phone: '+1-555-0112', department: 'Operations', designation: 'Operations Lead', salary: 95000, joiningDate: '2022-08-15', status: 'active', role: 'employee', reportingManager: null, reportingManagerName: null, profileImage: null },
];

export const demoDashboard: DashboardStats = {
  totalEmployees: 12,
  activeEmployees: 11,
  inactiveEmployees: 1,
  departmentCount: 5,
  departments: [
    { department: 'Engineering', count: 4 },
    { department: 'Sales', count: 3 },
    { department: 'Marketing', count: 2 },
    { department: 'HR', count: 1 },
    { department: 'Finance', count: 1 },
    { department: 'Operations', count: 1 },
  ],
  roleDistribution: [
    { role: 'super_admin', count: 1 },
    { role: 'hr', count: 1 },
    { role: 'employee', count: 10 },
  ],
  monthlyJoinings: [
    { month: 'Feb 20', count: 1 },
    { month: 'Jun 20', count: 1 },
    { month: 'Jan 21', count: 1 },
    { month: 'Mar 21', count: 1 },
    { month: 'May 21', count: 1 },
    { month: 'Sep 21', count: 1 },
    { month: 'Jan 22', count: 1 },
    { month: 'Apr 22', count: 1 },
    { month: 'Jul 22', count: 1 },
    { month: 'Aug 22', count: 1 },
    { month: 'Nov 22', count: 1 },
    { month: 'Feb 23', count: 1 },
  ],
};

export const demoTree: TreeNode = {
  _id: 'e1', employeeId: 'EMP001', name: 'Alice Johnson', designation: 'VP Engineering', department: 'Engineering', role: 'employee', profileImage: null,
  children: [
    { _id: 'e2', employeeId: 'EMP002', name: 'Bob Smith', designation: 'Engineering Manager', department: 'Engineering', role: 'employee', profileImage: null,
      children: [
        { _id: 'e3', employeeId: 'EMP003', name: 'Carol White', designation: 'Senior Developer', department: 'Engineering', role: 'employee', profileImage: null, children: [] },
        { _id: 'e4', employeeId: 'EMP004', name: 'Dave Brown', designation: 'Developer', department: 'Engineering', role: 'employee', profileImage: null, children: [] },
      ],
    },
  ],
};

// Also include the other root-level managers as children of a virtual root
export const demoForest: TreeNode[] = [
  demoTree,
  { _id: 'e5', employeeId: 'EMP005', name: 'Eve Davis', designation: 'VP Sales', department: 'Sales', role: 'employee', profileImage: null,
    children: [
      { _id: 'e6', employeeId: 'EMP006', name: 'Frank Miller', designation: 'Sales Manager', department: 'Sales', role: 'employee', profileImage: null,
        children: [
          { _id: 'e7', employeeId: 'EMP007', name: 'Grace Lee', designation: 'Sales Rep', department: 'Sales', role: 'employee', profileImage: null, children: [] },
        ],
      },
    ],
  },
  { _id: 'e8', employeeId: 'EMP008', name: 'Henry Wilson', designation: 'Marketing Lead', department: 'Marketing', role: 'employee', profileImage: null,
    children: [
      { _id: 'e9', employeeId: 'EMP009', name: 'Ivy Chen', designation: 'Content Writer', department: 'Marketing', role: 'employee', profileImage: null, children: [] },
    ],
  },
  { _id: 'e11', employeeId: 'EMP011', name: 'Kate Anderson', designation: 'Finance Manager', department: 'Finance', role: 'employee', profileImage: null, children: [] },
  { _id: 'e12', employeeId: 'EMP012', name: 'Liam Garcia', designation: 'Operations Lead', department: 'Operations', role: 'employee', profileImage: null, children: [] },
];

export function filterEmployees(emps: Employee[], q: { search?: string; department?: string; role?: string; status?: string; sortBy?: string; sortOrder?: string }): Employee[] {
  let result = [...emps];
  if (q.search) {
    const s = q.search.toLowerCase();
    result = result.filter((e) => e.name.toLowerCase().includes(s) || e.email.toLowerCase().includes(s));
  }
  if (q.department) result = result.filter((e) => e.department === q.department);
  if (q.role) result = result.filter((e) => e.role === q.role);
  if (q.status) result = result.filter((e) => e.status === q.status);
  const field = q.sortBy || 'name';
  const order = q.sortOrder === 'desc' ? -1 : 1;
  result.sort((a, b) => {
    let av: any = a[field as keyof Employee];
    let bv: any = b[field as keyof Employee];
    if (field === 'joiningDate') { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
    if (typeof av === 'string') { av = av.toLowerCase(); bv = (bv as string).toLowerCase(); }
    return av < bv ? -order : av > bv ? order : 0;
  });
  return result;
}

export function paginate<T>(items: T[], page: number, limit: number): { data: T[]; total: number; pages: number } {
  const total = items.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  return { data: items.slice(start, start + limit), total, pages };
}
