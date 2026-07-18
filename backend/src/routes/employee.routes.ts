import { Router } from "express";
import { employeeController } from "../controllers/employee.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  requireAdmin,
  requireAdminOrHr,
} from "../middleware/role.middleware";
import {
  upload,
  uploadMemory,
} from "../middleware/upload.middleware";
import { employeeValidator } from "../validators/employee.validator";
import { validateRequest } from "../middleware/error.middleware";
import {
  parseCsvBuffer,
  importEmployees,
} from "../utils/csv";
import { ApiError } from "../types/errors";

const router = Router();

/**
 * All Employee APIs require authentication
 */
router.use(authMiddleware);

/**
 * Dashboard Employee APIs
 */
router.get("/", employeeController.list);

router.get("/:id", employeeController.get);

router.get(
  "/:id/reportees",
  employeeController.reportees
);

/**
 * Create Employee
 * Super Admin & HR
 */
router.post(
  "/",
  requireAdminOrHr(),
  upload.single("profileImage"),
  employeeValidator,
  validateRequest,
  employeeController.create
);

/**
 * Update Employee
 * Super Admin & HR
 */
router.put(
  "/:id",
  requireAdminOrHr(),
  upload.single("profileImage"),
  employeeValidator,
  validateRequest,
  employeeController.update
);

/**
 * Soft Delete Employee
 * Super Admin Only
 */
router.delete(
  "/:id",
  requireAdmin(),
  employeeController.remove
);

/**
 * Assign Reporting Manager
 * Super Admin Only
 */
router.patch(
  "/:id/manager",
  requireAdmin(),
  employeeController.setManager
);

/**
 * Bulk Import Employees (Bonus)
 */
router.post(
  "/import",
  requireAdminOrHr(),
  uploadMemory.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new ApiError(
          400,
          "CSV file is required"
        );
      }

      const rows = await parseCsvBuffer(
        req.file.buffer
      );

      const result = await importEmployees(
        rows
      );

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;