import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSetup() {
  try {
    console.log("Starting database initialization...");

    // Path to sql files (relative to this script: src/scripts/setup-db.ts -> ../../db/...)
    const schemaPath = path.resolve(__dirname, "../../db/schema.sql");
    const customerSchemaPath = path.resolve(__dirname, "../../db/customer-schema.sql");

    console.log(`Reading schema.sql from: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    console.log(`Reading customer-schema.sql from: ${customerSchemaPath}`);
    const customerSchemaSql = fs.readFileSync(customerSchemaPath, "utf8");

    console.log("Applying core schema (schema.sql)...");
    await pool.query(schemaSql);
    console.log("Core schema applied successfully!");

    console.log("Applying customer schema (customer-schema.sql)...");
    await pool.query(customerSchemaSql);
    console.log("Customer schema applied successfully!");

    // Let's verify by listing tables
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Database initialized successfully!");
    console.log("Tables created:", res.rows.map(r => r.table_name));

  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSetup();
