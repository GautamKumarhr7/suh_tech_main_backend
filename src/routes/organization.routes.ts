/**
 * Organization Routes
 */

import { Router } from "express";
import { organizationController } from "../controllers/organization.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/organizations
 * Get all organizations with optional filters
 * Query params: status, purchasePlain
 */
router.get("/", (req, res) =>
  organizationController.getAllOrganizations(req, res)
);

/**
 * GET /api/organizations/:id
 * Get organization by ID
 */
router.get("/:id", (req, res) =>
  organizationController.getOrganizationById(req, res)
);

/**
 * POST /api/organizations
 * Create new organization
 */
router.post("/", (req, res) =>
  organizationController.createOrganization(req, res)
);

/**
 * PUT /api/organizations/:id
 * Update organization
 */
router.put("/:id", (req, res) =>
  organizationController.updateOrganization(req, res)
);

/**
 * DELETE /api/organizations/:id
 * Soft delete organization
 */
router.delete("/:id", (req, res) =>
  organizationController.deleteOrganization(req, res)
);

export default router;
