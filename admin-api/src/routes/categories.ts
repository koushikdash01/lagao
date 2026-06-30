import { Router } from "express";
import { z } from "zod";
import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
});

router.get("/", asyncHandler(async (_req, res) => {
  const result = await query("select * from categories order by name asc");
  res.json({ data: result.rows });
}));

router.post("/", asyncHandler(async (req, res) => {
  const input = schema.parse(req.body);
  const result = await query<{ id: string }>(
    "insert into categories (name, description, image_url, status) values ($1,$2,$3,$4) returning id",
    [input.name, input.description, input.imageUrl, input.status],
  );
  res.status(201).json({ id: result.rows[0].id });
}));

router.put("/:id", asyncHandler(async (req, res) => {
  const input = schema.parse(req.body);
  await query(
    "update categories set name=$2, description=$3, image_url=$4, status=$5, updated_at=now() where id=$1",
    [req.params.id, input.name, input.description, input.imageUrl, input.status],
  );
  res.json({ message: "Category updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await query("delete from categories where id=$1", [req.params.id]);
  res.json({ message: "Category deleted" });
}));

export default router;
