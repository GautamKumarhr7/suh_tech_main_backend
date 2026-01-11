/**
 * User Routes
 * Maps HTTP endpoints to controller methods
 */

import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import {
  authenticate,
  requireAdmin,
  requireOwnerOrAdmin,
} from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/users
 * Get all users - Admin only
 */
router.get("/", authenticate, requireAdmin, (req, res) =>
  userController.getAllUsers(req, res)
);

/**
 * POST /api/users
 * Create new user - Admin only
 */
router.post("/", authenticate, requireAdmin, (req, res) =>
  userController.createUser(req, res)
);

/**
 * GET /api/users/:id
 * Get user by ID - Owner or Admin
 */
router.get("/:id", authenticate, requireOwnerOrAdmin, (req, res) =>
  userController.getUserById(req, res)
);

/**
 * PUT /api/users/:id
 * Update user - Owner or Admin
 */
router.put("/:id", authenticate, requireOwnerOrAdmin, (req, res) =>
  userController.updateUser(req, res)
);

/**
 * DELETE /api/users/:id
 * Delete user - Admin only
 */
router.delete("/:id", authenticate, requireAdmin, (req, res) =>
  userController.deleteUser(req, res)
);

export default router;

router.get(
  "/",
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        `SELECT id, email, first_name, last_name, admin, emp_id, phone_number, 
              department_id, designation_id, active, joined_date, emp_type
       FROM users 
       WHERE is_deleted = false
       ORDER BY created_at DESC`
      );

      res.json({
        success: true,
        data: result.rows.map((user) => ({
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          admin: user.admin,
          empId: user.emp_id,
          phoneNumber: user.phone_number,
          departmentId: user.department_id,
          designationId: user.designation_id,
          active: user.active,
          joinedDate: user.joined_date,
          empType: user.emp_type,
        })),
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }
);

/**
 * POST /api/users
 * Create new user - Admin only
 */
router.post(
  "/",
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const {
        email,
        firstName,
        lastName,
        password,
        phoneNumber,
        address,
        admin = false,
        empId,
        departmentId,
        designationId,
        joinedDate,
        skills,
        active = true,
        empType = "full-time",
      } = req.body;

      // Validate required fields
      if (!email || !firstName || !lastName || !password) {
        return res.status(400).json({
          success: false,
          message: "Email, first name, last name, and password are required",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }

      // Validate empType if provided
      const validEmpTypes = ["full-time", "part-time", "contract", "intern"];
      if (empType && !validEmpTypes.includes(empType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee type. Must be: full-time, part-time, contract, or intern",
        });
      }

      // Check if email already exists
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email.toLowerCase().trim()]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Check if empId already exists (if provided)
      if (empId) {
        const existingEmpId = await pool.query(
          "SELECT id FROM users WHERE emp_id = $1",
          [empId]
        );

        if (existingEmpId.rows.length > 0) {
          return res.status(409).json({
            success: false,
            message: "Employee ID already exists",
          });
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const result = await pool.query(
        `INSERT INTO users (
          email, first_name, last_name, password, phone_number, address,
          admin, emp_id, department_id, designation_id, joined_date,
          skills, active, emp_type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id, email, first_name, last_name, admin, emp_id, phone_number,
                  department_id, designation_id, joined_date, active, emp_type`,
        [
          email.toLowerCase().trim(),
          firstName,
          lastName,
          hashedPassword,
          phoneNumber || null,
          address || null,
          admin,
          empId || null,
          departmentId || null,
          designationId || null,
          joinedDate || null,
          skills || null,
          active,
          empType,
        ]
      );

      const user = result.rows[0];

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          admin: user.admin,
          empId: user.emp_id,
          phoneNumber: user.phone_number,
          departmentId: user.department_id,
          designationId: user.designation_id,
          joinedDate: user.joined_date,
          active: user.active,
          empType: user.emp_type,
        },
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create user",
      });
    }
  }
);

/**
 * GET /api/users/:id
 * Get user by ID - Owner or Admin (Authorization with ownership check)
 */
router.get(
  "/:id",
  authenticate,
  requireOwnerOrAdmin,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);

      const result = await pool.query(
        `SELECT id, email, first_name, last_name, admin, emp_id, phone_number, 
              address, department_id, designation_id, active, joined_date, 
              emp_type, skills
       FROM users 
       WHERE id = $1 AND is_deleted = false`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const user = result.rows[0];

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          admin: user.admin,
          empId: user.emp_id,
          phoneNumber: user.phone_number,
          address: user.address,
          departmentId: user.department_id,
          designationId: user.designation_id,
          active: user.active,
          joinedDate: user.joined_date,
          empType: user.emp_type,
          skills: user.skills,
        },
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user",
      });
    }
  }
);

/**
 * PUT /api/users/:id
 * Update user - Owner or Admin (Authorization with ownership check)
 */
router.put(
  "/:id",
  authenticate,
  requireOwnerOrAdmin,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { firstName, lastName, phoneNumber, address, skills } = req.body;

      // Non-admin users can only update certain fields
      if (!req.user!.admin) {
        // Regular users can only update these fields
        const result = await pool.query(
          `UPDATE users 
         SET first_name = COALESCE($1, first_name),
             last_name = COALESCE($2, last_name),
             phone_number = COALESCE($3, phone_number),
             address = COALESCE($4, address),
             skills = COALESCE($5, skills),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 AND is_deleted = false
         RETURNING id, email, first_name, last_name, phone_number, address, skills`,
          [firstName, lastName, phoneNumber, address, skills, userId]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        return res.json({
          success: true,
          message: "Profile updated successfully",
          data: result.rows[0],
        });
      }

      // Admin can update additional fields
      const {
        admin,
        empId,
        departmentId,
        designationId,
        joinedDate,
        active,
        empType,
      } = req.body;

      const result = await pool.query(
        `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           phone_number = COALESCE($3, phone_number),
           address = COALESCE($4, address),
           skills = COALESCE($5, skills),
           admin = COALESCE($6, admin),
           emp_id = COALESCE($7, emp_id),
           department_id = COALESCE($8, department_id),
           designation_id = COALESCE($9, designation_id),
           joined_date = COALESCE($10, joined_date),
           active = COALESCE($11, active),
           emp_type = COALESCE($12, emp_type),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $13 AND is_deleted = false
       RETURNING id, email, first_name, last_name, admin, emp_id`,
        [
          firstName,
          lastName,
          phoneNumber,
          address,
          skills,
          admin,
          empId,
          departmentId,
          designationId,
          joinedDate,
          active,
          empType,
          userId,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update user",
      });
    }
  }
);

/**
 * DELETE /api/users/:id
 * Delete (soft delete) user - Admin only
 */
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);

      // Prevent admin from deleting themselves
      if (userId === req.user!.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own account",
        });
      }

      const result = await pool.query(
        `UPDATE users 
       SET is_deleted = true, active = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false
       RETURNING id, email`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete user",
      });
    }
  }
);

export default router;
