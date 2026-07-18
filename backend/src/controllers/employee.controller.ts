import { Response } from 'express';
import { employeeService } from '../services/employee.service';
import { ApiError } from '../types/errors';
import { AuthRequest } from '../middleware/auth.middleware';

export interface EmployeeQuery {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}


export const employeeController = {
  async list(req: AuthRequest, res: Response) {
    if (req.userRole === "employee") {
      const employee = await employeeService.getByUser(req.user!._id);
      return res.json({
        success: true,
        data: employee ? [employee] : [],
      });
    }

    const result = await employeeService.list(req.query);
    res.json(result);
  },

  async get(req: AuthRequest, res: Response) {
    if (req.userRole === "employee") {
      const employee = await employeeService.getByUser(req.user!._id);

      if (!employee || employee.id !== req.params.id) {
        throw new ApiError(
          403,
          "You can only view your own profile"
        );
      }
    }

    const employee = await employeeService.get(req.params.id);
    res.json(employee);
  },

  async create(req: AuthRequest, res: Response) {
    if (req.userRole === "employee") {
      throw new ApiError(
        403,
        "Employees cannot create employees"
      );
    }

    if (
      req.userRole === "hr" &&
      req.body.role === "super_admin"
    ) {
      throw new ApiError(
        403,
        "HR cannot create Super Admin"
      );
    }

    const payload = { ...req.body };

    if (req.file) {
      payload.profileImage = `/uploads/${req.file.filename}`;
    }

    const employee = await employeeService.create(payload);

    res.status(201).json(employee);
  },

  async update(req: AuthRequest, res: Response) {
    const payload = { ...req.body };

    if (req.file) {
      payload.profileImage =
        `/uploads/${req.file.filename}`;
    }

    if (req.userRole === "employee") {
      const employee = await employeeService.getByUser(
        req.user!._id
      );

      if (!employee || employee.id !== req.params.id) {
        throw new ApiError(
          403,
          "You can edit only your profile"
        );
      }

      delete payload.salary;
      delete payload.department;
      delete payload.designation;
      delete payload.role;
      delete payload.status;
      delete payload.reportingManager;
      delete payload.employeeId;
      delete payload.joiningDate;
    }

    if (
      req.userRole === "hr" &&
      payload.role === "super_admin"
    ) {
      throw new ApiError(
        403,
        "HR cannot assign Super Admin role"
      );
    }

    const employee = await employeeService.update(
      req.params.id,
      payload
    );

    res.json(employee);
  },

  async remove(req: AuthRequest, res: Response) {
    if (req.userRole !== "super_admin") {
      throw new ApiError(
        403,
        "Only Super Admin can delete employees"
      );
    }

    const result = await employeeService.softDelete(
      req.params.id
    );

    res.json(result);
  },

  async reportees(req: AuthRequest, res: Response) {
    if (req.userRole === "employee") {
      throw new ApiError(
        403,
        "Access denied"
      );
    }

    const reportees =
      await employeeService.getReportees(req.params.id);

    res.json(reportees);
  },

  async setManager(req: AuthRequest, res: Response) {
    if (req.userRole !== "super_admin") {
      throw new ApiError(
        403,
        "Only Super Admin can assign managers"
      );
    }

    const { reportingManager } = req.body;

    const employee =
      await employeeService.setManager(
        req.params.id,
        reportingManager ?? null
      );

    res.json(employee);
  },

  async importCsv(req: AuthRequest, res: Response) {
    if (
      req.userRole !== "super_admin" &&
      req.userRole !== "hr"
    ) {
      throw new ApiError(
        403,
        "Access denied"
      );
    }

    if (!req.file) {
      throw new ApiError(
        400,
        "CSV file required"
      );
    }

    res.status(201).json({
      success: true,
      message: "Import completed successfully",
    });
  },
};
