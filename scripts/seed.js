import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const { Client } = pg;

async function seedDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined in environment variables");
    process.exit(1);
  }

  console.log("🌱 Starting database seeding...\n");

  const connectionConfig = {
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  };

  const client = new Client(connectionConfig);

  try {
    await client.connect();
    console.log("✅ Database connected");

    // Check if admin user already exists
    const checkAdmin = await client.query(
      "SELECT * FROM users WHERE email = 'admin@suhtech.com'"
    );

    if (checkAdmin.rows.length > 0) {
      console.log("⚠️  Admin user already exists, skipping seed");
      await client.end();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Insert admin user
    const result = await client.query(
      `INSERT INTO users (
        email, 
        first_name, 
        last_name, 
        password, 
        admin, 
        emp_id,
        phone_number,
        active,
        emp_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, email, first_name, last_name`,
      [
        "admin@suhtech.com",
        "Admin",
        "User",
        hashedPassword,
        true,
        "EMP001",
        "+1234567890",
        true,
        "full-time",
      ]
    );

    console.log("\n✅ Admin user created successfully!");
    console.log("📧 Email:", result.rows[0].email);
    console.log("🔑 Password: Admin@123");
    console.log(
      "👤 Name:",
      `${result.rows[0].first_name} ${result.rows[0].last_name}`
    );
    console.log(
      "\n⚠️  Please change the default password after first login!\n"
    );

    await client.end();
  } catch (error) {
    console.error("\n❌ Seeding failed:", error.message);
    await client.end();
    process.exit(1);
  }
}

seedDatabase();
