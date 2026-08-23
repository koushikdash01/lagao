import {
  SlidersHorizontal,
  Search,
  X,
  Grid,
  List,
  Sparkles,
  Sun,
  Sprout,
  Filter,
  ArrowUp,
  RotateCcw,
  Check,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categories, Plant } from "../data/catalog";
import {
  PlantCard,
  SectionHeader,
  QuickViewModal,
  MobileFilterDrawer,
  type FilterState,
} from "../components/ui";
import { useStore } from "../lib/store";
import clsx from "clsx";

const CATEGORY_ICONS: Record<string, string> = {
  All: "🌿",
  "Indoor Plants": "🪴",
  "Outdoor Plants": "☀️",
  "Flowering Plants": "🌸",
  Succulents: "🌵",
  "Air Purifying Plants": "🍃",
  "Pots & Accessories": "🏺",
};

const initialFilters: FilterState = {
  priceRange: "all",
  sunlight: "all",
  type: "all",
  minRating: 0,
};

export function Catalog() {
  const { plants } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const querySearch = searchParams.get("q") || searchParams.get("search") || "";
  const queryCategory = searchParams.get("category") || "All";

  const [search, setSearch] = useState(querySearch);
  const [category, setCategory] = useState(queryCategory);
  const [sort, setSort] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [quickViewPlant, setQuickViewPlant] = useState<Plant | null>(null);

  useEffect(() => {
    if (querySearch !== search) setSearch(querySearch);
    if (queryCategory !== category) setCategory(queryCategory);
  }, [querySearch, queryCategory]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    const params = new URLSearchParams(searchParams);
    if (val.trim()) params.set("q", val);
    else params.delete("q");
    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    const params = new URLSearchParams(searchParams);
    if (val !== "All") params.set("category", val);
    else params.delete("category");
    setSearchParams(params, { replace: true });
  };

  const handleResetAll = () => {
    setSearch("");
    setCategory("All");
    setSort("newest");
    setFilters(initialFilters);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Calculate active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (category !== "All") count++;
    if (filters.type !== "all") count++;
    if (filters.priceRange !== "all") count++;
    if (filters.sunlight !== "all") count++;
    if (filters.minRating > 0) count++;
    if (search.trim()) count++;
    return count;
  }, [category, filters, search]);

  // Compute item count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: plants.length };
    categories.forEach((cat) => {
      counts[cat] = plants.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
    });
    return counts;
  }, [plants]);

  // Filtered plant items
  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    const result = plants.filter((plant) => {
      // Search query
      const matchesSearch =
        !s ||
        plant.name.toLowerCase().includes(s) ||
        plant.category.toLowerCase().includes(s) ||
        plant.type.toLowerCase().includes(s) ||
        (plant.description && plant.description.toLowerCase().includes(s)) ||
        (plant.sunlight && plant.sunlight.toLowerCase().includes(s));

      // Category
      const matchesCategory =
        category === "All" || plant.category.toLowerCase() === category.toLowerCase();

      // Environment Type
      const matchesType = filters.type === "all" || plant.type === filters.type;

      // Price Range
      const effectivePrice = plant.discountPrice ?? plant.price;
      let matchesPrice = true;
      if (filters.priceRange === "under-300") matchesPrice = effectivePrice < 300;
      else if (filters.priceRange === "300-600")
        matchesPrice = effectivePrice >= 300 && effectivePrice <= 600;
      else if (filters.priceRange === "above-600") matchesPrice = effectivePrice > 600;

      // Sunlight
      let matchesSunlight = true;
      if (filters.sunlight === "low")
        matchesSunlight = plant.sunlight.toLowerCase().includes("low");
      else if (filters.sunlight === "medium")
        matchesSunlight = plant.sunlight.toLowerCase().includes("medium");
      else if (filters.sunlight === "bright")
        matchesSunlight = plant.sunlight.toLowerCase().includes("bright");

      // Minimum Rating
      const matchesRating = plant.rating >= filters.minRating;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesPrice &&
        matchesSunlight &&
        matchesRating
      );
    });

    // Sorting
    if (sort === "price-low")
      result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
    if (sort === "price-high")
      result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [plants, search, category, sort, filters]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 lg:px-8 pb-24 md:pb-12">
      {/* Top Banner & Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-leaf-950 dark:text-white tracking-tight">
              Plant Collection
            </h1>
            <span className="rounded-full bg-leaf-100/80 px-2.5 py-0.5 text-xs font-bold text-leaf-800 dark:bg-leaf-950/80 dark:text-leaf-300">
              {filtered.length} {filtered.length === 1 ? "Plant" : "Plants"}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Hand-picked healthy green plants delivered right to your doorstep.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search plants, indoor, low light..."
            className="w-full rounded-2xl border border-stone-200/90 bg-white py-2.5 pl-10 pr-9 text-xs sm:text-sm text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:border-leaf-600 focus:outline-none focus:ring-2 focus:ring-leaf-600/20 dark:border-white/10 dark:bg-stone-900 dark:text-white dark:focus:border-leaf-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scrollable Category Pills Bar */}
      <div className="no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 mb-5 flex items-center gap-2 overflow-x-auto py-1">
        {["All", ...categories].map((cat) => {
          const isActive = category.toLowerCase() === cat.toLowerCase();
          const count = categoryCounts[cat] ?? 0;
          const icon = CATEGORY_ICONS[cat] || "🌿";

          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={clsx(
                "flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm",
                isActive
                  ? "bg-leaf-600 text-white shadow-leaf-600/25 ring-2 ring-leaf-500/40"
                  : "bg-white text-stone-700 hover:bg-leaf-50/50 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-white/10"
              )}
            >
              <span>{icon}</span>
              <span>{cat}</span>
              <span
                className={clsx(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-extrabold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-leaf-50 text-leaf-700 dark:bg-white/10 dark:text-stone-400"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile & Desktop Quick Controls Bar */}
      <div className="mb-4 flex items-center justify-between gap-2 rounded-2xl border border-stone-200/80 bg-white p-2.5 shadow-sm dark:border-white/10 dark:bg-stone-900">
        {/* Left: Filter Trigger Button */}
        <button
          type="button"
          onClick={() => setIsFilterDrawerOpen(true)}
          className={clsx(
            "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold border transition active:scale-95",
            activeFiltersCount > 0
              ? "border-leaf-600 bg-leaf-50 text-leaf-700 dark:bg-leaf-950/60 dark:text-leaf-300"
              : "border-stone-200 text-stone-700 hover:bg-leaf-50/50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/5"
          )}
        >
          <SlidersHorizontal className="h-4 w-4 text-leaf-600 dark:text-leaf-400" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-leaf-600 text-[10px] font-extrabold text-white">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Center: Quick environment pills for desktop/mobile */}
        <div className="hidden sm:flex items-center gap-1.5">
          {[
            { id: "all", label: "All Environment" },
            { id: "Indoor", label: "Indoor 🪴" },
            { id: "Outdoor", label: "Outdoor ☀️" },
          ].map((typeItem) => (
            <button
              key={typeItem.id}
              onClick={() => setFilters((prev) => ({ ...prev, type: typeItem.id as any }))}
              className={clsx(
                "rounded-xl px-2.5 py-1.5 text-xs font-bold border transition",
                filters.type === typeItem.id
                  ? "border-leaf-600 bg-leaf-50 text-leaf-700 dark:bg-leaf-950/60 dark:text-leaf-300"
                  : "border-transparent text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-white/5"
              )}
            >
              {typeItem.label}
            </button>
          ))}
        </div>

        {/* Right: Sort Select & View Toggle */}
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-2.5 py-2 text-xs font-bold text-stone-700 outline-none focus:border-leaf-600 dark:border-white/10 dark:bg-stone-800 dark:text-stone-200"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated ★</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-stone-100 p-1 dark:bg-white/10">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={clsx(
                "flex h-7 w-7 items-center justify-center rounded-lg text-stone-700 transition dark:text-stone-200",
                viewMode === "grid" && "bg-white shadow-sm dark:bg-stone-800 text-leaf-600 dark:text-leaf-400"
              )}
              title="2-Column Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={clsx(
                "flex h-7 w-7 items-center justify-center rounded-lg text-stone-700 transition dark:text-stone-200",
                viewMode === "list" && "bg-white shadow-sm dark:bg-stone-800 text-leaf-600 dark:text-leaf-400"
              )}
              title="1-Column Detailed List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFiltersCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-stone-500 dark:text-stone-400">Active Filters:</span>

          {search.trim() && (
            <span className="flex items-center gap-1 rounded-full bg-leaf-50 px-2.5 py-1 font-bold text-leaf-800 dark:bg-leaf-950/60 dark:text-leaf-300">
              Query: "{search}"
              <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => handleSearchChange("")} />
            </span>
          )}

          {category !== "All" && (
            <span className="flex items-center gap-1 rounded-full bg-leaf-50 px-2.5 py-1 font-bold text-leaf-800 dark:bg-leaf-950/60 dark:text-leaf-300">
              Cat: {category}
              <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => handleCategoryChange("All")} />
            </span>
          )}

          {filters.type !== "all" && (
            <span className="flex items-center gap-1 rounded-full bg-leaf-50 px-2.5 py-1 font-bold text-leaf-800 dark:bg-leaf-950/60 dark:text-leaf-300">
              Type: {filters.type}
              <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setFilters((p) => ({ ...p, type: "all" }))} />
            </span>
          )}

          {filters.priceRange !== "all" && (
            <span className="flex items-center gap-1 rounded-full bg-leaf-50 px-2.5 py-1 font-bold text-leaf-800 dark:bg-leaf-950/60 dark:text-leaf-300">
              Price: {filters.priceRange}
              <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setFilters((p) => ({ ...p, priceRange: "all" }))} />
            </span>
          )}

          {filters.sunlight !== "all" && (
            <span className="flex items-center gap-1 rounded-full bg-leaf-50 px-2.5 py-1 font-bold text-leaf-800 dark:bg-leaf-950/60 dark:text-leaf-300">
              Sunlight: {filters.sunlight}
              <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setFilters((p) => ({ ...p, sunlight: "all" }))} />
            </span>
          )}

          {filters.minRating > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-leaf-50 px-2.5 py-1 font-bold text-leaf-800 dark:bg-leaf-950/60 dark:text-leaf-300">
              Rating ≥ {filters.minRating}★
              <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setFilters((p) => ({ ...p, minRating: 0 }))} />
            </span>
          )}

          <button
            type="button"
            onClick={handleResetAll}
            className="text-xs font-extrabold text-red-500 hover:underline ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Catalog Plants Display */}
      {filtered.length > 0 ? (
        <div
          className={clsx(
            "grid gap-3 sm:gap-5",
            viewMode === "grid"
              ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 max-w-4xl mx-auto"
          )}
        >
          {filtered.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              viewMode={viewMode}
              onQuickView={setQuickViewPlant}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="my-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-stone-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-50 text-leaf-600 dark:bg-leaf-950/50 dark:text-leaf-400">
            <Sprout className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-extrabold text-stone-900 dark:text-white">
            No plants match your search
          </h3>
          <p className="mt-1 max-w-sm text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            We couldn't find any plants matching your active search or filter parameters.
          </p>

          <button
            type="button"
            onClick={handleResetAll}
            className="mt-5 rounded-2xl bg-leaf-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-leaf-600/30 hover:bg-leaf-700 active:scale-95 transition"
          >
            Reset Filters & View All
          </button>

          <div className="mt-6 border-t border-stone-100 pt-4 dark:border-white/10 w-full max-w-md">
            <p className="text-xs font-bold text-stone-400 uppercase">Popular Categories</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {categories.slice(0, 4).map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategoryChange(c)}
                  className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700 hover:bg-leaf-50 hover:text-leaf-700 dark:bg-white/10 dark:text-stone-300"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Mobile Capsule Bar (Sticky at Bottom on Mobile Scroll) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 md:hidden flex items-center gap-2.5 rounded-full border border-leaf-600/40 bg-leaf-950/95 px-4 py-2.5 text-white shadow-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => setIsFilterDrawerOpen(true)}
          className="flex items-center gap-1.5 text-xs font-extrabold text-leaf-200 hover:text-white"
        >
          <SlidersHorizontal className="h-4 w-4 text-leaf-400" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-leaf-500 text-[9px] font-extrabold text-white">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <div className="h-4 w-[1px] bg-white/20" />

        {/* Grid/List switch */}
        <button
          type="button"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          className="flex items-center gap-1 text-xs font-extrabold text-leaf-200 hover:text-white"
        >
          {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          <span>{viewMode === "grid" ? "List" : "Grid"}</span>
        </button>

        <div className="h-4 w-[1px] bg-white/20" />

        {/* Scroll to Top */}
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center justify-center text-leaf-300 hover:text-white"
          title="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      {/* Quick View Modal */}
      {quickViewPlant && (
        <QuickViewModal plant={quickViewPlant} onClose={() => setQuickViewPlant(null)} />
      )}

      {/* Mobile Filter Sheet Drawer */}
      <MobileFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        sort={sort}
        onSortChange={setSort}
        matchCount={filtered.length}
        onReset={handleResetAll}
      />
    </main>
  );
}
