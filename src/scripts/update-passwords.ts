import bcrypt from "bcrypt";
import { pool } from "../db/dbConnection.js";

async function updatePasswords() {
  console.log("Starting password update for all users and organizations...");
  
  try {
    // 1. Update Users
    const userResult = await pool.query(
      "SELECT id, first_name FROM users WHERE is_deleted = false"
    );
    const users = userResult.rows;
    
    console.log(`Found ${users.length} users to update.`);
    
    for (const user of users) {
      const password = user.first_name;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await pool.query(
        "UPDATE users SET password = $1 WHERE id = $2",
        [hashedPassword, user.id]
      );
      console.log(`Updated password for user ID ${user.id} (${password})`);
    }

    // 2. Update Organizations
    const orgResult = await pool.query(
      "SELECT id, name FROM organizations WHERE is_deleted = false"
    );
    const orgs = orgResult.rows;
    
    console.log(`Found ${orgs.length} organizations to update.`);
    
    for (const org of orgs) {
      const password = org.name;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await pool.query(
        "UPDATE organizations SET password = $1 WHERE id = $2",
        [hashedPassword, org.id]
      );
      console.log(`Updated password for organization ID ${org.id} (${password})`);
    }
    
    console.log("All passwords updated successfully!");
  } catch (error) {
    console.error("Error updating passwords:", error);
  } finally {
    await pool.end();
  }
}

updatePasswords();
