/**
 * Project Controller
 * Handles HTTP requests and responses for project operations
 */

import { Request, Response } from "express";
import { projectService } from "../services/project.service.js";

export class ProjectController {
  /**
   * GET /api/projects
   * Get all projects (with optional filters)
   */
  async getAllProjects(req: Request, res: Response) {
    try {
      const filters: any = {};

      if (req.query.status) {
        filters.status = req.query.status as string;
      }

      if (req.query.clientName) {
        filters.clientName = req.query.clientName as string;
      }

      if (req.query.startDate) {
        filters.startDate = new Date(req.query.startDate as string);
      }

      if (req.query.endDate) {
        filters.endDate = new Date(req.query.endDate as string);
      }

      const projects = await projectService.getAllProjects(filters);

      res.json({
        success: true,
        data: projects,
      });
    } catch (error: any) {
      console.error("Get projects error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch projects",
      });
    }
  }

  /**
   * GET /api/projects/:id
   * Get project by ID
   */
  async getProjectById(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.id);

      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        });
      }

      const project = await projectService.getProjectById(projectId);

      res.json({
        success: true,
        data: project,
      });
    } catch (error: any) {
      console.error("Get project error:", error);

      if (error.message === "Project not found") {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch project",
      });
    }
  }

  /**
   * POST /api/projects
   * Create new project
   */
  async createProject(req: Request, res: Response) {
    try {
      const projectData = {
        projectName: req.body.projectName,
        clientName: req.body.clientName,
        startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
        status: req.body.status || "pending",
        description: req.body.description,
        phone: req.body.phone,
        email: req.body.email,
        servicesType: req.body.servicesType,
        budget: req.body.budget,
        technologyStack: req.body.technologyStack,
      };

      const project = await projectService.createProject(projectData);

      res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: project,
      });
    } catch (error: any) {
      console.error("Create project error:", error);

      if (
        error.message.includes("required") ||
        error.message.includes("Invalid status")
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create project",
      });
    }
  }

  /**
   * PUT /api/projects/:id
   * Update project
   */
  async updateProject(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.id);

      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        });
      }

      const updateData: any = {};

      if (req.body.projectName) updateData.projectName = req.body.projectName;
      if (req.body.clientName) updateData.clientName = req.body.clientName;
      if (req.body.startDate) updateData.startDate = new Date(req.body.startDate);
      if (req.body.endDate) updateData.endDate = new Date(req.body.endDate);
      if (req.body.status) updateData.status = req.body.status;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.phone !== undefined) updateData.phone = req.body.phone;
      if (req.body.email !== undefined) updateData.email = req.body.email;
      if (req.body.servicesType !== undefined) updateData.servicesType = req.body.servicesType;
      if (req.body.budget !== undefined) updateData.budget = req.body.budget;
      if (req.body.technologyStack !== undefined) updateData.technologyStack = req.body.technologyStack;

      const project = await projectService.updateProject(projectId, updateData);

      res.json({
        success: true,
        message: "Project updated successfully",
        data: project,
      });
    } catch (error: any) {
      console.error("Update project error:", error);

      if (error.message === "Project not found") {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      if (error.message.includes("Invalid status")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update project",
      });
    }
  }

  /**
   * DELETE /api/projects/:id
   * Soft delete project
   */
  async deleteProject(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.id);

      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        });
      }

      await projectService.deleteProject(projectId);

      res.json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error: any) {
      console.error("Delete project error:", error);

      if (error.message === "Project not found") {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete project",
      });
    }
  }
}

export const projectController = new ProjectController();
