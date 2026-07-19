import { pool } from "../config/db.js";

async function checkConnection() {
  try {
    console.log("Checking database connection details...");
    
    // Check connection and fetch current database details
    const res = await pool.query("SELECT NOW() as db_time, current_database() as db_name, version()");
    
    console.log("\n==============================================");
    console.log("🎉 DATABASE IS CONNECTED AND RUNNING SUCCESSFULLY!");
    console.log(`Database Name: ${res.rows[0].db_name}`);
    console.log(`Database Server Time: ${res.rows[0].db_time}`);
    console.log(`PostgreSQL Engine Version: ${res.rows[0].version}`);
    console.log("==============================================\n");
  } catch (err: any) {
    console.error("\n==============================================");
    console.error("❌ DATABASE CONNECTION FAILED!");
    console.error("Error details:", err.message);
    console.error("==============================================\n");
  } finally {
    await pool.end();
  }
}

checkConnection();
