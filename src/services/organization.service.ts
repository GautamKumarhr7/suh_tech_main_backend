/**
 * Organization Service
 * Contains business logic for organization operations
 */

import { organizationRepository } from "../repositories/organization.repository.js";
import { userRepository } from "../repositories/user.repository.js";

export class OrganizationService {
  /**
   * Get all organizations with optional filters
   */
  async getAllOrganizations(filters?: {
    status?: string;
    purchasePlain?: string;
  }) {
    const organizations = await organizationRepository.findAll(filters);
    return organizations.map((org) => this.formatOrganizationResponse(org));
  }

  /**
   * Get organization by ID
   */
  async getOrganizationById(id: number) {
    const organization = await organizationRepository.findById(id);
    if (!organization) {
      throw new Error("Organization not found");
    }
    return this.formatOrganizationResponse(organization);
  }

  /**
   * Create new organization
   */
  async createOrganization(orgData: {
    name: string;
    address?: string;
    email: string;
    phone?: string;
    purchasePlain: string;
    modules?: string;
    status: string;
    loginStatus: boolean;
    createdBy: number;
  }) {
    // Validate required fields
    if (!orgData.name || !orgData.email || !orgData.createdBy) {
      throw new Error("Name, email, and creator are required");
    }

    // Check if organization with email already exists
    const existing = await organizationRepository.findByEmail(orgData.email);
    if (existing) {
      throw new Error("Organization with this email already exists");
    }

    // Verify creator exists
    const creator = await userRepository.findById(orgData.createdBy);
    if (!creator) {
      throw new Error("Creator user not found");
    }

    // Validate purchase plan
    const validPlans = ["basic", "standard", "premium", "enterprise"];
    if (orgData.purchasePlain && !validPlans.includes(orgData.purchasePlain)) {
      throw new Error(
        `Invalid purchase plan. Must be one of: ${validPlans.join(", ")}`
      );
    }

    const organization = await organizationRepository.create(orgData);
    return this.formatOrganizationResponse(organization);
  }

  /**
   * Update organization
   */
  async updateOrganization(
    id: number,
    updateData: {
      name?: string;
      address?: string;
      email?: string;
      phone?: string;
      purchasePlain?: string;
      modules?: string;
      status?: string;
      loginStatus?: boolean;
    }
  ) {
    const organization = await organizationRepository.findById(id);
    if (!organization) {
      throw new Error("Organization not found");
    }

    // If email is being updated, check for conflicts
    if (updateData.email && updateData.email !== organization.email) {
      const existing = await organizationRepository.findByEmail(
        updateData.email
      );
      if (existing) {
        throw new Error("Organization with this email already exists");
      }
    }

    // Validate purchase plan if provided
    if (updateData.purchasePlain) {
      const validPlans = ["basic", "standard", "premium", "enterprise"];
      if (!validPlans.includes(updateData.purchasePlain)) {
        throw new Error(
          `Invalid purchase plan. Must be one of: ${validPlans.join(", ")}`
        );
      }
    }

    const updatedOrganization = await organizationRepository.update(
      id,
      updateData
    );
    if (!updatedOrganization) {
      throw new Error("Failed to update organization");
    }

    return this.formatOrganizationResponse(updatedOrganization);
  }

  /**
   * Soft delete organization
   */
  async deleteOrganization(id: number) {
    const organization = await organizationRepository.findById(id);
    if (!organization) {
      throw new Error("Organization not found");
    }

    const deletedOrganization = await organizationRepository.softDelete(id);
    if (!deletedOrganization) {
      throw new Error("Failed to delete organization");
    }

    return { success: true, message: "Organization deleted successfully" };
  }

  /**
   * Format organization response
   */
  private formatOrganizationResponse(org: any) {
    return {
      id: org.id,
      name: org.name,
      address: org.address,
      email: org.email,
      phone: org.phone,
      purchasePlain: org.purchase_plain,
      modules: org.modules,
      status: org.status,
      loginStatus: org.login_status,
      createdBy: org.created_by,
      createdAt: org.created_at,
      updatedAt: org.updated_at,
    };
  }
}

export const organizationService = new OrganizationService();
