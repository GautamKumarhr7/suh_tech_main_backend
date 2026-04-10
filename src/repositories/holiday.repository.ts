/**
 * Holiday Repository
 * Handles all database operations for holidays
 */

import { pool } from "../db/dbConnection.js";

export class HolidayRepository {
  async findAll(filters?: { type?: string }) {
    let query = `
      SELECT id, name, type, date, created_at, updated_at
      FROM holidays
      WHERE is_deleted = false
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.type) {
      query += ` AND type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    query += ` ORDER BY date ASC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id: number) {
    const result = await pool.query(
      `SELECT id, name, type, date, created_at, updated_at
       FROM holidays
       WHERE id = $1 AND is_deleted = false`,
      [id],
    );

    return result.rows[0] || null;
  }

  async create(data: { name: string; type: string; date: Date }) {
    const result = await pool.query(
      `INSERT INTO holidays (name, type, date)
       VALUES ($1, $2, $3)
       RETURNING id, name, type, date, created_at, updated_at`,
      [data.name, data.type, data.date],
    );

    return result.rows[0];
  }

  async update(
    id: number,
    data: {
      name?: string;
      type?: string;
      date?: Date;
    },
  ) {
    const result = await pool.query(
      `UPDATE holidays
       SET name = COALESCE($1, name),
           type = COALESCE($2, type),
           date = COALESCE($3, date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND is_deleted = false
       RETURNING id, name, type, date, created_at, updated_at`,
      [data.name, data.type, data.date, id],
    );

    return result.rows[0] || null;
  }

  async delete(id: number) {
    const result = await pool.query(
      `UPDATE holidays
       SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false
       RETURNING id`,
      [id],
    );

    return result.rows[0] || null;
  }
}

export const holidayRepository = new HolidayRepository();
