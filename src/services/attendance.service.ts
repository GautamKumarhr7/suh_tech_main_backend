/**
 * Attendance Service
 * Contains business logic for attendance operations
 */

import { attendanceRepository } from "../repositories/attendance.repository.js";
import { userRepository } from "../repositories/user.repository.js";

export class AttendanceService {
  /**
   * Get all attendances with optional filters
   */
  async getAllAttendances(filters?: {
    userId?: number;
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }) {
    // Validate status if provided
    if (filters?.status) {
      const validStatuses = ["absent", "present", "on leave", "late"];
      if (!validStatuses.includes(filters.status)) {
        throw new Error(
          "Invalid status. Must be: absent, present, on leave, or late",
        );
      }
    }

    const attendances = await attendanceRepository.findAll(filters);
    return attendances.map((attendance) =>
      this.formatAttendanceResponse(attendance),
    );
  }

  /**
   * Get attendance by ID
   */
  async getAttendanceById(id: number) {
    const attendance = await attendanceRepository.findById(id);
    if (!attendance) {
      throw new Error("Attendance record not found");
    }
    return this.formatAttendanceResponse(attendance);
  }

  /**
   * Get attendances for a specific user
   */
  async getUserAttendances(userId: number, startDate?: Date, endDate?: Date) {
    // Verify user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const attendances = await attendanceRepository.findByUserId(
      userId,
      startDate,
      endDate,
    );
    return attendances.map((attendance) =>
      this.formatAttendanceResponse(attendance),
    );
  }

  /**
   * Create new attendance record
   */
  async createAttendance(attendanceData: {
    userId: number;
    date: Date;
    status: string;
    clockIn?: Date;
    clockOut?: Date;
  }) {
    // Validate required fields
    if (
      !attendanceData.userId ||
      !attendanceData.date ||
      !attendanceData.status
    ) {
      throw new Error("User ID, date, and status are required");
    }

    // Validate status
    const validStatuses = ["absent", "present", "on leave", "late"];
    if (!validStatuses.includes(attendanceData.status)) {
      throw new Error(
        "Invalid status. Must be: absent, present, on leave, or late",
      );
    }

    const user = await userRepository.findById(attendanceData.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if attendance already exists for this user on this date
    const exists = await attendanceRepository.existsForUserOnDate(
      attendanceData.userId,
      attendanceData.date,
    );

    if (exists) {
      throw new Error("Attendance already marked for this date");
    }

    const attendance = await attendanceRepository.create(attendanceData);
    return this.formatAttendanceResponse(attendance);
  }

  /**
   * Update attendance record
   */
  async updateAttendance(
    id: number,
    updateData: {
      status?: string;
      date?: Date;
      clockIn?: Date;
      clockOut?: Date;
    },
  ) {
    const attendance = await attendanceRepository.findById(id);
    if (!attendance) {
      throw new Error("Attendance record not found");
    }

    // Validate status if provided
    if (updateData.status) {
      const validStatuses = ["absent", "present", "on leave", "late"];
      if (!validStatuses.includes(updateData.status)) {
        throw new Error(
          "Invalid status. Must be: absent, present, on leave, or late",
        );
      }
    }

    // If date is being updated, check for conflicts
    if (updateData.date) {
      const existingOnDate = await attendanceRepository.findByUserIdAndDate(
        attendance.user_id,
        updateData.date,
      );

      if (existingOnDate && existingOnDate.id !== id) {
        throw new Error("Attendance already marked for this date");
      }
    }

    const updatedAttendance = await attendanceRepository.update(id, updateData);
    if (!updatedAttendance) {
      throw new Error("Failed to update attendance");
    }

    return this.formatAttendanceResponse(updatedAttendance);
  }

  /**
   * Delete attendance record
   */
  async deleteAttendance(id: number) {
    const attendance = await attendanceRepository.findById(id);
    if (!attendance) {
      throw new Error("Attendance record not found");
    }

    const deletedAttendance = await attendanceRepository.delete(id);
    if (!deletedAttendance) {
      throw new Error("Failed to delete attendance");
    }

    return { success: true };
  }

  /**
   * Get attendance statistics for a user
   */
  async getAttendanceStats(userId: number, startDate?: Date, endDate?: Date) {
    // Verify user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const stats = await attendanceRepository.getStats(
      userId,
      startDate,
      endDate,
    );

    // Format statistics
    const formattedStats: any = {
      userId,
      absent: 0,
      present: 0,
      "on leave": 0,
      late: 0,
      total: 0,
    };

    stats.forEach((stat) => {
      formattedStats[stat.status] = parseInt(stat.count);
      formattedStats.total += parseInt(stat.count);
    });

    return formattedStats;
  }

  /**
   * Format attendance response
   */
  private formatAttendanceResponse(attendance: any) {
    const formatted: any = {
      id: attendance.id,
      userId: attendance.user_id,
      date: attendance.date,
      status: attendance.status,
      clockIn: attendance.clock_in,
      clockOut: attendance.clock_out,
      createdAt: attendance.created_at,
      updatedAt: attendance.updated_at,
    };

    // Calculate total hours if both clockIn and clockOut are present
    if (attendance.clock_in && attendance.clock_out) {
      const clockIn = new Date(attendance.clock_in);
      const clockOut = new Date(attendance.clock_out);
      const diffMs = clockOut.getTime() - clockIn.getTime();
      const totalHours = diffMs / (1000 * 60 * 60); // Convert milliseconds to hours
      formatted.totalHours = parseFloat(totalHours.toFixed(2)); // Round to 2 decimal places
    } else {
      formatted.totalHours = null;
    }

    // Include user details if available
    if (attendance.first_name) {
      formatted.user = {
        firstName: attendance.first_name,
        lastName: attendance.last_name,
        email: attendance.email,
        empId: attendance.emp_id,
      };
    }

    return formatted;
  }
}

export const attendanceService = new AttendanceService();
