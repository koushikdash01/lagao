import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categories } from "../data/catalog";
import { PlantCard, SectionHeader } from "../components/ui";
import { useStore } from "../lib/store";

export function Catalog() {
  const { plants } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get("q") || searchParams.get("search") || "";
  const queryCategory = searchParams.get("category") || "All";

  const [search, setSearch] = useState(querySearch);
  const [category, setCategory] = useState(queryCategory);
  const [sort, setSort] = useState("newest");

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

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    const result = plants.filter((plant) => {
      const matchesSearch =
        !s ||
        plant.name.toLowerCase().includes(s) ||
        plant.category.toLowerCase().includes(s) ||
        plant.type.toLowerCase().includes(s) ||
        (plant.description && plant.description.toLowerCase().includes(s)) ||
        (plant.sunlight && plant.sunlight.toLowerCase().includes(s));

      const matchesCategory =
        category === "All" || plant.category.toLowerCase() === category.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
    if (sort === "price-high") result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [plants, search, category, sort]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader title="Plant Catalog" subtitle="Search, filter, sort, quick view, wishlist, and cart-ready plant cards." />
      <div className="mb-6 grid gap-3 rounded-lg bg-white p-4 shadow-soft dark:bg-white/10 md:grid-cols-[1fr_auto_auto]">
        <input
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="rounded-lg border border-slate-200 bg-transparent px-3 py-2 outline-none dark:border-white/10"
          placeholder="Search plants, categories, indoor, outdoor..."
        />
        <select
          value={category}
          onChange={(event) => handleCategoryChange(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 outline-none dark:border-white/10 dark:bg-slate-900 dark:text-white"
        >
          <option className="bg-white text-slate-800 dark:bg-slate-900 dark:text-white">All</option>
          {categories.map((item) => (
            <option key={item} value={item} className="bg-white text-slate-800 dark:bg-slate-900 dark:text-white">
              {item}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 outline-none dark:border-white/10 dark:bg-slate-900 dark:text-white">
          <option value="newest" className="bg-white text-slate-800 dark:bg-slate-900 dark:text-white">Newest</option>
          <option value="price-low" className="bg-white text-slate-800 dark:bg-slate-900 dark:text-white">Price Low to High</option>
          <option value="price-high" className="bg-white text-slate-800 dark:bg-slate-900 dark:text-white">Price High to Low</option>
          <option value="rating" className="bg-white text-slate-800 dark:bg-slate-900 dark:text-white">Best Rated</option>
          <option value="popularity" className="bg-white text-slate-800 dark:bg-slate-900 dark:text-white">Popularity</option>
        </select>
      </div>
      <aside className="mb-6 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300"><SlidersHorizontal className="h-5 w-5" /> Filters supported by API: category, price range, indoor/outdoor, sunlight, availability.</aside>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((plant) => <PlantCard key={plant.id} plant={plant} />)}</div>
      <div className="mt-8 flex justify-center gap-2"><button className="rounded-lg bg-white px-4 py-2 shadow-sm dark:bg-white/10">1</button><button className="rounded-lg bg-white px-4 py-2 shadow-sm dark:bg-white/10">2</button></div>
    </main>
  );
}
