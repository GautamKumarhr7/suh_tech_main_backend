/**
 * Job Repository
 * Handles all database operations for jobs
 */

import { pool } from "../db/dbConnection.js";

export class JobRepository {
  /**
   * Find all jobs
   */
  async findAll(filters?: { active?: boolean }) {
    let query = `
      SELECT id, title, type, location, description, responsibilities,
             requirements, active, created_at, updated_at
      FROM jobs
      WHERE is_deleted = false
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.active !== undefined) {
      query += ` AND active = $${paramIndex}`;
      params.push(filters.active);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Find job by ID
   */
  async findById(id: number) {
    const result = await pool.query(
      `SELECT id, title, type, location, description, responsibilities,
              requirements, active, created_at, updated_at
       FROM jobs
       WHERE id = $1 AND is_deleted = false`,
      [id],
    );

    return result.rows[0] || null;
  }

  /**
   * Create new job
   */
  async create(data: {
    title: string;
    type: string;
    location: string;
    description?: string;
    responsibilities?: string;
    requirements?: string;
    active: boolean;
  }) {
    const result = await pool.query(
      `INSERT INTO jobs (
         title, type, location, description, responsibilities, requirements, active
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, type, location, description, responsibilities,
                 requirements, active, created_at, updated_at`,
      [
        data.title,
        data.type,
        data.location,
        data.description || null,
        data.responsibilities || null,
        data.requirements || null,
        data.active,
      ],
    );

    return result.rows[0];
  }

  /**
   * Update job
   */
  async update(
    id: number,
    data: {
      title?: string;
      type?: string;
      location?: string;
      description?: string;
      responsibilities?: string;
      requirements?: string;
      active?: boolean;
    },
  ) {
    const result = await pool.query(
      `UPDATE jobs
       SET title = COALESCE($1, title),
           type = COALESCE($2, type),
           location = COALESCE($3, location),
           description = COALESCE($4, description),
           responsibilities = COALESCE($5, responsibilities),
           requirements = COALESCE($6, requirements),
           active = COALESCE($7, active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 AND is_deleted = false
       RETURNING id, title, type, location, description, responsibilities,
                 requirements, active, created_at, updated_at`,
      [
        data.title,
        data.type,
        data.location,
        data.description,
        data.responsibilities,
        data.requirements,
        data.active,
        id,
      ],
    );

    return result.rows[0] || null;
  }

  /**
   * Soft delete job
   */
  async delete(id: number) {
    const result = await pool.query(
      `UPDATE jobs
       SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false
       RETURNING id`,
      [id],
    );

    return result.rows[0] || null;
  }
}

export const jobRepository = new JobRepository();
