import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/error.middleware";

import {
  loginValidator,
  registerValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/auth.validator";

const router = Router();

/**
 * Public Routes
 */
router.post(
  "/register",
  registerValidator,
  validateRequest,
  authController.register
);

router.post(
  "/login",
  loginValidator,
  validateRequest,
  authController.login
);

router.post(
  "/refresh",
  authController.refresh
);

router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validateRequest,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordValidator,
  validateRequest,
  authController.resetPassword
);

/**
 * Protected Routes
 */
router.use(authMiddleware);

router.get(
  "/me",
  authController.me
);

router.post(
  "/logout",
  authController.logout
);

router.post(
  "/change-password",
  changePasswordValidator,
  validateRequest,
  authController.changePassword
);

router.put(
  "/profile",
  authMiddleware,
  authController.updateProfile
);

export default router;