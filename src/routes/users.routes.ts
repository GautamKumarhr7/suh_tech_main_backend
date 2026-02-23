/**
 * User Routes
 * Maps HTTP endpoints to controller methods
 */

import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import {
  authenticate,
  requireAdmin,
  requireOwnerOrAdmin,
} from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/users
 * Get all users - Admin only
 */
router.get("/", authenticate, requireAdmin, (req, res) =>
  userController.getAllUsers(req, res),
);

/**
 * POST /api/users
 * Create new user - Admin only
 */
router.post("/", authenticate, requireAdmin, (req, res) =>
  userController.createUser(req, res),
);

/**
 * GET /api/users/profile
 * Get current authenticated user's profile
 */
router.get("/profile", authenticate, (req, res) =>
  userController.getUserProfile(req, res),
);

/**
 * GET /api/users/:id
 * Get user by ID - Owner or Admin
 */
router.get("/:id", authenticate, requireOwnerOrAdmin, (req, res) =>
  userController.getUserById(req, res),
);

/**
 * PUT /api/users/:id
 * Update user - Owner or Admin
 */
router.put("/:id", authenticate, requireOwnerOrAdmin, (req, res) =>
  userController.updateUser(req, res),
);

/**
 * DELETE /api/users/:id
 * Delete user - Admin only
 */
router.delete("/:id", authenticate, requireAdmin, (req, res) =>
  userController.deleteUser(req, res),
);

export default router;
