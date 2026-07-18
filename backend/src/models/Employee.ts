import { Schema, model, Document, Types } from "mongoose";

export type Role = "super_admin" | "hr" | "employee";
export type EmployeeStatus = "active" | "inactive";

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: Date;
  status: EmployeeStatus;
  role: Role;
  reportingManager: Types.ObjectId | null;
  profileImage: string | null;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^[0-9+\-\s]{8,15}$/, "Invalid phone number"],
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },

    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },

    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
    },

    joiningDate: {
      type: Date,
      required: [true, "Joining date is required"],
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    role: {
      type: String,
      enum: ["super_admin", "hr", "employee"],
      default: "employee",
    },

    reportingManager: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    profileImage: {
      type: String,
      default: null,
    },

    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);



/**
 * Virtual for manager
 */
employeeSchema.virtual("manager", {
  ref: "Employee",
  localField: "reportingManager",
  foreignField: "_id",
  justOne: true,
});

/**
 * JSON Transform
 */
employeeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id;
     delete (ret as any)._id;
  }
},)

export const Employee = model<IEmployee>("Employee", employeeSchema);