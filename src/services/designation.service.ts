/**
 * Designation Service
 * Contains business logic for designation operations
 */

import { designationRepository } from "../repositories/designation.repository.js";

export class DesignationService {
  /**
   * Get all designations
   */
  async getAllDesignations() {
    return await designationRepository.findAll();
  }

  /**
   * Get designation by ID
   */
  async getDesignationById(id: number) {
    const designation = await designationRepository.findById(id);
    if (!designation) {
      throw new Error("Designation not found");
    }
    return designation;
  }

  /**
   * Create new designation
   */
  async createDesignation(data: { title: string; description?: string }) {
    // Validate required fields
    if (!data.title || data.title.trim().length === 0) {
      throw new Error("Designation title is required");
    }

    // Check if designation already exists
    const existingDesignation = await designationRepository.findByTitle(
      data.title
    );
    if (existingDesignation) {
      throw new Error("Designation with this title already exists");
    }

    return await designationRepository.create(data);
  }

  /**
   * Update designation
   */
  async updateDesignation(
    id: number,
    data: { title?: string; description?: string }
  ) {
    // Check if designation exists
    const existingDesignation = await designationRepository.findById(id);
    if (!existingDesignation) {
      throw new Error("Designation not found");
    }

    // If updating title, check if new title already exists
    if (data.title) {
      const designationWithTitle = await designationRepository.findByTitle(
        data.title
      );
      if (designationWithTitle && designationWithTitle.id !== id) {
        throw new Error("Designation with this title already exists");
      }
    }

    const updated = await designationRepository.update(id, data);
    if (!updated) {
      throw new Error("Failed to update designation");
    }

    return updated;
  }

  /**
   * Delete designation
   */
  async deleteDesignation(id: number) {
    // Check if designation exists
    const existingDesignation = await designationRepository.findById(id);
    if (!existingDesignation) {
      throw new Error("Designation not found");
    }

    // Check if designation is in use
    const isInUse = await designationRepository.isInUse(id);
    if (isInUse) {
      throw new Error(
        "Cannot delete designation as it is assigned to one or more users"
      );
    }

    const deleted = await designationRepository.delete(id);
    if (!deleted) {
      throw new Error("Failed to delete designation");
    }

    return { message: "Designation deleted successfully" };
  }
}

export const designationService = new DesignationService();
