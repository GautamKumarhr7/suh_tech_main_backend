/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("jobs", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    type: {
      type: "varchar(100)",
      notNull: true,
    },
    location: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "text",
    },
    responsibilities: {
      type: "text",
    },
    requirements: {
      type: "text",
    },
    active: {
      type: "boolean",
      notNull: true,
      default: true,
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

  pgm.createIndex("jobs", "title");
  pgm.createIndex("jobs", "active");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("jobs");
};
