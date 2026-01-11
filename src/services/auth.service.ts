/**
 * Auth Service
 * Contains business logic for authentication
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";

export class AuthService {
  /**
   * Login user
   */
  async login(email: string, password: string) {
    // Validate input
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Find user by email
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if account is active
    if (user.is_deleted || !user.active) {
      throw new Error(
        "Account is inactive or has been deleted. Please contact administrator."
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      jwtSecret,
      {
        expiresIn: "7d", // Token expires in 7 days
      }
    );

    // Return user info and token
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        admin: user.admin,
        empId: user.emp_id,
      },
    };
  }

  /**
   * Get current user info
   */
  async getCurrentUser(userId: number) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      admin: user.admin,
      empId: user.emp_id,
      phoneNumber: user.phone_number,
      address: user.address,
      designationId: user.designation_id,
      departmentId: user.department_id,
      joinedDate: user.joined_date,
      active: user.active,
    };
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

    // Get user with password
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
}

export const authService = new AuthService();
