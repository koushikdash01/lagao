import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, DataTable, PageHeader, StatusPill } from "../components/ui";
import { apiRequest } from "../lib/api";
import { Leaf } from "lucide-react";

export function Dashboard() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const res = await apiRequest<{ data: any }>("/demo/dashboard");
        setData(res.data);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const stats = data?.stats ?? {};
  const totalOrders = Number(stats.total_orders ?? 0);
  const totalRevenue = Number(stats.total_revenue ?? 0);
  const totalCustomers = Number(stats.total_customers ?? 0);
  const totalPlants = Number(stats.total_plants ?? 0);
  const pendingOrders = Number(stats.pending_orders ?? 0);
  const deliveredOrders = Number(stats.delivered_orders ?? 0);
  const lowStockPlants = Number(stats.low_stock_plants ?? 0);

  const metrics = [
    { label: "Total Orders", value: totalOrders.toLocaleString(), trend: totalOrders === 0 ? "Fresh start" : "Live" },
    { label: "Total Revenue", value: `Rs. ${totalRevenue.toLocaleString()}`, trend: totalRevenue === 0 ? "Fresh start" : "Live" },
    { label: "Total Customers", value: totalCustomers.toLocaleString(), trend: totalCustomers === 0 ? "Fresh start" : "Live" },
    { label: "Total Plants in Inventory", value: totalPlants.toLocaleString(), trend: `${totalPlants} available` },
    { label: "Pending Orders", value: pendingOrders.toLocaleString(), trend: pendingOrders > 0 ? "Requires action" : "All processed" },
    { label: "Delivered Orders", value: deliveredOrders.toLocaleString(), trend: "Completed" },
    { label: "Low Stock Plants (<= 5)", value: lowStockPlants.toLocaleString(), trend: lowStockPlants > 0 ? "Needs review" : "In stock" },
  ];

  const recentOrders = data?.recentOrders ?? [];
  const revenueTrend = data?.revenue?.length ? data.revenue : [{ name: "Start", revenue: totalRevenue, orders: totalOrders }];

  return (
    <>
      <PageHeader title="Dashboard" description="Real-time live overview of database orders, revenue, customers, inventory, and operational metrics." />

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <Leaf className="h-10 w-10 animate-bounce text-leaf-500" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading live database metrics...</span>
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <Card key={metric.label}>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{metric.label}</p>
                <div className="mt-3 flex items-end justify-between">
                  <strong className="text-2xl font-bold text-leaf-900 dark:text-white">{metric.value}</strong>
                  <span className="text-xs font-bold text-leaf-500">{metric.trend}</span>
                </div>
              </Card>
            ))}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card className="min-h-[360px]">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold">Revenue Trend</h3>
                <span className="text-xs font-semibold text-slate-500">Live Database Analytics</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend}>
                    <defs>
                      <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#3ca55c" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#3ca55c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d7ded3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#3ca55c" fill="url(#revenue)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div>
              <h3 className="mb-3 text-lg font-bold">Recent Customer Orders</h3>
              {recentOrders.length === 0 ? (
                <div className="rounded-lg bg-white p-8 text-center shadow-soft dark:bg-white/10 text-slate-500 text-sm">
                  🌱 No orders placed yet. Orders will appear here live when customers checkout.
                </div>
              ) : (
                <DataTable
                  columns={["Order No.", "Customer", "Items", "Total", "Status"]}
                  rows={recentOrders.map((order: any) => [
                    <strong>{order.order_number}</strong>,
                    order.customer_name || "Guest Customer",
                    order.items ? `${order.items.length} item(s)` : "1 item",
                    `Rs. ${order.total_amount}`,
                    <StatusPill value={order.status === "placed" ? "Pending" : order.status} />,
                  ])}
                />
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}
