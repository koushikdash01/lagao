import { Heart, Minus, Plus, Star } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import clsx from "clsx";
import { Button, PlantCard, SectionHeader } from "../components/ui";
import { useStore } from "../lib/store";

export function PlantDetails() {
  const { id } = useParams();
  const { plants, cart, addToCart, removeFromCart, updateQuantity, toggleWishlist, wishlist } = useStore();

  if (plants.length === 0) {
    return <main className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500">Loading plant details...</main>;
  }

  const plant = plants.find((item) => item.id === id) ?? plants[0];
  const [quantity, setQuantity] = useState(1);
  const cartItem = cart.find((item) => item.id === plant.id);
  const wished = wishlist.some((item) => item.id === plant.id);
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
          {cartItem ? (
            <>
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => {
                    if (cartItem.quantity === 1) {
                      removeFromCart(plant.id);
                    } else {
                      updateQuantity(plant.id, cartItem.quantity - 1);
                    }
                  }}
                  className="rounded-lg bg-white p-3 shadow-sm dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 transition"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <strong className="text-lg w-6 text-center select-none">{cartItem.quantity}</strong>
                <button
                  onClick={() => updateQuantity(plant.id, cartItem.quantity + 1)}
                  className="rounded-lg bg-white p-3 shadow-sm dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 transition"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <span className="text-sm font-bold text-leaf-500 ml-2">Added to Cart</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/checkout" className="rounded-lg bg-leaf-900 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-leaf-950 flex items-center">
                  Buy Now
                </Link>
                <Button
                  variant="secondary"
                  onClick={() => toggleWishlist(plant)}
                  className={clsx("px-5 py-3 transition", wished ? "border-red-200 bg-red-50 text-red-500" : "")}
                >
                  <Heart className={clsx("mr-2 inline h-4 w-4", wished && "fill-current")} />
                  {wished ? "Wished" : "Wishlist"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-lg bg-white p-3 shadow-sm dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 transition"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <strong className="text-lg w-6 text-center select-none">{quantity}</strong>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-lg bg-white p-3 shadow-sm dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 transition"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="px-5 py-3" onClick={() => addToCart(plant, quantity)}>
                  Add to Cart
                </Button>
                <Link to="/checkout" className="rounded-lg bg-leaf-900 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-leaf-950 flex items-center">
                  Buy Now
                </Link>
                <Button
                  variant="secondary"
                  onClick={() => toggleWishlist(plant)}
                  className={clsx("px-5 py-3 transition", wished ? "border-red-200 bg-red-50 text-red-500" : "")}
                >
                  <Heart className={clsx("mr-2 inline h-4 w-4", wished && "fill-current")} />
                  {wished ? "Wished" : "Wishlist"}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      <section className="mt-14">
        <SectionHeader title="Customer Reviews" subtitle="Reviews can be created, edited, deleted, approved, and shown from the API." />
        <div className="rounded-lg bg-white p-5 shadow-soft dark:bg-white/10">No review friction here: star rating, text review, and optional images are planned in the API contract.</div>
      </section>
      <section className="mt-14">
        <SectionHeader title="Similar Plants" />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">{similar.map((item) => <PlantCard key={item.id} plant={item} />)}</div>
      </section>
    </main>
  );
}
