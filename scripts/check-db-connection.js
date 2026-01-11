import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

async function checkDatabaseConnection() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined in environment variables");
    process.exit(1);
  }

  console.log("🔍 Checking database connection...");

  // Parse the database URL to add SSL configuration
  const connectionConfig = {
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false, // For cloud databases like Azure, AWS RDS, etc.
    },
  };

  const client = new Client(connectionConfig);

  try {
    await client.connect();
    console.log("✅ Database connection successful!");

    // Test a simple query
    const result = await client.query("SELECT NOW()");
    console.log("✅ Database query test passed");
    console.log(`   Server time: ${result.rows[0].now}`);

    await client.end();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(`   Error: ${error.message}`);
    console.error("\n💡 Troubleshooting tips:");
    console.error("   1. Check if DATABASE_URL is correct in .env file");
    console.error("   2. Verify database server is running and accessible");
    console.error("   3. Check if SSL/TLS is required by your database");
    console.error("   4. Verify network connectivity and firewall settings");
    await client.end();
    process.exit(1);
  }
}

checkDatabaseConnection();
