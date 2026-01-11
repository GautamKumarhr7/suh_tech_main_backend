/**
 * Database schema types and interfaces
 * Define your table structures here for type safety
 */

export type EmpType = "full-time" | "part-time" | "contract" | "intern";
export type AttendanceStatus = "present" | "absent" | "leave" | "holiday";

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
  emp_id: string | null;
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
  status: AttendanceStatus;
  created_at: Date;
  updated_at: Date;
}
