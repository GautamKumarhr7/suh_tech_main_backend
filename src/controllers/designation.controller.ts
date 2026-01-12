/**
 * Designation Controller
 * Handles HTTP requests and responses for designation operations
 */

import { Request, Response } from "express";
import { designationService } from "../services/designation.service.js";

export class DesignationController {
  /**
   * GET /api/designations
   * Get all designations
   */
  async getAllDesignations(req: Request, res: Response) {
    try {
      const designations = await designationService.getAllDesignations();

      res.json({
        success: true,
        data: designations,
      });
    } catch (error) {
      console.error("Get designations error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch designations",
      });
    }
  }

  /**
   * GET /api/designations/:id
   * Get designation by ID
   */
  async getDesignationById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid designation ID",
        });
      }

      const designation = await designationService.getDesignationById(id);

      res.json({
        success: true,
        data: designation,
      });
    } catch (error: any) {
      console.error("Get designation error:", error);
      if (error.message === "Designation not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to fetch designation",
      });
    }
  }

  /**
   * POST /api/designations
   * Create new designation
   */
  async createDesignation(req: Request, res: Response) {
    try {
      const designationData = {
        title: req.body.title,
        description: req.body.description,
      };

      const designation = await designationService.createDesignation(
        designationData
      );

      res.status(201).json({
        success: true,
        data: designation,
        message: "Designation created successfully",
      });
    } catch (error: any) {
      console.error("Create designation error:", error);
      if (
        error.message === "Designation title is required" ||
        error.message === "Designation with this title already exists"
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to create designation",
      });
    }
  }

  /**
   * PUT /api/designations/:id
   * Update designation
   */
  async updateDesignation(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid designation ID",
        });
      }

      const updateData = {
        title: req.body.title,
        description: req.body.description,
      };

      const designation = await designationService.updateDesignation(
        id,
        updateData
      );

      res.json({
        success: true,
        data: designation,
        message: "Designation updated successfully",
      });
    } catch (error: any) {
      console.error("Update designation error:", error);
      if (error.message === "Designation not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      if (error.message === "Designation with this title already exists") {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to update designation",
      });
    }
  }

  /**
   * DELETE /api/designations/:id
   * Delete designation
   */
  async deleteDesignation(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid designation ID",
        });
      }

      const result = await designationService.deleteDesignation(id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Delete designation error:", error);
      if (error.message === "Designation not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      if (
        error.message ===
        "Cannot delete designation as it is assigned to one or more users"
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to delete designation",
      });
    }
  }
}

export const designationController = new DesignationController();
