/**
 * Designation Repository
 * Handles all database operations for designations
 */

import { pool } from "../db/dbConnection.js";
import { Designation } from "../db/schema.js";

export class DesignationRepository {
  /**
   * Find all active designations
   */
  async findAll() {
    const result = await pool.query(
      `SELECT id, title, description, created_at, updated_at
       FROM designations 
       WHERE is_deleted = false
       ORDER BY title ASC`
    );
    return result.rows;
  }

  /**
   * Find designation by ID
   */
  async findById(id: number) {
    const result = await pool.query(
      `SELECT id, title, description, created_at, updated_at
       FROM designations 
       WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Find designation by title
   */
  async findByTitle(title: string) {
    const result = await pool.query(
      `SELECT id, title, description, created_at, updated_at
       FROM designations 
       WHERE LOWER(title) = LOWER($1) AND is_deleted = false`,
      [title.trim()]
    );
    return result.rows[0] || null;
  }

  /**
   * Create new designation
   */
  async create(data: { title: string; description?: string }) {
    const result = await pool.query(
      `INSERT INTO designations (title, description)
       VALUES ($1, $2)
       RETURNING id, title, description, created_at, updated_at`,
      [data.title.trim(), data.description || null]
    );
    return result.rows[0];
  }

  /**
   * Update designation
   */
  async update(id: number, data: { title?: string; description?: string }) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(data.title.trim());
    }

    if (data.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(data.description);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE designations 
       SET ${updates.join(", ")}
       WHERE id = $${paramCount} AND is_deleted = false
       RETURNING id, title, description, created_at, updated_at`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Soft delete designation
   */
  async delete(id: number) {
    const result = await pool.query(
      `UPDATE designations 
       SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false
       RETURNING id`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Check if designation is in use by users
   */
  async isInUse(id: number) {
    const result = await pool.query(
      `SELECT COUNT(*) as count
       FROM users 
       WHERE designation_id = $1 AND is_deleted = false`,
      [id]
    );
    return parseInt(result.rows[0].count) > 0;
  }
}

export const designationRepository = new DesignationRepository();
