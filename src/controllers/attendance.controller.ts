/**
 * Attendance Controller
 * Handles HTTP requests and responses for attendance operations
 */

import { Request, Response } from "express";
import { attendanceService } from "../services/attendance.service.js";

export class AttendanceController {
  /**
   * GET /api/attendances
   * Get all attendances (with optional filters)
   */
  async getAllAttendances(req: Request, res: Response) {
    try {
      const filters: any = {};

      if (req.query.userId) {
        filters.userId = parseInt(req.query.userId as string);
      }

      if (req.query.startDate) {
        filters.startDate = new Date(req.query.startDate as string);
      }

      if (req.query.endDate) {
        filters.endDate = new Date(req.query.endDate as string);
      }

      if (req.query.status) {
        filters.status = req.query.status as string;
      }

      const attendances = await attendanceService.getAllAttendances(filters);

      res.json({
        success: true,
        data: attendances,
      });
    } catch (error: any) {
      console.error("Get attendances error:", error);

      if (error.message.includes("Invalid status")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch attendances",
      });
    }
  }

  /**
   * POST /api/attendances
   * Create new attendance record
   */
  async createAttendance(req: Request, res: Response) {
    try {
      const attendanceData = {
        userId: req.body.userId,
        date: req.body.date ? new Date(req.body.date) : new Date(),
        status: req.body.status,
        clockIn: req.body.clockIn ? new Date(req.body.clockIn) : undefined,
        clockOut: req.body.clockOut ? new Date(req.body.clockOut) : undefined,
      };

      const attendance =
        await attendanceService.createAttendance(attendanceData);

      res.status(201).json({
        success: true,
        message: "Attendance marked successfully",
        data: attendance,
      });
    } catch (error: any) {
      console.error("Create attendance error:", error);

      if (error.message.includes("already marked")) {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message.includes("required") ||
        error.message.includes("Invalid status") ||
        error.message.includes("User not found")
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to mark attendance",
      });
    }
  }

  /**
   * GET /api/attendances/:id
   * Get attendance by ID
   */
  async getAttendanceById(req: Request, res: Response) {
    try {
      const attendanceId = parseInt(req.params.id);

      if (isNaN(attendanceId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid attendance ID",
        });
      }

      const attendance =
        await attendanceService.getAttendanceById(attendanceId);

      res.json({
        success: true,
        data: attendance,
      });
    } catch (error: any) {
      console.error("Get attendance error:", error);

      if (error.message === "Attendance record not found") {
        return res.status(404).json({
          success: false,
          message: "Attendance record not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch attendance",
      });
    }
  }

  /**
   * GET /api/attendances/user/:userId
   * Get attendances for a specific user
   */
  async getUserAttendances(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined;
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined;

      const attendances = await attendanceService.getUserAttendances(
        userId,
        startDate,
        endDate,
      );

      res.json({
        success: true,
        data: attendances,
      });
    } catch (error: any) {
      console.error("Get user attendances error:", error);

      if (error.message === "User not found") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch user attendances",
      });
    }
  }

  /**
   * PUT /api/attendances/:id
   * Update attendance record
   */
  async updateAttendance(req: Request, res: Response) {
    try {
      const attendanceId = parseInt(req.params.id);

      if (isNaN(attendanceId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid attendance ID",
        });
      }

      const updateData: any = {};

      if (req.body.status) {
        updateData.status = req.body.status;
      }

      if (req.body.date) {
        updateData.date = new Date(req.body.date);
      }

      if (req.body.clockIn !== undefined) {
        // If clockIn is true or "now", use current timestamp
        if (req.body.clockIn === true || req.body.clockIn === "now") {
          updateData.clockIn = new Date();
        } else {
          updateData.clockIn = new Date(req.body.clockIn);
        }
      }

      if (req.body.clockOut !== undefined) {
        // If clockOut is true or "now", use current timestamp
        if (req.body.clockOut === true || req.body.clockOut === "now") {
          updateData.clockOut = new Date();
        } else {
          updateData.clockOut = new Date(req.body.clockOut);
        }
      }

      const attendance = await attendanceService.updateAttendance(
        attendanceId,
        updateData,
      );

      res.json({
        success: true,
        message: "Attendance updated successfully",
        data: attendance,
      });
    } catch (error: any) {
      console.error("Update attendance error:", error);

      if (error.message === "Attendance record not found") {
        return res.status(404).json({
          success: false,
          message: "Attendance record not found",
        });
      }

      if (
        error.message.includes("Invalid status") ||
        error.message.includes("already marked")
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update attendance",
      });
    }
  }

  /**
   * DELETE /api/attendances/:id
   * Delete attendance record
   */
  async deleteAttendance(req: Request, res: Response) {
    try {
      const attendanceId = parseInt(req.params.id);

      if (isNaN(attendanceId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid attendance ID",
        });
      }

      await attendanceService.deleteAttendance(attendanceId);

      res.json({
        success: true,
        message: "Attendance deleted successfully",
      });
    } catch (error: any) {
      console.error("Delete attendance error:", error);

      if (error.message === "Attendance record not found") {
        return res.status(404).json({
          success: false,
          message: "Attendance record not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete attendance",
      });
    }
  }

  /**
   * GET /api/attendances/user/:userId/stats
   * Get attendance statistics for a user
   */
  async getAttendanceStats(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined;
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined;

      const stats = await attendanceService.getAttendanceStats(
        userId,
        startDate,
        endDate,
      );

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error("Get attendance stats error:", error);

      if (error.message === "User not found") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch attendance statistics",
      });
    }
  }
}

export const attendanceController = new AttendanceController();
