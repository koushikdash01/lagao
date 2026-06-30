import { Router } from "express";
import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

const router = Router();

router.get("/homepage", asyncHandler(async (_req, res) => {
  const [featured, bestSellers, categories, banners] = await Promise.all([
    query("select * from plants where is_featured=true and status='available' order by created_at desc limit 8"),
    query("select * from plants where status='available' order by stock_quantity asc limit 8"),
    query("select * from categories where status='active' order by name"),
    query("select * from banners where is_active=true order by sort_order asc limit 5"),
  ]);
  res.json({
    hero: {
      title: "Bring nature home",
      subtitle: "Premium indoor and outdoor plants delivered with care.",
      offer: "Seasonal greens up to 25% off",
    },
    featured: featured.rows,
    bestSellers: bestSellers.rows,
    newArrivals: featured.rows,
    trending: bestSellers.rows,
    categories: categories.rows,
    banners: banners.rows,
  });
}));

router.get("/plants", asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const search = `%${String(req.query.search ?? "")}%`;
  const categoryId = req.query.categoryId ? String(req.query.categoryId) : null;
  const type = req.query.type ? String(req.query.type) : null;
  const availability = req.query.availability ? String(req.query.availability) : null;
  const minPrice = Number(req.query.minPrice ?? 0);
  const maxPrice = Number(req.query.maxPrice ?? 999999);
  const sortMap = {
    newest: "p.created_at desc",
    "price-low": "p.price asc",
    "price-high": "p.price desc",
    popularity: "p.created_at desc",
    rating: "rating desc nulls last",
  } as const;
  const sort = sortMap[String(req.query.sort ?? "newest") as keyof typeof sortMap] ?? sortMap.newest;
  const result = await query(
    `select p.*, c.name as category_name, coalesce(avg(r.rating), 0) as rating
     from plants p
     left join categories c on c.id = p.category_id
     left join reviews r on r.plant_id = p.id and r.status = 'approved'
     where p.name ilike $1
       and ($2::text is null or p.category_id = $2::uuid)
       and ($3::text is null or p.type = $3::plant_type)
       and ($4::text is null or p.status = $4::plant_status)
       and p.price between $5 and $6
     group by p.id, c.name
     order by ${sort}
     limit $7 offset $8`,
    [search, categoryId, type, availability, minPrice, maxPrice, limit, offset],
  );
  res.json({ data: result.rows, meta: { page, limit } });
}));

router.get("/plants/:id", asyncHandler(async (req, res) => {
  const [plant, images, reviews, similar] = await Promise.all([
    query("select p.*, c.name as category_name from plants p left join categories c on c.id=p.category_id where p.id=$1", [req.params.id]),
    query("select * from plant_images where plant_id=$1 order by sort_order", [req.params.id]),
    query("select r.*, u.name as user_name from reviews r left join users u on u.id=r.user_id where r.plant_id=$1 and r.status='approved' order by r.created_at desc", [req.params.id]),
    query("select * from plants where id <> $1 and status='available' order by created_at desc limit 4", [req.params.id]),
  ]);
  res.json({ plant: plant.rows[0], images: images.rows, reviews: reviews.rows, similar: similar.rows });
}));

router.get("/categories", asyncHandler(async (_req, res) => {
  const result = await query("select * from categories where status='active' order by name");
  res.json({ data: result.rows });
}));

export default router;
