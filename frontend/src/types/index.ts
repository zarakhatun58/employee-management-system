export type Role = "super_admin" | "hr" | "employee";
export type EmployeeStatus = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  employee?: string | null;
}

export interface Employee {
  id?: string;
  _id?: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  status: EmployeeStatus;
  role: Role;
  reportingManager?: string | null;
  reportingManagerName?: string | null;
  profileImage?: string | null;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Used for Create & Update Employee API
 */
export interface EmployeeFormData {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number | string;
  joiningDate: string;
  role?: Role;
  status?: EmployeeStatus;
  reportingManager?: string | null;
  profileImage?: File | null;
}

export interface TreeNode {
  _id: string;
  employeeId: string;
  name: string;
  email?: string;
  phone?: string;
  designation: string;
  department: string;
  role: Role;
  profileImage?: string | null;
  children: TreeNode[];
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departmentCount: number;
  departments: {
    department: string;
    count: number;
  }[];
  roleDistribution: {
    role: string;
    count: number;
  }[];
  monthlyJoinings: {
    month: string;
    count: number;
  }[];
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface PaginatedEmployees {
  data: Employee[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}