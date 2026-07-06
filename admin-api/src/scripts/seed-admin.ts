import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

async function seedAdmin() {
  try {
    const email = "admin@lagao.shop";
    const password = "Password123";
    
    console.log(`Checking if admin user ${email} exists...`);
    const checkRes = await pool.query("select id from admins where email = $1", [email]);
    
    if (checkRes.rows.length > 0) {
      console.log("Admin user already exists.");
    } else {
      console.log("Creating admin user...");
      const passwordHash = await bcrypt.hash(password, 12);
      await pool.query(
        "insert into admins (name, email, password_hash, role) values ($1, $2, $3, $4)",
        ["Admin", email, passwordHash, "admin"]
      );
      console.log("Admin user created successfully!");
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }
  } catch (err) {
    console.error("Failed to seed admin user:", err);
  } finally {
    await pool.end();
  }
}

seedAdmin();
