/**
 * Department Repository
 * Handles all database operations for departments
 */

import { pool } from "../db/dbConnection.js";
import { Department } from "../db/types.js";

export class DepartmentRepository {
  /**
   * Find all active departments
   */
  async findAll() {
    const result = await pool.query(
      `SELECT id, name, description, created_at, updated_at
       FROM departments 
       WHERE is_deleted = false
       ORDER BY name ASC`
    );
    return result.rows;
  }

  /**
   * Find department by ID
   */
  async findById(id: number) {
    const result = await pool.query(
      `SELECT id, name, description, created_at, updated_at
       FROM departments 
       WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Find department by name
   */
  async findByName(name: string) {
    const result = await pool.query(
      `SELECT id, name, description, created_at, updated_at
       FROM departments 
       WHERE LOWER(name) = LOWER($1) AND is_deleted = false`,
      [name.trim()]
    );
    return result.rows[0] || null;
  }

  /**
   * Create new department
   */
  async create(data: { name: string; description?: string }) {
    const result = await pool.query(
      `INSERT INTO departments (name, description)
       VALUES ($1, $2)
       RETURNING id, name, description, created_at, updated_at`,
      [data.name.trim(), data.description || null]
    );
    return result.rows[0];
  }

  /**
   * Update department
   */
  async update(id: number, data: { name?: string; description?: string }) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(data.name.trim());
    }

    if (data.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(data.description);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE departments 
       SET ${updates.join(", ")}
       WHERE id = $${paramCount} AND is_deleted = false
       RETURNING id, name, description, created_at, updated_at`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Soft delete department
   */
  async delete(id: number) {
    const result = await pool.query(
      `UPDATE departments 
       SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false
       RETURNING id`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Check if department is in use by users
   */
  async isInUse(id: number) {
    const result = await pool.query(
      `SELECT COUNT(*) as count
       FROM users 
       WHERE department_id = $1 AND is_deleted = false`,
      [id]
    );
    return parseInt(result.rows[0].count) > 0;
  }
}

export const departmentRepository = new DepartmentRepository();
