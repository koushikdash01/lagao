import { pool } from "../config/db.js";

async function check() {
  try {
    console.log("Connecting to Supabase Database...");
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Connection successful!");
    console.log("Existing tables:", res.rows.map(r => r.table_name));
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await pool.end();
  }
}

check();
