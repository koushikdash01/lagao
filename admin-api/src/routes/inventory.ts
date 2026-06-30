import { Router } from "express";
import { z } from "zod";
import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(async (_req, res) => {
  const result = await query(`
    select p.id, p.name, p.stock_quantity, p.status,
      case when p.stock_quantity = 0 then 'out_of_stock'
           when p.stock_quantity <= 5 then 'low_stock'
           else 'healthy' end as stock_state
    from plants p
    order by p.stock_quantity asc
  `);
  res.json({ data: result.rows });
}));

router.post("/restock", asyncHandler(async (req, res) => {
  const input = z.object({
    plantId: z.string().uuid(),
    quantity: z.number().int().positive(),
    note: z.string().optional().nullable(),
  }).parse(req.body);

  await query("begin");
  await query("update plants set stock_quantity = stock_quantity + $2, status='available', updated_at=now() where id=$1", [
    input.plantId,
    input.quantity,
  ]);
  await query("insert into inventory (plant_id, change_type, quantity, note) values ($1,'restock',$2,$3)", [
    input.plantId,
    input.quantity,
    input.note,
  ]);
  await query("commit");

  res.json({ message: "Stock updated" });
}));

router.get("/:plantId/history", asyncHandler(async (req, res) => {
  const result = await query("select * from inventory where plant_id=$1 order by created_at desc", [req.params.plantId]);
  res.json({ data: result.rows });
}));

export default router;
