/**
 * Drizzle ORM Schema
 * Database schema definitions using Drizzle ORM
 */

import { pgTable, serial, varchar, text, boolean, timestamp, integer, decimal, date } from "drizzle-orm/pg-core";

// Departments table
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
});

// Designations table
export const designations = pgTable("designations", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
});

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  address: text("address"),
  admin: boolean("admin").default(false).notNull(),
  empId: varchar("emp_id", { length: 100 }).unique(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  designationId: integer("designation_id").references(() => designations.id, { onDelete: "set null" }),
  departmentId: integer("department_id").references(() => departments.id, { onDelete: "set null" }),
  joinedDate: date("joined_date"),
  skills: text("skills"),
  active: boolean("active").default(true).notNull(),
  empType: varchar("emp_type", { length: 225 }).default("full-time").notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  projectName: varchar("project_name", { length: 255 }).notNull(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  description: text("description"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  servicesType: varchar("services_type", { length: 100 }),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  technologyStack: text("technology_stack"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
});

// Organizations table
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  purchasePlain: varchar("purchase_plain", { length: 50 }).default("basic").notNull(),
  modules: text("modules"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  loginStatus: boolean("login_status").default(false).notNull(),
  createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
});

// Employee Expenses table
export const employeeExpenses = pgTable("employee_expenses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  role: varchar("role", { length: 255 }),
  department: integer("department").references(() => departments.id, { onDelete: "set null" }),
  paymentMode: varchar("payment_mode", { length: 50 }),
  basicSalary: decimal("basic_salary", { precision: 15, scale: 2 }),
  hra: decimal("hra", { precision: 15, scale: 2 }),
  conveyance: decimal("conveyance", { precision: 15, scale: 2 }),
  specialAllowance: decimal("special_allowance", { precision: 15, scale: 2 }),
  pfDeductions: decimal("pf_deductions", { precision: 15, scale: 2 }),
  taxDeductions: decimal("tax_deductions", { precision: 15, scale: 2 }),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }).notNull(),
});

// Company Client Expenses table
export const companyClientExpenses = pgTable("company_client_expenses", {
  id: serial("id").primaryKey(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  projectName: varchar("project_name", { length: 255 }),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  paymentMode: varchar("payment_mode", { length: 50 }),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }).notNull(),
});

// Company Personal Expenses table
export const companyPersonalExpenses = pgTable("company_personal_expenses", {
  id: serial("id").primaryKey(),
  expenseName: varchar("expense_name", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  category: varchar("category", { length: 100 }),
  paymentMode: varchar("payment_mode", { length: 50 }),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id, { onDelete: "set null" }).notNull(),
});

// Attendances table
export const attendances = pgTable("attendances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  date: date("date").notNull(),
  status: varchar("status", { length: 50 }).default("present").notNull(),
  markedBy: integer("marked_by").references(() => users.id, { onDelete: "cascade" }).notNull(),
  clockIn: timestamp("clock_in"),
  clockOut: timestamp("clock_out"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
