import { useEffect, useState } from "react";
import { Download, Plus, Trash2, X, RefreshCw, Edit, Leaf } from "lucide-react";
import { Button, Card, DataTable, PageHeader, StatusPill } from "../components/ui";
import { apiRequest } from "../lib/api";

export function PlantsPage() {
  const [plants, setPlants] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState<any | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(299);
  const [discountPrice, setDiscountPrice] = useState<number | "">("");
  const [stockQuantity, setStockQuantity] = useState(10);
  const [type, setType] = useState<"indoor" | "outdoor">("indoor");
  const [sunlight, setSunlight] = useState("Bright indirect");
  const [watering, setWatering] = useState("Water weekly");
  const [potSize, setPotSize] = useState("6 inch");
  const [imageUrl, setImageUrl] = useState("");

  const resetForm = () => {
    setName("");
    setScientificName("");
    setCategoryId(categories[0]?.id || "");
    setDescription("");
    setPrice(299);
    setDiscountPrice("");
    setStockQuantity(10);
    setType("indoor");
    setSunlight("Bright indirect");
    setWatering("Water weekly");
    setPotSize("6 inch");
    setImageUrl("");
  };

  const handleOpenEdit = (plant: any) => {
    setEditingPlant(plant);
    setName(plant.name);
    setScientificName(plant.scientific_name || "");
    setCategoryId(plant.category_id || "");
    setDescription(plant.description || "");
    setPrice(Number(plant.price));
    setDiscountPrice(plant.discount_price ? Number(plant.discount_price) : "");
    setStockQuantity(plant.stock_quantity);
    setType(plant.type || "indoor");
    setSunlight(plant.sunlight_requirement || "Bright indirect");
    setWatering(plant.watering_frequency || "Water weekly");
    setPotSize(plant.pot_size || "6 inch");
    setImageUrl(plant.image_url || "");
  };

  const handleEditPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest(`/demo/plants/${editingPlant.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          scientificName: scientificName || null,
          categoryId,
          description,
          price,
          discountPrice: discountPrice === "" ? null : Number(discountPrice),
          stockQuantity,
          type,
          sunlightRequirement: sunlight,
          wateringFrequency: watering,
          potSize,
          imageUrl: imageUrl || null,
        }),
      });
      setEditingPlant(null);
      resetForm();
      loadData();
    } catch (e) {
      alert("Failed to update plant");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [plantsRes, catsRes] = await Promise.all([
        apiRequest<{ data: any[] }>("/demo/plants"),
        apiRequest<{ data: any[] }>("/demo/categories"),
      ]);
      setPlants(plantsRes.data);
      setCategories(catsRes.data);
      if (catsRes.data.length > 0 && !categoryId) {
        setCategoryId(catsRes.data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/demo/plants", {
        method: "POST",
        body: JSON.stringify({
          name,
          scientificName: scientificName || null,
          categoryId,
          description,
          price,
          discountPrice: discountPrice === "" ? null : Number(discountPrice),
          stockQuantity,
          type,
          sunlightRequirement: sunlight,
          wateringFrequency: watering,
          potSize,
          imageUrl: imageUrl || null,
        }),
      });
      setShowAddModal(false);
      // Reset form
      setName("");
      setScientificName("");
      setDescription("");
      setImageUrl("");
      loadData();
    } catch (e) {
      alert("Failed to add plant");
    }
  };

  const handleAdjustStock = async (id: string, change: number) => {
    try {
      await apiRequest(`/demo/plants/${id}/stock`, {
        method: "PATCH",
        body: JSON.stringify({ change }),
      });
      setPlants(prev =>
        prev.map(p => {
          if (p.id === id) {
            const newStock = Math.max(0, p.stock_quantity + change);
            return {
              ...p,
              stock_quantity: newStock,
              status: newStock > 0 ? "available" : "out_of_stock",
            };
          }
          return p;
        })
      );
    } catch (e) {
      alert("Failed to update stock");
    }
  };

  const [deletingPlant, setDeletingPlant] = useState<any | null>(null);

  const confirmDeletePlant = async () => {
    if (!deletingPlant) return;
    const id = deletingPlant.id;
    try {
      await apiRequest(`/demo/plants/${id}`, { method: "DELETE" });
      setPlants(prev => prev.filter(p => p.id !== id));
      setDeletingPlant(null);
    } catch (e: any) {
      console.error("Failed to delete plant:", e);
      alert(e?.message || "Failed to delete plant");
      setDeletingPlant(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Plant Management"
        description="Create, edit, search, and manage live plant inventory in the PostgreSQL database."
        action={
          <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
            <Plus className="mr-2 inline h-4 w-4" />Add Plant
          </Button>
        }
      />
      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-3">
          <Leaf className="h-10 w-10 animate-bounce text-leaf-500" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading plants...</span>
        </div>
      ) : (
        <DataTable
          columns={["Plant", "Category", "Price", "Stock", "Status", "Actions"]}
          rows={plants.map((plant) => [
            <div className="flex items-center gap-3">
              {plant.image_url && <img src={plant.image_url} alt="" className="h-10 w-10 rounded object-cover" />}
              <div>
                <strong>{plant.name}</strong>
                {plant.scientific_name && <p className="text-xs italic text-slate-400">{plant.scientific_name}</p>}
              </div>
            </div>,
            plant.category_name || "Other Greens",
            `Rs. ${plant.discount_price ?? plant.price}`,
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAdjustStock(plant.id, -1)}
                className="h-7 w-7 rounded bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center font-bold text-sm select-none dark:text-white"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{plant.stock_quantity}</span>
              <button
                type="button"
                onClick={() => handleAdjustStock(plant.id, 1)}
                className="h-7 w-7 rounded bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center font-bold text-sm select-none dark:text-white"
              >
                +
              </button>
            </div>,
            <StatusPill value={plant.stock_quantity > 0 ? "Available" : "Out of Stock"} />,
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => alert(`Details:\nDescription: ${plant.description}\nSunlight: ${plant.sunlight_requirement}\nWatering: ${plant.watering_frequency}`)}>Details</Button>
              <Button variant="secondary" onClick={() => handleOpenEdit(plant)}><Edit className="h-4 w-4" /></Button>
              <Button variant="danger" onClick={() => setDeletingPlant(plant)}><Trash2 className="h-4 w-4" /></Button>
            </div>,
          ])}
        />
      )}

      {(showAddModal || editingPlant) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900 overflow-y-auto max-h-[90vh]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold dark:text-white">{editingPlant ? "Edit Plant" : "Add New Plant"}</h3>
              <button onClick={() => { setShowAddModal(false); setEditingPlant(null); resetForm(); }}><X className="h-6 w-6 dark:text-white" /></button>
            </div>
            <form onSubmit={editingPlant ? handleEditPlant : handleAddPlant} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Plant Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" placeholder="e.g. Snake Plant" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Scientific Name</label>
                <input value={scientificName} onChange={(e) => setScientificName(e.target.value)} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" placeholder="e.g. Sansevieria trifasciata" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Category</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded border px-3 py-2 dark:bg-slate-800 dark:text-white">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Description</label>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" rows={3} placeholder="Describe the plant..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Price (Rs.)</label>
                  <input required type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Discount Price (Rs.)</label>
                  <input type="number" min="0" step="0.01" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value === "" ? "" : Number(e.target.value))} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" placeholder="Optional" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Stock Quantity</label>
                  <input required type="number" min="0" value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value))} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value as "indoor" | "outdoor")} className="w-full rounded border px-3 py-2 dark:bg-slate-800 dark:text-white">
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Sunlight Requirement</label>
                  <input value={sunlight} onChange={(e) => setSunlight(e.target.value)} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" placeholder="e.g. Low to bright indirect" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Watering Frequency</label>
                  <input value={watering} onChange={(e) => setWatering(e.target.value)} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" placeholder="e.g. Every 2-3 weeks" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Pot Size</label>
                <input value={potSize} onChange={(e) => setPotSize(e.target.value)} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" placeholder="e.g. 6 inch" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Image URL</label>
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" placeholder="https://..." />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => { setShowAddModal(false); setEditingPlant(null); resetForm(); }}>Cancel</Button>
                <Button type="submit">{editingPlant ? "Update Plant" : "Save Plant"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingPlant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Plant</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete <strong className="text-slate-800 dark:text-white">{deletingPlant.name}</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeletingPlant(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDeletePlant}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deletingCategory, setDeletingCategory] = useState<any | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ data: any[] }>("/demo/categories");
      setCategories(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/demo/categories", {
        method: "POST",
        body: JSON.stringify({ name, description }),
      });
      setShowAddModal(false);
      setName("");
      setDescription("");
      loadCategories();
    } catch (e) {
      alert("Failed to add category");
    }
  };

  const confirmDeleteCategory = async () => {
    if (!deletingCategory) return;
    const id = deletingCategory.id;
    try {
      await apiRequest(`/demo/categories/${id}`, { method: "DELETE" });
      setCategories(prev => prev.filter(c => c.id !== id));
      setDeletingCategory(null);
    } catch (e: any) {
      console.error("Failed to delete category:", e);
      alert(e?.message || "Failed to delete category");
      setDeletingCategory(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Category Management"
        description="Manage plant categories in the database."
        action={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 inline h-4 w-4" />Add Category
          </Button>
        }
      />
      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-3">
          <Leaf className="h-10 w-10 animate-bounce text-leaf-500" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading categories...</span>
        </div>
      ) : (
        <DataTable
          columns={["Category", "Description", "Status", "Actions"]}
          rows={categories.map((c) => [
            <strong>{c.name}</strong>,
            c.description || "Curated storefront collection",
            <StatusPill value="Active" />,
            <div className="flex gap-2">
              <Button variant="danger" onClick={() => setDeletingCategory(c)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ])}
        />
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold dark:text-white">Add New Category</h3>
              <button onClick={() => setShowAddModal(false)}><X className="h-6 w-6 dark:text-white" /></button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Category Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" placeholder="e.g. Succulents" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" rows={3} placeholder="Category details..." />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit">Save Category</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Category</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete <strong className="text-slate-800 dark:text-white">{deletingCategory.name}</strong>? All plants in this category will be shifted to 'Other Greens'.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeletingCategory(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDeleteCategory}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function InventoryPage() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlants = async () => {
    try {
      const res = await apiRequest<{ data: any[] }>("/demo/plants");
      setPlants(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlants();
  }, []);

  return (
    <>
      <PageHeader title="Inventory Monitor" description="Monitor real stock counts, low stock alerts, and catalog availability." />
      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-3">
          <Leaf className="h-10 w-10 animate-bounce text-leaf-500" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading inventory...</span>
        </div>
      ) : (
        <DataTable
          columns={["Plant", "Current Stock", "Alert Status", "Last Update"]}
          rows={plants.map((plant) => [
            plant.name,
            plant.stock_quantity,
            <StatusPill value={plant.stock_quantity === 0 ? "Out of Stock" : plant.stock_quantity <= 5 ? "Pending" : "Available"} />,
            new Date(plant.updated_at).toLocaleTimeString()
          ])}
        />
      )}
    </>
  );
}

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ data: any[] }>("/demo/orders");
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleConfirm = async (id: string) => {
    try {
      await apiRequest(`/demo/orders/${id}/confirm`, { method: "POST" });
      loadOrders();
    } catch (e) {
      alert("Failed to confirm order");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await apiRequest(`/demo/orders/${id}/cancel`, { method: "POST" });
      loadOrders();
    } catch (e) {
      alert("Failed to cancel order");
    }
  };

  return (
    <>
      <PageHeader title="Order Management" description="Manage database customer purchases, confirm orders, or cancel them to restore inventory." />
      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-3">
          <Leaf className="h-10 w-10 animate-bounce text-leaf-500" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading orders...</span>
        </div>
      ) : (
        <DataTable
          columns={["Order No.", "Plants Ordered", "Total", "Payment Method", "Status", "Date", "Actions"]}
          rows={orders.map((o) => [
            <strong>{o.order_number}</strong>,
            <div className="space-y-1">
              {o.items && o.items.map((item: any, idx: number) => (
                <p key={idx} className="text-xs">{item.plant_name} (x{item.quantity})</p>
              ))}
            </div>,
            `Rs. ${o.total_amount}`,
            o.payment_method.toUpperCase(),
            <StatusPill value={o.status === "placed" ? "Pending" : o.status === "confirmed" ? "Active" : o.status === "cancelled" ? "Out of Stock" : o.status} />,
            new Date(o.created_at).toLocaleDateString(),
            <div className="flex gap-2">
              {o.status === "placed" && (
                <>
                  <Button variant="primary" className="py-1 text-xs" onClick={() => handleConfirm(o.id)}>Confirm</Button>
                  <Button variant="danger" className="py-1 text-xs" onClick={() => handleCancel(o.id)}>Cancel</Button>
                </>
              )}
              {o.status === "confirmed" && (
                <Button variant="danger" className="py-1 text-xs" onClick={() => handleCancel(o.id)}>Cancel Order</Button>
              )}
              {o.status === "cancelled" && (
                <span className="text-xs text-slate-400 italic">No actions available</span>
              )}
            </div>
          ])}
        />
      )}
    </>
  );
}

export function CustomersPage() {
  return (
    <>
      <PageHeader title="Customer Management" description="Search customers, view contact details, purchase history, addresses, and total spending." />
      <DataTable columns={["Customer", "Email", "Phone", "Address", "Orders", "Total Spending"]} rows={[["Koushik Dash", "koushik@email.com", "+91 98765 43210", "Kolkata, WB", 1, "Rs. 899"]]} />
    </>
  );
}

export function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<any | null>(null);

  // Form states
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"flat" | "percentage">("percentage");
  const [discountValue, setDiscountValue] = useState(10);
  const [expiryDate, setExpiryDate] = useState("");
  const [minimumOrderAmount, setMinimumOrderAmount] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  // Selective Coupon states
  const [appliesTo, setAppliesTo] = useState<"all" | "category" | "plant">("all");
  const [categoryId, setCategoryId] = useState("");
  const [plantId, setPlantId] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [couponsRes, catsRes, plantsRes] = await Promise.all([
        apiRequest<{ data: any[] }>("/coupons"),
        apiRequest<{ data: any[] }>("/demo/categories"),
        apiRequest<{ data: any[] }>("/demo/plants")
      ]);
      setCoupons(couponsRes.data);
      setCategories(catsRes.data);
      setPlants(plantsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setCode("");
    setDiscountType("percentage");
    setDiscountValue(10);
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    setExpiryDate(nextMonth.toISOString().split("T")[0]);
    setMinimumOrderAmount(0);
    setIsActive(true);
    setAppliesTo("all");
    setCategoryId(categories[0]?.id || "");
    setPlantId(plants[0]?.id || "");
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscountType(coupon.discount_type || "percentage");
    setDiscountValue(Number(coupon.discount_value));
    setExpiryDate(coupon.expiry_date.split("T")[0]);
    setMinimumOrderAmount(Number(coupon.minimum_order_amount || 0));
    setIsActive(coupon.is_active);
    
    if (coupon.category_id) {
      setAppliesTo("category");
      setCategoryId(coupon.category_id);
      setPlantId(plants[0]?.id || "");
    } else if (coupon.plant_id) {
      setAppliesTo("plant");
      setPlantId(coupon.plant_id);
      setCategoryId(categories[0]?.id || "");
    } else {
      setAppliesTo("all");
      setCategoryId(categories[0]?.id || "");
      setPlantId(plants[0]?.id || "");
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/coupons", {
        method: "POST",
        body: JSON.stringify({
          code,
          discountType,
          discountValue,
          expiryDate,
          minimumOrderAmount,
          isActive,
          categoryId: appliesTo === "category" ? categoryId : null,
          plantId: appliesTo === "plant" ? plantId : null,
        }),
      });
      setShowAddModal(false);
      resetForm();
      loadData();
    } catch (e) {
      alert("Failed to add coupon");
    }
  };

  const handleEditCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest(`/coupons/${editingCoupon.id}`, {
        method: "PUT",
        body: JSON.stringify({
          code,
          discountType,
          discountValue,
          expiryDate,
          minimumOrderAmount,
          isActive,
          categoryId: appliesTo === "category" ? categoryId : null,
          plantId: appliesTo === "plant" ? plantId : null,
        }),
      });
      setEditingCoupon(null);
      resetForm();
      loadData();
    } catch (e) {
      alert("Failed to update coupon");
    }
  };

  const confirmDeleteCoupon = async () => {
    if (!deletingCoupon) return;
    const id = deletingCoupon.id;
    try {
      await apiRequest(`/coupons/${id}`, { method: "DELETE" });
      setCoupons(prev => prev.filter(c => c.id !== id));
      setDeletingCoupon(null);
    } catch (e: any) {
      console.error("Failed to delete coupon:", e);
      alert(e?.message || "Failed to delete coupon");
      setDeletingCoupon(null);
    }
  };

  const getAppliesToText = (c: any) => {
    if (c.category_id) {
      const cat = categories.find(cat => cat.id === c.category_id);
      return `Category: ${cat ? cat.name : "Unknown Category"}`;
    }
    if (c.plant_id) {
      const plant = plants.find(p => p.id === c.plant_id);
      return `Plant: ${plant ? plant.name : "Unknown Plant"}`;
    }
    return "All Items (Global)";
  };

  return (
    <>
      <PageHeader
        title="Coupon Management"
        description="Create, edit, and manage flat or percentage coupons with selective plant/category applicability, expiry, min order, and active status."
        action={
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 inline h-4 w-4" />Add Coupon
          </Button>
        }
      />
      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-3">
          <Leaf className="h-10 w-10 animate-bounce text-leaf-500" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading coupons...</span>
        </div>
      ) : (
        <DataTable
          columns={["Code", "Type", "Value", "Expiry", "Applies To", "Minimum Order", "Status", "Actions"]}
          rows={coupons.map((c) => [
            <strong>{c.code}</strong>,
            c.discount_type === "percentage" ? "Percentage" : "Flat Amount",
            c.discount_type === "percentage" ? `${c.discount_value}%` : `Rs. ${c.discount_value}`,
            new Date(c.expiry_date).toLocaleDateString(),
            <span className="text-xs font-bold text-slate-500">{getAppliesToText(c)}</span>,
            `Rs. ${c.minimum_order_amount || 0}`,
            <StatusPill value={c.is_active ? "Active" : "Out of Stock"} />,
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => handleOpenEdit(c)}><Edit className="h-4 w-4" /></Button>
              <Button variant="danger" onClick={() => setDeletingCoupon(c)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ])}
        />
      )}

      {(showAddModal || editingCoupon) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900 overflow-y-auto max-h-[90vh]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold dark:text-white">{editingCoupon ? "Edit Coupon" : "Add New Coupon"}</h3>
              <button onClick={() => { setShowAddModal(false); setEditingCoupon(null); resetForm(); }}><X className="h-6 w-6 dark:text-white" /></button>
            </div>
            <form onSubmit={editingCoupon ? handleEditCoupon : handleAddCoupon} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Coupon Code</label>
                <input required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="w-full rounded border px-3 py-2 font-mono dark:bg-transparent dark:text-white" placeholder="e.g. SAVE20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Discount Type</label>
                  <select value={discountType} onChange={(e) => setDiscountType(e.target.value as "percentage" | "flat")} className="w-full rounded border px-3 py-2 dark:bg-slate-800 dark:text-white">
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Discount Value</label>
                  <input required type="number" min="0" step="0.01" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Applies To</label>
                <select value={appliesTo} onChange={(e) => setAppliesTo(e.target.value as "all" | "category" | "plant")} className="w-full rounded border px-3 py-2 dark:bg-slate-800 dark:text-white">
                  <option value="all">All Items (Global)</option>
                  <option value="category">Specific Category</option>
                  <option value="plant">Specific Plant</option>
                </select>
              </div>

              {appliesTo === "category" && (
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Select Category</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded border px-3 py-2 dark:bg-slate-800 dark:text-white">
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {appliesTo === "plant" && (
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Select Plant</label>
                  <select value={plantId} onChange={(e) => setPlantId(e.target.value)} className="w-full rounded border px-3 py-2 dark:bg-slate-800 dark:text-white">
                    {plants.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Expiry Date</label>
                  <input required type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Min Order Amount (Rs.)</label>
                  <input type="number" min="0" value={minimumOrderAmount} onChange={(e) => setMinimumOrderAmount(Number(e.target.value))} className="w-full rounded border px-3 py-2 dark:bg-transparent dark:text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded" />
                <label htmlFor="isActive" className="text-sm font-semibold dark:text-slate-200">Active Coupon</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => { setShowAddModal(false); setEditingCoupon(null); resetForm(); }}>Cancel</Button>
                <Button type="submit">{editingCoupon ? "Update Coupon" : "Save Coupon"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Coupon</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete coupon <strong className="text-slate-800 dark:text-white">{deletingCoupon.code}</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeletingCoupon(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDeleteCoupon}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ReviewsPage() {
  return <ResourcePage title="Reviews Management" description="Approve, hide, delete, and reply to product reviews from customers." columns={["Plant", "Customer", "Rating", "Review", "Status"]} rows={[["Snake Plant", "Koushik Dash", "5/5", "Healthy plant and fast delivery", <StatusPill value="Pending" />]]} />;
}

export function BannersPage() {
  return <ResourcePage title="Banner Management" description="Upload banners, add promotional text, schedule visibility, manage sliders, and feature plants." columns={["Title", "Image", "Schedule", "Sort", "Status"]} rows={[["Monsoon Greens", "banner.jpg", "Jun 1 - Jul 15", 1, <StatusPill value="Active" />]]} />;
}

export function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" description="Monthly revenue, orders by month, best-selling plants, customer growth, revenue by category, and top customers." />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Best-selling plant", value: "Snake Plant" },
          { label: "Top category", value: "Indoor Plants" },
          { label: "Customer growth", value: "+16.2%" },
          { label: "Top customer", value: "Koushik Dash" },
        ].map((item) => <Card key={item.label}><p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p><strong className="mt-2 block text-xl">{item.value}</strong></Card>)}
      </section>
    </>
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
