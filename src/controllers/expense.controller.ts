/**
 * Unified Expense Controller
 * Handles HTTP requests for all expense types
 */

import { Request, Response } from "express";
import { expenseService } from "../services/expense.service.js";

export class ExpenseController {
  /**
   * Get all employee expenses
   * GET /api/expenses/employee
   */
  async getAllEmployeeExpenses(req: Request, res: Response) {
    try {
      const expenses = await expenseService.getAllEmployeeExpenses();
      res.status(200).json({ success: true, data: expenses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get all client expenses
   * GET /api/expenses/client
   */
  async getAllClientExpenses(req: Request, res: Response) {
    try {
      const expenses = await expenseService.getAllClientExpenses();
      res.status(200).json({ success: true, data: expenses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get all personal expenses
   * GET /api/expenses/personal
   */
  async getAllPersonalExpenses(req: Request, res: Response) {
    try {
      const expenses = await expenseService.getAllPersonalExpenses();
      res.status(200).json({ success: true, data: expenses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get employee expense by ID
   * GET /api/expenses/employee/:id
   */
  async getEmployeeExpenseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const expense = await expenseService.getExpenseById(
        parseInt(id),
        "employee"
      );
      res.status(200).json({ success: true, data: expense });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  /**
   * Get client expense by ID
   * GET /api/expenses/client/:id
   */
  async getClientExpenseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const expense = await expenseService.getExpenseById(
        parseInt(id),
        "client"
      );
      res.status(200).json({ success: true, data: expense });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  /**
   * Get personal expense by ID
   * GET /api/expenses/personal/:id
   */
  async getPersonalExpenseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const expense = await expenseService.getExpenseById(
        parseInt(id),
        "personal"
      );
      res.status(200).json({ success: true, data: expense });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  /**
   * Create employee expense
   * POST /api/expenses/employee
   */
  async createEmployeeExpense(req: Request, res: Response) {
    try {
      const expenseData = {
        userId: parseInt(req.body.userId),
        amount: parseFloat(req.body.amount),
        phone: req.body.phone,
        status: req.body.status,
        role: req.body.role,
        department: req.body.department
          ? parseInt(req.body.department)
          : undefined,
        paymentMode: req.body.paymentMode,
        basicSalary: req.body.basicSalary
          ? parseFloat(req.body.basicSalary)
          : undefined,
        hra: req.body.hra ? parseFloat(req.body.hra) : undefined,
        conveyance: req.body.conveyance
          ? parseFloat(req.body.conveyance)
          : undefined,
        specialAllowance: req.body.specialAllowance
          ? parseFloat(req.body.specialAllowance)
          : undefined,
        pfDeductions: req.body.pfDeductions
          ? parseFloat(req.body.pfDeductions)
          : undefined,
        taxDeductions: req.body.taxDeductions
          ? parseFloat(req.body.taxDeductions)
          : undefined,
        date: new Date(req.body.date),
        createdBy: (req as any).user.userId,
      };

      const expense = await expenseService.createEmployeeExpense(expenseData);
      res.status(201).json({ success: true, data: expense });
    } catch (error: any) {
      if (
        error.message.includes("required") ||
        error.message.includes("not found") ||
        error.message.includes("Invalid")
      ) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  /**
   * Create client expense
   * POST /api/expenses/client
   */
  async createClientExpense(req: Request, res: Response) {
    try {
      const expenseData = {
        clientName: req.body.clientName,
        projectName: req.body.projectName,
        amount: parseFloat(req.body.amount),
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status,
        paymentMode: req.body.paymentMode,
        date: new Date(req.body.date),
        createdBy: (req as any).user.userId,
      };

      const expense = await expenseService.createClientExpense(expenseData);
      res.status(201).json({ success: true, data: expense });
    } catch (error: any) {
      if (
        error.message.includes("required") ||
        error.message.includes("not found") ||
        error.message.includes("Invalid")
      ) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  /**
   * Create personal expense
   * POST /api/expenses/personal
   */
  async createPersonalExpense(req: Request, res: Response) {
    try {
      const expenseData = {
        expenseName: req.body.expenseName,
        amount: parseFloat(req.body.amount),
        status: req.body.status,
        category: req.body.category,
        paymentMode: req.body.paymentMode,
        date: new Date(req.body.date),
        createdBy: (req as any).user.userId,
      };

      const expense = await expenseService.createPersonalExpense(expenseData);
      res.status(201).json({ success: true, data: expense });
    } catch (error: any) {
      if (
        error.message.includes("required") ||
        error.message.includes("not found") ||
        error.message.includes("Invalid")
      ) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  /**
   * Update employee expense
   * PUT /api/expenses/employee/:id
   */
  async updateEmployeeExpense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: any = {};

      if (req.body.amount !== undefined)
        updateData.amount = parseFloat(req.body.amount);
      if (req.body.phone !== undefined) updateData.phone = req.body.phone;
      if (req.body.status) updateData.status = req.body.status;
      if (req.body.role !== undefined) updateData.role = req.body.role;
      if (req.body.department !== undefined)
        updateData.department = parseInt(req.body.department);
      if (req.body.paymentMode !== undefined)
        updateData.paymentMode = req.body.paymentMode;
      if (req.body.basicSalary !== undefined)
        updateData.basicSalary = parseFloat(req.body.basicSalary);
      if (req.body.hra !== undefined) updateData.hra = parseFloat(req.body.hra);
      if (req.body.conveyance !== undefined)
        updateData.conveyance = parseFloat(req.body.conveyance);
      if (req.body.specialAllowance !== undefined)
        updateData.specialAllowance = parseFloat(req.body.specialAllowance);
      if (req.body.pfDeductions !== undefined)
        updateData.pfDeductions = parseFloat(req.body.pfDeductions);
      if (req.body.taxDeductions !== undefined)
        updateData.taxDeductions = parseFloat(req.body.taxDeductions);
      if (req.body.date) updateData.date = new Date(req.body.date);

      const expense = await expenseService.updateEmployeeExpense(
        parseInt(id),
        updateData
      );
      res.status(200).json({ success: true, data: expense });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ success: false, message: error.message });
      } else if (error.message.includes("Invalid")) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  /**
   * Update client expense
   * PUT /api/expenses/client/:id
   */
  async updateClientExpense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: any = {};

      if (req.body.clientName) updateData.clientName = req.body.clientName;
      if (req.body.projectName !== undefined)
        updateData.projectName = req.body.projectName;
      if (req.body.amount !== undefined)
        updateData.amount = parseFloat(req.body.amount);
      if (req.body.email !== undefined) updateData.email = req.body.email;
      if (req.body.phone !== undefined) updateData.phone = req.body.phone;
      if (req.body.status) updateData.status = req.body.status;
      if (req.body.paymentMode !== undefined)
        updateData.paymentMode = req.body.paymentMode;
      if (req.body.date) updateData.date = new Date(req.body.date);

      const expense = await expenseService.updateClientExpense(
        parseInt(id),
        updateData
      );
      res.status(200).json({ success: true, data: expense });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ success: false, message: error.message });
      } else if (error.message.includes("Invalid")) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  /**
   * Update personal expense
   * PUT /api/expenses/personal/:id
   */
  async updatePersonalExpense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: any = {};

      if (req.body.expenseName) updateData.expenseName = req.body.expenseName;
      if (req.body.amount !== undefined)
        updateData.amount = parseFloat(req.body.amount);
      if (req.body.status) updateData.status = req.body.status;
      if (req.body.category !== undefined)
        updateData.category = req.body.category;
      if (req.body.paymentMode !== undefined)
        updateData.paymentMode = req.body.paymentMode;
      if (req.body.date) updateData.date = new Date(req.body.date);

      const expense = await expenseService.updatePersonalExpense(
        parseInt(id),
        updateData
      );
      res.status(200).json({ success: true, data: expense });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ success: false, message: error.message });
      } else if (error.message.includes("Invalid")) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  /**
   * Delete employee expense
   * DELETE /api/expenses/employee/:id
   */
  async deleteEmployeeExpense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await expenseService.deleteExpense(
        parseInt(id),
        "employee"
      );
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  /**
   * Delete client expense
   * DELETE /api/expenses/client/:id
   */
  async deleteClientExpense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await expenseService.deleteExpense(parseInt(id), "client");
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  /**
   * Delete personal expense
   * DELETE /api/expenses/personal/:id
   */
  async deletePersonalExpense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await expenseService.deleteExpense(
        parseInt(id),
        "personal"
      );
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }
}

export const expenseController = new ExpenseController();
