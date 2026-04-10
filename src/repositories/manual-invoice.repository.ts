/**
 * Manual Invoice Repository
 * Handles all database operations for manual invoices
 */

import { pool } from "../db/dbConnection.js";

export interface ManualInvoicePhaseInput {
  phaseNumber: number;
  remarks?: string;
  price?: number;
  startDate?: Date;
  endDate?: Date;
}

export class ManualInvoiceRepository {
  private async getPhasesByInvoiceIds(invoiceIds: number[]) {
    if (invoiceIds.length === 0) {
      return new Map<number, any[]>();
    }

    const result = await pool.query(
      `SELECT id, invoice_id, phase_number, remarks, price, start_date, end_date,
              created_at, updated_at
       FROM manual_invoice_phases
       WHERE invoice_id = ANY($1::int[])
       ORDER BY invoice_id ASC, phase_number ASC`,
      [invoiceIds],
    );

    const phaseMap = new Map<number, any[]>();

    for (const row of result.rows) {
      const existing = phaseMap.get(row.invoice_id) || [];
      existing.push(row);
      phaseMap.set(row.invoice_id, existing);
    }

    return phaseMap;
  }

  /**
   * Find all manual invoices
   */
  async findAll(filters?: { status?: string }) {
    let query = `
      SELECT id, client_name, client_email, contact_phone, address,
             service_description, phase_work, service_type, service_category,
             tax_rate, discount, maintenance_due_date, status, created_at, updated_at
      FROM manual_invoices
      WHERE is_deleted = false
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    const rows = result.rows;
    const phaseMap = await this.getPhasesByInvoiceIds(
      rows.map((row) => row.id),
    );

    return rows.map((row) => ({
      ...row,
      phases: phaseMap.get(row.id) || [],
    }));
  }

  /**
   * Find manual invoice by ID
   */
  async findById(id: number) {
    const result = await pool.query(
      `SELECT id, client_name, client_email, contact_phone, address,
              service_description, phase_work, service_type, service_category,
              tax_rate, discount, maintenance_due_date, status, created_at, updated_at
       FROM manual_invoices
       WHERE id = $1 AND is_deleted = false`,
      [id],
    );

    const invoice = result.rows[0] || null;
    if (!invoice) return null;

    const phaseMap = await this.getPhasesByInvoiceIds([id]);
    return {
      ...invoice,
      phases: phaseMap.get(id) || [],
    };
  }

  /**
   * Create manual invoice
   */
  async create(data: {
    clientName: string;
    clientEmail?: string;
    contactPhone?: string;
    address?: string;
    serviceDescription: string;
    phaseWork?: string;
    serviceType: string;
    serviceCategory: string;
    phases: ManualInvoicePhaseInput[];
    taxRate?: number;
    discount?: number;
    maintenanceDueDate?: Date;
    status: string;
  }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        `INSERT INTO manual_invoices (
           client_name, client_email, contact_phone, address,
           service_description, phase_work, service_type, service_category,
           tax_rate, discount, maintenance_due_date, status
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id, client_name, client_email, contact_phone, address,
                   service_description, phase_work, service_type, service_category,
                   tax_rate, discount, maintenance_due_date, status, created_at, updated_at`,
        [
          data.clientName,
          data.clientEmail || null,
          data.contactPhone || null,
          data.address || null,
          data.serviceDescription,
          data.phaseWork || null,
          data.serviceType,
          data.serviceCategory,
          data.taxRate || null,
          data.discount || null,
          data.maintenanceDueDate || null,
          data.status,
        ],
      );

      const invoice = result.rows[0];

      for (const phase of data.phases) {
        await client.query(
          `INSERT INTO manual_invoice_phases (
             invoice_id, phase_number, remarks, price, start_date, end_date
           ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            invoice.id,
            phase.phaseNumber,
            phase.remarks || null,
            phase.price || null,
            phase.startDate || null,
            phase.endDate || null,
          ],
        );
      }

      await client.query("COMMIT");
      return this.findById(invoice.id);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update manual invoice
   */
  async update(
    id: number,
    data: {
      clientName?: string;
      clientEmail?: string;
      contactPhone?: string;
      address?: string;
      serviceDescription?: string;
      phaseWork?: string;
      serviceType?: string;
      serviceCategory?: string;
      phases?: ManualInvoicePhaseInput[];
      taxRate?: number;
      discount?: number;
      maintenanceDueDate?: Date;
      status?: string;
    },
  ) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        `UPDATE manual_invoices
         SET client_name = COALESCE($1, client_name),
             client_email = COALESCE($2, client_email),
             contact_phone = COALESCE($3, contact_phone),
             address = COALESCE($4, address),
             service_description = COALESCE($5, service_description),
             phase_work = COALESCE($6, phase_work),
             service_type = COALESCE($7, service_type),
             service_category = COALESCE($8, service_category),
             tax_rate = COALESCE($9, tax_rate),
             discount = COALESCE($10, discount),
             maintenance_due_date = COALESCE($11, maintenance_due_date),
             status = COALESCE($12, status),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $13 AND is_deleted = false
         RETURNING id`,
        [
          data.clientName,
          data.clientEmail,
          data.contactPhone,
          data.address,
          data.serviceDescription,
          data.phaseWork,
          data.serviceType,
          data.serviceCategory,
          data.taxRate,
          data.discount,
          data.maintenanceDueDate,
          data.status,
          id,
        ],
      );

      if (!result.rows[0]) {
        await client.query("ROLLBACK");
        return null;
      }

      if (data.phases) {
        await client.query(
          `DELETE FROM manual_invoice_phases WHERE invoice_id = $1`,
          [id],
        );

        for (const phase of data.phases) {
          await client.query(
            `INSERT INTO manual_invoice_phases (
               invoice_id, phase_number, remarks, price, start_date, end_date
             ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              id,
              phase.phaseNumber,
              phase.remarks || null,
              phase.price || null,
              phase.startDate || null,
              phase.endDate || null,
            ],
          );
        }
      }

      await client.query("COMMIT");
      return this.findById(id);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Soft delete manual invoice
   */
  async delete(id: number) {
    const result = await pool.query(
      `UPDATE manual_invoices
       SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false
       RETURNING id`,
      [id],
    );

    return result.rows[0] || null;
  }
}

export const manualInvoiceRepository = new ManualInvoiceRepository();
