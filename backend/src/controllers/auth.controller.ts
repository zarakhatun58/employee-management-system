import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { authService } from "../services/auth.service";

export const authController = {
async register(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await authService.register({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        employeeId: req.body.employeeId,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(
        email,
        password
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async logout(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await authService.logout(
        req.userId!
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },


  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.me(req.user!);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async refresh(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { refreshToken } = req.body;

      const result =
        await authService.refreshToken(refreshToken);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async changePassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { currentPassword, newPassword } =
        req.body;

      const result =
        await authService.changePassword(
          req.user!.userId,
          currentPassword,
          newPassword
        );

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;

      const result =
        await authService.forgotPassword(email);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { token, password } = req.body;

      const result =
        await authService.resetPassword(
          token,
          password
        );

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
  async updateProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await authService.updateProfile(
      req.user!.userId,
      {
        name: req.body.name,
        email: req.body.email,
      }
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
}
};