/**
 * Unified Expense Service
 * Contains business logic for all expense types
 */

import {
  expenseRepository,
  ExpenseType,
} from "../repositories/expense.repository.js";
import { userRepository } from "../repositories/user.repository.js";

export class ExpenseService {
  /**
   * Get all employee expenses
   */
  async getAllEmployeeExpenses() {
    const expenses = await expenseRepository.findEmployeeExpenses();
    return expenses.map((expense) =>
      this.formatEmployeeExpenseResponse(expense)
    );
  }

  /**
   * Get all client expenses
   */
  async getAllClientExpenses() {
    const expenses = await expenseRepository.findClientExpenses();
    return expenses.map((expense) => this.formatClientExpenseResponse(expense));
  }

  /**
   * Get all personal expenses
   */
  async getAllPersonalExpenses() {
    const expenses = await expenseRepository.findPersonalExpenses();
    return expenses.map((expense) =>
      this.formatPersonalExpenseResponse(expense)
    );
  }

  /**
   * Get expense by ID and type
   */
  async getExpenseById(id: number, type: ExpenseType) {
    const expense = await expenseRepository.findById(id, type);
    if (!expense) {
      throw new Error(`${this.capitalize(type)} expense not found`);
    }

    if (type === "employee") {
      return this.formatEmployeeExpenseResponse(expense);
    } else if (type === "client") {
      return this.formatClientExpenseResponse(expense);
    } else {
      return this.formatPersonalExpenseResponse(expense);
    }
  }

  /**
   * Create employee expense
   */
  async createEmployeeExpense(expenseData: {
    userId: number;
    amount: number;
    phone?: string;
    status: string;
    role?: string;
    department?: number;
    paymentMode?: string;
    basicSalary?: number;
    hra?: number;
    conveyance?: number;
    specialAllowance?: number;
    pfDeductions?: number;
    taxDeductions?: number;
    date: Date;
  }) {
    // Validate required fields
    if (
      !expenseData.userId ||
      !expenseData.amount ||
      !expenseData.date
    ) {
      throw new Error("User ID, amount, and date are required");
    }

    // Verify user exists
    const user = await userRepository.findById(expenseData.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate status
    this.validateStatus(expenseData.status);

    const expense = await expenseRepository.createEmployeeExpense({
      userId: expenseData.userId,
      amount: expenseData.amount.toString(),
      phone: expenseData.phone,
      status: expenseData.status,
      role: expenseData.role,
      department: expenseData.department,
      paymentMode: expenseData.paymentMode,
      basicSalary: expenseData.basicSalary?.toString(),
      hra: expenseData.hra?.toString(),
      conveyance: expenseData.conveyance?.toString(),
      specialAllowance: expenseData.specialAllowance?.toString(),
      pfDeductions: expenseData.pfDeductions?.toString(),
      taxDeductions: expenseData.taxDeductions?.toString(),
      date: expenseData.date.toISOString().split("T")[0],
      createdBy: expenseData.userId,
    });

    return this.formatEmployeeExpenseResponse(expense);
  }

  /**
   * Create client expense
   */
  async createClientExpense(expenseData: {
    clientName: string;
    projectName?: string;
    amount: number;
    email?: string;
    phone?: string;
    status: string;
    paymentMode?: string;
    date: Date;
    createdBy: number;
  }) {
    // Validate required fields
    if (
      !expenseData.clientName ||
      !expenseData.amount ||
      !expenseData.date ||
      !expenseData.createdBy
    ) {
      throw new Error("Client name, amount, date, and creator are required");
    }

    // Verify creator exists
    const creator = await userRepository.findById(expenseData.createdBy);
    if (!creator) {
      throw new Error("Creator user not found");
    }

    // Validate status
    this.validateStatus(expenseData.status);

    const expense = await expenseRepository.createClientExpense({
      clientName: expenseData.clientName,
      projectName: expenseData.projectName,
      amount: expenseData.amount.toString(),
      email: expenseData.email,
      phone: expenseData.phone,
      status: expenseData.status,
      paymentMode: expenseData.paymentMode,
      date: expenseData.date.toISOString().split("T")[0],
      createdBy: expenseData.createdBy,
    });

    return this.formatClientExpenseResponse(expense);
  }

  /**
   * Create personal expense
   */
  async createPersonalExpense(expenseData: {
    expenseName: string;
    amount: number;
    status: string;
    category?: string;
    paymentMode?: string;
    date: Date;
    createdBy: number;
  }) {
    // Validate required fields
    if (
      !expenseData.expenseName ||
      !expenseData.amount ||
      !expenseData.date ||
      !expenseData.createdBy
    ) {
      throw new Error("Expense name, amount, date, and creator are required");
    }

    // Verify creator exists
    const creator = await userRepository.findById(expenseData.createdBy);
    if (!creator) {
      throw new Error("Creator user not found");
    }

    // Validate status
    this.validateStatus(expenseData.status);

    const expense = await expenseRepository.createPersonalExpense({
      expenseName: expenseData.expenseName,
      amount: expenseData.amount.toString(),
      status: expenseData.status,
      category: expenseData.category,
      paymentMode: expenseData.paymentMode,
      date: expenseData.date.toISOString().split("T")[0],
      createdBy: expenseData.createdBy,
    });

    return this.formatPersonalExpenseResponse(expense);
  }

  /**
   * Update employee expense
   */
  async updateEmployeeExpense(
    id: number,
    updateData: {
      amount?: number;
      phone?: string;
      status?: string;
      role?: string;
      department?: number;
      paymentMode?: string;
      basicSalary?: number;
      hra?: number;
      conveyance?: number;
      specialAllowance?: number;
      pfDeductions?: number;
      taxDeductions?: number;
      date?: Date;
    }
  ) {
    const expense = await expenseRepository.findById(id, "employee");
    if (!expense) {
      throw new Error("Employee expense not found");
    }

    if (updateData.status) {
      this.validateStatus(updateData.status);
    }

    const data: any = {};
    if (updateData.amount !== undefined)
      data.amount = updateData.amount.toString();
    if (updateData.phone !== undefined) data.phone = updateData.phone;
    if (updateData.status) data.status = updateData.status;
    if (updateData.role !== undefined) data.role = updateData.role;
    if (updateData.department !== undefined)
      data.department = updateData.department;
    if (updateData.paymentMode !== undefined)
      data.paymentMode = updateData.paymentMode;
    if (updateData.basicSalary !== undefined)
      data.basicSalary = updateData.basicSalary.toString();
    if (updateData.hra !== undefined) data.hra = updateData.hra.toString();
    if (updateData.conveyance !== undefined)
      data.conveyance = updateData.conveyance.toString();
    if (updateData.specialAllowance !== undefined)
      data.specialAllowance = updateData.specialAllowance.toString();
    if (updateData.pfDeductions !== undefined)
      data.pfDeductions = updateData.pfDeductions.toString();
    if (updateData.taxDeductions !== undefined)
      data.taxDeductions = updateData.taxDeductions.toString();
    if (updateData.date)
      data.date = updateData.date.toISOString().split("T")[0];

    const updatedExpense = await expenseRepository.updateEmployeeExpense(
      id,
      data
    );
    if (!updatedExpense) {
      throw new Error("Failed to update employee expense");
    }

    return this.formatEmployeeExpenseResponse(updatedExpense);
  }

  /**
   * Update client expense
   */
  async updateClientExpense(
    id: number,
    updateData: {
      clientName?: string;
      projectName?: string;
      amount?: number;
      email?: string;
      phone?: string;
      status?: string;
      paymentMode?: string;
      date?: Date;
    }
  ) {
    const expense = await expenseRepository.findById(id, "client");
    if (!expense) {
      throw new Error("Client expense not found");
    }

    if (updateData.status) {
      this.validateStatus(updateData.status);
    }

    const data: any = {};
    if (updateData.clientName) data.clientName = updateData.clientName;
    if (updateData.projectName !== undefined)
      data.projectName = updateData.projectName;
    if (updateData.amount !== undefined)
      data.amount = updateData.amount.toString();
    if (updateData.email !== undefined) data.email = updateData.email;
    if (updateData.phone !== undefined) data.phone = updateData.phone;
    if (updateData.status) data.status = updateData.status;
    if (updateData.paymentMode !== undefined)
      data.paymentMode = updateData.paymentMode;
    if (updateData.date)
      data.date = updateData.date.toISOString().split("T")[0];

    const updatedExpense = await expenseRepository.updateClientExpense(
      id,
      data
    );
    if (!updatedExpense) {
      throw new Error("Failed to update client expense");
    }

    return this.formatClientExpenseResponse(updatedExpense);
  }

  /**
   * Update personal expense
   */
  async updatePersonalExpense(
    id: number,
    updateData: {
      expenseName?: string;
      amount?: number;
      status?: string;
      category?: string;
      paymentMode?: string;
      date?: Date;
    }
  ) {
    const expense = await expenseRepository.findById(id, "personal");
    if (!expense) {
      throw new Error("Personal expense not found");
    }

    if (updateData.status) {
      this.validateStatus(updateData.status);
    }

    const data: any = {};
    if (updateData.expenseName) data.expenseName = updateData.expenseName;
    if (updateData.amount !== undefined)
      data.amount = updateData.amount.toString();
    if (updateData.status) data.status = updateData.status;
    if (updateData.category !== undefined) data.category = updateData.category;
    if (updateData.paymentMode !== undefined)
      data.paymentMode = updateData.paymentMode;
    if (updateData.date)
      data.date = updateData.date.toISOString().split("T")[0];

    const updatedExpense = await expenseRepository.updatePersonalExpense(
      id,
      data
    );
    if (!updatedExpense) {
      throw new Error("Failed to update personal expense");
    }

    return this.formatPersonalExpenseResponse(updatedExpense);
  }

  /**
   * Delete expense
   */
  async deleteExpense(id: number, type: ExpenseType) {
    const expense = await expenseRepository.findById(id, type);
    if (!expense) {
      throw new Error(`${this.capitalize(type)} expense not found`);
    }

    let deletedExpense;
    if (type === "employee") {
      deletedExpense = await expenseRepository.deleteEmployeeExpense(id);
    } else if (type === "client") {
      deletedExpense = await expenseRepository.deleteClientExpense(id);
    } else {
      deletedExpense = await expenseRepository.deletePersonalExpense(id);
    }

    if (!deletedExpense) {
      throw new Error(`Failed to delete ${type} expense`);
    }

    return {
      success: true,
      message: `${this.capitalize(type)} expense deleted successfully`,
    };
  }

  /**
   * Validate expense status
   */
  private validateStatus(status: string) {
    const validStatuses = ["pending", "paid", "processing"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }
  }

  /**
   * Capitalize first letter
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Format employee expense response
   */
  private formatEmployeeExpenseResponse(expense: any) {
    const formatted: any = {
      id: expense.id,
      userId: expense.userId,
      amount: expense.amount ? parseFloat(expense.amount) : 0,
      phone: expense.phone,
      status: expense.status,
      role: expense.role,
      department: expense.department,
      paymentMode: expense.paymentMode,
      basicSalary: expense.basicSalary ? parseFloat(expense.basicSalary) : null,
      hra: expense.hra ? parseFloat(expense.hra) : null,
      conveyance: expense.conveyance ? parseFloat(expense.conveyance) : null,
      specialAllowance: expense.specialAllowance
        ? parseFloat(expense.specialAllowance)
        : null,
      pfDeductions: expense.pfDeductions
        ? parseFloat(expense.pfDeductions)
        : null,
      taxDeductions: expense.taxDeductions
        ? parseFloat(expense.taxDeductions)
        : null,
      date: expense.date,
      createdBy: expense.createdBy,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };

    if (expense.firstName) {
      formatted.user = {
        firstName: expense.firstName,
        lastName: expense.lastName,
        email: expense.email,
        empId: expense.empId,
      };
    }

    if (expense.departmentName) {
      formatted.departmentName = expense.departmentName;
    }

    return formatted;
  }

  /**
   * Format client expense response
   */
  private formatClientExpenseResponse(expense: any) {
    return {
      id: expense.id,
      clientName: expense.clientName,
      projectName: expense.projectName,
      amount: expense.amount ? parseFloat(expense.amount) : 0,
      email: expense.email,
      phone: expense.phone,
      status: expense.status,
      paymentMode: expense.paymentMode,
      date: expense.date,
      createdBy: expense.createdBy,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };
  }

  /**
   * Format personal expense response
   */
  private formatPersonalExpenseResponse(expense: any) {
    return {
      id: expense.id,
      expenseName: expense.expenseName,
      amount: expense.amount ? parseFloat(expense.amount) : 0,
      status: expense.status,
      category: expense.category,
      paymentMode: expense.paymentMode,
      date: expense.date,
      createdBy: expense.createdBy,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };
  }
}

export const expenseService = new ExpenseService();
