import { ArrowRight, Bell, Leaf, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { categories, testimonials, type Plant } from "../data/catalog";
import { PlantCard, SectionHeader } from "../components/ui";
import { useStore } from "../lib/store";

export function Home() {
  const { plants } = useStore();

  if (plants.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-8">
        <Leaf className="h-12 w-12 animate-bounce text-leaf-500" />
        <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">Loading plants...</p>
      </div>
    );
  }

  return (
    <main>
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1800&auto=format&fit=crop" alt="Plant filled home" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-leaf-900/85 via-leaf-900/55 to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">Monsoon offer: up to 25% off selected greens</p>
            <h1 className="text-5xl font-black leading-tight md:text-7xl">Bring nature home, one calm corner at a time.</h1>
            <p className="mt-6 text-lg leading-8 text-white/85">Shop curated indoor plants, air-purifying favorites, pots, care kits, and seasonal arrivals packed safely for your home.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalog" className="rounded-lg bg-leaf-500 px-5 py-3 font-bold text-white hover:bg-leaf-700">Shop Plants <ArrowRight className="ml-2 inline h-5 w-5" /></Link>
              <Link to="/catalog" className="rounded-lg bg-white/15 px-5 py-3 font-bold text-white backdrop-blur hover:bg-white/25">View Offers</Link>
            </div>
          </div>
        </div>
      </section>

      <ContentBand title="Featured Plants" subtitle="Hand-picked greens for homes, offices, balconies, and mindful gifting." plants={plants} />
      <ContentBand title="Best Sellers" subtitle="Customer-loved plants with strong survival instincts and good looks." plants={[...plants].reverse()} />
      <ContentBand title="New Arrivals" subtitle="Fresh drops from nurseries and seasonal collections." plants={plants.length > 0 ? plants.slice(1).concat(plants[0]) : []} />
      <ContentBand title="Trending Plants" subtitle="The greens people keep adding to wishlists." plants={plants.slice(0, 3)} />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader title="Shop By Category" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => <Link key={category} to="/catalog" className="rounded-lg bg-white p-6 font-bold shadow-soft transition hover:-translate-y-1 dark:bg-white/10">{category}</Link>)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        {[["Safe Delivery", Truck], ["Healthy Plants", Leaf], ["Easy Returns", PackageCheck], ["Secure Payments", ShieldCheck]].map(([label, Icon]) => <div key={String(label)} className="rounded-lg bg-white p-5 shadow-soft dark:bg-white/10"><Icon className="mb-4 h-6 w-6 text-leaf-500" /><h3 className="font-bold">{String(label)}</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">A premium, careful experience from browse to doorstep.</p></div>)}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader title="Customer Testimonials" />
        <div className="grid gap-4 md:grid-cols-3">{testimonials.map((text) => <blockquote key={text} className="rounded-lg bg-white p-6 text-slate-700 shadow-soft dark:bg-white/10 dark:text-slate-200">"{text}"</blockquote>)}</div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-leaf-900 p-8 text-white md:flex md:items-center md:justify-between">
          <div><Bell className="mb-3 h-7 w-7 text-leaf-100" /><h2 className="text-3xl font-black">Get plant care notes and offers.</h2><p className="mt-2 text-white/75">Newsletter, restock alerts, price drops, and seasonal guides.</p></div>
          <form className="mt-6 flex gap-2 md:mt-0"><input className="rounded-lg px-4 py-3 text-slate-900 outline-none" placeholder="Email address" /><button className="rounded-lg bg-leaf-500 px-5 font-bold">Subscribe</button></form>
        </div>
      </section>
    </main>
  );
}

function ContentBand({ title, subtitle, plants: items }: { title: string; subtitle: string; plants: Plant[] }) {
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><SectionHeader title={title} subtitle={subtitle} /><div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">{items.map((plant) => <PlantCard key={`${title}-${plant.id}`} plant={plant} />)}</div></section>;
}
