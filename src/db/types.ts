/**
 * Database schema types and interfaces
 * Define your table structures here for type safety
 */

export type EmpType = "full-time" | "part-time" | "contract" | "intern";
export type AttendanceStatus =
  | "absent"
  | "present"
  | "on leave"
  | "late"
  | "half-day";
export type ExpanceStatus = "pending" | "paid" | "processing";

// Departments table
export interface Department {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

// Designations table
export interface Designation {
  id: number;
  title: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

// Users table
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  address: string | null;
  admin: boolean;
  emp_id: string;
  phone_number: string | null;
  designation_id: number | null;
  department_id: number | null;
  joined_date: Date | null;
  skills: string | null;
  active: boolean;
  emp_type: EmpType;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

// Attendances table
export interface Attendance {
  id: number;
  user_id: number;
  date: Date;
  marked_By: number;
  status: AttendanceStatus;
  clock_in: Date | null;
  clock_out: Date | null;
  created_at: Date;
  updated_at: Date;
}
export interface EmployeeExpances {
  id: number;
  user_id: number;
  amount: number;
  phone: string;
  status: ExpanceStatus;
  role: string;
  department: number;
  paymentMode: string;
  basicSalary: number;
  hra: number;
  conveyance: number;
  SpecialAllowance: number;
  pfDeductions: number;
  taxDeductions: number;
  date: Date;
  created_at: Date;
  updated_at: Date;
  createdBy: number;
}
export interface CompanyClientExpances {
  id: number;
  clientName: string;
  projectName: string;
  amount: number;
  email: string;
  phone: string;
  status: ExpanceStatus;
  paymentMode: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
  createdBy: number;
}
export interface companyPersonalExpances {
  id: number;
  expanceName: string;
  amount: number;
  status: ExpanceStatus;
  category: string;
  paymentMode: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
  createdBy: number;
}
export interface Organizations {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  purchasePlain: purchasePlain;
  modules: moduleType;
  status: projectStatus;
  loginStatus: boolean;
  createdBy: number;
  created_at: Date;
  updated_at: Date;
  isDeleted: boolean;
}
export type purchasePlain = ["basic", "standard", "premium", "enterprise"];
export type moduleType = ["HRMS", "finance", "CRM", "Scales"];

export interface Projects {
  id: number;
  projectName: string;
  clientName: string;
  startDate: Date;
  endDate: Date;
  status: projectStatus;
  description: string;
  phone: string;
  email: string;
  servicesType: servicesTypes;
  budget: number;
  technologyStack: technologyStacks;
  created_at: Date;
  updated_at: Date;
  isDeleted: boolean;
}

export interface Job {
  id: number;
  title: string;
  type: string;
  location: string;
  description: string | null;
  responsibilities: string | null;
  requirements: string | null;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string | null;
  tags: string | null;
  published: boolean;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface ManualInvoice {
  id: number;
  client_name: string;
  client_email: string | null;
  contact_phone: string | null;
  address: string | null;
  service_description: string;
  phase_work: string | null;
  service_type: string;
  service_category: string;
  tax_rate: number | null;
  discount: number | null;
  maintenance_due_date: Date | null;
  status: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  phases?: ManualInvoicePhase[];
}

export interface ManualInvoicePhase {
  id: number;
  invoice_id: number;
  phase_number: number;
  remarks: string | null;
  price: number | null;
  start_date: Date | null;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Holiday {
  id: number;
  name: string;
  type: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface SystemPreference {
  id: number;
  timezone: string;
  date_format: string;
  time_format: string;
  created_at: Date;
  updated_at: Date;
}
export type projectStatus = [
  "pending",
  "in progress",
  "completed",
  "on hold",
  "cancelled",
];
export type servicesTypes = [
  "web development",
  "mobile app development",
  "Devops",
  "custom software",
  "maintenance",
  "consulting",
  "other",
];
export type technologyStacks = [
  "javascript",
  "python",
  "java",
  "c#",
  "php",
  "ruby",
  "go",
  "typescript",
];
