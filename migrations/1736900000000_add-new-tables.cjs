/**
 * Migration for Projects, Expenses, and Organizations tables
 */

exports.up = async function up(pgm) {
  // Create Organizations table
  pgm.createTable("organizations", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    address: {
      type: "text",
      notNull: false,
    },
    email: {
      type: "varchar(255)",
      notNull: true,
    },
    phone: {
      type: "varchar(20)",
      notNull: false,
    },
    purchase_plain: {
      type: "varchar(50)",
      notNull: true,
      default: "basic",
    },
    modules: {
      type: "text",
      notNull: false,
    },
    status: {
      type: "varchar(50)",
      notNull: true,
      default: "pending",
    },
    login_status: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    created_by: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "SET NULL",
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

  // Create Projects table
  pgm.createTable("projects", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    project_name: {
      type: "varchar(255)",
      notNull: true,
    },
    client_name: {
      type: "varchar(255)",
      notNull: true,
    },
    start_date: {
      type: "date",
      notNull: true,
    },
    end_date: {
      type: "date",
      notNull: false,
    },
    status: {
      type: "varchar(50)",
      notNull: true,
      default: "pending",
    },
    description: {
      type: "text",
      notNull: false,
    },
    phone: {
      type: "varchar(20)",
      notNull: false,
    },
    email: {
      type: "varchar(255)",
      notNull: false,
    },
    services_type: {
      type: "varchar(100)",
      notNull: false,
    },
    budget: {
      type: "decimal(15,2)",
      notNull: false,
    },
    technology_stack: {
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

  // Create Employee Expenses table
  pgm.createTable("employee_expenses", {
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
    amount: {
      type: "decimal(15,2)",
      notNull: true,
    },
    phone: {
      type: "varchar(20)",
      notNull: false,
    },
    status: {
      type: "varchar(50)",
      notNull: true,
      default: "pending",
    },
    role: {
      type: "varchar(255)",
      notNull: false,
    },
    department: {
      type: "integer",
      notNull: false,
      references: "departments",
      onDelete: "SET NULL",
    },
    payment_mode: {
      type: "varchar(50)",
      notNull: false,
    },
    basic_salary: {
      type: "decimal(15,2)",
      notNull: false,
    },
    hra: {
      type: "decimal(15,2)",
      notNull: false,
    },
    conveyance: {
      type: "decimal(15,2)",
      notNull: false,
    },
    special_allowance: {
      type: "decimal(15,2)",
      notNull: false,
    },
    pf_deductions: {
      type: "decimal(15,2)",
      notNull: false,
    },
    tax_deductions: {
      type: "decimal(15,2)",
      notNull: false,
    },
    date: {
      type: "date",
      notNull: true,
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
    created_by: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "SET NULL",
    },
  });

  // Create Company Client Expenses table
  pgm.createTable("company_client_expenses", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    client_name: {
      type: "varchar(255)",
      notNull: true,
    },
    project_name: {
      type: "varchar(255)",
      notNull: false,
    },
    amount: {
      type: "decimal(15,2)",
      notNull: true,
    },
    email: {
      type: "varchar(255)",
      notNull: false,
    },
    phone: {
      type: "varchar(20)",
      notNull: false,
    },
    status: {
      type: "varchar(50)",
      notNull: true,
      default: "pending",
    },
    payment_mode: {
      type: "varchar(50)",
      notNull: false,
    },
    date: {
      type: "date",
      notNull: true,
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
    created_by: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "SET NULL",
    },
  });

  // Create Company Personal Expenses table
  pgm.createTable("company_personal_expenses", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    expense_name: {
      type: "varchar(255)",
      notNull: true,
    },
    amount: {
      type: "decimal(15,2)",
      notNull: true,
    },
    status: {
      type: "varchar(50)",
      notNull: true,
      default: "pending",
    },
    category: {
      type: "varchar(100)",
      notNull: false,
    },
    payment_mode: {
      type: "varchar(50)",
      notNull: false,
    },
    date: {
      type: "date",
      notNull: true,
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
    created_by: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "SET NULL",
    },
  });

  // Update attendances table to match new schema
  pgm.alterColumn("attendances", "status", {
    type: "varchar(50)",
    notNull: true,
    default: "present",
  });

  pgm.addColumns("attendances", {
    clock_in: {
      type: "timestamp",
      notNull: false,
    },
    clock_out: {
      type: "timestamp",
      notNull: false,
    },
  });

  // Create indexes
  pgm.createIndex("organizations", "email");
  pgm.createIndex("projects", ["client_name", "is_deleted"]);
  pgm.createIndex("employee_expenses", ["user_id", "date"]);
  pgm.createIndex("company_client_expenses", ["client_name", "date"]);
  pgm.createIndex("company_personal_expenses", ["category", "date"]);
};

exports.down = async function down(pgm) {
  pgm.dropTable("company_personal_expenses");
  pgm.dropTable("company_client_expenses");
  pgm.dropTable("employee_expenses");
  pgm.dropTable("projects");
  pgm.dropTable("organizations");
  
  // Revert attendances changes
  pgm.dropColumns("attendances", ["clock_in", "clock_out"]);
  pgm.alterColumn("attendances", "status", {
    type: "boolean",
    notNull: true,
    default: true,
  });
};
