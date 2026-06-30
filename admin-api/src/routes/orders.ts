import { Router } from "express";
import { z } from "zod";
import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

const router = Router();
const orderStatuses = ["placed", "confirmed", "packed", "shipped", "delivered", "cancelled"] as const;

router.get("/", asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const status = req.query.status ? String(req.query.status) : null;
  const search = `%${String(req.query.search ?? "")}%`;

  const result = await query(
    `select o.*, c.name as customer_name, c.email as customer_email
     from orders o
     left join customers c on c.id = o.customer_id
     where ($1::text is null or o.status = $1)
       and (o.order_number ilike $2 or c.name ilike $2 or c.email ilike $2)
     order by o.created_at desc
     limit $3 offset $4`,
    [status, search, limit, offset],
  );

  res.json({ data: result.rows, meta: { page, limit } });
}));

router.patch("/:id/status", asyncHandler(async (req, res) => {
  const input = z.object({ status: z.enum(orderStatuses) }).parse(req.body);
  await query("update orders set status=$2, updated_at=now() where id=$1", [req.params.id, input.status]);
  res.json({ message: "Order status updated" });
}));

router.post("/:id/cancel", asyncHandler(async (req, res) => {
  await query("update orders set status='cancelled', updated_at=now() where id=$1", [req.params.id]);
  res.json({ message: "Order cancelled" });
}));

router.get("/export.csv", asyncHandler(async (_req, res) => {
  const result = await query<{
    order_number: string;
    total_amount: string;
    payment_status: string;
    status: string;
    created_at: string;
  }>("select order_number,total_amount,payment_status,status,created_at from orders order by created_at desc");
  const rows = result.rows.map((row) =>
    [row.order_number, row.total_amount, row.payment_status, row.status, row.created_at].join(","),
  );
  res.type("text/csv").send(["Order Number,Total,Payment,Status,Date", ...rows].join("\n"));
}));

export default router;
