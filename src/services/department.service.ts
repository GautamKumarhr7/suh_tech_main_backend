/**
 * Department Service
 * Contains business logic for department operations
 */

import { departmentRepository } from "../repositories/department.repository.js";

export class DepartmentService {
  /**
   * Get all departments
   */
  async getAllDepartments() {
    return await departmentRepository.findAll();
  }

  /**
   * Get department by ID
   */
  async getDepartmentById(id: number) {
    const department = await departmentRepository.findById(id);
    if (!department) {
      throw new Error("Department not found");
    }
    return department;
  }

  /**
   * Create new department
   */
  async createDepartment(data: { name: string; description?: string }) {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Department name is required");
    }

    // Check if department already exists
    const existingDepartment = await departmentRepository.findByName(data.name);
    if (existingDepartment) {
      throw new Error("Department with this name already exists");
    }

    return await departmentRepository.create(data);
  }

  /**
   * Update department
   */
  async updateDepartment(
    id: number,
    data: { name?: string; description?: string }
  ) {
    // Check if department exists
    const existingDepartment = await departmentRepository.findById(id);
    if (!existingDepartment) {
      throw new Error("Department not found");
    }

    // If updating name, check if new name already exists
    if (data.name) {
      const departmentWithName = await departmentRepository.findByName(
        data.name
      );
      if (departmentWithName && departmentWithName.id !== id) {
        throw new Error("Department with this name already exists");
      }
    }

    const updated = await departmentRepository.update(id, data);
    if (!updated) {
      throw new Error("Failed to update department");
    }

    return updated;
  }

  /**
   * Delete department
   */
  async deleteDepartment(id: number) {
    // Check if department exists
    const existingDepartment = await departmentRepository.findById(id);
    if (!existingDepartment) {
      throw new Error("Department not found");
    }

    // Check if department is in use
    const isInUse = await departmentRepository.isInUse(id);
    if (isInUse) {
      throw new Error(
        "Cannot delete department as it is assigned to one or more users"
      );
    }

    const deleted = await departmentRepository.delete(id);
    if (!deleted) {
      throw new Error("Failed to delete department");
    }

    return { message: "Department deleted successfully" };
  }
}

export const departmentService = new DepartmentService();
