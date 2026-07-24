import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { categories } from "../data/catalog";
import { useStore } from "../lib/store";

export function Layout() {
  const [open, setOpen] = useState(false);
  const { cartCount, wishlist } = useStore();
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved !== null) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const nav = (
    <>
      <NavLink to="/catalog">Plants</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/faqs">FAQs</NavLink>
      <NavLink to="/contact">Contact</NavLink>
    </>
  );

  return (
    <div className="min-h-screen bg-cream text-slate-900 dark:bg-[#08120c] dark:text-white">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/90 backdrop-blur dark:border-white/10 dark:bg-[#08120c]/85">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-6 w-6" /></button>
          <Link to="/" className="mr-2 flex h-14 w-32 items-center overflow-hidden">
            <img src="/logo.png" alt="Lagao.shop" className="h-full w-auto object-contain" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-700 dark:text-slate-200 lg:flex">{nav}</nav>
          <div className="group relative hidden lg:block">
            <button className="text-sm font-bold">Categories</button>
            <div className="invisible absolute left-0 top-8 w-64 rounded-lg bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100 dark:bg-[#102517]">
              {categories.map((category) => <Link key={category} to="/catalog" className="block rounded-md px-3 py-2 text-sm hover:bg-leaf-50 dark:hover:bg-white/10">{category}</Link>)}
            </div>
          </div>
          <div className="ml-auto hidden min-w-72 items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm dark:bg-white/10 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search plants..." />
          </div>
          <button onClick={() => setDark(!dark)} className="rounded-full bg-white p-2 shadow-sm dark:bg-white/10">{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
          <Link to="/wishlist" className="relative rounded-full bg-white p-2 shadow-sm dark:bg-white/10"><Heart className="h-5 w-5" />{wishlist.length ? <Badge value={wishlist.length} /> : null}</Link>
          <Link to="/cart" className="relative rounded-full bg-white p-2 shadow-sm dark:bg-white/10"><ShoppingBag className="h-5 w-5" />{cartCount ? <Badge value={cartCount} /> : null}</Link>
          <Link to="/profile" className="rounded-full bg-white p-2 shadow-sm dark:bg-white/10"><User className="h-5 w-5" /></Link>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="h-full w-80 bg-white p-5 dark:bg-[#102517]">
            <div className="mb-8 flex items-center justify-between">
              <Link to="/" className="flex h-14 w-32 items-center overflow-hidden">
                <img src="/logo.png" alt="Lagao.shop" className="h-full w-auto object-contain" />
              </Link>
              <button onClick={() => setOpen(false)}><X /></button>
            </div>
            <nav className="grid gap-4 text-base font-bold" onClick={() => setOpen(false)}>{nav}</nav>
          </div>
        </div>
      ) : null}

      <Outlet />
      <footer className="mt-16 bg-leaf-900 px-4 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
          <div>
            <img src="/logo.png" alt="Lagao.shop" className="h-16 w-auto rounded bg-white/95 p-1" />
            <p className="mt-3 text-sm text-white/70">Premium plants, careful packing, and useful care guidance.</p>
          </div>
          {["Shipping Policy", "Return Policy", "Privacy Policy", "Terms and Conditions"].map((item) => <Link key={item} to={`/pages/${item.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-white/75 hover:text-white">{item}</Link>)}
        </div>
      </footer>
    </div>
  );
}

function Badge({ value }: { value: number }) {
  return <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-xs font-bold text-white">{value}</span>;
}
