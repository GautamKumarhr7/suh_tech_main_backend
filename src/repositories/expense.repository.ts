/**
 * Unified Expense Repository
 * Handles all database operations for all expense types using Drizzle ORM
 */

import { db } from "../db/drizzle.js";
import { employeeExpenses, companyClientExpenses, companyPersonalExpenses, users, departments } from "../db/drizzle-schema.js";
import { eq } from "drizzle-orm";

export type ExpenseType = "employee" | "client" | "personal";

export class ExpenseRepository {
  /**
   * Get all employee expenses
   */
  async findEmployeeExpenses() {
    const result = await db
      .select({
        id: employeeExpenses.id,
        userId: employeeExpenses.userId,
        amount: employeeExpenses.amount,
        phone: employeeExpenses.phone,
        status: employeeExpenses.status,
        role: employeeExpenses.role,
        department: employeeExpenses.department,
        paymentMode: employeeExpenses.paymentMode,
        basicSalary: employeeExpenses.basicSalary,
        hra: employeeExpenses.hra,
        conveyance: employeeExpenses.conveyance,
        specialAllowance: employeeExpenses.specialAllowance,
        pfDeductions: employeeExpenses.pfDeductions,
        taxDeductions: employeeExpenses.taxDeductions,
        date: employeeExpenses.date,
        createdBy: employeeExpenses.createdBy,
        createdAt: employeeExpenses.createdAt,
        updatedAt: employeeExpenses.updatedAt,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        empId: users.empId,
        departmentName: departments.name,
      })
      .from(employeeExpenses)
      .leftJoin(users, eq(employeeExpenses.userId, users.id))
      .leftJoin(departments, eq(employeeExpenses.department, departments.id));

    return result;
  }

  /**
   * Get all client expenses
   */
  async findClientExpenses() {
    return await db
      .select()
      .from(companyClientExpenses);
  }

  /**
   * Get all personal expenses
   */
  async findPersonalExpenses() {
    return await db
      .select()
      .from(companyPersonalExpenses);
  }

  /**
   * Find expense by ID and type
   */
  async findById(id: number, type: ExpenseType) {
    if (type === "employee") {
      const result = await db
        .select({
          id: employeeExpenses.id,
          userId: employeeExpenses.userId,
          amount: employeeExpenses.amount,
          phone: employeeExpenses.phone,
          status: employeeExpenses.status,
          role: employeeExpenses.role,
          department: employeeExpenses.department,
          paymentMode: employeeExpenses.paymentMode,
          basicSalary: employeeExpenses.basicSalary,
          hra: employeeExpenses.hra,
          conveyance: employeeExpenses.conveyance,
          specialAllowance: employeeExpenses.specialAllowance,
          pfDeductions: employeeExpenses.pfDeductions,
          taxDeductions: employeeExpenses.taxDeductions,
          date: employeeExpenses.date,
          createdBy: employeeExpenses.createdBy,
          createdAt: employeeExpenses.createdAt,
          updatedAt: employeeExpenses.updatedAt,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          empId: users.empId,
          departmentName: departments.name,
        })
        .from(employeeExpenses)
        .leftJoin(users, eq(employeeExpenses.userId, users.id))
        .leftJoin(departments, eq(employeeExpenses.department, departments.id))
        .where(eq(employeeExpenses.id, id));
      return result[0] || null;
    } else if (type === "client") {
      const result = await db
        .select()
        .from(companyClientExpenses)
        .where(eq(companyClientExpenses.id, id));
      return result[0] || null;
    } else {
      const result = await db
        .select()
        .from(companyPersonalExpenses)
        .where(eq(companyPersonalExpenses.id, id));
      return result[0] || null;
    }
  }

  /**
   * Create employee expense
   */
  async createEmployeeExpense(data: {
    userId: number;
    amount: string;
    phone?: string;
    status: string;
    role?: string;
    department?: number;
    paymentMode?: string;
    basicSalary?: string;
    hra?: string;
    conveyance?: string;
    specialAllowance?: string;
    pfDeductions?: string;
    taxDeductions?: string;
    date: string;
    createdBy: number;
  }) {
    const result = await db
      .insert(employeeExpenses)
      .values(data)
      .returning();
    return result[0];
  }

  /**
   * Create client expense
   */
  async createClientExpense(data: {
    clientName: string;
    projectName?: string;
    amount: string;
    email?: string;
    phone?: string;
    status: string;
    paymentMode?: string;
    date: string;
    createdBy: number;
  }) {
    const result = await db
      .insert(companyClientExpenses)
      .values(data)
      .returning();
    return result[0];
  }

  /**
   * Create personal expense
   */
  async createPersonalExpense(data: {
    expenseName: string;
    amount: string;
    status: string;
    category?: string;
    paymentMode?: string;
    date: string;
    createdBy: number;
  }) {
    const result = await db
      .insert(companyPersonalExpenses)
      .values(data)
      .returning();
    return result[0];
  }

  /**
   * Update employee expense
   */
  async updateEmployeeExpense(id: number, data: Partial<{
    amount: string;
    phone: string;
    status: string;
    role: string;
    department: number;
    paymentMode: string;
    basicSalary: string;
    hra: string;
    conveyance: string;
    specialAllowance: string;
    pfDeductions: string;
    taxDeductions: string;
    date: string;
  }>) {
    const result = await db
      .update(employeeExpenses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(employeeExpenses.id, id))
      .returning();
    return result[0] || null;
  }

  /**
   * Update client expense
   */
  async updateClientExpense(id: number, data: Partial<{
    clientName: string;
    projectName: string;
    amount: string;
    email: string;
    phone: string;
    status: string;
    paymentMode: string;
    date: string;
  }>) {
    const result = await db
      .update(companyClientExpenses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(companyClientExpenses.id, id))
      .returning();
    return result[0] || null;
  }

  /**
   * Update personal expense
   */
  async updatePersonalExpense(id: number, data: Partial<{
    expenseName: string;
    amount: string;
    status: string;
    category: string;
    paymentMode: string;
    date: string;
  }>) {
    const result = await db
      .update(companyPersonalExpenses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(companyPersonalExpenses.id, id))
      .returning();
    return result[0] || null;
  }

  /**
   * Delete employee expense
   */
  async deleteEmployeeExpense(id: number) {
    const result = await db
      .delete(employeeExpenses)
      .where(eq(employeeExpenses.id, id))
      .returning({ id: employeeExpenses.id });
    return result[0] || null;
  }

  /**
   * Delete client expense
   */
  async deleteClientExpense(id: number) {
    const result = await db
      .delete(companyClientExpenses)
      .where(eq(companyClientExpenses.id, id))
      .returning({ id: companyClientExpenses.id });
    return result[0] || null;
  }

  /**
   * Delete personal expense
   */
  async deletePersonalExpense(id: number) {
    const result = await db
      .delete(companyPersonalExpenses)
      .where(eq(companyPersonalExpenses.id, id))
      .returning({ id: companyPersonalExpenses.id });
    return result[0] || null;
  }
}

export const expenseRepository = new ExpenseRepository();
