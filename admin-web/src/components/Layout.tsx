import clsx from "clsx";
import {
  BarChart3,
  Bell,
  Boxes,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PackageCheck,
  Percent,
  Search,
  ShoppingBag,
  Sprout,
  Star,
  Sun,
  Tags,
  Users,
  Image,
} from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/plants", label: "Plants", icon: Sprout },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/coupons", label: "Coupons", icon: Percent },
  { to: "/reviews", label: "Reviews", icon: Star },
  { to: "/banners", label: "Banners", icon: Image },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

type LayoutProps = {
  children: ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  onLogout?: () => void;
};

export function Layout({ children, sidebarOpen, setSidebarOpen, darkMode, setDarkMode, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f7f3] text-slate-900 dark:bg-[#08120c] dark:text-slate-100">
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-black/5 bg-white/95 px-4 py-5 shadow-soft backdrop-blur transition dark:border-white/10 dark:bg-[#0d1b12]/95 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="min-w-0">
            <img src="/logo.png" alt="Lagao.shop" className="mb-2 h-16 w-auto object-contain" />
            <h1 className="text-2xl font-bold text-leaf-900 dark:text-white">Admin Panel</h1>
          </div>
          <button className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-white/10 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                  isActive
                    ? "bg-leaf-500 text-white shadow-lg shadow-leaf-500/20"
                    : "text-slate-600 hover:bg-leaf-50 hover:text-leaf-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                )
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-black/5 bg-[#f5f7f3]/85 px-4 backdrop-blur dark:border-white/10 dark:bg-[#08120c]/80 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 hover:bg-white dark:hover:bg-white/10 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm dark:bg-white/10 md:flex">
              <Search className="h-4 w-4 text-slate-400" />
              <input className="w-80 bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Search orders, plants, customers..." />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full bg-white p-2 shadow-sm dark:bg-white/10" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className="relative rounded-full bg-white p-2 shadow-sm dark:bg-white/10">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-leaf-500" />
            </button>
            <div className="hidden items-center gap-3 rounded-full bg-white py-1 pl-1 pr-4 shadow-sm dark:bg-white/10 sm:flex">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-leaf-100 text-sm font-bold text-leaf-700">A</div>
              <div>
                <p className="text-sm font-bold">Admin</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Owner</p>
              </div>
            </div>
            <button className="rounded-full bg-white p-2 shadow-sm dark:bg-white/10" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
