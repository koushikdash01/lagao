import { Router } from "express";
import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(async (_req, res) => {
  const [stats, recentOrders, revenue] = await Promise.all([
    query(`
      select
        (select count(*) from orders) as total_orders,
        (select coalesce(sum(total_amount), 0) from orders where payment_status = 'paid') as total_revenue,
        (select count(*) from customers) as total_customers,
        (select count(*) from plants) as total_plants,
        (select count(*) from orders where status in ('placed','confirmed','packed','shipped')) as pending_orders,
        (select count(*) from orders where status = 'delivered') as delivered_orders,
        (select count(*) from plants where stock_quantity <= 5) as low_stock_plants
    `),
    query(`
      select o.id, o.order_number, c.name as customer_name, o.total_amount, o.status, o.created_at
      from orders o
      left join customers c on c.id = o.customer_id
      order by o.created_at desc
      limit 8
    `),
    query(`
      select date_trunc('day', created_at)::date as date, coalesce(sum(total_amount), 0) as revenue
      from orders
      where payment_status = 'paid' and created_at >= now() - interval '30 days'
      group by 1
      order by 1
    `),
  ]);

  res.json({ stats: stats.rows[0], recentOrders: recentOrders.rows, revenue: revenue.rows });
}));

export default router;
