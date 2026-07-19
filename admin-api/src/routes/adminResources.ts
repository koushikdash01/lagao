import { Router } from "express";
import { z } from "zod";
import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export function createAdminResourceRouter(table: string, schema: z.ZodObject<z.ZodRawShape>) {
  const router = Router();

  router.get("/", asyncHandler(async (_req, res) => {
    const result = await query(`select * from ${table} order by created_at desc`);
    res.json({ data: result.rows });
  }));

  router.post("/", asyncHandler(async (req, res) => {
    const input = schema.parse(req.body);
    const keys = Object.keys(input);
    const columns = keys.map((key) => key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`));
    const values = keys.map((key) => (input as Record<string, unknown>)[key]);
    const placeholders = keys.map((_, index) => `$${index + 1}`);
    const result = await query<{ id: string }>(
      `insert into ${table} (${columns.join(",")}) values (${placeholders.join(",")}) returning id`,
      values,
    );
    res.status(201).json({ id: result.rows[0].id });
  }));

  router.put("/:id", asyncHandler(async (req, res) => {
    const input = schema.parse(req.body);
    const keys = Object.keys(input);
    const values = keys.map((key) => (input as Record<string, unknown>)[key]);
    const assignments = keys
      .map((key, index) => `${key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)}=$${index + 2}`)
      .join(",");
    await query(`update ${table} set ${assignments}, updated_at=now() where id=$1`, [req.params.id, ...values]);
    res.json({ message: "Resource updated" });
  }));

  router.delete("/:id", asyncHandler(async (req, res) => {
    await query(`delete from ${table} where id=$1`, [req.params.id]);
    res.json({ message: "Resource deleted" });
  }));

  return router;
}

export const couponSchema = z.object({
  code: z.string().min(3),
  discountType: z.enum(["flat", "percentage"]),
  discountValue: z.number().positive(),
  expiryDate: z.string(),
  minimumOrderAmount: z.number().nonnegative().default(0),
  isActive: z.boolean().default(true),
  categoryId: z.string().uuid().optional().nullable(),
  plantId: z.string().uuid().optional().nullable(),
});

export const reviewSchema = z.object({
  plantId: z.string().uuid(),
  customerId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(2),
  reply: z.string().optional().nullable(),
  status: z.enum(["pending", "approved", "hidden"]).default("pending"),
});

export const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().url(),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
