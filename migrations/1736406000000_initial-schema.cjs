/**
 * Initial database schema
 */

exports.up = async function up(pgm) {
  // Create departments table first (referenced by users)
  pgm.createTable("departments", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "text",
      notNull: false,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    is_deleted: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });

  // Create designations table (referenced by users)
  pgm.createTable("designations", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "text",
      notNull: false,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    is_deleted: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });

  // Create users table
  pgm.createTable("users", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
    first_name: {
      type: "varchar(255)",
      notNull: true,
    },
    last_name: {
      type: "varchar(255)",
      notNull: true,
    },
    password: {
      type: "varchar(255)",
      notNull: true,
    },
    address: {
      type: "text",
      notNull: false,
    },
    admin: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    emp_id: {
      type: "varchar(100)",
      notNull: false,
      unique: true,
    },
    phone_number: {
      type: "varchar(20)",
      notNull: false,
    },
    designation_id: {
      type: "integer",
      notNull: false,
      references: "designations",
      onDelete: "SET NULL",
    },
    department_id: {
      type: "integer",
      notNull: false,
      references: "departments",
      onDelete: "SET NULL",
    },
    joined_date: {
      type: "date",
      notNull: false,
    },
    skills: {
      type: "text",
      notNull: false,
    },
    active: {
      type: "boolean",
      notNull: true,
      default: true,
    },
    emp_type: {
      type: "varchar(225)",
      enum: ["full-time", "part-time", "contract", "intern"],
      notNull: true,
      default: "full-time",
    },
    is_deleted: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Create attendances table
  pgm.createTable("attendances", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    date: {
      type: "date",
      notNull: true,
    },
    status: {
      type: "varchar(50)",
      enum: ["present", "absent", "leave", "holiday"],
      notNull: true,
      default: "present",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Create indexes
  pgm.createIndex("users", "email");
  pgm.createIndex("attendances", ["user_id", "date"]);
};

exports.down = async function down(pgm) {
  pgm.dropTable("attendances");
  pgm.dropTable("users");
  pgm.dropTable("designations");
  pgm.dropTable("departments");
};
