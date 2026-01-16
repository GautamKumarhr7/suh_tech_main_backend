/**
 * Project Routes
 */

import { Router } from "express";
import { projectController } from "../controllers/project.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/projects
 * Get all projects with optional filters
 * Query params: status, clientName, startDate, endDate
 */
router.get("/", (req, res) => projectController.getAllProjects(req, res));

/**
 * GET /api/projects/:id
 * Get project by ID
 */
router.get("/:id", (req, res) => projectController.getProjectById(req, res));

/**
 * POST /api/projects
 * Create new project
 */
router.post("/", (req, res) => projectController.createProject(req, res));

/**
 * PUT /api/projects/:id
 * Update project
 */
router.put("/:id", (req, res) => projectController.updateProject(req, res));

/**
 * DELETE /api/projects/:id
 * Soft delete project
 */
router.delete("/:id", (req, res) => projectController.deleteProject(req, res));

export default router;
