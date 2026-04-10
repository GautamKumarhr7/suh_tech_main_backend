/**
 * System Preferences Repository
 * Handles database operations for system preferences
 */

import { pool } from "../db/dbConnection.js";

export class SystemPreferencesRepository {
  async getPreferences() {
    const result = await pool.query(
      `SELECT id, timezone, date_format, time_format, created_at, updated_at
       FROM system_preferences
       ORDER BY id ASC
       LIMIT 1`,
    );

    return result.rows[0] || null;
  }

  async create(data: {
    timezone: string;
    dateFormat: string;
    timeFormat: string;
  }) {
    const result = await pool.query(
      `INSERT INTO system_preferences (timezone, date_format, time_format)
       VALUES ($1, $2, $3)
       RETURNING id, timezone, date_format, time_format, created_at, updated_at`,
      [data.timezone, data.dateFormat, data.timeFormat],
    );

    return result.rows[0];
  }

  async update(
    id: number,
    data: {
      timezone?: string;
      dateFormat?: string;
      timeFormat?: string;
    },
  ) {
    const result = await pool.query(
      `UPDATE system_preferences
       SET timezone = COALESCE($1, timezone),
           date_format = COALESCE($2, date_format),
           time_format = COALESCE($3, time_format),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, timezone, date_format, time_format, created_at, updated_at`,
      [data.timezone, data.dateFormat, data.timeFormat, id],
    );

    return result.rows[0] || null;
  }
}

export const systemPreferencesRepository = new SystemPreferencesRepository();
