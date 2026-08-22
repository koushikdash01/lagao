import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  Bell,
  Check,
  ChevronRight,
  Clock,
  Droplets,
  Edit3,
  Heart,
  Leaf,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Trash2,
  Truck,
  User,
  X
} from "lucide-react";
import { plants } from "../data/catalog";
import { PlantCard, SectionHeader } from "../components/ui";
import { useStore } from "../lib/store";

export function Wishlist() {
  const { wishlist, addToCart, toggleWishlist } = useStore();

  return (
    <main className="mx-auto w-full max-w-7xl px-3.5 py-6 sm:px-6 lg:px-8 overflow-x-hidden">
      <SectionHeader
        title="My Wishlist"
        subtitle={`You have ${wishlist.length} plant${wishlist.length === 1 ? "" : "s"} saved in your wishlist.`}
      />
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 sm:p-12 text-center shadow-soft dark:bg-white/10">
          <Heart className="h-14 w-14 sm:h-16 sm:w-16 text-slate-300 dark:text-slate-600 mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">Your wishlist is empty</h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md">
            Explore our curated catalog and tap the heart icon to save your favorite plants for later!
          </p>
          <Link
            to="/catalog"
            className="mt-5 rounded-xl bg-leaf-500 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-leaf-600 shadow-md"
          >
            Explore Plant Catalog →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((plant) => (
            <div key={plant.id} className="flex flex-col justify-between min-w-0">
              <PlantCard plant={plant} />
              <button
                onClick={() => {
                  addToCart(plant);
                  toggleWishlist(plant);
                }}
                className="mt-2 w-full rounded-xl bg-leaf-900 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-leaf-950 shadow-sm flex items-center justify-center gap-1.5"
              >
                <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export function Orders() {
  const demoOrders = [
    {
      id: "LG-84920",
      date: "Aug 20, 2026",
      status: "Out for Delivery",
      statusColor: "text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300",
      total: 1299,
      items: [
        { name: "Monstera Deliciosa", image: plants[0]?.image || "", qty: 1, price: 699 },
        { name: "Snake Plant Zeylanica", image: plants[1]?.image || "", qty: 1, price: 499 }
      ],
      estimatedDelivery: "Today by 6:00 PM"
    },
    {
      id: "LG-71044",
      date: "Aug 12, 2026",
      status: "Delivered",
      statusColor: "text-blue-700 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300",
      total: 799,
      items: [{ name: "Areca Palm Air Purifier", image: plants[2]?.image || "", qty: 1, price: 799 }],
      estimatedDelivery: "Delivered on Aug 14, 2026"
    }
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-3.5 py-6 sm:px-6 lg:px-8 overflow-x-hidden">
      <SectionHeader
        title="My Orders"
        subtitle="Track live order status, download tax invoices, and easily reorder your favorite plants."
      />
      <div className="space-y-3.5 sm:space-y-4">
        {demoOrders.map((order) => (
          <div
            key={order.id}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-all hover:shadow-md dark:border-white/10 dark:bg-white/10 min-w-0"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-3.5 py-2.5 sm:px-6 sm:py-3 dark:border-white/5 dark:bg-white/5">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="font-extrabold text-xs sm:text-base text-slate-900 dark:text-white">
                  Order #{order.id}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500">Placed on {order.date}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-bold ${order.statusColor}`}>
                  ● {order.status}
                </span>
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                  ₹{order.total}
                </span>
              </div>
            </div>

            <div className="p-3.5 sm:p-6">
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 gap-2.5 min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-11 w-11 sm:h-14 sm:w-14 rounded-xl object-cover shadow-sm shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-500">
                          Qty: {item.qty} · ₹{item.price} each
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white shrink-0">
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-100 pt-3 sm:pt-4 dark:border-white/5">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 truncate">
                  <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-leaf-500 shrink-0" />
                  <span className="truncate">{order.estimatedDelivery}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <button className="rounded-xl border border-slate-200 px-3 py-1 text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 transition">
                    Invoice
                  </button>
                  <button className="rounded-xl bg-leaf-500 px-3.5 py-1 text-[11px] sm:text-xs font-bold text-white hover:bg-leaf-600 transition shadow-sm">
                    Track
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export function Profile() {
  const navigate = useNavigate();
  const {
    wishlist,
    addresses,
    selectedAddressId,
    selectAddress,
    setDefaultAddress,
    addAddress,
    updateAddress,
    deleteAddress
  } = useStore();
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "orders" | "care" | "settings">("profile");

  // Editable Profile Form State
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Koushik Dash",
    email: "koushik@email.com",
    phone: "+91 98765 43210",
    experience: "Intermediate Green Parent",
    memberSince: "May 2025",
    bio: "Passionate about indoor monsteras, air-purifying foliage, and balcony gardens."
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState({
    type: "Home",
    name: "Koushik Dash",
    phone: "+91 98765 43210",
    line: "",
    city: "Kolkata",
    pin: "700091"
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingAddrId(null);
    setAddrForm({
      type: "Home",
      name: profileData.name || "Koushik Dash",
      phone: profileData.phone || "+91 98765 43210",
      line: "",
      city: "Kolkata",
      pin: "700091"
    });
    setAddrModalOpen(true);
  };

  const handleOpenEditModal = (addr: any) => {
    setEditingAddrId(addr.id);
    setAddrForm({
      type: addr.type,
      name: addr.name,
      phone: addr.phone,
      line: addr.line,
      city: addr.city,
      pin: addr.pin
    });
    setAddrModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.line || !addrForm.pin) return;
    if (editingAddrId) {
      updateAddress(editingAddrId, addrForm);
    } else {
      addAddress(addrForm);
    }
    setAddrModalOpen(false);
    setEditingAddrId(null);
  };


  const handleSetDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id
      }))
    );
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "orders", label: "Order History", icon: RotateCcw },
    { id: "care", label: "Care Routine", icon: Droplets },
    { id: "settings", label: "Settings", icon: Settings }
  ] as const;

  return (
    <main className="mx-auto w-full max-w-7xl px-3.5 py-6 sm:px-6 lg:px-8 overflow-x-hidden min-w-0">
      {/* Header Plant Parent Card */}
      <div className="relative mb-6 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-r from-[#12381e] via-[#1b5e20] to-[#25733d] p-4 sm:p-6 text-white shadow-xl min-w-0">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="relative shrink-0">
              <div className="flex h-14 w-14 sm:h-18 sm:w-18 items-center justify-center rounded-2xl bg-white/20 text-xl sm:text-2xl font-black shadow-inner ring-2 ring-white/30 backdrop-blur-md">
                KD
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-amber-400 text-slate-900 shadow-md">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h1 className="text-base sm:text-2xl font-black tracking-tight truncate">{profileData.name}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/25 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-200 backdrop-blur-sm ring-1 ring-emerald-300/40">
                  <Leaf className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Certified Parent
                </span>
              </div>
              <p className="mt-0.5 text-[11px] sm:text-sm text-white/80 truncate">{profileData.email} · {profileData.phone}</p>
              <p className="text-[10px] sm:text-[11px] text-white/60">Member since {profileData.memberSince}</p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full sm:w-auto">
            <div className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl bg-white/10 py-1.5 px-2 sm:px-3 sm:py-2.5 backdrop-blur-md border border-white/10 min-w-0">
              <span className="text-sm sm:text-lg font-black">12</span>
              <span className="text-[9px] sm:text-[10px] text-white/75 font-semibold truncate">Plants</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl bg-white/10 py-1.5 px-2 sm:px-3 sm:py-2.5 backdrop-blur-md border border-white/10 min-w-0">
              <span className="text-sm sm:text-lg font-black">{wishlist.length}</span>
              <span className="text-[9px] sm:text-[10px] text-white/75 font-semibold truncate">Wishlist</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl bg-white/10 py-1.5 px-2 sm:px-3 sm:py-2.5 backdrop-blur-md border border-white/10 min-w-0">
              <span className="text-sm sm:text-lg font-black text-amber-300 truncate">450 🪙</span>
              <span className="text-[9px] sm:text-[10px] text-white/75 font-semibold truncate">Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 animate-fadeIn">
          <Check className="h-4 w-4 shrink-0" />
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      {/* Main Layout: Sidebar Navigation + Tab Content */}
      <div className="grid gap-5 lg:grid-cols-[240px_1fr] min-w-0">
        
        {/* Navigation Tabs (Mobile Horizontal Scroll / Desktop Sidebar) */}
        <aside className="w-full min-w-0">
          {/* Mobile Pill Scroll */}
          <div className="flex w-full max-w-full overflow-x-auto overscroll-contain gap-2 pb-1.5 lg:hidden no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition shrink-0 ${
                    isActive
                      ? "bg-leaf-500 text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-white/10 dark:text-white border border-slate-200/60 dark:border-white/5"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:flex flex-col gap-1 rounded-2xl bg-white p-3 shadow-soft dark:bg-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
                    isActive
                      ? "bg-leaf-500 text-white shadow-sm"
                      : "text-slate-700 hover:bg-leaf-50 dark:text-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                </button>
              );
            })}

            <div className="my-1.5 border-t border-slate-100 dark:border-white/10" />

            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Tab Contents Area */}
        <section className="space-y-4 min-w-0">

          {/* TAB 1: Profile & Account Details */}
          {activeTab === "profile" && (
            <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-soft dark:bg-white/10 min-w-0">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 dark:border-white/10 gap-2">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    Personal Information
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                    Manage your contact details and bio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1 rounded-xl bg-leaf-50 px-3 py-1.5 text-xs font-bold text-leaf-700 hover:bg-leaf-100 dark:bg-white/10 dark:text-leaf-300 dark:hover:bg-white/20 transition shrink-0"
                >
                  {isEditing ? (
                    <>
                      <X className="h-3.5 w-3.5" /> Cancel
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </>
                  )}
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="mt-4 sm:mt-5 space-y-3.5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-500 dark:text-slate-400">
                      Full Name
                    </label>
                    <input
                      disabled={!isEditing}
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs sm:text-sm font-semibold outline-none focus:border-leaf-500 disabled:bg-slate-50/60 dark:border-white/10 dark:disabled:bg-white/5"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-500 dark:text-slate-400">
                      Email Address
                    </label>
                    <input
                      disabled={!isEditing}
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs sm:text-sm font-semibold outline-none focus:border-leaf-500 disabled:bg-slate-50/60 dark:border-white/10 dark:disabled:bg-white/5"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-500 dark:text-slate-400">
                      Phone Number
                    </label>
                    <input
                      disabled={!isEditing}
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs sm:text-sm font-semibold outline-none focus:border-leaf-500 disabled:bg-slate-50/60 dark:border-white/10 dark:disabled:bg-white/5"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-500 dark:text-slate-400">
                      Care Experience Level
                    </label>
                    <select
                      disabled={!isEditing}
                      value={profileData.experience}
                      onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold outline-none focus:border-leaf-500 disabled:bg-slate-50/60 dark:border-white/10 dark:bg-slate-900 dark:disabled:bg-white/5"
                    >
                      <option value="Beginner Green Parent">Beginner (Low maintenance)</option>
                      <option value="Intermediate Green Parent">Intermediate (Monstera, Palms)</option>
                      <option value="Advanced Horticulturist">Advanced (Rare Exotics)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500 dark:text-slate-400">
                    Plant Bio & Notes
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs sm:text-sm font-semibold outline-none focus:border-leaf-500 disabled:bg-slate-50/60 dark:border-white/10 dark:disabled:bg-white/5"
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1 rounded-xl bg-leaf-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-leaf-600 shadow-sm transition"
                    >
                      <Save className="h-3.5 w-3.5" /> Save
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: Saved Addresses */}
          {activeTab === "addresses" && (
            <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-soft dark:bg-white/10 min-w-0">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 dark:border-white/10 gap-2">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    Saved Addresses
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                    Manage delivery destinations for fast checkout.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-1 rounded-xl bg-leaf-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-leaf-600 shadow-sm transition shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>

              <div className="mt-4 sm:mt-5 grid gap-3 sm:grid-cols-2">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => selectAddress(addr.id)}
                      className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all cursor-pointer min-w-0 ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/80 dark:border-emerald-400/80 dark:bg-emerald-950/30 shadow-sm ring-1 ring-emerald-500/50 dark:ring-emerald-400/30 dark:shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                          : "border-slate-200/80 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="rounded-md bg-emerald-100/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border dark:border-emerald-500/20">
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-400/20 dark:text-amber-300 dark:border dark:border-amber-400/30">
                                Default
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {isSelected ? (
                              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-500/25 dark:border dark:border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                                <Check className="h-3 w-3 stroke-[3]" /> Selected
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectAddress(addr.id);
                                }}
                                className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition"
                              >
                                Select
                              </button>
                            )}
                          </div>
                        </div>

                        <h4 className="mt-2.5 font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {addr.name}
                        </h4>
                        <p className="mt-1 text-[11px] sm:text-xs text-slate-600 dark:text-slate-200 leading-relaxed">
                          {addr.line}, {addr.city} - {addr.pin}
                        </p>
                        <p className="mt-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                          📞 {addr.phone}
                        </p>
                      </div>

                      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-white/5 gap-2">
                        <div>
                          {!addr.isDefault ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDefaultAddress(addr.id);
                              }}
                              className="text-[11px] font-bold text-emerald-700 hover:underline dark:text-emerald-400"
                            >
                              Set Default
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-semibold">Primary Address</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(addr)}
                            className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20 transition"
                            title="Edit address"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteAddress(addr.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 transition"
                            title="Delete address"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add / Edit Address Modal */}
              {addrModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3.5 backdrop-blur-sm animate-fadeIn">
                  <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-[#102517] dark:text-white max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/10">
                      <h3 className="font-bold text-sm sm:text-base">
                        {editingAddrId ? "Edit Saved Address" : "Add New Address"}
                      </h3>
                      <button onClick={() => setAddrModalOpen(false)}>
                        <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveAddress} className="mt-3.5 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500">Address Label</label>
                        <select
                          value={addrForm.type}
                          onChange={(e) => setAddrForm({ ...addrForm, type: e.target.value })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs sm:text-sm dark:bg-slate-900"
                        >
                          <option value="Home">Home</option>
                          <option value="Work / Office">Work / Office</option>
                          <option value="Farmhouse / Garden">Farmhouse / Garden</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500">Recipient Name</label>
                        <input
                          required
                          placeholder="Full Name"
                          value={addrForm.name}
                          onChange={(e) => setAddrForm({ ...addrForm, name: e.target.value })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs sm:text-sm dark:bg-transparent"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500">Contact Phone</label>
                        <input
                          required
                          placeholder="Phone Number"
                          value={addrForm.phone}
                          onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs sm:text-sm dark:bg-transparent"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500">Street Address / Landmark</label>
                        <input
                          required
                          placeholder="House/Flat No, Street, Landmark"
                          value={addrForm.line}
                          onChange={(e) => setAddrForm({ ...addrForm, line: e.target.value })}
                          className="mt-1 w-full rounded-xl border p-2 text-xs sm:text-sm dark:bg-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-slate-500">City</label>
                          <input
                            required
                            value={addrForm.city}
                            onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                            className="mt-1 w-full rounded-xl border p-2 text-xs sm:text-sm dark:bg-transparent"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500">Postal Code</label>
                          <input
                            required
                            value={addrForm.pin}
                            onChange={(e) => setAddrForm({ ...addrForm, pin: e.target.value })}
                            className="mt-1 w-full rounded-xl border p-2 text-xs sm:text-sm dark:bg-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setAddrModalOpen(false)}
                          className="rounded-xl border px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-xl bg-leaf-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-leaf-600 shadow-sm"
                        >
                          {editingAddrId ? "Update Address" : "Save Address"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Order History */}
          {activeTab === "orders" && (
            <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-soft dark:bg-white/10 min-w-0">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 dark:border-white/10 gap-2">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    Order History
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                    Track shipments and past orders.
                  </p>
                </div>
                <Link
                  to="/orders"
                  className="text-xs font-bold text-leaf-600 hover:underline dark:text-leaf-400 shrink-0"
                >
                  Full Page →
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  {
                    id: "LG-84920",
                    date: "Aug 20, 2026",
                    status: "Out for Delivery",
                    statusColor: "text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300",
                    total: 1299,
                    item: "Monstera Deliciosa + 1 item",
                    image: plants[0]?.image
                  },
                  {
                    id: "LG-71044",
                    date: "Aug 12, 2026",
                    status: "Delivered",
                    statusColor: "text-blue-700 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300",
                    total: 799,
                    item: "Areca Palm Air Purifier",
                    image: plants[2]?.image
                  }
                ].map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-white/5 min-w-0"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={order.image}
                        alt=""
                        className="h-11 w-11 rounded-lg object-cover shadow-sm shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            #{order.id}
                          </span>
                          <span className={`rounded-full px-2 py-0.2 text-[9px] font-bold ${order.statusColor}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{order.item}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">₹{order.total}</p>
                      <Link to="/orders" className="text-[10px] font-bold text-leaf-600 dark:text-leaf-400 hover:underline">
                        Track →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Plant Care Routine */}
          {activeTab === "care" && (
            <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-soft dark:bg-white/10 min-w-0">
              <div className="border-b border-slate-100 pb-3 sm:pb-4 dark:border-white/10">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  My Plant Care Routine
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Customized watering and sunlight care guidelines.
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    name: "Monstera Deliciosa",
                    water: "Every 7-9 days",
                    sunlight: "Bright indirect",
                    status: "Water today 💧",
                    image: plants[0]?.image
                  },
                  {
                    name: "Snake Plant Zeylanica",
                    water: "Every 14 days",
                    sunlight: "Low to medium",
                    status: "Good for 5 days 🌿",
                    image: plants[1]?.image
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-white/5 dark:bg-white/5 min-w-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        💧 Water: {item.water}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        ☀️ {item.sunlight}
                      </p>
                      <span className="mt-1 inline-block rounded bg-leaf-100 px-1.5 py-0.2 text-[9px] font-bold text-leaf-800 dark:bg-leaf-950 dark:text-leaf-300">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Settings & Notifications */}
          {activeTab === "settings" && (
            <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-soft dark:bg-white/10 min-w-0">
              <div className="border-b border-slate-100 pb-3 sm:pb-4 dark:border-white/10">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Preferences & Settings
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Control notifications and preferences.
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:p-3.5 dark:border-white/5 dark:bg-white/5 gap-3">
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white truncate">
                      WhatsApp Delivery Updates
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      Tracking links sent to +91 98765 43210
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 sm:h-5 sm:w-5 accent-leaf-600 rounded shrink-0" />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:p-3.5 dark:border-white/5 dark:bg-white/5 gap-3">
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white truncate">
                      Watering & Care Reminders
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      Notifications to mist and water plants
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 sm:h-5 sm:w-5 accent-leaf-600 rounded shrink-0" />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:p-3.5 dark:border-white/5 dark:bg-white/5 gap-3">
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white truncate">
                      Seasonal Discounts & Drops
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      Early access to monsoon discounts
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 sm:h-5 sm:w-5 accent-leaf-600 rounded shrink-0" />
                </div>
              </div>
            </div>
          )}

        </section>
      </div>
    </main>
  );
}

export function Notifications() {
  const notifications = [
    {
      title: "Your Areca Palm has shipped!",
      time: "2 hours ago",
      desc: "Order #LG-84920 is on its way with express plant packaging.",
      unread: true
    },
    {
      title: "Monsoon Plant Care Tip 🌧️",
      time: "1 day ago",
      desc: "Ensure indoor pots have adequate drainage during humid weather.",
      unread: false
    },
    {
      title: "Snake Plant Zeylanica price dropped",
      time: "3 days ago",
      desc: "Now available for ₹499 (Save ₹100 today).",
      unread: false
    }
  ];

  return (
    <main className="mx-auto w-full max-w-4xl px-3.5 py-6 sm:px-6 overflow-x-hidden min-w-0">
      <SectionHeader
        title="Notifications"
        subtitle="Stay updated with your live deliveries, care tips, and restock alerts."
      />
      <div className="space-y-3">
        {notifications.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 rounded-2xl border p-3.5 transition min-w-0 ${
              item.unread
                ? "border-leaf-500 bg-leaf-50/40 dark:bg-leaf-950/20 shadow-sm"
                : "border-slate-200/70 bg-white dark:border-white/10 dark:bg-white/10"
            }`}
          >
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-leaf-500/20 text-leaf-700 dark:text-leaf-300">
              <Bell className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {item.title}
                </h4>
                <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0">{item.time}</span>
              </div>
              <p className="mt-1 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export function Recommendations() {
  return (
    <main className="mx-auto w-full max-w-7xl px-3.5 py-6 sm:px-6 lg:px-8 overflow-x-hidden min-w-0">
      <SectionHeader
        title="AI Plant Recommendations"
        subtitle="Curated based on your care preferences, indoor sunlight, and plant parenting score."
      />
      <div className="grid grid-cols-2 gap-2.5 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </main>
  );
}
