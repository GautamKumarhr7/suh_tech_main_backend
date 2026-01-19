/**
 * Auth Controller
 * Handles HTTP requests and responses for authentication
 */

import { Request, Response } from "express";
import { authService } from "../services/auth.service.js";

export class AuthController {
  /**
   * POST /api/auth/login
   * Login user
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      console.error("Login error:", error);

      if (
        error.message.includes("Invalid") ||
        error.message.includes("required")
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message.includes("inactive") ||
        error.message.includes("deleted")
      ) {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message === "Invalid email or password") {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Login failed. Please try again.",
      });
    }
  }

  /**
   * GET /api/auth/me
   * Get current authenticated user info
   */
  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      const user = await authService.getCurrentUser(req.user.id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      console.error("Get current user error:", error);

      if (error.message === "User not found") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch user information",
      });
    }
  }

  /**
   * POST /api/auth/change-password
   * Change user password
   */
  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(
        req.user!.id,
        currentPassword,
        newPassword
      );

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error: any) {
      console.error("Change password error:", error);

      if (
        error.message.includes("required") ||
        error.message.includes("must be") ||
        error.message.includes("incorrect")
      ) {
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
        message: "Failed to change password. Please try again.",
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Logout user
   */
  async logout(req: Request, res: Response) {
    try {
      // Since we're using JWT, logout is handled client-side by removing the token
      // This endpoint can be used for logging, session cleanup, or token blacklisting if needed
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Logout failed. Please try again.",
      });
    }
  }
}

export const authController = new AuthController();
