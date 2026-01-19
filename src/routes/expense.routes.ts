/**
 * Unified Expense Routes
 * Defines all API endpoints for expense management
 */

import { Router } from "express";
import { expenseController } from "../controllers/expense.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

/**
 * Employee Expense Routes
 */
// Get all employee expenses with filters
router.get("/employee", authenticate, (req, res) =>
  expenseController.getAllEmployeeExpenses(req, res)
);

// Get employee expense by ID
router.get("/employee/:id", authenticate, (req, res) =>
  expenseController.getEmployeeExpenseById(req, res)
);

// Create new employee expense
router.post("/employee", authenticate, (req, res) =>
  expenseController.createEmployeeExpense(req, res)
);

// Update employee expense
router.put("/employee/:id", authenticate, (req, res) =>
  expenseController.updateEmployeeExpense(req, res)
);

// Delete employee expense (soft delete)
router.delete("/employee/:id", authenticate, (req, res) =>
  expenseController.deleteEmployeeExpense(req, res)
);

/**
 * Client Expense Routes
 */
// Get all client expenses with filters
router.get("/client", authenticate, (req, res) =>
  expenseController.getAllClientExpenses(req, res)
);

// Get client expense by ID
router.get("/client/:id", authenticate, (req, res) =>
  expenseController.getClientExpenseById(req, res)
);

// Create new client expense
router.post("/client", authenticate, (req, res) =>
  expenseController.createClientExpense(req, res)
);

// Update client expense
router.put("/client/:id", authenticate, (req, res) =>
  expenseController.updateClientExpense(req, res)
);

// Delete client expense (soft delete)
router.delete("/client/:id", authenticate, (req, res) =>
  expenseController.deleteClientExpense(req, res)
);

/**
 * Personal Expense Routes
 */
// Get all personal expenses
router.get("/personal", authenticate, (req, res) =>
  expenseController.getAllPersonalExpenses(req, res)
);

// Get personal expense by ID
router.get("/personal/:id", authenticate, (req, res) =>
  expenseController.getPersonalExpenseById(req, res)
);

// Create new personal expense
router.post("/personal", authenticate, (req, res) =>
  expenseController.createPersonalExpense(req, res)
);

// Update personal expense
router.put("/personal/:id", authenticate, (req, res) =>
  expenseController.updatePersonalExpense(req, res)
);

// Delete personal expense (soft delete)
router.delete("/personal/:id", authenticate, (req, res) =>
  expenseController.deletePersonalExpense(req, res)
);

export default router;
