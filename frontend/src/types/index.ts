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
   id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  status: "active" | "inactive";
  role: "super_admin" | "hr" | "employee";
  reportingManager: string | null;
  reportingManagerName?: string | null;
  profileImage?: string | null;
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
  designation: string;
  department: string;
  role: Role;
  email?: string;
  phone?: string;
  profileImage?: string | null;
  children: TreeNode[];
}
export interface OrganizationResponse {
  success: boolean;
  data: TreeNode[];
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
  success: boolean;
  message: string;
  token: string;
  user: User;
}
// export interface PaginatedEmployees {
//   success: boolean;
//   message: string;
//   data: Employee[];
//   pagination: {
//     total: number;
//     page: number;
//     limit: number;
//     pages: number;
//     hasNext: boolean;
//     hasPrevious: boolean;
//   };
// }

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}