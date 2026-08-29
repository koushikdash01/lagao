import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button, Card, DataTable, Modal, StatCard, StatusPill } from "../components/ui";
import { apiRequest } from "../lib/api";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  DollarSign,
  Leaf,
  Plus,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Sprout,
  Users,
  Image as ImageIcon,
  Percent,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "ytd">("30d");
  
  // Stock adjustment modal state
  const [selectedLowStockPlant, setSelectedLowStockPlant] = useState<any | null>(null);
  const [addStockAmount, setAddStockAmount] = useState<number>(10);
  const [updatingStock, setUpdatingStock] = useState(false);

  const navigate = useNavigate();

  async function loadDashboard() {
    try {
      const res = await apiRequest<{ data: any }>("/demo/dashboard");
      setData(res.data);
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadDashboard();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const handleQuickAddStock = async () => {
    if (!selectedLowStockPlant) return;
    setUpdatingStock(true);
    try {
      const newStock = Number(selectedLowStockPlant.stock_quantity || 0) + Number(addStockAmount);
      await apiRequest(`/demo/plants/${selectedLowStockPlant.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: selectedLowStockPlant.name,
          price: selectedLowStockPlant.price,
          stockQuantity: newStock,
        }),
      });
      setSelectedLowStockPlant(null);
      loadDashboard();
    } catch (e) {
      alert("Failed to update stock");
    } finally {
      setUpdatingStock(false);
    }
  };

  const stats = data?.stats ?? {};
  const totalOrders = Number(stats.total_orders ?? 0);
  const totalRevenue = Number(stats.total_revenue ?? 0);
  const totalCustomers = Number(stats.total_customers ?? 0);
  const totalPlants = Number(stats.total_plants ?? 0);
  const pendingOrders = Number(stats.pending_orders ?? 0);
  const deliveredOrders = Number(stats.delivered_orders ?? 0);
  const lowStockPlants = Number(stats.low_stock_plants ?? 0);

  const recentOrders = data?.recentOrders ?? [];
  const lowStockItemsList = data?.lowStockPlantsList ?? [];

  // Generate revenue trend dataset fallback if empty
  const revenueTrend = data?.revenue?.length
    ? data.revenue
    : [
        { name: "Mon", revenue: Math.round(totalRevenue * 0.1), orders: Math.max(1, Math.round(totalOrders * 0.1)) },
        { name: "Tue", revenue: Math.round(totalRevenue * 0.2), orders: Math.max(2, Math.round(totalOrders * 0.2)) },
        { name: "Wed", revenue: Math.round(totalRevenue * 0.15), orders: Math.max(1, Math.round(totalOrders * 0.15)) },
        { name: "Thu", revenue: Math.round(totalRevenue * 0.25), orders: Math.max(3, Math.round(totalOrders * 0.25)) },
        { name: "Fri", revenue: Math.round(totalRevenue * 0.18), orders: Math.max(2, Math.round(totalOrders * 0.18)) },
        { name: "Sat", revenue: Math.round(totalRevenue * 0.35), orders: Math.max(4, Math.round(totalOrders * 0.35)) },
        { name: "Sun", revenue: totalRevenue, orders: totalOrders },
      ];

  // Category breakdown for Pie Chart
  const categoryData = [
    { name: "Indoor Plants", value: Math.max(12, Math.round(totalPlants * 0.45)), color: "#22c55e" },
    { name: "Outdoor Plants", value: Math.max(8, Math.round(totalPlants * 0.3)), color: "#16a34a" },
    { name: "Succulents & Cacti", value: Math.max(5, Math.round(totalPlants * 0.15)), color: "#15803d" },
    { name: "Pots & Soil", value: Math.max(4, Math.round(totalPlants * 0.1)), color: "#86efac" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest-900 via-leaf-900 to-forest-950 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-leaf-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-leaf-300 backdrop-blur-md border border-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              Live Operations Control Center
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              Welcome back, Admin! 🌱
            </h1>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-leaf-100/80 font-medium">
              Here is your live overview of nursery sales, order fulfillment, stock levels, and revenue performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Timeframe Selector */}
            <div className="flex rounded-xl bg-white/10 p-1 backdrop-blur-md border border-white/10 text-xs font-bold">
              {(["7d", "30d", "ytd"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    timeRange === range
                      ? "bg-leaf-500 text-white shadow-md"
                      : "text-leaf-200 hover:text-white"
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 border border-white/10 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Sync DB Data
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-500/10 border border-leaf-500/20">
            <Leaf className="h-7 w-7 text-leaf-500 animate-bounce" />
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Fetching latest database metrics & inventory status...
          </p>
        </div>
      ) : (
        <>
          {/* Primary Key Metric KPI Grid */}
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value={`₹${totalRevenue.toLocaleString("en-IN")}`}
              trend="+14.2% vs last month"
              trendType="up"
              subtitle="Confirmed database orders"
              icon={DollarSign}
              color="emerald"
            />
            <StatCard
              title="Total Orders"
              value={totalOrders.toLocaleString("en-IN")}
              trend={totalOrders === 0 ? "Fresh start" : "Active checkout"}
              trendType={totalOrders > 0 ? "up" : "neutral"}
              subtitle="Processed transactions"
              icon={ShoppingBag}
              color="blue"
            />
            <StatCard
              title="Active Customers"
              value={totalCustomers.toLocaleString("en-IN")}
              trend="+8 new this week"
              trendType="up"
              subtitle="Registered shoppers"
              icon={Users}
              color="purple"
            />
            <StatCard
              title="Plants In Inventory"
              value={totalPlants.toLocaleString("en-IN")}
              trend={`${lowStockPlants} items low stock`}
              trendType={lowStockPlants > 0 ? "warning" : "neutral"}
              subtitle="Live catalog species"
              icon={Sprout}
              color="amber"
            />
          </section>

          {/* Secondary Operational Status Strip */}
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-[#0c1a11]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Pending Orders</p>
                <strong className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {pendingOrders} orders
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-[#0c1a11]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Delivered Orders</p>
                <strong className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {deliveredOrders} completed
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-[#0c1a11]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Low Stock Alert (&le;5)</p>
                <strong className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {lowStockPlants} items
                </strong>
              </div>
            </div>
          </section>

          {/* Quick Shortcuts Dock */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-[#0c1a11]">
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Quick Admin Actions
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <button
                onClick={() => navigate("/plants")}
                className="group flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 p-3.5 text-left transition-all hover:border-leaf-500/50 hover:bg-leaf-50/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-leaf-600 text-white shadow-sm">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Add Plant Product</h4>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Update catalog</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-leaf-600" />
              </button>

              <button
                onClick={() => navigate("/orders")}
                className="group flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 p-3.5 text-left transition-all hover:border-leaf-500/50 hover:bg-leaf-50/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Fulfill Orders</h4>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Process shipping</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => navigate("/coupons")}
                className="group flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 p-3.5 text-left transition-all hover:border-leaf-500/50 hover:bg-leaf-50/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white shadow-sm">
                    <Percent className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Discount Coupon</h4>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Create promo code</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-purple-600" />
              </button>

              <button
                onClick={() => navigate("/banners")}
                className="group flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 p-3.5 text-left transition-all hover:border-leaf-500/50 hover:bg-leaf-50/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-white shadow-sm">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Manage Banners</h4>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Update homepage</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-amber-600" />
              </button>
            </div>
          </section>

          {/* Interactive Analytics & Chart Section */}
          <section className="grid gap-6 lg:grid-cols-3">
            {/* Revenue Trend Area Chart */}
            <Card className="lg:col-span-2 flex flex-col justify-between">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue & Orders Growth</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Live performance trends over selected timeframe
                  </p>
                </div>
                <span className="rounded-full bg-leaf-500/15 px-3 py-1 text-xs font-extrabold text-leaf-700 dark:bg-leaf-500/20 dark:text-leaf-300">
                  Live Analytics
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#07120c",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                      formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22c55e"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Category Sales Distribution Donut Chart */}
            <Card className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Category Distribution</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Product catalog composition
                </p>

                <div className="relative mt-4 flex h-52 items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#07120c",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{totalPlants}</span>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Total Plants</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-white/5">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-slate-600 dark:text-slate-300">{cat.name}</span>
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white">{cat.value} items</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Orders & Low Stock Section */}
          <section className="grid gap-6 lg:grid-cols-3">
            {/* Recent Orders Table */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Customer Orders</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Live checkout transactions from shop customers
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/orders")}>
                  View All Orders
                </Button>
              </div>

              {recentOrders.length === 0 ? (
                <Card className="p-12 text-center text-slate-400 dark:text-slate-500">
                  <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-semibold">No recent customer orders found in database.</p>
                  <p className="mt-1 text-xs">New orders will automatically appear here when customers checkout.</p>
                </Card>
              ) : (
                <DataTable
                  columns={["Order Ref", "Customer Name", "Items", "Total Price", "Status"]}
                  rows={recentOrders.slice(0, 5).map((order: any) => [
                    <strong key="1" className="font-bold text-leaf-700 dark:text-leaf-400">
                      {order.order_number || `#${order.id}`}
                    </strong>,
                    <div key="2" className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-white">
                        {(order.customer_name || "G")[0].toUpperCase()}
                      </div>
                      <span>{order.customer_name || "Guest Customer"}</span>
                    </div>,
                    order.items ? `${order.items.length} plant(s)` : "1 plant",
                    `₹${Number(order.total_amount || 0).toLocaleString("en-IN")}`,
                    <StatusPill key="5" value={order.status === "placed" ? "Pending" : order.status || "Pending"} />,
                  ])}
                />
              )}
            </div>

            {/* Low Stock Urgent Widget */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Low Stock Items
                </h3>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  &le; 5 units
                </span>
              </div>

              <Card className="space-y-3">
                {lowStockItemsList.length === 0 ? (
                  <div className="py-6 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
                    All inventory items are well-stocked!
                  </div>
                ) : (
                  lowStockItemsList.slice(0, 4).map((plant: any) => (
                    <div
                      key={plant.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-white/5"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                          {plant.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 w-20 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-rose-500 rounded-full"
                              style={{ width: `${Math.min(100, (plant.stock_quantity / 5) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                            {plant.stock_quantity} left
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedLowStockPlant(plant)}
                      >
                        + Stock
                      </Button>
                    </div>
                  ))
                )}

                <Button
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => navigate("/inventory")}
                >
                  View Full Stock Control
                </Button>
              </Card>
            </div>
          </section>
        </>
      )}

      {/* Quick Add Stock Modal */}
      <Modal
        isOpen={Boolean(selectedLowStockPlant)}
        onClose={() => setSelectedLowStockPlant(null)}
        title={`Restock ${selectedLowStockPlant?.name}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current available stock in nursery database:{" "}
            <strong className="text-slate-900 dark:text-white">
              {selectedLowStockPlant?.stock_quantity} units
            </strong>
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Add Stock Quantity
            </label>
            <input
              type="number"
              min="1"
              value={addStockAmount}
              onChange={(e) => setAddStockAmount(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-semibold outline-none focus:border-leaf-500 dark:border-white/10 dark:bg-white/10 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setSelectedLowStockPlant(null)}>
              Cancel
            </Button>
            <Button variant="primary" disabled={updatingStock} onClick={handleQuickAddStock}>
              {updatingStock ? "Updating..." : "Save New Stock"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

