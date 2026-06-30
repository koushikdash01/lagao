import { Router } from "express";
import { z } from "zod";
import { query } from "../config/db.js";
import { requireUser } from "../middleware/userAuth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(requireUser);

router.get("/cart", asyncHandler(async (req, res) => {
  const result = await query(
    `select ci.*, p.name, p.price, p.discount_price, p.stock_quantity
     from cart_items ci join plants p on p.id=ci.plant_id
     where ci.user_id=$1 order by ci.created_at desc`,
    [req.user!.sub],
  );
  res.json({ data: result.rows });
}));

router.post("/cart", asyncHandler(async (req, res) => {
  const input = z.object({ plantId: z.string().uuid(), quantity: z.number().int().positive() }).parse(req.body);
  await query(
    `insert into cart_items (user_id, plant_id, quantity)
     values ($1,$2,$3)
     on conflict (user_id, plant_id) do update set quantity = cart_items.quantity + excluded.quantity, updated_at=now()`,
    [req.user!.sub, input.plantId, input.quantity],
  );
  res.status(201).json({ message: "Added to cart" });
}));

router.patch("/cart/:plantId", asyncHandler(async (req, res) => {
  const input = z.object({ quantity: z.number().int().nonnegative() }).parse(req.body);
  if (input.quantity === 0) {
    await query("delete from cart_items where user_id=$1 and plant_id=$2", [req.user!.sub, req.params.plantId]);
  } else {
    await query("update cart_items set quantity=$3, updated_at=now() where user_id=$1 and plant_id=$2", [req.user!.sub, req.params.plantId, input.quantity]);
  }
  res.json({ message: "Cart updated" });
}));

router.get("/wishlist", asyncHandler(async (req, res) => {
  const result = await query("select wi.*, p.name, p.price from wishlist_items wi join plants p on p.id=wi.plant_id where wi.user_id=$1", [req.user!.sub]);
  res.json({ data: result.rows });
}));

router.post("/wishlist", asyncHandler(async (req, res) => {
  const input = z.object({ plantId: z.string().uuid() }).parse(req.body);
  await query("insert into wishlist_items (user_id, plant_id) values ($1,$2) on conflict do nothing", [req.user!.sub, input.plantId]);
  res.status(201).json({ message: "Added to wishlist" });
}));

router.delete("/wishlist/:plantId", asyncHandler(async (req, res) => {
  await query("delete from wishlist_items where user_id=$1 and plant_id=$2", [req.user!.sub, req.params.plantId]);
  res.json({ message: "Removed from wishlist" });
}));

router.get("/addresses", asyncHandler(async (req, res) => {
  const result = await query("select * from user_addresses where user_id=$1 order by is_default desc, created_at desc", [req.user!.sub]);
  res.json({ data: result.rows });
}));

router.post("/checkout", asyncHandler(async (req, res) => {
  const input = z.object({
    addressId: z.string().uuid(),
    paymentMethod: z.enum(["upi", "card", "net_banking", "cod"]),
    couponCode: z.string().optional(),
  }).parse(req.body);
  const result = await query<{ id: string; order_number: string }>(
    `insert into customer_orders (order_number, user_id, shipping_address_id, payment_method, status, payment_status, total_amount)
     values ('LG-' || floor(random()*1000000)::text, $1, $2, $3, 'placed', $4, 0)
     returning id, order_number`,
    [req.user!.sub, input.addressId, input.paymentMethod, input.paymentMethod === "cod" ? "pending" : "paid"],
  );
  res.status(201).json({ order: result.rows[0], couponCode: input.couponCode });
}));

router.get("/orders", asyncHandler(async (req, res) => {
  const result = await query("select * from customer_orders where user_id=$1 order by created_at desc", [req.user!.sub]);
  res.json({ data: result.rows });
}));

router.post("/reviews", asyncHandler(async (req, res) => {
  const input = z.object({ plantId: z.string().uuid(), rating: z.number().int().min(1).max(5), comment: z.string().min(3) }).parse(req.body);
  await query("insert into reviews (plant_id, user_id, rating, comment, status) values ($1,$2,$3,$4,'pending')", [input.plantId, req.user!.sub, input.rating, input.comment]);
  res.status(201).json({ message: "Review submitted" });
}));

router.get("/notifications", asyncHandler(async (req, res) => {
  const result = await query("select * from notifications where user_id=$1 order by created_at desc limit 50", [req.user!.sub]);
  res.json({ data: result.rows });
}));

export default router;
