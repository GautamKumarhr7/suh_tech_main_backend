/**
 * Blog Routes
 * Maps HTTP endpoints to controller methods
 */

import { Router } from "express";
import { blogController } from "../controllers/blog.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * GET /blogs
 * Get all blogs - Authenticated users
 */
router.get("/", authenticate, (req, res) =>
  blogController.getAllBlogs(req, res),
);

/**
 * GET /blogs/:id
 * Get blog by ID - Authenticated users
 */
router.get("/:id", authenticate, (req, res) =>
  blogController.getBlogById(req, res),
);

/**
 * POST /blogs
 * Create blog - Admin only
 */
router.post("/", authenticate, requireAdmin, (req, res) =>
  blogController.createBlog(req, res),
);

/**
 * PUT /blogs/:id
 * Update blog - Admin only
 */
router.put("/:id", authenticate, requireAdmin, (req, res) =>
  blogController.updateBlog(req, res),
);

/**
 * DELETE /blogs/:id
 * Delete blog - Admin only
 */
router.delete("/:id", authenticate, requireAdmin, (req, res) =>
  blogController.deleteBlog(req, res),
);

export default router;
