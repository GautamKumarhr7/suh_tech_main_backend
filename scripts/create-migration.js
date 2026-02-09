import { exec } from "child_process";
import { promisify } from "util";
import { rename } from "fs/promises";
import { readdir } from "fs/promises";
import { join } from "path";

const execPromise = promisify(exec);

async function createMigration() {
  const migrationName = process.argv[2];

  if (!migrationName) {
    console.error("❌ Migration name is required");
    console.error("Usage: npm run migrate:create -- <migration-name>");
    process.exit(1);
  }

  try {
    // Get list of migrations before creation
    const migrationsDir = "migrations";
    const filesBefore = await readdir(migrationsDir);

    // Create the migration
    const { stdout, stderr } = await execPromise(
      `node-pg-migrate create ${migrationName}`,
    );

    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(stderr);
    }

    // Get list of migrations after creation
    const filesAfter = await readdir(migrationsDir);

    // Find the newly created file
    const newFile = filesAfter.find((file) => !filesBefore.includes(file));

    if (newFile && newFile.endsWith(".js")) {
      const oldPath = join(migrationsDir, newFile);
      const newPath = join(migrationsDir, newFile.replace(/\.js$/, ".cjs"));

      await rename(oldPath, newPath);
      console.log(`✅ Renamed to .cjs extension: ${newPath}`);
    }
  } catch (error) {
    console.error("❌ Failed to create migration:");
    console.error(error.message);
    process.exit(1);
  }
}

createMigration();
