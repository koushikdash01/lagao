import { Download, Plus, Trash2 } from "lucide-react";
import { analytics, plants, recentOrders } from "../data/mockData";
import { Button, Card, DataTable, PageHeader, StatusPill } from "../components/ui";

const categories = ["Indoor Plants", "Outdoor Plants", "Flowering Plants", "Succulents", "Air Purifying Plants", "Pots & Accessories"];

export function PlantsPage() {
  return (
    <>
      <PageHeader title="Plant Management" description="Create, edit, search, filter, sort, bulk update, and bulk delete plant products." action={<Button><Plus className="mr-2 inline h-4 w-4" />Add Plant</Button>} />
      <Toolbar />
      <DataTable
        columns={["Select", "Plant", "Category", "Price", "Stock", "Status", "Actions"]}
        rows={plants.map((plant) => [
          <input type="checkbox" className="h-4 w-4 rounded" />,
          <strong>{plant.name}</strong>,
          plant.category,
          `Rs. ${plant.price}`,
          plant.stock,
          <StatusPill value={plant.status} />,
          <div className="flex gap-2"><Button variant="secondary">Edit</Button><Button variant="danger"><Trash2 className="h-4 w-4" /></Button></div>,
        ])}
      />
    </>
  );
}

export function CategoriesPage() {
  return (
    <>
      <PageHeader title="Category Management" description="Manage category names, descriptions, images, and active status." action={<Button><Plus className="mr-2 inline h-4 w-4" />Add Category</Button>} />
      <DataTable columns={["Category", "Description", "Status", "Actions"]} rows={categories.map((category) => [<strong>{category}</strong>, "Curated storefront collection", <StatusPill value="Active" />, <Button variant="secondary">Edit</Button>])} />
    </>
  );
}

export function InventoryPage() {
  return (
    <>
      <PageHeader title="Inventory" description="Monitor current stock, low stock alerts, out-of-stock plants, stock history, and restocks." action={<Button>Restock</Button>} />
      <DataTable columns={["Plant", "Current Stock", "Alert", "Last Update", "Actions"]} rows={plants.map((plant) => [plant.name, plant.stock, <StatusPill value={plant.stock === 0 ? "Out of Stock" : plant.stock <= 5 ? "Pending" : "Available"} />, "Today", <Button variant="secondary">History</Button>])} />
    </>
  );
}

export function OrdersPage() {
  return (
    <>
      <PageHeader title="Order Management" description="Track order flow from placed to delivered, update statuses, cancel orders, invoice, search, filter, and export CSV." action={<Button variant="secondary"><Download className="mr-2 inline h-4 w-4" />Export CSV</Button>} />
      <Toolbar />
      <DataTable columns={["Order ID", "Customer", "Plants", "Quantity", "Total", "Payment", "Status", "Actions"]} rows={recentOrders.map((order) => [<strong>{order.id}</strong>, order.customer, "Mixed plants", order.items, order.total, <StatusPill value="Paid" />, <StatusPill value={order.status} />, <Button variant="secondary">Update</Button>])} />
    </>
  );
}

export function CustomersPage() {
  return (
    <>
      <PageHeader title="Customer Management" description="Search customers, view contact details, purchase history, addresses, and total spending." />
      <Toolbar />
      <DataTable columns={["Customer", "Email", "Phone", "Address", "Orders", "Total Spending", "Actions"]} rows={["Ananya Sen", "Ritwik Das", "Maya Roy", "Soham Dey"].map((name, index) => [<strong>{name}</strong>, `${name.toLowerCase().replace(" ", ".")}@email.com`, "+91 98765 43210", "Kolkata, WB", index + 2, `Rs. ${(index + 1) * 1240}`, <Button variant="secondary">View</Button>])} />
    </>
  );
}

export function CouponsPage() {
  return <ResourcePage title="Coupon Management" description="Create flat or percentage coupons with expiry date, minimum order amount, and active status." columns={["Code", "Type", "Value", "Expiry", "Minimum", "Status"]} rows={[["LAGAO10", "Percentage", "10%", "2026-08-31", "Rs. 499", <StatusPill value="Active" />]]} />;
}

export function ReviewsPage() {
  return <ResourcePage title="Reviews Management" description="Approve, hide, delete, and reply to product reviews from customers." columns={["Plant", "Customer", "Rating", "Review", "Status", "Actions"]} rows={[["Snake Plant", "Ananya Sen", "5/5", "Healthy plant and fast delivery", <StatusPill value="Pending" />, <Button variant="secondary">Reply</Button>]]} />;
}

export function BannersPage() {
  return <ResourcePage title="Banner Management" description="Upload banners, add promotional text, schedule visibility, manage sliders, and feature plants." columns={["Title", "Image", "Schedule", "Sort", "Status"]} rows={[["Monsoon Greens", "banner.jpg", "Jun 1 - Jul 15", 1, <StatusPill value="Active" />]]} />;
}

export function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" description="Monthly revenue, orders by month, best-selling plants, customer growth, revenue by category, and top customers." />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analytics.map((item) => <Card key={item.label}><p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p><strong className="mt-2 block text-xl">{item.value}</strong></Card>)}
      </section>
    </>
  );
}

function Toolbar() {
  return (
    <Card className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <input className="rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10" placeholder="Search..." />
      <div className="flex flex-wrap gap-2">
        <select className="rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-white/10"><option>All Categories</option></select>
        <select className="rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-white/10"><option>Sort by date</option><option>Sort by price</option><option>Sort by stock</option></select>
        <Button variant="secondary">Bulk Update</Button>
        <Button variant="danger">Bulk Delete</Button>
      </div>
    </Card>
  );
}

function ResourcePage({ title, description, columns, rows }: { title: string; description: string; columns: string[]; rows: React.ReactNode[][] }) {
  return (
    <>
      <PageHeader title={title} description={description} action={<Button><Plus className="mr-2 inline h-4 w-4" />Create</Button>} />
      <DataTable columns={columns} rows={rows} />
    </>
  );
}
