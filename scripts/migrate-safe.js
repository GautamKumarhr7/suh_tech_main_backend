import { exec } from "child_process";
import { promisify } from "util";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const execPromise = promisify(exec);
const { Client } = pg;

async function checkDatabaseConnection() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined in environment variables");
    return false;
  }

  console.log("🔍 Checking database connection...");

  const connectionConfig = {
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  };

  const client = new Client(connectionConfig);

  try {
    await client.connect();
    console.log("✅ Database connection successful!");
    await client.end();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(`   Error: ${error.message}`);
    await client.end();
    return false;
  }
}

async function runMigrations() {
  const command = process.argv[2] || "up";

  console.log("\n📦 Starting migration process...\n");

  // Check connection first
  const isConnected = await checkDatabaseConnection();

  if (!isConnected) {
    console.error(
      "\n❌ Cannot proceed with migrations due to connection issues"
    );
    console.error("\n💡 Please fix the database connection and try again");
    process.exit(1);
  }

  console.log(`\n🚀 Running migrations (${command})...\n`);

  // Add SSL parameters to DATABASE_URL for node-pg-migrate
  const originalUrl = process.env.DATABASE_URL;
  const urlWithSSL = originalUrl.includes("?")
    ? `${originalUrl}&ssl=true&sslmode=require`
    : `${originalUrl}?ssl=true&sslmode=require`;

  try {
    const { stdout, stderr } = await execPromise(`node-pg-migrate ${command}`, {
      env: {
        ...process.env,
        DATABASE_URL: urlWithSSL,
      },
    });

    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(stderr);
    }

    console.log("\n✅ Migrations completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:");
    console.error(error.stdout || error.message);
    process.exit(1);
  }
}

runMigrations();
