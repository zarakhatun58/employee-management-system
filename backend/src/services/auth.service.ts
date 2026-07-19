import { User } from "../models/User";
import { Employee } from "../models/Employee";
import { PasswordReset } from "../models/PasswordReset";
import { config } from "../config/env";
import {
  signToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import {
  sendEmail,
  welcomeTemplate,
  forgotPasswordTemplate,
} from "../utils/email";
import {
  comparePassword,
  hashPassword,
} from "../utils/bcrypt";


import {
  generatePasswordResetToken,
  generateRefreshTokenId,
  hashResetToken,
  hashToken,
} from "../utils/token";

import { ApiError } from "../types/errors";

export const authService = {

async register(data: {
  name: string;
  email: string;
  password: string;
  role?: "super_admin" | "hr" | "employee";
  employeeId?: string;
}) {

  const email = data.email.toLowerCase().trim();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await User.create({
    name: data.name,
    email,
    password: hashedPassword,
    role: data.role ?? "employee",
    employee: data.employeeId ?? null,
  });

  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const token = signToken(payload);

  return {
    success: true,
    message: "User registered successfully.",
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      employee: user.employee,
    },
  };
},
async login(email: string, password: string) {
  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  })
    .select("+password")
    .populate(
      "employee",
      "employeeId name department designation status reportingManager profileImage"
    );

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive || user.isDeleted) {
    throw new ApiError(403, "Your account has been disabled");
  }

  const matched = await comparePassword(
    password,
    user.password
  );

  if (!matched) {
    throw new ApiError(401, "Invalid email or password");
  }

  user.lastLogin = new Date();
  user.loginAttempts = 0;
  await user.save();

  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const token = signToken(payload);

  return {
    success: true,
    message: "Login successful.",
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      employee: user.employee,
    },
  };
},
  /**
 * Get Logged-in User Profile
 */
  async me(userId: string) {
    const user = await User.findById(userId)
      .select("-password")
      .lean();

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    let employee = null;

    if (user.employee) {
      employee = await Employee.findById(user.employee)
        .populate(
          "reportingManager",
          "name employeeId designation"
        )
        .lean();
    }

    return {
      success: true,
      user: {
        ...user,
        employee,
      },
    };
  },

async logout(p0: string) {
  return {
    success: true,
    message: "Logged out successfully.",
  };
},

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, "Invalid refresh token");
    }

    const user = await User.findById(payload.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = signRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    };
  },


  /**
 * Change Password
 * User must know the current password.
 */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Current password is incorrect");
    }

    const isSamePassword = await comparePassword(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      throw new ApiError(
        400,
        "New password cannot be the same as the current password"
      );
    }

    user.password = await hashPassword(newPassword);

    await user.save();

    return {
      success: true,
      message: "Password changed successfully.",
    };
  },
  /**
 * Forgot Password
 */
  async forgotPassword(email: string) {
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    /**
     * Don't reveal whether the email exists.
     */
    if (!user) {
      return {
        success: true,
        message:
          "If an account exists, a password reset link has been sent.",
      };
    }

    /**
     * Remove old reset requests
     */
    await PasswordReset.deleteMany({
      user: user._id,
    });

    /**
     * Generate secure token
     */
    const {
      rawToken,
      hashedToken,
      expiresAt,
    } = generatePasswordResetToken();

    /**
     * Save hashed token
     */
    await PasswordReset.create({
      user: user._id,
      token: hashedToken,
      expiresAt,
    });

    /**
     * Build reset link
     *
     * Frontend route:
     * /reset-password?token=xxxxx
     */
    const resetLink =
      `${config.clientUrl}/reset-password?token=${rawToken}`;

    /**
     * Send email
     */
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: forgotPasswordTemplate(
        user.name,
        resetLink
      ),
    });

    return {
      success: true,
      message:
        "If an account exists, a password reset link has been sent.",
    };
  },
  /**
 * Reset Password
 */
  async resetPassword(token: string, password: string) {
    const hashedToken = hashResetToken(token);

    const reset = await PasswordReset.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!reset) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    const user = await User.findById(reset.user);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.password = await hashPassword(password);
    await user.save();

    reset.used = true;
    await reset.save();

    await PasswordReset.deleteMany({
      user: user._id,
    });

    return {
      success: true,
      message: "Password reset successfully",
    };
  },
  async updateProfile(
  userId: string,
  data: {
    name: string;
    email: string;
  }
) {
  const user = await User.findByIdAndUpdate(
    userId,
    data,
    {
      new: true,
    }
  ).select("-password");

  return {
    success: true,
    user,
    message: "Profile updated successfully",
  };
}
}