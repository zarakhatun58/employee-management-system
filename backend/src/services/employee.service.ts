import { FilterQuery, SortOrder, Types } from "mongoose";
import { Employee, IEmployee } from "../models/Employee";
import { ApiError } from "../types/errors";
import { wouldCreateCycle } from "../utils/tree";
import { User } from "../models/User";

export interface EmployeeQuery {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  role?: string;
  status?: string;
  sortBy?: "name" | "joiningDate" | "salary" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface EmployeePayload {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: Date | string;
  status?: "active" | "inactive";
  role?: "super_admin" | "hr" | "employee";
  reportingManager?: string | null;
  profileImage?: string | null;
}

const SORT_FIELDS: Record<string, string> = {
  name: "name",
  joiningDate: "joiningDate",
  salary: "salary",
  createdAt: "createdAt",
};

function getSort(
  field?: string,
  order?: "asc" | "desc"
): Record<string, SortOrder> {
  return {
    [SORT_FIELDS[field || "name"] || "name"]:
      order === "desc" ? -1 : 1,
  };
}

async function validateUniqueFields(
  payload: Partial<EmployeePayload>,
  excludeId?: string
) {
  if (payload.employeeId) {
    const exists = await Employee.findOne({
      employeeId: payload.employeeId,
      ...(excludeId && {
        _id: { $ne: excludeId },
      }),
    });

    if (exists) {
      throw new ApiError(
        409,
        "Employee ID already exists"
      );
    }
  }

  if (payload.email) {
    const exists = await Employee.findOne({
      email: payload.email.toLowerCase(),
      ...(excludeId && {
        _id: { $ne: excludeId },
      }),
    });

    if (exists) {
      throw new ApiError(
        409,
        "Email already exists"
      );
    }
  }

  if (payload.phone) {
    const exists = await Employee.findOne({
      phone: payload.phone,
      ...(excludeId && {
        _id: { $ne: excludeId },
      }),
    });

    if (exists) {
      throw new ApiError(
        409,
        "Phone number already exists"
      );
    }
  }
}

async function validateManager(
  employeeId: Types.ObjectId,
  managerId: string | null
): Promise<Types.ObjectId | null> {
  if (!managerId) {
    return null;
  }

  if (!Types.ObjectId.isValid(managerId)) {
    throw new ApiError(
      400,
      "Invalid reporting manager"
    );
  }

  const managerObjectId =
    new Types.ObjectId(managerId);

  if (employeeId.equals(managerObjectId)) {
    throw new ApiError(
      400,
      "Employee cannot report to themselves"
    );
  }

  const manager = await Employee.findById(
    managerObjectId
  );

  if (!manager) {
    throw new ApiError(
      404,
      "Reporting manager not found"
    );
  }

  const hasCycle =
    await wouldCreateCycle(
      employeeId,
      managerObjectId
    );

  if (hasCycle) {
    throw new ApiError(
      400,
      "Circular reporting detected"
    );
  }

  return managerObjectId;
}

export const employeeService = { 
  async list(query: EmployeeQuery) {
  const page = Math.max(Number(query.page) || 1, 1);

  const limit = Math.min(
    Math.max(Number(query.limit) || 10, 1),
    100
  );

  const filter: FilterQuery<IEmployee> = {
    deleted: false,
  };

  if (query.search?.trim()) {
    const keyword = query.search.trim();

    filter.$or = [
      {
        name: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        email: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        employeeId: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: keyword,
          $options: "i",
        },
      },
    ];
  }

  if (query.department) {
    filter.department = query.department;
  }

  if (query.role) {
    filter.role = query.role;
  }

  if (query.status) {
    filter.status = query.status;
  }

  const [employees, total] = await Promise.all([
    Employee.find(filter)
      .populate(
        "reportingManager",
        "name employeeId designation"
      )
      .sort(getSort(query.sortBy, query.sortOrder))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    Employee.countDocuments(filter),
  ]);

  const data = employees.map((employee: any) => ({
    id: employee._id.toString(),
    employeeId: employee.employeeId,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    salary: employee.salary,
    joiningDate: employee.joiningDate,
    status: employee.status,
    role: employee.role,
    profileImage: employee.profileImage,
    reportingManager:
      employee.reportingManager?._id ?? null,
    reportingManagerName:
      employee.reportingManager?.name ?? null,
    deleted: employee.deleted,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
  }));

  return {
    success: true,
    message: "Employees fetched successfully",
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNext:
        page < Math.ceil(total / limit),
      hasPrevious: page > 1,
    },
  };
},

async get(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(
      400,
      "Invalid employee id"
    );
  }

  const employee = await Employee.findOne({
    _id: id,
    deleted: false,
  })
    .populate(
      "reportingManager",
      "name employeeId designation"
    )
    .lean();

  if (!employee) {
    throw new ApiError(
      404,
      "Employee not found"
    );
  }

  const manager =
    employee.reportingManager as any;

  return {
    success: true,
    message: "Employee fetched successfully",
    data: {
      id: employee._id.toString(),
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      designation: employee.designation,
      salary: employee.salary,
      joiningDate: employee.joiningDate,
      status: employee.status,
      role: employee.role,
      profileImage: employee.profileImage,
      reportingManager:
        manager?._id ?? null,
      reportingManagerName:
        manager?.name ?? null,
      reportingManagerEmployeeId:
        manager?.employeeId ?? null,
      reportingManagerDesignation:
        manager?.designation ?? null,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    },
  };
},
async create(payload: EmployeePayload) {
  await validateUniqueFields(payload);

  const employeeId = new Types.ObjectId();

  const manager = await validateManager(
    employeeId,
    payload.reportingManager ?? null
  );

  const employee = await Employee.create({
    employeeId: payload.employeeId,
    name: payload.name,
    email: payload.email.toLowerCase().trim(),
    phone: payload.phone,
    department: payload.department,
    designation: payload.designation,
    salary: payload.salary,
    joiningDate: payload.joiningDate,
    status: payload.status ?? "active",
    role: payload.role ?? "employee",
    reportingManager: manager,
    profileImage: payload.profileImage ?? null,
    deleted: false,
    _id: employeeId,
  });

  await employee.populate(
    "reportingManager",
    "name employeeId designation"
  );

  return {
    success: true,
    message: "Employee created successfully.",
    data: employee.toJSON(),
  };
},

async update(
  id: string,
  payload: Partial<EmployeePayload>
) {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(
      400,
      "Invalid employee id"
    );
  }

  const employee = await Employee.findOne({
    _id: id,
    deleted: false,
  });

  if (!employee) {
    throw new ApiError(
      404,
      "Employee not found"
    );
  }

  await validateUniqueFields(payload, id);

  if (payload.reportingManager !== undefined) {
    employee.reportingManager =
      await validateManager(
        employee._id as Types.ObjectId,
        payload.reportingManager
      );
  }

  if (payload.employeeId !== undefined) {
    employee.employeeId = payload.employeeId;
  }

  if (payload.name !== undefined) {
    employee.name = payload.name;
  }

  if (payload.email !== undefined) {
    employee.email = payload.email
      .toLowerCase()
      .trim();
  }

  if (payload.phone !== undefined) {
    employee.phone = payload.phone;
  }

  if (payload.department !== undefined) {
    employee.department =
      payload.department;
  }

  if (payload.designation !== undefined) {
    employee.designation =
      payload.designation;
  }

  if (payload.salary !== undefined) {
    employee.salary = payload.salary;
  }

  if (payload.joiningDate !== undefined) {
    employee.joiningDate = new Date(
      payload.joiningDate
    );
  }

  if (payload.status !== undefined) {
    employee.status = payload.status;
  }

  if (payload.role !== undefined) {
    employee.role = payload.role;
  }

  if (payload.profileImage !== undefined) {
    employee.profileImage =
      payload.profileImage;
  }

  await employee.save();

  await employee.populate(
    "reportingManager",
    "name employeeId designation"
  );

  return {
    success: true,
    message: "Employee updated successfully.",
    data: employee.toJSON(),
  };
},
async softDelete(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid employee id");
  }

  const employee = await Employee.findOne({
    _id: id,
    deleted: false,
  });

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  employee.deleted = true;

  await employee.save();

  return {
    success: true,
    message: "Employee deleted successfully.",
  };
},

async getReportees(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid employee id");
  }

  const employee = await Employee.findOne({
    _id: id,
    deleted: false,
  });

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  const reportees = await Employee.find({
    reportingManager: id,
    deleted: false,
  })
    .sort({ name: 1 })
    .lean();

  return {
    success: true,
    count: reportees.length,
    data: reportees.map((emp: any) => ({
      id: emp._id.toString(),
      employeeId: emp.employeeId,
      name: emp.name,
      email: emp.email,
      department: emp.department,
      designation: emp.designation,
      role: emp.role,
      status: emp.status,
      profileImage: emp.profileImage,
    })),
  };
},

async setManager(
  employeeId: string,
  managerId: string | null
) {
  if (!Types.ObjectId.isValid(employeeId)) {
    throw new ApiError(400, "Invalid employee id");
  }

  const employee = await Employee.findOne({
    _id: employeeId,
    deleted: false,
  });

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  employee.reportingManager =
    await validateManager(
      employee._id as Types.ObjectId,
      managerId
    );

  await employee.save();

  await employee.populate(
    "reportingManager",
    "name employeeId designation"
  );

  return {
    success: true,
    message: "Reporting manager updated successfully.",
    data: employee.toJSON(),
  };
},
async getByUser(userId: string) {
  const user = await User.findById(userId).lean();

  if (!user || !user.employee) {
    return null;
  }

  return Employee.findById(user.employee).lean();
},
};