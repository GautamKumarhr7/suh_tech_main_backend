/**
 * Department Routes
 * Maps HTTP endpoints to controller methods
 */

import { Router } from "express";
import { departmentController } from "../controllers/department.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/departments
 * Get all departments - Authenticated users
 */
router.get("/", authenticate, (req, res) =>
  departmentController.getAllDepartments(req, res)
);

/**
 * GET /api/departments/:id
 * Get department by ID - Authenticated users
 */
router.get("/:id", authenticate, (req, res) =>
  departmentController.getDepartmentById(req, res)
);

/**
 * POST /api/departments
 * Create new department - Admin only
 */
router.post("/", authenticate, requireAdmin, (req, res) =>
  departmentController.createDepartment(req, res)
);

/**
 * PUT /api/departments/:id
 * Update department - Admin only
 */
router.put("/:id", authenticate, requireAdmin, (req, res) =>
  departmentController.updateDepartment(req, res)
);

/**
 * DELETE /api/departments/:id
 * Delete department - Admin only
 */
router.delete("/:id", authenticate, requireAdmin, (req, res) =>
  departmentController.deleteDepartment(req, res)
);

export default router;
