/**
 * Project Service
 * Contains business logic for project operations
 */

import { projectRepository } from "../repositories/project.repository.js";

export class ProjectService {
  /**
   * Get all projects with optional filters
   */
  async getAllProjects(filters?: {
    status?: string;
    clientName?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const projects = await projectRepository.findAll(filters);
    return projects.map((project) => this.formatProjectResponse(project));
  }

  /**
   * Get project by ID
   */
  async getProjectById(id: number) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new Error("Project not found");
    }
    return this.formatProjectResponse(project);
  }

  /**
   * Create new project
   */
  async createProject(projectData: {
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
    // Validate required fields
    if (
      !projectData.projectName ||
      !projectData.clientName ||
      !projectData.startDate
    ) {
      throw new Error("Project name, client name, and start date are required");
    }

    // Validate status
    const validStatuses = [
      "pending",
      "in progress",
      "completed",
      "on hold",
      "cancelled",
    ];
    if (projectData.status && !validStatuses.includes(projectData.status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    const project = await projectRepository.create(projectData);
    return this.formatProjectResponse(project);
  }

  /**
   * Update project
   */
  async updateProject(
    id: number,
    updateData: {
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
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new Error("Project not found");
    }

    // Validate status if provided
    if (updateData.status) {
      const validStatuses = [
        "pending",
        "in progress",
        "completed",
        "on hold",
        "cancelled",
      ];
      if (!validStatuses.includes(updateData.status)) {
        throw new Error(
          `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        );
      }
    }

    const updatedProject = await projectRepository.update(id, updateData);
    if (!updatedProject) {
      throw new Error("Failed to update project");
    }

    return this.formatProjectResponse(updatedProject);
  }

  /**
   * Soft delete project
   */
  async deleteProject(id: number) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new Error("Project not found");
    }

    const deletedProject = await projectRepository.softDelete(id);
    if (!deletedProject) {
      throw new Error("Failed to delete project");
    }

    return { success: true, message: "Project deleted successfully" };
  }

  /**
   * Format project response
   */
  private formatProjectResponse(project: any) {
    return {
      id: project.id,
      projectName: project.project_name,
      clientName: project.client_name,
      startDate: project.start_date,
      endDate: project.end_date,
      status: project.status,
      description: project.description,
      phone: project.phone,
      email: project.email,
      servicesType: project.services_type,
      budget: project.budget ? parseFloat(project.budget) : null,
      technologyStack: project.technology_stack,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    };
  }
}

export const projectService = new ProjectService();
