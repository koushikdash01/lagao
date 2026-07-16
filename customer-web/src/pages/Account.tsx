import { Bell, Heart, Package, RotateCcw, Settings, Star, User } from "lucide-react";
import { Link } from "react-router-dom";
import { plants } from "../data/catalog";
import { PlantCard, SectionHeader } from "../components/ui";
import { useStore } from "../lib/store";

export function Wishlist() {
  const { wishlist, addToCart, toggleWishlist } = useStore();
  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><SectionHeader title="Wishlist" subtitle="Persisted wishlist items can be moved to cart after login." /><div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">{wishlist.map((plant) => <div key={plant.id} className="flex flex-col justify-between"><PlantCard plant={plant} /><button onClick={() => { addToCart(plant); toggleWishlist(plant); }} className="mt-2 w-full rounded-lg bg-leaf-900 py-2 text-xs sm:text-sm font-bold text-white transition hover:bg-leaf-950">Move to Cart</button></div>)}</div></main>;
}

export function Orders() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader title="My Orders" subtitle="View details, track status, cancel, download invoice, and reorder purchases." />
      {["Placed", "Confirmed", "Packed", "Shipped", "Delivered"].map((status, index) => <div key={status} className="mb-3 rounded-lg bg-white p-4 shadow-soft dark:bg-white/10"><strong>Order LG-10{index}</strong><p className="text-sm text-slate-600 dark:text-slate-300">Status: {status}</p><div className="mt-3 flex gap-2"><button>Track</button><button>Invoice</button><button>Reorder</button></div></div>)}
    </main>
  );
}

export function Profile() {
  const sections = [["Personal Information", User], ["Address Management", Package], ["My Orders", RotateCcw], ["Wishlist", Heart], ["Reviews", Star], ["Settings", Settings], ["Notifications", Bell]];
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader title="User Profile" subtitle="Update profile, change password, manage addresses, orders, wishlist, reviews, and settings." />
      <div className="grid gap-4 md:grid-cols-3">{sections.map(([label, Icon]) => <Link key={String(label)} to={String(label) === "My Orders" ? "/orders" : String(label) === "Wishlist" ? "/wishlist" : "/profile"} className="rounded-lg bg-white p-5 shadow-soft dark:bg-white/10"><Icon className="mb-3 h-6 w-6 text-leaf-500" /><strong>{String(label)}</strong></Link>)}</div>
    </main>
  );
}

export function Notifications() {
  return <main className="mx-auto max-w-4xl px-4 py-10"><SectionHeader title="Notifications" subtitle="Order updates, delivery notifications, promotional offers, and price drop alerts." />{["Your Areca Palm shipped", "Snake Plant price dropped", "Water your Peace Lily today"].map((item) => <div key={item} className="mb-3 rounded-lg bg-white p-4 shadow-soft dark:bg-white/10">{item}</div>)}</main>;
}

export function Recommendations() {
  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><SectionHeader title="AI Plant Recommendations" subtitle="A future recommendation layer can use care preferences, room light, purchase history, and recently viewed plants." /><div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">{plants.map((plant) => <PlantCard key={plant.id} plant={plant} />)}</div></main>;
}
