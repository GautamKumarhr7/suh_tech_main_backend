/**
 * User Repository
 * Handles all database operations for users
 */

import { pool } from "../db/dbConnection.js";
import { User } from "../db/schema.js";

export class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, password, admin, active, 
              is_deleted, emp_id, phone_number, address, department_id, 
              designation_id, joined_date, skills, emp_type
       FROM users 
       WHERE email = $1`,
      [email.toLowerCase().trim()]
    );
    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   */
  async findById(id: number) {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, password, admin, active, 
              is_deleted, emp_id, phone_number, address, department_id, 
              designation_id, joined_date, skills, emp_type, created_at, updated_at
       FROM users 
       WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Find all active users
   */
  async findAll() {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, admin, emp_id, phone_number, 
              department_id, designation_id, active, joined_date, emp_type, 
              created_at, updated_at
       FROM users 
       WHERE is_deleted = false
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const result = await pool.query("SELECT id FROM users WHERE email = $1", [
      email.toLowerCase().trim(),
    ]);
    return result.rows.length > 0;
  }

  /**
   * Check if employee ID exists
   */
  async empIdExists(empId: string): Promise<boolean> {
    const result = await pool.query("SELECT id FROM users WHERE emp_id = $1", [
      empId,
    ]);
    return result.rows.length > 0;
  }

  /**
   * Create new user
   */
  async create(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber?: string;
    address?: string;
    admin?: boolean;
    empId?: string;
    departmentId?: number;
    designationId?: number;
    joinedDate?: Date;
    skills?: string;
    active?: boolean;
    empType?: string;
  }) {
    const result = await pool.query(
      `INSERT INTO users (
        email, first_name, last_name, password, phone_number, address,
        admin, emp_id, department_id, designation_id, joined_date,
        skills, active, emp_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, email, first_name, last_name, admin, emp_id, phone_number,
                department_id, designation_id, joined_date, active, emp_type,
                created_at, updated_at`,
      [
        userData.email.toLowerCase().trim(),
        userData.firstName,
        userData.lastName,
        userData.password,
        userData.phoneNumber || null,
        userData.address || null,
        userData.admin || false,
        userData.empId || null,
        userData.departmentId || null,
        userData.designationId || null,
        userData.joinedDate || null,
        userData.skills || null,
        userData.active ?? true,
        userData.empType || "full-time",
      ]
    );
    return result.rows[0];
  }

  /**
   * Update user (basic fields)
   */
  async updateBasicFields(
    id: number,
    data: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      address?: string;
      skills?: string;
    }
  ) {
    const result = await pool.query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           phone_number = COALESCE($3, phone_number),
           address = COALESCE($4, address),
           skills = COALESCE($5, skills),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND is_deleted = false
       RETURNING id, email, first_name, last_name, phone_number, address, skills`,
      [
        data.firstName,
        data.lastName,
        data.phoneNumber,
        data.address,
        data.skills,
        id,
      ]
    );
    return result.rows[0] || null;
  }

  /**
   * Update user (admin - all fields)
   */
  async updateAllFields(
    id: number,
    data: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      address?: string;
      skills?: string;
      admin?: boolean;
      empId?: string;
      departmentId?: number;
      designationId?: number;
      joinedDate?: Date;
      active?: boolean;
      empType?: string;
    }
  ) {
    const result = await pool.query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           phone_number = COALESCE($3, phone_number),
           address = COALESCE($4, address),
           skills = COALESCE($5, skills),
           admin = COALESCE($6, admin),
           emp_id = COALESCE($7, emp_id),
           department_id = COALESCE($8, department_id),
           designation_id = COALESCE($9, designation_id),
           joined_date = COALESCE($10, joined_date),
           active = COALESCE($11, active),
           emp_type = COALESCE($12, emp_type),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $13 AND is_deleted = false
       RETURNING id, email, first_name, last_name, admin, emp_id, phone_number,
                 department_id, designation_id, joined_date, active, emp_type`,
      [
        data.firstName,
        data.lastName,
        data.phoneNumber,
        data.address,
        data.skills,
        data.admin,
        data.empId,
        data.departmentId,
        data.designationId,
        data.joinedDate,
        data.active,
        data.empType,
        id,
      ]
    );
    return result.rows[0] || null;
  }

  /**
   * Update user password
   */
  async updatePassword(id: number, hashedPassword: string) {
    const result = await pool.query(
      `UPDATE users 
       SET password = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND is_deleted = false
       RETURNING id`,
      [hashedPassword, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Soft delete user
   */
  async softDelete(id: number) {
    const result = await pool.query(
      `UPDATE users 
       SET is_deleted = true, active = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false
       RETURNING id, email`,
      [id]
    );
    return result.rows[0] || null;
  }
}

export const userRepository = new UserRepository();
