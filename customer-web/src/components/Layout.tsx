import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { categories } from "../data/catalog";
import { useStore } from "../lib/store";
import { FloatingCheckoutBar } from "./FloatingCheckoutBar";
import { Footer } from "./Footer";

export function Layout() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { cartCount, wishlist, plants } = useStore();
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePlantClick = (id: string) => {
    setShowSuggestions(false);
    navigate(`/plants/${id}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    setShowSuggestions(false);
    navigate(`/catalog?category=${encodeURIComponent(categoryName)}`);
  };

  const queryLower = searchQuery.trim().toLowerCase();

  const matchingCategories = queryLower
    ? categories.filter((cat) => cat.toLowerCase().includes(queryLower))
    : [];

  const matchingPlants = queryLower
    ? plants
        .filter((p) => {
          return (
            p.name.toLowerCase().includes(queryLower) ||
            p.category.toLowerCase().includes(queryLower) ||
            p.type.toLowerCase().includes(queryLower) ||
            (p.description && p.description.toLowerCase().includes(queryLower))
          );
        })
        .slice(0, 5)
    : [];

  const hasSuggestions = showSuggestions && (matchingCategories.length > 0 || matchingPlants.length > 0);

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
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-20 sm:gap-4 sm:px-6 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation menu">
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="mr-1 flex h-12 w-28 items-center sm:mr-2 sm:h-14 sm:w-32">
            <img src="/logo.png" alt="Lagao.shop" className="h-full w-auto object-contain transition-all duration-300 dark:brightness-110 dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.85)]" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-700 dark:text-slate-200 lg:flex">{nav}</nav>
          <div className="group relative hidden lg:block">
            <button className="text-sm font-bold">Categories</button>
            <div className="invisible absolute left-0 top-8 w-64 rounded-lg bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100 dark:bg-[#102517]">
              {categories.map((category) => (
                <Link key={category} to={`/catalog?category=${encodeURIComponent(category)}`} className="block rounded-md px-3 py-2 text-sm hover:bg-leaf-50 dark:hover:bg-white/10">
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="relative ml-auto hidden min-w-72 items-center md:flex">
            <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-leaf-500 dark:bg-white/10">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search plants, categories..."
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            {/* Desktop Autocomplete dropdown */}
            {hasSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-black/5 bg-white/95 py-2 shadow-xl backdrop-blur-lg dark:border-white/10 dark:bg-[#102517]/95">
                {matchingCategories.length > 0 && (
                  <div className="border-b border-black/5 px-3 py-2 dark:border-white/5">
                    <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Categories</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {matchingCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleCategoryClick(cat);
                          }}
                          className="rounded-full bg-leaf-50 px-2.5 py-1 text-xs font-semibold text-leaf-800 hover:bg-leaf-100 dark:bg-white/10 dark:text-leaf-300 dark:hover:bg-white/20"
                        >
                          🌿 {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {matchingPlants.map((plant) => (
                  <button
                    key={plant.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handlePlantClick(plant.id);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-leaf-50 dark:hover:bg-white/10"
                  >
                    <img src={plant.image} alt={plant.name} className="h-10 w-10 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{plant.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{plant.category} · ₹{plant.discountPrice ?? plant.price}</p>
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSearchSubmit();
                  }}
                  className="w-full border-t border-black/5 px-4 py-2.5 text-left text-xs font-bold text-leaf-600 hover:bg-leaf-50 dark:border-white/10 dark:text-leaf-400 dark:hover:bg-white/10"
                >
                  View all results for "{searchQuery}" →
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setDark(!dark)} aria-label="Toggle dark mode" className="ml-auto rounded-full bg-white p-2 shadow-sm dark:bg-white/10 md:ml-0">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="relative rounded-full bg-white p-2 shadow-sm dark:bg-white/10">
            <Heart className="h-5 w-5" />
            {wishlist.length ? <Badge value={wishlist.length} /> : null}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative rounded-full bg-white p-2 shadow-sm dark:bg-white/10">
            <ShoppingBag className="h-5 w-5" />
            {cartCount ? <Badge value={cartCount} /> : null}
          </Link>
          <Link to="/profile" aria-label="Profile" className="rounded-full bg-white p-2 shadow-sm dark:bg-white/10">
            <User className="h-5 w-5" />
          </Link>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="border-t border-black/5 px-4 pb-3 pt-2 dark:border-white/10 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center rounded-xl bg-white px-3.5 py-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-leaf-500 dark:bg-white/10">
            <Search className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Search plants, categories..."
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          {/* Mobile Autocomplete Dropdown */}
          {hasSuggestions && (
            <div className="mt-2 overflow-hidden rounded-2xl border border-black/5 bg-white/98 shadow-xl backdrop-blur-lg dark:border-white/10 dark:bg-[#102517]/98">
              {matchingCategories.length > 0 && (
                <div className="border-b border-black/5 px-3 py-2 dark:border-white/5">
                  <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Categories</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {matchingCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleCategoryClick(cat);
                        }}
                        className="rounded-full bg-leaf-50 px-2.5 py-1 text-xs font-semibold text-leaf-800 hover:bg-leaf-100 dark:bg-white/10 dark:text-leaf-300 dark:hover:bg-white/20"
                      >
                        🌿 {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {matchingPlants.map((plant) => (
                <button
                  key={plant.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handlePlantClick(plant.id);
                  }}
                  className="flex w-full items-center gap-3 border-b border-black/5 px-3.5 py-2.5 text-left last:border-0 hover:bg-leaf-50 dark:border-white/5 dark:hover:bg-white/10"
                >
                  <img src={plant.image} alt={plant.name} className="h-10 w-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{plant.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{plant.category} · ₹{plant.discountPrice ?? plant.price}</p>
                  </div>
                </button>
              ))}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSearchSubmit();
                }}
                className="w-full bg-leaf-50/50 px-4 py-2.5 text-center text-xs font-bold text-leaf-700 hover:bg-leaf-50 dark:bg-white/5 dark:text-leaf-300 dark:hover:bg-white/10"
              >
                View all results for "{searchQuery}" →
              </button>
            </div>
          )}
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="h-full w-80 bg-white p-5 dark:bg-[#102517]">
            <div className="mb-8 flex items-center justify-between">
              <Link to="/" className="flex h-14 w-32 items-center">
                <img src="/logo.png" alt="Lagao.shop" className="h-full w-auto object-contain transition-all duration-300 dark:brightness-110 dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.85)]" />
              </Link>
              <button onClick={() => setOpen(false)}><X /></button>
            </div>
            <nav className="grid gap-4 text-base font-bold" onClick={() => setOpen(false)}>{nav}</nav>
          </div>
        </div>
      ) : null}

      <div className={cartCount > 0 ? "pb-24 sm:pb-28" : ""}>
        <Outlet />
      </div>

      <FloatingCheckoutBar />

      <Footer />
    </div>
  );
}

function Badge({ value }: { value: number }) {
  return <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-xs font-bold text-white">{value}</span>;
}
