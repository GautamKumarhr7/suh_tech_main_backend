/**
 * User Service
 * Contains business logic for user operations
 */

import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository.js";

export class UserService {
  /**
   * Get all users
   */
  async getAllUsers() {
    const users = await userRepository.findAll();
    return users.map((user) => this.formatUserResponse(user));
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return this.formatUserResponse(user);
  }

  /**
   * Create new user
   */
  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    admin?: boolean;
    departmentId?: number;
    designationId?: number;
    joinedDate?: Date;
    skills?: string;
    active?: boolean;
    empType?: string;
  }) {
    // Validate required fields
    if (
      !userData.email ||
      !userData.firstName ||
      !userData.lastName
    ) {
      throw new Error(
        "Email, first name, and last name are required"
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error("Invalid email format");
    }
    const password=userData.firstName.toLowerCase()+"@123"

    // Validate empType if provided
    const validEmpTypes = ["full-time", "part-time", "contract", "intern"];
    if (userData.empType && !validEmpTypes.includes(userData.empType)) {
      throw new Error(
        "Invalid employee type. Must be: full-time, part-time, contract, or intern"
      );
    }
    const empId="EMP-"+Math.floor(1000 + Math.random() * 9000)

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.formatUserResponse(user);
  }

  /**
   * Update user
   */
  async updateUser(id: number, updateData: any, isAdmin: boolean) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    let updatedUser;

    if (isAdmin) {
      // Admin can update all fields
      updatedUser = await userRepository.updateAllFields(id, updateData);
    } else {
      // Regular users can only update basic fields
      const basicFields = {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        phoneNumber: updateData.phoneNumber,
        address: updateData.address,
        skills: updateData.skills,
      };
      updatedUser = await userRepository.updateBasicFields(id, basicFields);
    }

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return this.formatUserResponse(updatedUser);
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: number, requestingUserId: number) {
    // Prevent user from deleting themselves
    if (id === requestingUserId) {
      throw new Error("You cannot delete your own account");
    }

    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const deletedUser = await userRepository.softDelete(id);
    if (!deletedUser) {
      throw new Error("Failed to delete user");
    }

    return { success: true };
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ) {
    if (!currentPassword || !newPassword) {
      throw new Error("Current password and new password are required");
    }

    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await userRepository.updatePassword(userId, hashedPassword);

    return { success: true };
  }

  /**
   * Format user response (remove sensitive data)
   */
  private formatUserResponse(user: any) {
    const formatted: any = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      admin: user.admin,
      empId: user.emp_id,
      phoneNumber: user.phone_number,
      active: user.active,
      empType: user.emp_type,
    };

    // Include optional fields if they exist
    if (user.address !== undefined) formatted.address = user.address;
    if (user.department_id !== undefined)
      formatted.departmentId = user.department_id;
    if (user.designation_id !== undefined)
      formatted.designationId = user.designation_id;
    if (user.joined_date !== undefined) formatted.joinedDate = user.joined_date;
    if (user.skills !== undefined) formatted.skills = user.skills;
    if (user.created_at !== undefined) formatted.createdAt = user.created_at;
    if (user.updated_at !== undefined) formatted.updatedAt = user.updated_at;

    return formatted;
  }
}

export const userService = new UserService();
