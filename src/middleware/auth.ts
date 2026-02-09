/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db/dbConnection.js";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        address: string | null;
        admin: boolean;
        empId: string | null;
        phoneNumber: string | null;
        designationId: number | null;
        departmentId: number | null;
        joinedDate: string | null;
        skills: string | null;
        active: boolean;
        empType: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}

/**
 * Authentication Middleware
 * Concept: Verifies that the user has a valid JWT token
 * Extracts user information from token and attaches to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from Authorization header (Bearer token)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please provide a valid token.",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: number;
      email: string;
    };

    // Verify user still exists and is active - fetch all fields except password
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, address, admin, emp_id, 
              phone_number, designation_id, department_id, joined_date, 
              skills, active, emp_type, is_deleted, created_at, updated_at 
       FROM users WHERE id = $1`,
      [decoded.userId],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token is invalid.",
      });
    }

    const user = result.rows[0];

    if (user.is_deleted || !user.active) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive or has been deleted.",
      });
    }

    // Attach all user data (except password) to request object
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      address: user.address,
      admin: user.admin,
      empId: user.emp_id,
      phoneNumber: user.phone_number,
      designationId: user.designation_id,
      departmentId: user.department_id,
      joinedDate: user.joined_date,
      skills: user.skills,
      active: user.active,
      empType: user.emp_type,
      isDeleted: user.is_deleted,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed. Please try again.",
    });
  }
};

/**
 * Authorization Middleware - Admin Only
 * Concept: Checks if authenticated user has admin privileges
 * Must be used AFTER authenticate middleware
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (!req.user.admin) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

/**
 * Authorization Middleware - Own Resource or Admin
 * Concept: Allows users to access their own resources or admin to access any
 * Checks if userId in request params matches authenticated user or if user is admin
 */
export const requireOwnerOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const resourceUserId = parseInt(req.params.userId || req.params.id);

  // Allow if user is admin or accessing their own resource
  if (req.user.admin || req.user.id === resourceUserId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. You can only access your own resources.",
  });
};
