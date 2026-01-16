/**
 * Project Repository
 * Handles all database operations for projects
 */

import { pool } from "../db/dbConnection.js";

export class ProjectRepository {
  /**
   * Find project by ID
   */
  async findById(id: number) {
    const result = await pool.query(
      `SELECT id, project_name, client_name, start_date, end_date, status,
              description, phone, email, services_type, budget, technology_stack,
              created_at, updated_at
       FROM projects 
       WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Find all projects
   */
  async findAll(filters?: {
    status?: string;
    clientName?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    let query = `
      SELECT id, project_name, client_name, start_date, end_date, status,
             description, phone, email, services_type, budget, technology_stack,
             created_at, updated_at
      FROM projects
      WHERE is_deleted = false
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.clientName) {
      query += ` AND client_name ILIKE $${paramIndex}`;
      params.push(`%${filters.clientName}%`);
      paramIndex++;
    }

    if (filters?.startDate) {
      query += ` AND start_date >= $${paramIndex}`;
      params.push(filters.startDate);
      paramIndex++;
    }

    if (filters?.endDate) {
      query += ` AND end_date <= $${paramIndex}`;
      params.push(filters.endDate);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Create new project
   */
  async create(projectData: {
    projectName: string;
    clientName: string;
    startDate: Date;
    endDate?: Date;
    status: string;
    description?: string;
    phone?: string;
    email?: string;
    servicesType?: string;
    budget?: number;
    technologyStack?: string;
  }) {
    const result = await pool.query(
      `INSERT INTO projects (
        project_name, client_name, start_date, end_date, status,
        description, phone, email, services_type, budget, technology_stack
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, project_name, client_name, start_date, end_date, status,
                 description, phone, email, services_type, budget, technology_stack,
                 created_at, updated_at`,
      [
        projectData.projectName,
        projectData.clientName,
        projectData.startDate,
        projectData.endDate || null,
        projectData.status,
        projectData.description || null,
        projectData.phone || null,
        projectData.email || null,
        projectData.servicesType || null,
        projectData.budget || null,
        projectData.technologyStack || null,
      ]
    );
    return result.rows[0];
  }

  /**
   * Update project
   */
  async update(
    id: number,
    data: {
      projectName?: string;
      clientName?: string;
      startDate?: Date;
      endDate?: Date;
      status?: string;
      description?: string;
      phone?: string;
      email?: string;
      servicesType?: string;
      budget?: number;
      technologyStack?: string;
    }
  ) {
    const result = await pool.query(
      `UPDATE projects 
       SET project_name = COALESCE($1, project_name),
           client_name = COALESCE($2, client_name),
           start_date = COALESCE($3, start_date),
           end_date = COALESCE($4, end_date),
           status = COALESCE($5, status),
           description = COALESCE($6, description),
           phone = COALESCE($7, phone),
           email = COALESCE($8, email),
           services_type = COALESCE($9, services_type),
           budget = COALESCE($10, budget),
           technology_stack = COALESCE($11, technology_stack),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $12 AND is_deleted = false
       RETURNING id, project_name, client_name, start_date, end_date, status,
                 description, phone, email, services_type, budget, technology_stack,
                 created_at, updated_at`,
      [
        data.projectName,
        data.clientName,
        data.startDate,
        data.endDate,
        data.status,
        data.description,
        data.phone,
        data.email,
        data.servicesType,
        data.budget,
        data.technologyStack,
        id,
      ]
    );
    return result.rows[0] || null;
  }

  /**
   * Soft delete project
   */
  async softDelete(id: number) {
    const result = await pool.query(
      `UPDATE projects 
       SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false
       RETURNING id`,
      [id]
    );
    return result.rows[0] || null;
  }
}

export const projectRepository = new ProjectRepository();
