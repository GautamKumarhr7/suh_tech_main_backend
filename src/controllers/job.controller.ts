/**
 * Job Controller
 * Handles HTTP requests and responses for job operations
 */

import { Request, Response } from "express";
import { jobService } from "../services/job.service.js";

export class JobController {
  /**
   * GET /jobs
   * Get all jobs
   */
  async getAllJobs(req: Request, res: Response) {
    try {
      const filters: { active?: boolean } = {};

      if (req.query.active !== undefined) {
        filters.active = String(req.query.active) === "true";
      }

      const jobs = await jobService.getAllJobs(filters);

      res.json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch jobs",
      });
    }
  }

  /**
   * GET /jobs/:id
   * Get job by ID
   */
  async getJobById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID",
        });
      }

      const job = await jobService.getJobById(id);

      res.json({
        success: true,
        data: job,
      });
    } catch (error: any) {
      console.error("Get job error:", error);

      if (error.message === "Job not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch job",
      });
    }
  }

  /**
   * POST /jobs
   * Create new job
   */
  async createJob(req: Request, res: Response) {
    try {
      const payload = {
        title: req.body.title,
        type: req.body.type,
        location: req.body.location,
        description: req.body.description,
        responsibilities: req.body.responsibilities,
        requirements: req.body.requirements,
        active: req.body.active,
      };

      const job = await jobService.createJob(payload);

      res.status(201).json({
        success: true,
        data: job,
        message: "Job created successfully",
      });
    } catch (error: any) {
      console.error("Create job error:", error);

      if (error.message === "Title, type, and location are required") {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create job",
      });
    }
  }

  /**
   * PUT /jobs/:id
   * Update job
   */
  async updateJob(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID",
        });
      }

      const payload = {
        title: req.body.title,
        type: req.body.type,
        location: req.body.location,
        description: req.body.description,
        responsibilities: req.body.responsibilities,
        requirements: req.body.requirements,
        active: req.body.active,
      };

      const job = await jobService.updateJob(id, payload);

      res.json({
        success: true,
        data: job,
        message: "Job updated successfully",
      });
    } catch (error: any) {
      console.error("Update job error:", error);

      if (error.message === "Job not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update job",
      });
    }
  }

  /**
   * DELETE /jobs/:id
   * Delete job
   */
  async deleteJob(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID",
        });
      }

      const result = await jobService.deleteJob(id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Delete job error:", error);

      if (error.message === "Job not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete job",
      });
    }
  }
}

export const jobController = new JobController();
