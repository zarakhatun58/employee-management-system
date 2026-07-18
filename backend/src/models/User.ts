import { Schema, model, Document, Types } from "mongoose";

export type Role = "super_admin" | "hr" | "employee";

export interface IUser extends Document {
  employee: Types.ObjectId | null;
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  isDeleted: boolean;
  refreshToken: string | null;
  lastLogin: Date | null;
  loginAttempts: number;
  lockUntil: Date | null;
  passwordChangedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
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

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["super_admin", "hr", "employee"],
      default: "employee",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.index({ employee: 1 });
// userSchema.index({ role: 1 });
// userSchema.index({ isActive: 1 });

userSchema.virtual("employeeInfo", {
  ref: "Employee",
  localField: "employee",
  foreignField: "_id",
  justOne: true,
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret: any) {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});

export const User = model<IUser>("User", userSchema);