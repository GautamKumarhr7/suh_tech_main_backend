/**
 * Manual Invoice Service
 * Contains business logic for manual invoice operations
 */

import { manualInvoiceRepository } from "../repositories/manual-invoice.repository.js";

interface InvoicePhaseInput {
  phaseNumber: number;
  remarks?: string;
  price?: number;
  startDate?: Date;
  endDate?: Date;
}

export class ManualInvoiceService {
  /**
   * Get all manual invoices
   */
  async getAllManualInvoices(filters?: { status?: string }) {
    const invoices = await manualInvoiceRepository.findAll(filters);
    return invoices.map((invoice) => this.formatManualInvoiceResponse(invoice));
  }

  /**
   * Get manual invoice by ID
   */
  async getManualInvoiceById(id: number) {
    const invoice = await manualInvoiceRepository.findById(id);
    if (!invoice) {
      throw new Error("Manual invoice not found");
    }

    return this.formatManualInvoiceResponse(invoice);
  }

  /**
   * Create manual invoice
   */
  async createManualInvoice(data: {
    clientName: string;
    clientEmail?: string;
    contactPhone?: string;
    address?: string;
    serviceDescription: string;
    phaseWork?: string;
    serviceType: string;
    serviceCategory: string;
    phases: InvoicePhaseInput[];
    taxRate?: number;
    discount?: number;
    maintenanceDueDate?: Date;
    status?: string;
  }) {
    if (
      !data.clientName ||
      !data.serviceDescription ||
      !data.serviceType ||
      !data.serviceCategory
    ) {
      throw new Error(
        "Client name, service description, service type, and service category are required",
      );
    }

    this.validatePhases(data.phases);

    const status = data.status || "draft";
    this.validateStatus(status);

    const created = await manualInvoiceRepository.create({
      ...data,
      status,
    });

    return this.formatManualInvoiceResponse(created);
  }

  /**
   * Update manual invoice
   */
  async updateManualInvoice(
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
      phases?: InvoicePhaseInput[];
      taxRate?: number;
      discount?: number;
      maintenanceDueDate?: Date;
      status?: string;
    },
  ) {
    const existing = await manualInvoiceRepository.findById(id);
    if (!existing) {
      throw new Error("Manual invoice not found");
    }

    if (data.status) {
      this.validateStatus(data.status);
    }

    if (data.phases) {
      this.validatePhases(data.phases);
    }

    const updated = await manualInvoiceRepository.update(id, data);
    if (!updated) {
      throw new Error("Failed to update manual invoice");
    }

    return this.formatManualInvoiceResponse(updated);
  }

  /**
   * Delete manual invoice
   */
  async deleteManualInvoice(id: number) {
    const existing = await manualInvoiceRepository.findById(id);
    if (!existing) {
      throw new Error("Manual invoice not found");
    }

    const deleted = await manualInvoiceRepository.delete(id);
    if (!deleted) {
      throw new Error("Failed to delete manual invoice");
    }

    return { message: "Manual invoice deleted successfully" };
  }

  private validateStatus(status: string) {
    const validStatuses = [
      "draft",
      "sent",
      "paid",
      "partially paid",
      "overdue",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      );
    }
  }

  private validatePhases(phases: InvoicePhaseInput[]) {
    if (!Array.isArray(phases) || phases.length === 0) {
      throw new Error("At least one phase is required");
    }

    const uniquePhaseNumbers = new Set(
      phases.map((phase) => phase.phaseNumber),
    );
    if (uniquePhaseNumbers.size !== phases.length) {
      throw new Error("Duplicate phase numbers are not allowed");
    }

    const phase1 = phases.find((phase) => phase.phaseNumber === 1);
    if (!phase1 || phase1.price === undefined || Number.isNaN(phase1.price)) {
      throw new Error("Phase 1 with a valid price is required");
    }

    for (const phase of phases) {
      if (phase.phaseNumber < 1 || phase.phaseNumber > 4) {
        throw new Error("Phase number must be between 1 and 4");
      }

      if (phase.price !== undefined && Number.isNaN(phase.price)) {
        throw new Error(`Invalid price for phase ${phase.phaseNumber}`);
      }
    }
  }

  /**
   * Format manual invoice response
   */
  private formatManualInvoiceResponse(invoice: any) {
    const phases = (invoice.phases || []).map((phase: any) => ({
      phaseNumber: phase.phase_number,
      remarks: phase.remarks,
      price: phase.price ? parseFloat(phase.price) : null,
      startDate: phase.start_date,
      endDate: phase.end_date,
    }));

    const getPhase = (phaseNumber: number) =>
      phases.find((phase: any) => phase.phaseNumber === phaseNumber) || {
        remarks: null,
        price: null,
        startDate: null,
        endDate: null,
      };

    return {
      id: invoice.id,
      clientName: invoice.client_name,
      clientEmail: invoice.client_email,
      contactPhone: invoice.contact_phone,
      address: invoice.address,
      serviceDescription: invoice.service_description,
      phaseWork: invoice.phase_work,
      serviceType: invoice.service_type,
      serviceCategory: invoice.service_category,
      phases,
      phase1: getPhase(1),
      phase2: getPhase(2),
      phase3: getPhase(3),
      phase4: getPhase(4),
      taxRate: invoice.tax_rate ? parseFloat(invoice.tax_rate) : null,
      discount: invoice.discount ? parseFloat(invoice.discount) : null,
      maintenanceDueDate: invoice.maintenance_due_date,
      status: invoice.status,
      createdAt: invoice.created_at,
      updatedAt: invoice.updated_at,
    };
  }
}

export const manualInvoiceService = new ManualInvoiceService();
