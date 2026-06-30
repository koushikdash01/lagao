import { Router } from "express";
import { z } from "zod";
import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

const router = Router();

const plantSchema = z.object({
  name: z.string().min(2),
  scientificName: z.string().optional().nullable(),
  categoryId: z.string().uuid(),
  description: z.string().min(10),
  price: z.number().nonnegative(),
  discountPrice: z.number().nonnegative().optional().nullable(),
  stockQuantity: z.number().int().nonnegative(),
  type: z.enum(["indoor", "outdoor"]),
  sunlightRequirement: z.string().min(2),
  wateringFrequency: z.string().min(2),
  potSize: z.string().min(1),
  isFeatured: z.boolean().default(false),
  status: z.enum(["available", "out_of_stock"]).default("available"),
  imageUrls: z.array(z.string().url()).default([]),
});

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page, limit, offset } = getPagination(req.query);
    const search = `%${String(req.query.search ?? "")}%`;
    const categoryId = req.query.categoryId ? String(req.query.categoryId) : null;
    const sortMap = {
      price: "p.price",
      stock: "p.stock_quantity",
      date: "p.created_at",
    } as const;
    const sort = sortMap[String(req.query.sortBy ?? "date") as keyof typeof sortMap] ?? "p.created_at";

    const plants = await query(
      `select p.*, c.name as category_name
       from plants p
       left join categories c on c.id = p.category_id
       where ($1::text is null or p.category_id = $1::uuid)
         and p.name ilike $2
       order by ${sort} desc
       limit $3 offset $4`,
      [categoryId, search, limit, offset],
    );

    const count = await query<{ count: string }>(
      "select count(*) from plants where ($1::text is null or category_id = $1::uuid) and name ilike $2",
      [categoryId, search],
    );

    res.json({ data: plants.rows, meta: { page, limit, total: Number(count.rows[0].count) } });
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = plantSchema.parse(req.body);
    const result = await query<{ id: string }>(
      `insert into plants
       (name, scientific_name, category_id, description, price, discount_price, stock_quantity, type,
        sunlight_requirement, watering_frequency, pot_size, is_featured, status)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       returning id`,
      [
        input.name,
        input.scientificName,
        input.categoryId,
        input.description,
        input.price,
        input.discountPrice,
        input.stockQuantity,
        input.type,
        input.sunlightRequirement,
        input.wateringFrequency,
        input.potSize,
        input.isFeatured,
        input.status,
      ],
    );

    for (const [index, url] of input.imageUrls.entries()) {
      await query("insert into plant_images (plant_id, image_url, sort_order) values ($1,$2,$3)", [
        result.rows[0].id,
        url,
        index,
      ]);
    }

    res.status(201).json({ id: result.rows[0].id });
  }),
);

router.patch(
  "/bulk",
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        ids: z.array(z.string().uuid()).min(1),
        status: z.enum(["available", "out_of_stock"]).optional(),
        isFeatured: z.boolean().optional(),
      })
      .parse(req.body);

    await query(
      `update plants
       set status = coalesce($2, status),
           is_featured = coalesce($3, is_featured),
           updated_at = now()
       where id = any($1::uuid[])`,
      [input.ids, input.status, input.isFeatured],
    );

    res.json({ message: "Plants updated" });
  }),
);

router.delete(
  "/bulk",
  asyncHandler(async (req, res) => {
    const input = z.object({ ids: z.array(z.string().uuid()).min(1) }).parse(req.body);
    await query("delete from plants where id = any($1::uuid[])", [input.ids]);
    res.json({ message: "Plants deleted" });
  }),
);

router.put("/:id", asyncHandler(async (req, res) => {
  const input = plantSchema.parse(req.body);
  await query(
    `update plants set name=$2, scientific_name=$3, category_id=$4, description=$5, price=$6,
     discount_price=$7, stock_quantity=$8, type=$9, sunlight_requirement=$10,
     watering_frequency=$11, pot_size=$12, is_featured=$13, status=$14, updated_at=now()
     where id=$1`,
    [
      req.params.id,
      input.name,
      input.scientificName,
      input.categoryId,
      input.description,
      input.price,
      input.discountPrice,
      input.stockQuantity,
      input.type,
      input.sunlightRequirement,
      input.wateringFrequency,
      input.potSize,
      input.isFeatured,
      input.status,
    ],
  );
  res.json({ message: "Plant updated" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  await query("delete from plants where id = $1", [req.params.id]);
  res.json({ message: "Plant deleted" });
}));

export default router;
