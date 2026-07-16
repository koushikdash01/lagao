import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { categories } from "../data/catalog";
import { PlantCard, SectionHeader } from "../components/ui";
import { useStore } from "../lib/store";

export function Catalog() {
  const { plants } = useStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const result = plants.filter((plant) => plant.name.toLowerCase().includes(search.toLowerCase()) && (category === "All" || plant.category === category));
    if (sort === "price-low") result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
    if (sort === "price-high") result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [plants, search, category, sort]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader title="Plant Catalog" subtitle="Search, filter, sort, quick view, wishlist, and cart-ready plant cards." />
      <div className="mb-6 grid gap-3 rounded-lg bg-white p-4 shadow-soft dark:bg-white/10 md:grid-cols-[1fr_auto_auto]">
        <input value={search} onChange={(event) => setSearch(event.target.value)} className="rounded-lg border border-slate-200 bg-transparent px-3 py-2 outline-none dark:border-white/10" placeholder="Search by plant name..." />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-lg border border-slate-200 bg-transparent px-3 py-2 dark:border-white/10"><option>All</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-slate-200 bg-transparent px-3 py-2 dark:border-white/10"><option value="newest">Newest</option><option value="price-low">Price Low to High</option><option value="price-high">Price High to Low</option><option value="rating">Best Rated</option><option value="popularity">Popularity</option></select>
      </div>
      <aside className="mb-6 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300"><SlidersHorizontal className="h-5 w-5" /> Filters supported by API: category, price range, indoor/outdoor, sunlight, availability.</aside>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((plant) => <PlantCard key={plant.id} plant={plant} />)}</div>
      <div className="mt-8 flex justify-center gap-2"><button className="rounded-lg bg-white px-4 py-2 shadow-sm dark:bg-white/10">1</button><button className="rounded-lg bg-white px-4 py-2 shadow-sm dark:bg-white/10">2</button></div>
    </main>
  );
}
