import { Heart, Minus, Plus, Star } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { plants } from "../data/catalog";
import { Button, PlantCard, SectionHeader } from "../components/ui";
import { useStore } from "../lib/store";

export function PlantDetails() {
  const { id } = useParams();
  const plant = plants.find((item) => item.id === id) ?? plants[0];
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist } = useStore();
  const similar = plants.filter((item) => item.id !== plant.id).slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="grid gap-3">
          <img src={plant.image} alt={plant.name} className="aspect-square rounded-lg object-cover shadow-soft" />
          <div className="grid grid-cols-4 gap-3">{[1, 2, 3, 4].map((item) => <img key={item} src={plant.image} alt="" className="aspect-square rounded-lg object-cover" />)}</div>
        </div>
        <div>
          <p className="font-bold uppercase tracking-wide text-leaf-500">{plant.category}</p>
          <h1 className="mt-2 text-4xl font-black text-leaf-900 dark:text-white">{plant.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-amber-500"><Star className="h-5 w-5 fill-current" /> {plant.rating} rating and customer reviews</p>
          <div className="mt-5"><strong className="text-3xl">Rs. {plant.discountPrice ?? plant.price}</strong>{plant.discountPrice ? <span className="ml-3 text-slate-400 line-through">Rs. {plant.price}</span> : null}</div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{plant.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Water every 7-10 days", plant.sunlight, "18-30 C", "Beginner friendly", plant.type].map((item) => <span key={item} className="rounded-lg bg-white p-3 text-sm font-semibold shadow-sm dark:bg-white/10">{item}</span>)}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded-lg bg-white p-3 shadow-sm dark:bg-white/10"><Minus /></button>
            <strong>{quantity}</strong>
            <button onClick={() => setQuantity(quantity + 1)} className="rounded-lg bg-white p-3 shadow-sm dark:bg-white/10"><Plus /></button>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => addToCart(plant, quantity)}>Add to Cart</Button>
            <Link to="/checkout" className="rounded-lg bg-leaf-900 px-4 py-2.5 text-sm font-bold text-white">Buy Now</Link>
            <Button variant="secondary" onClick={() => toggleWishlist(plant)}><Heart className="mr-2 inline h-4 w-4" />Wishlist</Button>
          </div>
        </div>
      </section>
      <section className="mt-14">
        <SectionHeader title="Customer Reviews" subtitle="Reviews can be created, edited, deleted, approved, and shown from the API." />
        <div className="rounded-lg bg-white p-5 shadow-soft dark:bg-white/10">No review friction here: star rating, text review, and optional images are planned in the API contract.</div>
      </section>
      <section className="mt-14">
        <SectionHeader title="Similar Plants" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{similar.map((item) => <PlantCard key={item.id} plant={item} />)}</div>
      </section>
    </main>
  );
}
