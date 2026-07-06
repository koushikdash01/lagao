import { query } from "../config/db.js";

async function runTest() {
  try {
    console.log("=== Lagao Inventory Stock Sync Integration Test ===");

    // 1. Get a Category ID
    const catRes = await query<{ id: string; name: string }>("select id, name from categories limit 1");
    const categoryId = catRes.rows[0]?.id;
    if (!categoryId) {
      throw new Error("No categories found in database. Please setup database first.");
    }
    console.log(`Using Category: ${catRes.rows[0].name} (${categoryId})`);

    // 2. Insert a temporary plant with stock 10
    const plantName = "Test Sync Plant " + Math.floor(Math.random() * 1000);
    console.log(`\n1. Creating test plant: "${plantName}" with stock_quantity = 10...`);
    const plantRes = await query<{ id: string }>(
      `insert into plants 
       (name, category_id, description, price, stock_quantity, type, sunlight_requirement, watering_frequency, pot_size, status)
       values ($1, $2, 'Test plant description', 199, 10, 'indoor', 'Bright indirect', 'Water weekly', '6 inch', 'available')
       returning id`,
      [plantName, categoryId]
    );
    const plantId = plantRes.rows[0].id;
    console.log(`Test plant created successfully with ID: ${plantId}`);

    // Verify initial stock
    let verifyRes = await query<{ stock_quantity: number }>("select stock_quantity from plants where id = $1", [plantId]);
    console.log(`Verified initial stock: ${verifyRes.rows[0].stock_quantity}`);

    // 3. Simulate Checkout (Place Order for 3 units of this plant)
    console.log(`\n2. Simulating Checkout: Customer orders 3 units of "${plantName}"...`);
    const orderNumber = "LG-TEST-" + Math.floor(100000 + Math.random() * 900000);
    
    // Begin transaction
    await query("BEGIN");
    
    // Insert order record
    const orderRes = await query<{ id: string }>(
      `insert into customer_orders (order_number, subtotal, tax_amount, total_amount, payment_method, status)
       values ($1, 597, 30, 627, 'cod', 'placed')
       returning id`,
      [orderNumber]
    );
    const orderId = orderRes.rows[0].id;

    // Insert order item
    await query(
      `insert into customer_order_items (order_id, plant_id, plant_name, quantity, unit_price, total_price)
       values ($1, $2, $3, 3, 199, 597)`,
      [orderId, plantId, plantName]
    );

    // Reduce stock
    await query(
      `update plants 
       set stock_quantity = stock_quantity - 3,
           status = case when stock_quantity - 3 = 0 then 'out_of_stock'::plant_status else 'available'::plant_status end
       where id = $1`,
      [plantId]
    );
    
    await query("COMMIT");
    console.log(`Checkout transaction committed. Order ID: ${orderId}`);

    // Verify stock after checkout
    verifyRes = await query<{ stock_quantity: number }>("select stock_quantity from plants where id = $1", [plantId]);
    console.log(`Verified stock after checkout (should be 7): ${verifyRes.rows[0].stock_quantity}`);
    if (verifyRes.rows[0].stock_quantity !== 7) {
      throw new Error(`Stock mismatch! Expected 7, got ${verifyRes.rows[0].stock_quantity}`);
    }

    // 4. Simulate Cancellation (Restore stock)
    console.log(`\n3. Simulating Cancellation: Admin cancels order ${orderNumber}...`);
    await query("BEGIN");

    // Update status to cancelled
    await query(
      "update customer_orders set status = 'cancelled', updated_at = now() where id = $1",
      [orderId]
    );

    // Get order items to restore
    const itemsRes = await query<{ plant_id: string; quantity: number }>(
      "select plant_id, quantity from customer_order_items where order_id = $1",
      [orderId]
    );

    // Restore stock
    for (const item of itemsRes.rows) {
      await query(
        `update plants 
         set stock_quantity = stock_quantity + $2,
             status = 'available'::plant_status
         where id = $1`,
        [item.plant_id, item.quantity]
      );
    }

    await query("COMMIT");
    console.log("Cancellation transaction committed.");

    // Verify stock after cancellation
    verifyRes = await query<{ stock_quantity: number }>("select stock_quantity from plants where id = $1", [plantId]);
    console.log(`Verified stock after cancellation (should be 10): ${verifyRes.rows[0].stock_quantity}`);
    if (verifyRes.rows[0].stock_quantity !== 10) {
      throw new Error(`Stock mismatch! Expected 10, got ${verifyRes.rows[0].stock_quantity}`);
    }

    // 5. Cleanup
    console.log("\n4. Cleaning up test data...");
    await query("delete from customer_order_items where order_id = $1", [orderId]);
    await query("delete from customer_orders where id = $1", [orderId]);
    await query("delete from plants where id = $1", [plantId]);
    console.log("Cleanup completed.");

    console.log("\n=== ALL STOCK SYNC INTEGRATION CHECKS PASSED SUCCESSFULLY! ===");

  } catch (err) {
    console.error("\n❌ Test Failed:", err);
    process.exit(1);
  } finally {
    // End pool
    const { pool } = await import("../config/db.js");
    await pool.end();
  }
}

runTest();
