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
      `SELECT id, user_id, date, status, clock_in, clock_out, created_at, updated_at
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
      SELECT a.id, a.user_id, a.date, a.status, a.clock_in, a.clock_out, a.created_at, a.updated_at,
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
      query += ` AND a.date >= $${paramIndex}`;
      params.push(filters.startDate);
      paramIndex++;
    }

    if (filters?.endDate) {
      query += ` AND a.date <= $${paramIndex}`;
      params.push(filters.endDate);
      paramIndex++;
    }

    if (filters?.status) {
      query += ` AND a.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.date) {
      // Extract just the date portion and compare
      const dateStr = filters.date.toISOString().split("T")[0];
      query += ` AND a.created_at::date = $${paramIndex}::date`;
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
      SELECT id, user_id, date, status, clock_in, clock_out, created_at, updated_at
      FROM attendances 
      WHERE user_id = $1
    `;
    const params: any[] = [userId];
    let paramIndex = 2;

    if (startDate) {
      query += ` AND date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND date <= $${paramIndex}`;
      params.push(endDate);
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
    const result = await pool.query(
      `SELECT id FROM attendances WHERE user_id = $1 AND date = $2`,
      [userId, date],
    );
    return result.rows.length > 0;
  }

  /**
   * Find attendance by user ID and date
   */
  async findByUserIdAndDate(userId: number, date: Date) {
    const result = await pool.query(
      `SELECT id, user_id, date, status, clock_in, clock_out, created_at, updated_at
       FROM attendances 
       WHERE user_id = $1 AND date = $2`,
      [userId, date],
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
    clockIn?: Date;
    clockOut?: Date;
  }) {
    const result = await pool.query(
      `INSERT INTO attendances (user_id, date, status, clock_in, clock_out)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, date, status, clock_in, clock_out, created_at, updated_at`,
      [
        attendanceData.userId,
        attendanceData.date,
        attendanceData.status,
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
    const result = await pool.query(
      `UPDATE attendances 
       SET status = COALESCE($1, status),
           date = COALESCE($2, date),
           clock_in = COALESCE($3, clock_in),
           clock_out = COALESCE($4, clock_out),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, user_id, date, status, clock_in, clock_out, created_at, updated_at`,
      [data.status, data.date, data.clockIn, data.clockOut, id],
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
      query += ` AND date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    query += ` GROUP BY status`;

    const result = await pool.query(query, params);
    return result.rows;
  }
}

export const attendanceRepository = new AttendanceRepository();
