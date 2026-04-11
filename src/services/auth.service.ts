/**
 * Auth Service
 * Contains business logic for authentication
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/dbConnection.js";
import { userRepository } from "../repositories/user.repository.js";
import { organizationRepository } from "../repositories/organization.repository.js";

export class AuthService {
  /**
   * Login user
   */
  async login(email: string, password: string) {
    // Validate input
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Find user or organization by email
    let account = await userRepository.findByEmail(email);
    let isOrganization = false;

    if (!account) {
      account = await organizationRepository.findByEmail(email);
      isOrganization = true;
    }

    if (!account) {
      throw new Error("Invalid email or password");
    }

    // Check if account is active/active login status
    if (isOrganization) {
      if (!account.login_status) {
        throw new Error(
          "Organization login is disabled. Please contact administrator.",
        );
      }
    } else {
      if (account.is_deleted || !account.active) {
        throw new Error(
          "Account is inactive or has been deleted. Please contact administrator.",
        );
      }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, account.password);

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
        userId: account.id,
        email: account.email,
        isOrganization,
      },
      jwtSecret,
      {
        expiresIn: "7d", // Token expires in 7 days
      },
    );

    // Return account info and token
    if (isOrganization) {
      return {
        token,
        user: {
          id: account.id,
          email: account.email,
          firstName: account.name,
          lastName: "",
          isOrganization: true,
        },
      };
    }

    return {
      token,
      user: {
        id: account.id,
        email: account.email,
        firstName: account.first_name,
        lastName: account.last_name,
        admin: account.admin,
        empId: account.emp_id,
        isOrganization: false,
      },
    };
  }

  /**
   * Get current account info
   */
  async getCurrentUser(id: number, isOrganization: boolean = false) {
    if (isOrganization) {
      const org = await organizationRepository.findById(id);
      if (!org) {
        throw new Error("Organization not found");
      }
      return {
        id: org.id,
        email: org.email,
        firstName: org.name,
        lastName: "",
        active: org.login_status,
        isOrganization: true,
      };
    }

    const user = await userRepository.findById(id);

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
      isOrganization: false,
    };
  }

  /**
   * Change account password
   */
  async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
    isOrganization: boolean = false,
  ) {
    if (!currentPassword || !newPassword) {
      throw new Error("Current password and new password are required");
    }

    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }

    // Get account with password
    let account;
    if (isOrganization) {
      account = await organizationRepository.findById(id);
    } else {
      account = await userRepository.findById(id);
    }

    if (!account) {
      throw new Error("Account not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      account.password,
    );

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    if (isOrganization) {
      await pool.query(
        "UPDATE organizations SET password = $1 WHERE id = $2",
        [hashedPassword, id],
      );
    } else {
      await userRepository.updatePassword(id, hashedPassword);
    }

    return { success: true };
  }

  /**
   * Reset password (authenticated user)
   */
  async resetPassword(
    id: number,
    currentPassword: string,
    newPassword: string,
    isOrganization: boolean = false,
  ) {
    return this.changePassword(
      id,
      currentPassword,
      newPassword,
      isOrganization,
    );
  }
}

export const authService = new AuthService();
