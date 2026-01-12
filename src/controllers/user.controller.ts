/**
 * User Controller
 * Handles HTTP requests and responses for user operations
 */

import { Request, Response } from "express";
import { userService } from "../services/user.service.js";

export class UserController {
  /**
   * GET /api/users
   * Get all users
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }

  /**
   * POST /api/users
   * Create new user
   */
  async createUser(req: Request, res: Response) {
    try {
      const userData = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        admin: req.body.admin,
        departmentId: req.body.departmentId,
        designationId: req.body.designationId,
        joinedDate: req.body.joinedDate,
        skills: req.body.skills,
        active: req.body.active,
        empType: req.body.empType,
      };

      const user = await userService.createUser(userData);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error: any) {
      console.error("Create user error:", error);

      if (error.message.includes("already exists")) {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message.includes("required") ||
        error.message.includes("Invalid") ||
        error.message.includes("must be")
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create user",
      });
    }
  }

  /**
   * GET /api/users/:id
   * Get user by ID
   */
  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const user = await userService.getUserById(userId);

      res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      console.error("Get user error:", error);

      if (error.message === "User not found") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch user",
      });
    }
  }

  /**
   * PUT /api/users/:id
   * Update user
   */
  async updateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        skills: req.body.skills,
        admin: req.body.admin,
        empId: req.body.empId,
        departmentId: req.body.departmentId,
        designationId: req.body.designationId,
        joinedDate: req.body.joinedDate,
        active: req.body.active,
        empType: req.body.empType,
      };

      const isAdmin = req.user!.admin;
      const user = await userService.updateUser(userId, updateData, isAdmin);

      res.json({
        success: true,
        message: isAdmin
          ? "User updated successfully"
          : "Profile updated successfully",
        data: user,
      });
    } catch (error: any) {
      console.error("Update user error:", error);

      if (error.message === "User not found") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update user",
      });
    }
  }

  /**
   * DELETE /api/users/:id
   * Delete user (soft delete)
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      await userService.deleteUser(userId, req.user!.id);

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      console.error("Delete user error:", error);

      if (error.message === "You cannot delete your own account") {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message === "User not found") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete user",
      });
    }
  }
}

export const userController = new UserController();
