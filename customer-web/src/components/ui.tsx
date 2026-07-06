import clsx from "clsx";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { type Plant } from "../data/catalog";
import { useStore } from "../lib/store";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button {...props} className={clsx("rounded-lg px-4 py-2.5 text-sm font-bold transition", variant === "primary" && "bg-leaf-500 text-white hover:bg-leaf-700", variant === "secondary" && "bg-white text-leaf-900 shadow-sm hover:bg-leaf-50 dark:bg-white/10 dark:text-white", variant === "ghost" && "text-leaf-900 hover:bg-leaf-50 dark:text-white dark:hover:bg-white/10", className)}>
      {children}
    </button>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-leaf-900 dark:text-white md:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
      </div>
    </div>
  );
}

export function PlantCard({ plant }: { plant: Plant }) {
  const { cart, addToCart, removeFromCart, updateQuantity, toggleWishlist, wishlist } = useStore();
  const cartItem = cart.find((item) => item.id === plant.id);
  const wished = wishlist.some((item) => item.id === plant.id);

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-soft transition hover:-translate-y-1 dark:bg-white/10">
      <Link to={`/plants/${plant.id}`}>
        <img src={plant.image} alt={plant.name} loading="lazy" className="h-56 w-full object-cover" />
      </Link>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wide text-leaf-500">{plant.category}</p>
          <span className="flex items-center gap-1 text-sm font-bold text-amber-500"><Star className="h-4 w-4 fill-current" />{plant.rating}</span>
        </div>
        <Link to={`/plants/${plant.id}`} className="text-lg font-bold text-leaf-900 hover:text-leaf-500 dark:text-white">{plant.name}</Link>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{plant.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <strong className="text-lg text-leaf-900 dark:text-white">Rs. {plant.discountPrice ?? plant.price}</strong>
            {plant.discountPrice ? <span className="ml-2 text-sm text-slate-400 line-through">Rs. {plant.price}</span> : null}
          </div>
          <span className={clsx("text-xs font-bold", plant.stock > 0 ? "text-leaf-500" : "text-red-500")}>{plant.stock > 0 ? "In stock" : "Out of stock"}</span>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          {cartItem ? (
            <div className="flex items-center justify-between rounded-lg bg-leaf-500 text-white font-bold h-10 w-full overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => {
                  if (cartItem.quantity === 1) {
                    removeFromCart(plant.id);
                  } else {
                    updateQuantity(plant.id, cartItem.quantity - 1);
                  }
                }}
                className="px-4 h-full hover:bg-leaf-600 active:bg-leaf-700 transition flex items-center justify-center text-lg select-none"
              >
                -
              </button>
              <span className="text-sm select-none">{cartItem.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(plant.id, cartItem.quantity + 1)}
                className="px-4 h-full hover:bg-leaf-600 active:bg-leaf-700 transition flex items-center justify-center text-lg select-none"
              >
                +
              </button>
            </div>
          ) : (
            <Button className="w-full h-10 flex items-center justify-center gap-2" onClick={() => addToCart(plant)}>
              <ShoppingCart className="h-4 w-4" />Add
            </Button>
          )}
          <button aria-label="Add to wishlist" onClick={() => toggleWishlist(plant)} className={clsx("rounded-lg border px-3 h-10 flex items-center justify-center transition", wished ? "border-red-200 bg-red-50 text-red-500" : "border-slate-200 text-slate-500 dark:border-white/10")}>
            <Heart className={clsx("h-5 w-5", wished && "fill-current")} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-lg bg-white/80 dark:bg-white/10" />)}
    </div>
  );
}
