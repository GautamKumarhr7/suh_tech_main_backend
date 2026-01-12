/**
 * Designation Routes
 * Maps HTTP endpoints to controller methods
 */

import { Router } from "express";
import { designationController } from "../controllers/designation.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/designations
 * Get all designations - Authenticated users
 */
router.get("/", authenticate, (req, res) =>
  designationController.getAllDesignations(req, res)
);

/**
 * GET /api/designations/:id
 * Get designation by ID - Authenticated users
 */
router.get("/:id", authenticate, (req, res) =>
  designationController.getDesignationById(req, res)
);

/**
 * POST /api/designations
 * Create new designation - Admin only
 */
router.post("/", authenticate, requireAdmin, (req, res) =>
  designationController.createDesignation(req, res)
);

/**
 * PUT /api/designations/:id
 * Update designation - Admin only
 */
router.put("/:id", authenticate, requireAdmin, (req, res) =>
  designationController.updateDesignation(req, res)
);

/**
 * DELETE /api/designations/:id
 * Delete designation - Admin only
 */
router.delete("/:id", authenticate, requireAdmin, (req, res) =>
  designationController.deleteDesignation(req, res)
);

export default router;
