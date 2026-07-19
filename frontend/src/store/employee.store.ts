import { create } from "zustand";
import api from "../services/api";
import type { Employee, EmployeeFormData } from "../types";

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface EmployeeApiResponse {
  success: boolean;
  message: string;
  data: Employee[];
  pagination: Pagination;
}

interface EmployeeState {
  employees: Employee[];
  employee: Employee | null;

  loading: boolean;
  saving: boolean;
  deleting: boolean;

  total: number;
  page: number;
  pages: number;
  limit: number;

  error: string | null;

  getEmployees: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => Promise<void>;

  getEmployee: (id: string) => Promise<void>;

  createEmployee: (
    data: EmployeeFormData
  ) => Promise<boolean>;

  updateEmployee: (
    id: string,
    data: EmployeeFormData
  ) => Promise<boolean>;

  deleteEmployee: (
    id: string
  ) => Promise<boolean>;

  setManager: (
    employeeId: string,
    managerId: string | null
  ) => Promise<boolean>;

  getReportees: (
    id: string
  ) => Promise<Employee[]>;

  clearEmployee: () => void;

  clearError: () => void;
}

export const useEmployeeStore =
  create<EmployeeState>((set) => ({
    employees: [],
    employee: null,

    loading: false,
    saving: false,
    deleting: false,

    total: 0,
    page: 1,
    pages: 1,
    limit: 10,

    error: null,

    getEmployees: async (params = {}) => {
      set({
        loading: true,
        error: null,
      });

      try {
        const { data } =
          await api.get<EmployeeApiResponse>("/employees", { params, });

        set({
          employees: data.data,
          total: data.pagination.total,
          page: data.pagination.page,
          pages: data.pagination.pages,
          limit: data.pagination.limit,
          loading: false,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response?.data?.message ??
            "Failed to load employees",
        });
      }
    },

    getEmployee: async (id) => {
      set({
        loading: true,
        error: null,
      });

      try {
        const { data } =
          await api.get<Employee>(
            `/employees/${id}`
          );

        set({
          employee: data,
          loading: false,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response?.data?.message ??
            "Failed to load employee",
        });
      }
    },

    createEmployee: async (form) => {
      set({
        saving: true,
        error: null,
      });

      try {
        const body = new FormData();

        Object.entries(form).forEach(
          ([key, value]) => {
            if (
              value !== undefined &&
              value !== null
            ) {
              body.append(
                key,
                value as any
              );
            }
          }
        );

        await api.post(
          "/employees",
          body,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        set({
          saving: false,
        });

        return true;
      } catch (error: any) {
        set({
          saving: false,
          error:
            error.response?.data?.message ??
            "Failed to create employee",
        });

        return false;
      }
    },

    updateEmployee: async (
      id,
      form
    ) => {
      set({
        saving: true,
        error: null,
      });

      try {
        const body = new FormData();

        Object.entries(form).forEach(
          ([key, value]) => {
            if (
              value !== undefined &&
              value !== null
            ) {
              body.append(
                key,
                value as any
              );
            }
          }
        );

        await api.put(
          `/employees/${id}`,
          body,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        set({
          saving: false,
        });

        return true;
      } catch (error: any) {
        set({
          saving: false,
          error:
            error.response?.data?.message ??
            "Failed to update employee",
        });

        return false;
      }
    },

    deleteEmployee: async (
      id
    ) => {
      set({
        deleting: true,
        error: null,
      });

      try {
        await api.delete(
          `/employees/${id}`
        );

        set({
          deleting: false,
        });

        return true;
      } catch (error: any) {
        set({
          deleting: false,
          error:
            error.response?.data?.message ??
            "Failed to delete employee",
        });

        return false;
      }
    },

    setManager: async (
      employeeId,
      managerId
    ) => {
      try {
        await api.patch(
          `/employees/${employeeId}/manager`,
          {
            reportingManager:
              managerId,
          }
        );

        return true;
      } catch {
        return false;
      }
    },

    getReportees: async (id) => {
      const { data } =
        await api.get<Employee[]>(
          `/employees/${id}/reportees`
        );

      return data;
    },

    clearEmployee: () =>
      set({
        employee: null,
      }),

    clearError: () =>
      set({
        error: null,
      }),
  }));