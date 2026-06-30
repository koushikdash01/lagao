import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { metrics, recentOrders, revenue } from "../data/mockData";
import { Card, DataTable, PageHeader, StatusPill } from "../components/ui";

export function Dashboard() {
  return (
    <>
      <PageHeader title="Dashboard" description="A live overview of Lagao orders, revenue, customers, inventory, and operational alerts." />

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
            <select className="rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-white/10">
              <option>Monthly</option>
              <option>Daily</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#3ca55c" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3ca55c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d7ded3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3ca55c" fill="url(#revenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <DataTable
          columns={["Order ID", "Customer", "Items", "Total", "Status"]}
          rows={recentOrders.map((order) => [
            <strong>{order.id}</strong>,
            order.customer,
            order.items,
            order.total,
            <StatusPill value={order.status} />,
          ])}
        />
      </section>
    </>
  );
}
