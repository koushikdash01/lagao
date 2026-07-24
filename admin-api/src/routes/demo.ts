import { Router } from "express";
import { z } from "zod";
import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { calculateDistanceInMeters } from "../utils/distance.js";

const router = Router();

// Ensure customer_orders has location, customer, & distance columns
query(`
  ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS customer_name text;
  ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS customer_email text;
  ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS shipping_address text;
  ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS latitude numeric(10,7);
  ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS longitude numeric(10,7);
  ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS distance_meters integer;
`).catch(err => console.error("Location & Customer columns migration notice:", err.message));

// 1. GET /api/demo/categories
router.get("/categories", asyncHandler(async (_req, res) => {
  const result = await query("select * from categories order by name");
  res.json({ data: result.rows });
}));

// 2. POST /api/demo/categories
router.post("/categories", asyncHandler(async (req, res) => {
  const input = z.object({
    name: z.string().min(2),
    description: z.string().optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
  }).parse(req.body);

  const result = await query(
    "insert into categories (name, description, image_url, status) values ($1, $2, $3, 'active') returning *",
    [input.name, input.description || "Curated storefront collection", input.imageUrl || ""]
  );

  res.status(201).json({ data: result.rows[0] });
}));

// 3. GET /api/demo/plants
router.get("/plants", asyncHandler(async (_req, res) => {
  const countRes = await query<{ count: string }>("select count(*) from plants");
  if (Number(countRes.rows[0].count) === 0) {
    console.log("Database plants table is empty. Auto-seeding default plants...");
    const catRes = await query<{ id: string; name: string }>("select id, name from categories");
    const getCatId = (name: string) => {
      const match = catRes.rows.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
      return match ? match.id : catRes.rows[0]?.id;
    };

    const defaults = [
      {
        name: "Snake Plant",
        category: "Air Purifying Plants",
        price: 399,
        discountPrice: 299,
        stock: 18,
        type: "indoor",
        sunlight: "Low to bright indirect",
        watering: "Every 7-10 days",
        potSize: "6 inch",
        image: "https://images.unsplash.com/photo-1593482892290-f54927ae2b7f?q=80&w=900&auto=format&fit=crop",
        description: "A sculptural, resilient houseplant that forgives missed watering and low light."
      },
      {
        name: "Peace Lily",
        category: "Flowering Plants",
        price: 549,
        discountPrice: 449,
        stock: 9,
        type: "indoor",
        sunlight: "Medium indirect",
        watering: "Every 7-10 days",
        potSize: "6 inch",
        image: "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?q=80&w=900&auto=format&fit=crop",
        description: "Elegant white blooms and glossy leaves for calm corners and workspaces."
      },
      {
        name: "Jade Plant",
        category: "Succulents",
        price: 499,
        discountPrice: null,
        stock: 22,
        type: "indoor",
        sunlight: "Bright indirect",
        watering: "Every 10-14 days",
        potSize: "4 inch",
        image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=900&auto=format&fit=crop",
        description: "Glossy succulent leaves, compact growth, and a long-lived tabletop presence."
      },
      {
        name: "Areca Palm",
        category: "Indoor Plants",
        price: 899,
        discountPrice: 749,
        stock: 5,
        type: "indoor",
        sunlight: "Bright filtered",
        watering: "Every 5-7 days",
        potSize: "8 inch",
        image: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?q=80&w=900&auto=format&fit=crop",
        description: "A lush palm that softens rooms and adds tropical height without heaviness."
      }
    ];

    for (const p of defaults) {
      const catId = getCatId(p.category);
      if (catId) {
        const plantIns = await query<{ id: string }>(
          `insert into plants
           (name, category_id, description, price, discount_price, stock_quantity, type,
            sunlight_requirement, watering_frequency, pot_size, is_featured, status)
           values ($1,$2,$3,$4,$5,$6,$7::plant_type,$8,$9,$10,true,'available')
           returning id`,
          [p.name, catId, p.description, p.price, p.discountPrice, p.stock, p.type, p.sunlight, p.watering, p.potSize]
        );
        await query("insert into plant_images (plant_id, image_url, sort_order) values ($1,$2,0)", [
          plantIns.rows[0].id,
          p.image
        ]);
      }
    }
  }

  const result = await query(
    `select p.*, c.name as category_name, (select image_url from plant_images where plant_id = p.id order by sort_order asc limit 1) as image_url
     from plants p
     left join categories c on c.id = p.category_id
     order by p.created_at desc`
  );
  res.json({ data: result.rows });
}));

// 4. POST /api/demo/plants
router.post("/plants", asyncHandler(async (req, res) => {
  const input = z.object({
    name: z.string().min(2),
    scientificName: z.string().optional().nullable(),
    categoryId: z.string().uuid(),
    description: z.string().min(5),
    price: z.number().nonnegative(),
    discountPrice: z.number().nonnegative().optional().nullable(),
    stockQuantity: z.number().int().nonnegative(),
    type: z.enum(["indoor", "outdoor"]),
    sunlightRequirement: z.string().min(2),
    wateringFrequency: z.string().min(2),
    potSize: z.string().min(1),
    imageUrl: z.string().url().optional().nullable(),
  }).parse(req.body);

  const status = input.stockQuantity > 0 ? "available" : "out_of_stock";

  const result = await query<{ id: string }>(
    `insert into plants
     (name, scientific_name, category_id, description, price, discount_price, stock_quantity, type,
      sunlight_requirement, watering_frequency, pot_size, is_featured, status)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true,$12)
     returning id`,
    [
      input.name,
      input.scientificName || "",
      input.categoryId,
      input.description,
      input.price,
      input.discountPrice || null,
      input.stockQuantity,
      input.type,
      input.sunlightRequirement,
      input.wateringFrequency,
      input.potSize,
      status,
    ]
  );

  const plantId = result.rows[0].id;

  if (input.imageUrl) {
    await query("insert into plant_images (plant_id, image_url, sort_order) values ($1,$2,0)", [
      plantId,
      input.imageUrl,
    ]);
  }

  // Retrieve the full record
  const fullResult = await query(
    `select p.*, c.name as category_name
     from plants p
     left join categories c on c.id = p.category_id
     where p.id = $1`,
    [plantId]
  );

  res.status(201).json({ data: fullResult.rows[0] });
}));

// 5. GET /api/demo/orders
router.get("/orders", asyncHandler(async (_req, res) => {
  const result = await query(
    `select o.*,
       (select json_agg(
         json_build_object(
           'id', oi.id,
           'plant_name', oi.plant_name,
           'quantity', oi.quantity,
           'unit_price', oi.unit_price,
           'total_price', oi.total_price,
           'plant_id', oi.plant_id
         )
       ) from customer_order_items oi where oi.order_id = o.id) as items
     from customer_orders o
     order by o.created_at desc`
  );
  res.json({ data: result.rows });
}));

// 6. POST /api/demo/orders (Place Order & Reduce Stock)
router.post("/orders", asyncHandler(async (req, res) => {
  const input = z.object({
    customerName: z.string().min(2),
    customerEmail: z.string().email(),
    paymentMethod: z.enum(["upi", "card", "net_banking", "cod"]),
    addressLine: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    items: z.array(z.object({
      plantId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })).min(1),
    couponCode: z.string().optional().nullable(),
  }).parse(req.body);

  // Calculate distance in meters from admin store/house if coordinates exist
  const distanceMeters = calculateDistanceInMeters(input.latitude, input.longitude);
  const formattedAddress = [input.addressLine, input.city, input.postalCode].filter(Boolean).join(", ");

  // Begin transaction
  await query("BEGIN");

  try {
    let subtotal = 0;
    const itemsToInsert: { plantId: string; name: string; quantity: number; price: number; categoryId: string }[] = [];

    // 1. Validate stock and calculate prices
    for (const item of input.items) {
      const plantRes = await query<{ name: string; price: number; discount_price: number | null; stock_quantity: number; category_id: string }>(
        "select name, price, discount_price, stock_quantity, category_id from plants where id = $1 for update",
        [item.plantId]
      );

      const plant = plantRes.rows[0];
      if (!plant) {
        throw new Error(`Plant not found: ${item.plantId}`);
      }

      if (plant.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${plant.name}. Available: ${plant.stock_quantity}, Requested: ${item.quantity}`);
      }

      const activePrice = Number(plant.discount_price ?? plant.price);
      subtotal += activePrice * item.quantity;

      itemsToInsert.push({
        plantId: item.plantId,
        name: plant.name,
        quantity: item.quantity,
        price: activePrice,
        categoryId: plant.category_id,
      });
    }

    // 1.5 Calculate Coupon Discount if applicable
    let discount = 0;
    if (input.couponCode) {
      const couponRes = await query(
        "select * from coupons where upper(code) = upper($1) and is_active = true and expiry_date >= current_date",
        [input.couponCode]
      );
      const coupon = couponRes.rows[0];
      if (coupon && subtotal >= Number(coupon.minimum_order_amount)) {
        let eligibleSubtotal = subtotal;
        if (coupon.category_id) {
          eligibleSubtotal = itemsToInsert
            .filter(item => item.categoryId === coupon.category_id)
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
        } else if (coupon.plant_id) {
          eligibleSubtotal = itemsToInsert
            .filter(item => item.plantId === coupon.plant_id)
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
        }

        if (eligibleSubtotal > 0) {
          if (coupon.discount_type === "percentage") {
            discount = Number((eligibleSubtotal * (Number(coupon.discount_value) / 100)).toFixed(2));
          } else {
            discount = Math.min(Number(coupon.discount_value), eligibleSubtotal);
          }
        }
      }
    }

    const orderNumber = "LG-" + Math.floor(100000 + Math.random() * 900000);
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Number((taxableAmount * 0.05).toFixed(2)); // 5% GST
    const delivery = subtotal > 499 ? 0 : 49;
    const total = taxableAmount + tax + delivery;

    // 2. Insert order with customer info, location and calculated distance in meters
    const orderRes = await query<{ id: string }>(
      `insert into customer_orders
       (order_number, customer_name, customer_email, subtotal, tax_amount, delivery_charge, discount_amount, total_amount, payment_method, payment_status, status, shipping_address, latitude, longitude, distance_meters)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'placed', $11, $12, $13, $14)
       returning id`,
      [
        orderNumber,
        input.customerName,
        input.customerEmail,
        subtotal,
        tax,
        delivery,
        discount,
        total,
        input.paymentMethod,
        input.paymentMethod === "cod" ? "pending" : "paid",
        formattedAddress || null,
        input.latitude ?? null,
        input.longitude ?? null,
        distanceMeters,
      ]
    );

    const orderId = orderRes.rows[0].id;

    // 3. Insert items and reduce stock
    for (const item of itemsToInsert) {
      await query(
        `insert into customer_order_items
         (order_id, plant_id, plant_name, quantity, unit_price, total_price)
         values ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          item.plantId,
          item.name,
          item.quantity,
          item.price,
          item.price * item.quantity,
        ]
      );

      // Reduce stock
      await query(
        `update plants
         set stock_quantity = stock_quantity - $2,
             status = case when stock_quantity - $2 = 0 then 'out_of_stock'::plant_status else 'available'::plant_status end,
             updated_at = now()
         where id = $1`,
        [item.plantId, item.quantity]
      );

      // Add inventory record
      await query(
        "insert into inventory (plant_id, change_type, quantity, note) values ($1, 'sale', $2, $3)",
        [item.plantId, -item.quantity, `Sale order ${orderNumber}`]
      );
    }

    await query("COMMIT");

    // Retrieve full order with items
    const fullOrderRes = await query(
      `select o.*,
         (select json_agg(oi.*) from customer_order_items oi where oi.order_id = o.id) as items
       from customer_orders o
       where o.id = $1`,
      [orderId]
    );

    res.status(201).json({ data: fullOrderRes.rows[0] });

  } catch (error: any) {
    await query("ROLLBACK");
    res.status(400).json({ message: error.message || "Checkout failed" });
  }
}));

// 7. POST /api/demo/orders/:id/confirm
router.post("/orders/:id/confirm", asyncHandler(async (req, res) => {
  const result = await query(
    "update customer_orders set status = 'confirmed', updated_at = now() where id = $1 returning *",
    [req.params.id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json({ data: result.rows[0] });
}));

// 8. POST /api/demo/orders/:id/cancel (Cancel Order & Restore Stock)
router.post("/orders/:id/cancel", asyncHandler(async (req, res) => {
  await query("BEGIN");

  try {
    // 1. Get order details and current status
    const orderRes = await query<{ status: string; order_number: string }>(
      "select status, order_number from customer_orders where id = $1 for update",
      [req.params.id]
    );

    const order = orderRes.rows[0];
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === "cancelled") {
      throw new Error("Order is already cancelled");
    }

    // 2. Get order items
    const itemsRes = await query<{ plant_id: string; quantity: number }>(
      "select plant_id, quantity from customer_order_items where order_id = $1",
      [req.params.id]
    );

    // 3. Update status
    await query(
      "update customer_orders set status = 'cancelled', payment_status = 'refunded', updated_at = now() where id = $1",
      [req.params.id]
    );

    // 4. Restore stock
    for (const item of itemsRes.rows) {
      if (item.plant_id) {
        await query(
          `update plants
           set stock_quantity = stock_quantity + $2,
               status = 'available'::plant_status,
               updated_at = now()
           where id = $1`,
          [item.plant_id, item.quantity]
        );

        // Add inventory record
        await query(
          "insert into inventory (plant_id, change_type, quantity, note) values ($1, 'return', $2, $3)",
          [item.plant_id, item.quantity, `Cancelled order ${order.order_number}`]
        );
      }
    }

    await query("COMMIT");

    const fullOrderRes = await query(
      `select o.*,
         (select json_agg(oi.*) from customer_order_items oi where oi.order_id = o.id) as items
       from customer_orders o
       where o.id = $1`,
      [req.params.id]
    );

    res.json({ data: fullOrderRes.rows[0] });

  } catch (error: any) {
    await query("ROLLBACK");
    res.status(400).json({ message: error.message || "Cancellation failed" });
  }
}));

// 9. PATCH /api/demo/plants/:id/stock (Adjust Plant Stock Level)
router.patch("/plants/:id/stock", asyncHandler(async (req, res) => {
  const input = z.object({ change: z.number().int() }).parse(req.body);

  // 1. Get current stock
  const plantRes = await query<{ stock_quantity: number }>("select stock_quantity from plants where id = $1", [req.params.id]);
  if (plantRes.rows.length === 0) {
    return res.status(404).json({ message: "Plant not found" });
  }

  const newStock = Math.max(0, plantRes.rows[0].stock_quantity + input.change);
  const status = newStock > 0 ? "available" : "out_of_stock";

  // 2. Update stock
  await query(
    "update plants set stock_quantity = $2, status = $3::plant_status, updated_at = now() where id = $1",
    [req.params.id, newStock, status]
  );

  // 3. Log in inventory
  await query(
    "insert into inventory (plant_id, change_type, quantity, note) values ($1, 'adjustment', $2, 'Manual admin adjustment')",
    [req.params.id, input.change]
  );

  res.json({ success: true, stockQuantity: newStock });
}));

// 10. PUT /api/demo/plants/:id (Update plant details)
router.put("/plants/:id", asyncHandler(async (req, res) => {
  const input = z.object({
    name: z.string().min(2),
    scientificName: z.string().optional().nullable(),
    categoryId: z.string().uuid(),
    description: z.string().min(5),
    price: z.number().nonnegative(),
    discountPrice: z.number().nonnegative().optional().nullable(),
    stockQuantity: z.number().int().nonnegative(),
    type: z.enum(["indoor", "outdoor"]),
    sunlightRequirement: z.string().min(2),
    wateringFrequency: z.string().min(2),
    potSize: z.string().min(1),
    imageUrl: z.string().url().optional().nullable(),
  }).parse(req.body);

  const status = input.stockQuantity > 0 ? "available" : "out_of_stock";

  const result = await query(
    `update plants
     set name = $1, scientific_name = $2, category_id = $3, description = $4, price = $5,
         discount_price = $6, stock_quantity = $7, type = $8, sunlight_requirement = $9,
         watering_frequency = $10, pot_size = $11, status = $12, updated_at = now()
     where id = $13
     returning id`,
    [
      input.name,
      input.scientificName || "",
      input.categoryId,
      input.description,
      input.price,
      input.discountPrice || null,
      input.stockQuantity,
      input.type,
      input.sunlightRequirement,
      input.wateringFrequency,
      input.potSize,
      status,
      req.params.id,
    ]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Plant not found" });
  }

  if (input.imageUrl) {
    // Check if an image already exists for this plant
    const imgRes = await query("select id from plant_images where plant_id = $1 limit 1", [req.params.id]);
    if (imgRes.rows.length > 0) {
      await query("update plant_images set image_url = $1 where id = $2", [input.imageUrl, imgRes.rows[0].id]);
    } else {
      await query("insert into plant_images (plant_id, image_url, sort_order) values ($1,$2,0)", [req.params.id, input.imageUrl]);
    }
  }

  // Retrieve the full record
  const fullResult = await query(
    `select p.*, c.name as category_name, (select image_url from plant_images where plant_id = p.id order by sort_order asc limit 1) as image_url
     from plants p
     left join categories c on c.id = p.category_id
     where p.id = $1`,
    [req.params.id]
  );

  res.json({ data: fullResult.rows[0] });
}));

// 11. DELETE /api/demo/plants/:id (Delete plant product)
router.delete("/plants/:id", asyncHandler(async (req, res) => {
  await query("delete from plants where id = $1", [req.params.id]);
  res.json({ success: true });
}));

// 11. DELETE /api/demo/categories/:id (Delete category)
router.delete("/categories/:id", asyncHandler(async (req, res) => {
  await query("delete from categories where id = $1", [req.params.id]);
  res.json({ success: true });
}));

// 13. GET /api/demo/dashboard (Real live overview stats)
router.get("/dashboard", asyncHandler(async (_req, res) => {
  const [stats, recentOrders, revenueTrend] = await Promise.all([
    query(`
      select
        (select count(*) from customer_orders) as total_orders,
        (select coalesce(sum(total_amount), 0) from customer_orders where status != 'cancelled') as total_revenue,
        (select count(distinct coalesce(customer_email, user_id::text)) from customer_orders) as total_customers,
        (select count(*) from plants) as total_plants,
        (select count(*) from customer_orders where status in ('placed','confirmed','packed','shipped')) as pending_orders,
        (select count(*) from customer_orders where status = 'delivered') as delivered_orders,
        (select count(*) from plants where stock_quantity <= 5) as low_stock_plants
    `),
    query(`
      select o.*,
        (select json_agg(
          json_build_object(
            'id', oi.id,
            'plant_name', oi.plant_name,
            'quantity', oi.quantity
          )
        ) from customer_order_items oi where oi.order_id = o.id) as items
      from customer_orders o
      order by o.created_at desc
      limit 5
    `),
    query(`
      select to_char(created_at, 'Mon') as name, coalesce(sum(total_amount), 0) as revenue, count(id) as orders
      from customer_orders
      where status != 'cancelled'
      group by to_char(created_at, 'Mon'), date_trunc('month', created_at)
      order by date_trunc('month', created_at) asc
      limit 6
    `),
  ]);

  res.json({
    data: {
      stats: stats.rows[0],
      recentOrders: recentOrders.rows,
      revenue: revenueTrend.rows,
    }
  });
}));

// 14. GET /api/demo/customers (Real customer data aggregated from database)
router.get("/customers", asyncHandler(async (_req, res) => {
  const result = await query(`
    select 
      coalesce(customer_name, 'Guest Customer') as name,
      coalesce(customer_email, 'N/A') as email,
      count(id) as order_count,
      coalesce(sum(total_amount), 0) as total_spent,
      max(shipping_address) as address
    from customer_orders
    group by customer_name, customer_email
    order by total_spent desc
  `);
  res.json({ data: result.rows });
}));

// 15. GET /api/demo/analytics (Real analytics stats)
router.get("/analytics", asyncHandler(async (_req, res) => {
  const [topPlant, topCategory, topCustomer] = await Promise.all([
    query(`
      select plant_name, sum(quantity) as total_sold
      from customer_order_items
      group by plant_name
      order by total_sold desc
      limit 1
    `),
    query(`
      select c.name as category_name, count(oi.id) as item_count
      from customer_order_items oi
      join plants p on p.id = oi.plant_id
      join categories c on c.id = p.category_id
      group by c.name
      order by item_count desc
      limit 1
    `),
    query(`
      select customer_name, sum(total_amount) as total_spent
      from customer_orders
      where customer_name is not null
      group by customer_name
      order by total_spent desc
      limit 1
    `),
  ]);

  res.json({
    data: {
      bestSellingPlant: topPlant.rows[0]?.plant_name || "No sales yet",
      topCategory: topCategory.rows[0]?.category_name || "No sales yet",
      topCustomer: topCustomer.rows[0]?.customer_name || "No sales yet",
    }
  });
}));

export default router;
