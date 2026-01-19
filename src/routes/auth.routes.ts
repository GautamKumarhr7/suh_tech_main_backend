/**
 * Auth Routes
 * Maps HTTP endpoints to controller methods
 */

import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

/**
 * POST /api/auth/login
 * Login user
 */
router.post("/login", (req, res) => authController.login(req, res));

/**
 * GET /api/auth/me
 * Get current authenticated user info
 */
router.get("/me", authenticate, (req, res) =>
  authController.getCurrentUser(req, res)
);

/**
 * POST /api/auth/change-password
 * Change user password
 */
router.post("/change-password", authenticate, (req, res) =>
  authController.changePassword(req, res)
);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post("/logout", authenticate, (req, res) =>
  authController.logout(req, res)
);

export default router;
