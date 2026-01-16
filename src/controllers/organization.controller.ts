/**
 * Organization Controller
 * Handles HTTP requests and responses for organization operations
 */

import { Request, Response } from "express";
import { organizationService } from "../services/organization.service.js";

export class OrganizationController {
  /**
   * GET /api/organizations
   * Get all organizations (with optional filters)
   */
  async getAllOrganizations(req: Request, res: Response) {
    try {
      const filters: any = {};

      if (req.query.status) {
        filters.status = req.query.status as string;
      }

      if (req.query.purchasePlain) {
        filters.purchasePlain = req.query.purchasePlain as string;
      }

      const organizations = await organizationService.getAllOrganizations(filters);

      res.json({
        success: true,
        data: organizations,
      });
    } catch (error: any) {
      console.error("Get organizations error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch organizations",
      });
    }
  }

  /**
   * GET /api/organizations/:id
   * Get organization by ID
   */
  async getOrganizationById(req: Request, res: Response) {
    try {
      const orgId = parseInt(req.params.id);

      if (isNaN(orgId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid organization ID",
        });
      }

      const organization = await organizationService.getOrganizationById(orgId);

      res.json({
        success: true,
        data: organization,
      });
    } catch (error: any) {
      console.error("Get organization error:", error);

      if (error.message === "Organization not found") {
        return res.status(404).json({
          success: false,
          message: "Organization not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch organization",
      });
    }
  }

  /**
   * POST /api/organizations
   * Create new organization
   */
  async createOrganization(req: Request, res: Response) {
    try {
      const orgData = {
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        purchasePlain: req.body.purchasePlain || "basic",
        modules: req.body.modules,
        status: req.body.status || "pending",
        loginStatus: req.body.loginStatus || false,
        createdBy: req.body.createdBy || (req as any).user?.id,
      };

      const organization = await organizationService.createOrganization(orgData);

      res.status(201).json({
        success: true,
        message: "Organization created successfully",
        data: organization,
      });
    } catch (error: any) {
      console.error("Create organization error:", error);

      if (
        error.message.includes("required") ||
        error.message.includes("already exists") ||
        error.message.includes("Invalid purchase plan") ||
        error.message.includes("not found")
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create organization",
      });
    }
  }

  /**
   * PUT /api/organizations/:id
   * Update organization
   */
  async updateOrganization(req: Request, res: Response) {
    try {
      const orgId = parseInt(req.params.id);

      if (isNaN(orgId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid organization ID",
        });
      }

      const updateData: any = {};

      if (req.body.name) updateData.name = req.body.name;
      if (req.body.address !== undefined) updateData.address = req.body.address;
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.phone !== undefined) updateData.phone = req.body.phone;
      if (req.body.purchasePlain) updateData.purchasePlain = req.body.purchasePlain;
      if (req.body.modules !== undefined) updateData.modules = req.body.modules;
      if (req.body.status) updateData.status = req.body.status;
      if (req.body.loginStatus !== undefined) updateData.loginStatus = req.body.loginStatus;

      const organization = await organizationService.updateOrganization(
        orgId,
        updateData
      );

      res.json({
        success: true,
        message: "Organization updated successfully",
        data: organization,
      });
    } catch (error: any) {
      console.error("Update organization error:", error);

      if (error.message === "Organization not found") {
        return res.status(404).json({
          success: false,
          message: "Organization not found",
        });
      }

      if (
        error.message.includes("already exists") ||
        error.message.includes("Invalid purchase plan")
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update organization",
      });
    }
  }

  /**
   * DELETE /api/organizations/:id
   * Soft delete organization
   */
  async deleteOrganization(req: Request, res: Response) {
    try {
      const orgId = parseInt(req.params.id);

      if (isNaN(orgId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid organization ID",
        });
      }

      await organizationService.deleteOrganization(orgId);

      res.json({
        success: true,
        message: "Organization deleted successfully",
      });
    } catch (error: any) {
      console.error("Delete organization error:", error);

      if (error.message === "Organization not found") {
        return res.status(404).json({
          success: false,
          message: "Organization not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete organization",
      });
    }
  }
}

export const organizationController = new OrganizationController();
