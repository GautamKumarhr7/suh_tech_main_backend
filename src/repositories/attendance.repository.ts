/**
 * Attendance Repository
 * Handles all database operations for attendances
 */

import { pool } from "../db/dbConnection.js";

export class AttendanceRepository {
  /**
   * Find attendance by ID
   */
  async findById(id: number) {
    const result = await pool.query(
      `SELECT id, user_id, date, status, "marked_By", clock_in, clock_out, created_at, updated_at
       FROM attendances 
       WHERE id = $1`,
      [id],
    );
    return result.rows[0] || null;
  }

  /**
   * Find all attendances
   */
  async findAll(filters?: {
    userId?: number;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    date?: Date;
  }) {
    let query = `
      SELECT a.id, a.user_id, a.date, a.status, a."marked_By", a.clock_in, a.clock_out, a.created_at, a.updated_at,
             u.first_name, u.last_name, u.email, u.emp_id
      FROM attendances a
      INNER JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.userId) {
      query += ` AND a.user_id = $${paramIndex}`;
      params.push(filters.userId);
      paramIndex++;
    }

    if (filters?.startDate) {
      const startDateStr = filters.startDate.toISOString().split("T")[0];
      query += ` AND a.date >= $${paramIndex}::date`;
      params.push(startDateStr);
      paramIndex++;
    }

    if (filters?.endDate) {
      const endDateStr = filters.endDate.toISOString().split("T")[0];
      query += ` AND a.date <= $${paramIndex}::date`;
      params.push(endDateStr);
      paramIndex++;
    }

    if (filters?.status) {
      query += ` AND a.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.date) {
      // Extract just the date portion and compare against the date column
      const dateStr = filters.date.toISOString().split("T")[0];
      query += ` AND a.date = $${paramIndex}::date`;
      params.push(dateStr);
      paramIndex++;
    }

    query += ` ORDER BY a.date DESC, a.created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Find attendances by user ID
   */
  async findByUserId(userId: number, startDate?: Date, endDate?: Date) {
    let query = `
      SELECT id, user_id, date, status, "marked_By", clock_in, clock_out, created_at, updated_at
      FROM attendances 
      WHERE user_id = $1
    `;
    const params: any[] = [userId];
    let paramIndex = 2;

    if (startDate) {
      const startDateStr = startDate.toISOString().split("T")[0];
      query += ` AND date >= $${paramIndex}::date`;
      params.push(startDateStr);
      paramIndex++;
    }

    if (endDate) {
      const endDateStr = endDate.toISOString().split("T")[0];
      query += ` AND date <= $${paramIndex}::date`;
      params.push(endDateStr);
      paramIndex++;
    }

    query += ` ORDER BY date DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Check if attendance exists for user on specific date
   */
  async existsForUserOnDate(userId: number, date: Date): Promise<boolean> {
    // Convert date to YYYY-MM-DD string to avoid timezone issues
    const dateStr = date.toISOString().split("T")[0];
    const result = await pool.query(
      `SELECT id FROM attendances WHERE user_id = $1 AND date = $2::date`,
      [userId, dateStr],
    );
    return result.rows.length > 0;
  }

  /**
   * Find attendance by user ID and date
   */
  async findByUserIdAndDate(userId: number, date: Date) {
    // Convert date to YYYY-MM-DD string to avoid timezone issues
    const dateStr = date.toISOString().split("T")[0];
    const result = await pool.query(
      `SELECT id, user_id, date, status, "marked_By", clock_in, clock_out, created_at, updated_at
       FROM attendances 
       WHERE user_id = $1 AND date = $2::date`,
      [userId, dateStr],
    );
    return result.rows[0] || null;
  }

  /**
   * Create new attendance record
   */
  async create(attendanceData: {
    userId: number;
    date: Date;
    status: string;
    markedBy: number;
    clockIn?: Date;
    clockOut?: Date;
  }) {
    // Convert date to YYYY-MM-DD string to avoid timezone issues
    const dateStr = attendanceData.date.toISOString().split("T")[0];

    const result = await pool.query(
      `INSERT INTO attendances (user_id, date, status, "marked_By", clock_in, clock_out)
       VALUES ($1, $2::date, $3, $4, $5, $6)
       RETURNING id, user_id, date, status, "marked_By", clock_in, clock_out, created_at, updated_at`,
      [
        attendanceData.userId,
        dateStr,
        attendanceData.status,
        attendanceData.markedBy,
        attendanceData.clockIn || null,
        attendanceData.clockOut || null,
      ],
    );
    return result.rows[0];
  }

  /**
   * Update attendance record
   */
  async update(
    id: number,
    data: { status?: string; date?: Date; clockIn?: Date; clockOut?: Date },
  ) {
    // Convert date to YYYY-MM-DD string if provided to avoid timezone issues
    const dateStr = data.date ? data.date.toISOString().split("T")[0] : null;

    const result = await pool.query(
      `UPDATE attendances 
       SET status = COALESCE($1, status),
           date = COALESCE($2::date, date),
           clock_in = COALESCE($3, clock_in),
           clock_out = COALESCE($4, clock_out),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, user_id, date, status, "marked_By", clock_in, clock_out, created_at, updated_at`,
      [data.status, dateStr, data.clockIn, data.clockOut, id],
    );
    return result.rows[0] || null;
  }

  /**
   * Delete attendance record
   */
  async delete(id: number) {
    const result = await pool.query(
      `DELETE FROM attendances 
       WHERE id = $1
       RETURNING id`,
      [id],
    );
    return result.rows[0] || null;
  }

  /**
   * Get attendance statistics for a user
   */
  async getStats(userId: number, startDate?: Date, endDate?: Date) {
    let query = `
      SELECT 
        status,
        COUNT(*) as count
      FROM attendances
      WHERE user_id = $1
    `;
    const params: any[] = [userId];
    let paramIndex = 2;

    if (startDate) {
      const startDateStr = startDate.toISOString().split("T")[0];
      query += ` AND date >= $${paramIndex}::date`;
      params.push(startDateStr);
      paramIndex++;
    }

    if (endDate) {
      const endDateStr = endDate.toISOString().split("T")[0];
      query += ` AND date <= $${paramIndex}::date`;
      params.push(endDateStr);
      paramIndex++;
    }

    query += ` GROUP BY status`;

    const result = await pool.query(query, params);
    return result.rows;
  }
}

export const attendanceRepository = new AttendanceRepository();
