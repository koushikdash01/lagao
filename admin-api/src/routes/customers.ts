import { Router } from "express";
import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

const router = Router();

router.get("/", asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const search = `%${String(req.query.search ?? "")}%`;
  const result = await query(
    `select c.*, coalesce(sum(o.total_amount), 0) as total_spending, count(o.id) as order_count
     from customers c
     left join orders o on o.customer_id = c.id
     where c.name ilike $1 or c.email ilike $1 or c.phone ilike $1
     group by c.id
     order by c.created_at desc
     limit $2 offset $3`,
    [search, limit, offset],
  );
  res.json({ data: result.rows, meta: { page, limit } });
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const [customer, orders] = await Promise.all([
    query("select * from customers where id=$1", [req.params.id]),
    query("select * from orders where customer_id=$1 order by created_at desc", [req.params.id]),
  ]);
  res.json({ customer: customer.rows[0], orders: orders.rows });
}));

export default router;
