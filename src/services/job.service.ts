/**
 * Job Service
 * Contains business logic for job operations
 */

import { jobRepository } from "../repositories/job.repository.js";

export class JobService {
  /**
   * Get all jobs
   */
  async getAllJobs(filters?: { active?: boolean }) {
    const jobs = await jobRepository.findAll(filters);
    return jobs.map((job) => this.formatJobResponse(job));
  }

  /**
   * Get job by ID
   */
  async getJobById(id: number) {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new Error("Job not found");
    }

    return this.formatJobResponse(job);
  }

  /**
   * Create new job
   */
  async createJob(data: {
    title: string;
    type: string;
    location: string;
    description?: string;
    responsibilities?: string | string[];
    requirements?: string | string[];
    active?: boolean;
  }) {
    if (!data.title || !data.type || !data.location) {
      throw new Error("Title, type, and location are required");
    }

    const created = await jobRepository.create({
      title: data.title.trim(),
      type: data.type.trim(),
      location: data.location.trim(),
      description: data.description?.trim(),
      responsibilities: this.toMultilineText(data.responsibilities),
      requirements: this.toMultilineText(data.requirements),
      active: data.active ?? true,
    });

    return this.formatJobResponse(created);
  }

  /**
   * Update job
   */
  async updateJob(
    id: number,
    data: {
      title?: string;
      type?: string;
      location?: string;
      description?: string;
      responsibilities?: string | string[];
      requirements?: string | string[];
      active?: boolean;
    },
  ) {
    const existing = await jobRepository.findById(id);
    if (!existing) {
      throw new Error("Job not found");
    }

    const updated = await jobRepository.update(id, {
      title: data.title?.trim(),
      type: data.type?.trim(),
      location: data.location?.trim(),
      description: data.description?.trim(),
      responsibilities:
        data.responsibilities !== undefined
          ? this.toMultilineText(data.responsibilities)
          : undefined,
      requirements:
        data.requirements !== undefined
          ? this.toMultilineText(data.requirements)
          : undefined,
      active: data.active,
    });

    if (!updated) {
      throw new Error("Failed to update job");
    }

    return this.formatJobResponse(updated);
  }

  /**
   * Delete job
   */
  async deleteJob(id: number) {
    const existing = await jobRepository.findById(id);
    if (!existing) {
      throw new Error("Job not found");
    }

    const deleted = await jobRepository.delete(id);
    if (!deleted) {
      throw new Error("Failed to delete job");
    }

    return { message: "Job deleted successfully" };
  }

  private toMultilineText(value?: string | string[]) {
    if (!value) return undefined;

    const lines = Array.isArray(value)
      ? value
      : value
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

    return lines.join("\n");
  }

  private toLineArray(value?: string | null) {
    if (!value) return [];

    return value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  /**
   * Format job response
   */
  private formatJobResponse(job: any) {
    return {
      id: job.id,
      title: job.title,
      type: job.type,
      location: job.location,
      description: job.description,
      responsibilities: this.toLineArray(job.responsibilities),
      requirements: this.toLineArray(job.requirements),
      active: job.active,
      createdAt: job.created_at,
      updatedAt: job.updated_at,
    };
  }
}

export const jobService = new JobService();
