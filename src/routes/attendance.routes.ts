/**
 * Attendance Routes
 * Maps HTTP endpoints to controller methods
 */

import { Router } from "express";
import { attendanceController } from "../controllers/attendance.controller.js";
import {
  authenticate,
  requireAdmin,
  requireOwnerOrAdmin,
} from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/attendances
 * Get all attendances - Admin only
 * Query params: userId, startDate, endDate, status
 */
router.get("/", authenticate, requireAdmin, (req, res) =>
  attendanceController.getAllAttendances(req, res),
);

/**
 * POST /api/attendances
 * Mark attendance - Admin can mark for any user, users can mark for themselves
 */
router.post("/", authenticate, (req, res) =>
  attendanceController.createAttendance(req, res),
);

/**
 * GET /api/attendances/user/:userId
 * Get attendances for specific user - Owner or Admin
 * Query params: startDate, endDate
 */
router.get("/user/:userId", authenticate, requireOwnerOrAdmin, (req, res) =>
  attendanceController.getUserAttendances(req, res),
);

/**
 * GET /api/attendances/user/:userId/stats
 * Get attendance statistics for specific user - Owner or Admin
 * Query params: startDate, endDate
 */
router.get(
  "/user/:userId/stats",
  authenticate,
  requireOwnerOrAdmin,
  (req, res) => attendanceController.getAttendanceStats(req, res),
);

/**
 * GET /api/attendances/:id
 * Get attendance by ID - Authenticated users
 */
router.get("/:id", authenticate, (req, res) =>
  attendanceController.getAttendanceById(req, res),
);

/**
 * PATCH /api/attendances/:id
 * Update attendance (clockIn/clockOut) - Admin only
 */
router.patch("/:id", authenticate, requireAdmin, (req, res) =>
  attendanceController.updateAttendance(req, res),
);

/**
 * DELETE /api/attendances/:id
 * Delete attendance - Admin only
 */
router.delete("/:id", authenticate, requireAdmin, (req, res) =>
  attendanceController.deleteAttendance(req, res),
);

export default router;
