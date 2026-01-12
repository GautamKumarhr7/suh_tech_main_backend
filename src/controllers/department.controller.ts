/**
 * Department Controller
 * Handles HTTP requests and responses for department operations
 */

import { Request, Response } from "express";
import { departmentService } from "../services/department.service.js";

export class DepartmentController {
  /**
   * GET /api/departments
   * Get all departments
   */
  async getAllDepartments(req: Request, res: Response) {
    try {
      const departments = await departmentService.getAllDepartments();

      res.json({
        success: true,
        data: departments,
      });
    } catch (error) {
      console.error("Get departments error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch departments",
      });
    }
  }

  /**
   * GET /api/departments/:id
   * Get department by ID
   */
  async getDepartmentById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid department ID",
        });
      }

      const department = await departmentService.getDepartmentById(id);

      res.json({
        success: true,
        data: department,
      });
    } catch (error: any) {
      console.error("Get department error:", error);
      if (error.message === "Department not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to fetch department",
      });
    }
  }

  /**
   * POST /api/departments
   * Create new department
   */
  async createDepartment(req: Request, res: Response) {
    try {
      const departmentData = {
        name: req.body.name,
        description: req.body.description,
      };

      const department = await departmentService.createDepartment(
        departmentData
      );

      res.status(201).json({
        success: true,
        data: department,
        message: "Department created successfully",
      });
    } catch (error: any) {
      console.error("Create department error:", error);
      if (
        error.message === "Department name is required" ||
        error.message === "Department with this name already exists"
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to create department",
      });
    }
  }

  /**
   * PUT /api/departments/:id
   * Update department
   */
  async updateDepartment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid department ID",
        });
      }

      const updateData: { name?: string; description?: string } = {};

      if (req.body.name !== undefined) {
        updateData.name = req.body.name;
      }
      if (req.body.description !== undefined) {
        updateData.description = req.body.description;
      }

      const department = await departmentService.updateDepartment(
        id,
        updateData
      );

      res.json({
        success: true,
        data: department,
        message: "Department updated successfully",
      });
    } catch (error: any) {
      console.error("Update department error:", error);
      if (error.message === "Department not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      if (error.message === "Department with this name already exists") {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to update department",
      });
    }
  }

  /**
   * DELETE /api/departments/:id
   * Delete department
   */
  async deleteDepartment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid department ID",
        });
      }

      const result = await departmentService.deleteDepartment(id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Delete department error:", error);
      if (error.message === "Department not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      if (
        error.message ===
        "Cannot delete department as it is assigned to one or more users"
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to delete department",
      });
    }
  }
}

export const departmentController = new DepartmentController();
