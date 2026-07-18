import { body } from "express-validator";

export const employeeValidator = [
  body("employeeId")
    .trim()
    .notEmpty()
    .withMessage("Employee ID is required"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("phone")
    .trim()
    .matches(/^[+]?[0-9\s\-()]{7,15}$/)
    .withMessage("Valid phone number is required"),

  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required"),

  body("designation")
    .trim()
    .notEmpty()
    .withMessage("Designation is required"),

  body("salary")
    .isFloat({ min: 0 })
    .withMessage("Salary must be greater than or equal to 0"),

  body("joiningDate")
    .isISO8601()
    .withMessage("Joining date must be valid"),

  body("role")
    .optional()
    .isIn(["super_admin", "hr", "employee"])
    .withMessage("Invalid role"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status"),

  body("reportingManager")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Reporting manager must be a valid ID"),
];