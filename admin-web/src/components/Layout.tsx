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
  Percent,
  Search,
  ShoppingBag,
  Sprout,
  Star,
  Sun,
  Tags,
  Users,
  Image as ImageIcon,
  ShieldCheck,
  Plus,
  ExternalLink,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const navSections = [
  {
    title: "OVERVIEW",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
      { to: "/analytics", label: "Analytics & Growth", icon: BarChart3 },
    ],
  },
  {
    title: "CATALOG & STOCK",
    items: [
      { to: "/plants", label: "Plants & Products", icon: Sprout, badge: "Live" },
      { to: "/categories", label: "Categories", icon: Tags },
      { to: "/inventory", label: "Stock Control", icon: Boxes },
    ],
  },
  {
    title: "SALES & CUSTOMERS",
    items: [
      { to: "/orders", label: "Orders", icon: ShoppingBag, badge: "Live" },
      { to: "/customers", label: "Customer List", icon: Users },
      { to: "/reviews", label: "Reviews & Ratings", icon: Star },
    ],
  },
  {
    title: "PROMOTIONS",
    items: [
      { to: "/coupons", label: "Discount Coupons", icon: Percent },
      { to: "/banners", label: "Hero Banners", icon: ImageIcon },
    ],
  },
];

type LayoutProps = {
  children: ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  onLogout?: () => void;
};

export function Layout({
  children,
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  onLogout,
}: LayoutProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: "New Order Placed", desc: "Order #LAG-1082 received for Rs. 1,499", time: "5 min ago", unread: true },
    { id: 2, title: "Low Stock Alert", desc: "Snake Plant stock fell below 5 units", time: "25 min ago", unread: true },
    { id: 3, title: "New 5-Star Review", desc: "Priya left a review for Monstera Deliciosa", time: "2 hrs ago", unread: false },
  ];

  return (
    <div className="min-h-screen bg-[#f6f8f5] text-slate-900 transition-colors duration-200 dark:bg-[#06110a] dark:text-slate-100 font-sans">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-200/90 bg-white px-4 py-5 shadow-soft transition-all duration-300 dark:border-white/10 dark:bg-[#08140c] lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-600 text-white shadow-md shadow-leaf-600/30">
                <Sprout className="h-6 w-6 text-white" />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-slate-950 ring-2 ring-white dark:ring-slate-900">
                  ✓
                </span>
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  Lagao Admin
                  <span className="inline-flex items-center rounded-full bg-leaf-500/15 px-2 py-0.5 text-[10px] font-extrabold text-leaf-700 dark:text-leaf-300 border border-leaf-500/30">
                    v2.0
                  </span>
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Nursery Operations
                </p>
              </div>
            </div>
            <button
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Add Plant Action Button */}
          <div className="mb-6 px-2">
            <button
              onClick={() => {
                navigate("/plants");
                setSidebarOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-leaf-600/25 transition-all hover:bg-leaf-700 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Add New Plant
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {navSections.map((section) => (
              <div key={section.title}>
                <h2 className="mb-2 px-3 text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-400">
                  {section.title}
                </h2>
                <nav className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        clsx(
                          "group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                          isActive
                            ? "bg-leaf-600 text-white shadow-md shadow-leaf-600/25 font-bold"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                        )
                      }
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="border-t border-slate-200/80 pt-4 dark:border-white/10 px-2">
          <div className="flex items-center justify-between rounded-xl bg-slate-100/90 p-2.5 border border-slate-200/70 dark:bg-white/5 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-extrabold text-white shadow-sm">
                A
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  Lagao Owner
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 inline" />
                </p>
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">admin@lagao.shop</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/90 bg-white/90 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#08140c]/90 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-300 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Global Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plants, orders, customers..."
                className="w-80 rounded-xl border border-slate-200/90 bg-slate-100/90 py-2 pl-10 pr-10 text-xs font-medium text-slate-800 outline-none transition-all focus:border-leaf-500 focus:bg-white focus:ring-2 focus:ring-leaf-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-[#0c1a11] dark:focus:border-leaf-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-300/80 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 dark:border-white/10 dark:bg-white/10">
                ⌘K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Database Live Status Badge */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              DB Live
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 transition-all hover:scale-105"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-90 hover:rotate-180" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Notifications Bell & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 transition-all hover:scale-105"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-leaf-500 ring-2 ring-white dark:ring-slate-900" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/15 dark:bg-[#0c1a11] z-50 text-slate-900 dark:text-white">
                  <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/10">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </h4>
                    <span className="rounded-full bg-leaf-100 px-2 py-0.5 text-[10px] font-bold text-leaf-800 dark:bg-leaf-950 dark:text-leaf-300">
                      2 Unread
                    </span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={clsx(
                          "rounded-xl p-2.5 transition-colors text-xs",
                          n.unread
                            ? "bg-leaf-50 dark:bg-leaf-950/60 border border-leaf-200 dark:border-leaf-800/60"
                            : "bg-slate-50 dark:bg-white/5"
                        )}
                      >
                        <p className="font-bold text-slate-900 dark:text-white">{n.title}</p>
                        <p className="mt-0.5 text-slate-600 dark:text-slate-300">{n.desc}</p>
                        <span className="mt-1 block text-[10px] text-slate-400 font-semibold">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Visit Store Button */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
            >
              <ExternalLink className="h-3.5 w-3.5 text-leaf-600 dark:text-leaf-400" />
              Visit Store
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">{children}</main>

        {/* Footer */}
        <footer className="border-t border-slate-200/70 py-4 px-6 text-center text-xs font-medium text-slate-400 dark:border-white/10 dark:text-slate-500">
          Lagao Admin Management Portal &copy; {new Date().getFullYear()} — Plant Nursery Operations Dashboard
        </footer>
      </div>
    </div>
  );
}


