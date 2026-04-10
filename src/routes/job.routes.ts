/**
 * Job Routes
 * Maps HTTP endpoints to controller methods
 */

import { Router } from "express";
import { jobController } from "../controllers/job.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * GET /jobs
 * Get all jobs - Authenticated users
 */
router.get("/", authenticate, (req, res) => jobController.getAllJobs(req, res));

/**
 * GET /jobs/:id
 * Get job by ID - Authenticated users
 */
router.get("/:id", authenticate, (req, res) =>
  jobController.getJobById(req, res),
);

/**
 * POST /jobs
 * Create new job - Admin only
 */
router.post("/", authenticate, requireAdmin, (req, res) =>
  jobController.createJob(req, res),
);

/**
 * PUT /jobs/:id
 * Update job - Admin only
 */
router.put("/:id", authenticate, requireAdmin, (req, res) =>
  jobController.updateJob(req, res),
);

/**
 * DELETE /jobs/:id
 * Delete job - Admin only
 */
router.delete("/:id", authenticate, requireAdmin, (req, res) =>
  jobController.deleteJob(req, res),
);

export default router;
