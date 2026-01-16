/**
 * Organization Repository
 * Handles all database operations for organizations
 */

import { pool } from "../db/dbConnection.js";

export class OrganizationRepository {
  /**
   * Find organization by ID
   */
  async findById(id: number) {
    const result = await pool.query(
      `SELECT id, name, address, email, phone, purchase_plain, modules,
              status, login_status, created_by, created_at, updated_at
       FROM organizations 
       WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Find all organizations
   */
  async findAll(filters?: { status?: string; purchasePlain?: string }) {
    let query = `
      SELECT id, name, address, email, phone, purchase_plain, modules,
             status, login_status, created_by, created_at, updated_at
      FROM organizations
      WHERE is_deleted = false
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.purchasePlain) {
      query += ` AND purchase_plain = $${paramIndex}`;
      params.push(filters.purchasePlain);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Find organization by email
   */
  async findByEmail(email: string) {
    const result = await pool.query(
      `SELECT id, name, email FROM organizations 
       WHERE email = $1 AND is_deleted = false`,
      [email.toLowerCase().trim()]
    );
    return result.rows[0] || null;
  }

  /**
   * Create new organization
   */
  async create(orgData: {
    name: string;
    address?: string;
    email: string;
    phone?: string;
    purchasePlain: string;
    modules?: string;
    status: string;
    loginStatus: boolean;
    createdBy: number;
  }) {
    const result = await pool.query(
      `INSERT INTO organizations (
        name, address, email, phone, purchase_plain, modules,
        status, login_status, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, name, address, email, phone, purchase_plain, modules,
                 status, login_status, created_by, created_at, updated_at`,
      [
        orgData.name,
        orgData.address || null,
        orgData.email.toLowerCase().trim(),
        orgData.phone || null,
        orgData.purchasePlain,
        orgData.modules || null,
        orgData.status,
        orgData.loginStatus,
        orgData.createdBy,
      ]
    );
    return result.rows[0];
  }

  /**
   * Update organization
   */
  async update(
    id: number,
    data: {
      name?: string;
      address?: string;
      email?: string;
      phone?: string;
      purchasePlain?: string;
      modules?: string;
      status?: string;
      loginStatus?: boolean;
    }
  ) {
    const result = await pool.query(
      `UPDATE organizations 
       SET name = COALESCE($1, name),
           address = COALESCE($2, address),
           email = COALESCE($3, email),
           phone = COALESCE($4, phone),
           purchase_plain = COALESCE($5, purchase_plain),
           modules = COALESCE($6, modules),
           status = COALESCE($7, status),
           login_status = COALESCE($8, login_status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND is_deleted = false
       RETURNING id, name, address, email, phone, purchase_plain, modules,
                 status, login_status, created_by, created_at, updated_at`,
      [
        data.name,
        data.address,
        data.email ? data.email.toLowerCase().trim() : null,
        data.phone,
        data.purchasePlain,
        data.modules,
        data.status,
        data.loginStatus,
        id,
      ]
    );
    return result.rows[0] || null;
  }

  /**
   * Soft delete organization
   */
  async softDelete(id: number) {
    const result = await pool.query(
      `UPDATE organizations 
       SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false
       RETURNING id`,
      [id]
    );
    return result.rows[0] || null;
  }
}

export const organizationRepository = new OrganizationRepository();
