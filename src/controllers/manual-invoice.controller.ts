/**
 * Manual Invoice Controller
 * Handles HTTP requests and responses for manual invoice operations
 */

import { Request, Response } from "express";
import { manualInvoiceService } from "../services/manual-invoice.service.js";

export class ManualInvoiceController {
  private parseNumber(value: any) {
    if (value === undefined || value === null || value === "") return undefined;
    const num = parseFloat(value);
    return Number.isNaN(num) ? undefined : num;
  }

  private parseDate(value: any) {
    if (!value) return undefined;
    return new Date(value);
  }

  private buildPhases(body: any) {
    if (Array.isArray(body.phases)) {
      return body.phases.map((phase: any) => ({
        phaseNumber: parseInt(phase.phaseNumber),
        remarks: phase.remarks,
        price: this.parseNumber(phase.price),
        startDate: this.parseDate(phase.startDate),
        endDate: this.parseDate(phase.endDate),
      }));
    }

    const phases = [1, 2, 3, 4]
      .map((phaseNumber) => {
        const remarks = body[`phase${phaseNumber}Remarks`];
        const price = this.parseNumber(body[`phase${phaseNumber}Price`]);
        const startDate = this.parseDate(body[`phase${phaseNumber}StartDate`]);
        const endDate = this.parseDate(body[`phase${phaseNumber}EndDate`]);

        if (
          remarks === undefined &&
          price === undefined &&
          startDate === undefined &&
          endDate === undefined
        ) {
          return null;
        }

        return { phaseNumber, remarks, price, startDate, endDate };
      })
      .filter(Boolean);

    return phases;
  }

  /**
   * GET /manual-invoices
   */
  async getAllManualInvoices(req: Request, res: Response) {
    try {
      const filters: { status?: string } = {};

      if (req.query.status) {
        filters.status = String(req.query.status);
      }

      const invoices = await manualInvoiceService.getAllManualInvoices(filters);

      res.json({
        success: true,
        data: invoices,
      });
    } catch (error) {
      console.error("Get manual invoices error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch manual invoices",
      });
    }
  }

  /**
   * GET /manual-invoices/:id
   */
  async getManualInvoiceById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid manual invoice ID",
        });
      }

      const invoice = await manualInvoiceService.getManualInvoiceById(id);

      res.json({
        success: true,
        data: invoice,
      });
    } catch (error: any) {
      console.error("Get manual invoice error:", error);

      if (error.message === "Manual invoice not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch manual invoice",
      });
    }
  }

  /**
   * POST /manual-invoices
   */
  async createManualInvoice(req: Request, res: Response) {
    try {
      const payload = {
        clientName: req.body.clientName,
        clientEmail: req.body.clientEmail,
        contactPhone: req.body.contactPhone,
        address: req.body.address,
        serviceDescription: req.body.serviceDescription,
        phaseWork: req.body.phaseWork,
        serviceType: req.body.serviceType,
        serviceCategory: req.body.serviceCategory,
        phases: this.buildPhases(req.body),
        taxRate: this.parseNumber(req.body.taxRate),
        discount: this.parseNumber(req.body.discount),
        maintenanceDueDate: this.parseDate(req.body.maintenanceDueDate),
        status: req.body.status,
      };

      const invoice = await manualInvoiceService.createManualInvoice(payload);

      res.status(201).json({
        success: true,
        data: invoice,
        message: "Manual invoice created successfully",
      });
    } catch (error: any) {
      console.error("Create manual invoice error:", error);

      if (
        error.message.includes("required") ||
        error.message.includes("Invalid status") ||
        error.message.includes("Phase")
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create manual invoice",
      });
    }
  }

  /**
   * PUT /manual-invoices/:id
   */
  async updateManualInvoice(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid manual invoice ID",
        });
      }

      const payload = {
        clientName: req.body.clientName,
        clientEmail: req.body.clientEmail,
        contactPhone: req.body.contactPhone,
        address: req.body.address,
        serviceDescription: req.body.serviceDescription,
        phaseWork: req.body.phaseWork,
        serviceType: req.body.serviceType,
        serviceCategory: req.body.serviceCategory,
        phases: this.buildPhases(req.body),
        taxRate: this.parseNumber(req.body.taxRate),
        discount: this.parseNumber(req.body.discount),
        maintenanceDueDate: this.parseDate(req.body.maintenanceDueDate),
        status: req.body.status,
      };

      if (payload.phases.length === 0) {
        delete (payload as any).phases;
      }

      const invoice = await manualInvoiceService.updateManualInvoice(
        id,
        payload,
      );

      res.json({
        success: true,
        data: invoice,
        message: "Manual invoice updated successfully",
      });
    } catch (error: any) {
      console.error("Update manual invoice error:", error);

      if (error.message === "Manual invoice not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message.includes("Invalid status")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message.includes("Phase")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update manual invoice",
      });
    }
  }

  /**
   * DELETE /manual-invoices/:id
   */
  async deleteManualInvoice(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid manual invoice ID",
        });
      }

      const result = await manualInvoiceService.deleteManualInvoice(id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Delete manual invoice error:", error);

      if (error.message === "Manual invoice not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete manual invoice",
      });
    }
  }
}

export const manualInvoiceController = new ManualInvoiceController();
