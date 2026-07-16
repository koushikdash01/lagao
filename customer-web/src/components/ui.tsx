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
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-100 bg-white p-2.5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/5 dark:bg-white/10">
      <div className="relative overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-900/50">
        <Link to={`/plants/${plant.id}`}>
          <img src={plant.image} alt={plant.name} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </Link>
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => toggleWishlist(plant)}
          className={clsx(
            "absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-black/60 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-90",
            wished ? "text-red-500" : "text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-white"
          )}
        >
          <Heart className={clsx("h-4 w-4", wished && "fill-current")} />
        </button>
      </div>

      <div className="mt-2 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-leaf-500 truncate max-w-[70%]">
              {plant.category}
            </span>
            <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
              <Star className="h-3 w-3 fill-current" />
              {plant.rating}
            </span>
          </div>

          <Link
            to={`/plants/${plant.id}`}
            className="mt-1 block text-xs sm:text-sm font-semibold text-slate-800 hover:text-leaf-500 dark:text-slate-100 dark:hover:text-leaf-400 line-clamp-2 leading-tight min-h-[2rem]"
          >
            {plant.name}
          </Link>

          <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {plant.description}
          </p>

          <div className="mt-1 flex items-center">
            <span
              className={clsx(
                "inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold",
                plant.stock > 0
                  ? "bg-leaf-50 text-leaf-700 dark:bg-leaf-950/30 dark:text-leaf-300"
                  : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
              )}
            >
              {plant.stock > 0 ? "In stock" : "Out of stock"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-1.5 border-t border-slate-50 pt-2 dark:border-white/5">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 dark:text-white">
              Rs. {plant.discountPrice ?? plant.price}
            </span>
            {plant.discountPrice ? (
              <span className="text-[9px] sm:text-[11px] text-slate-400 line-through">
                Rs. {plant.price}
              </span>
            ) : null}
          </div>

          <div className="w-16 sm:w-20 md:w-24">
            {cartItem ? (
              <div className="flex items-center justify-between rounded-lg border border-leaf-500 bg-leaf-500 text-white font-bold h-7 sm:h-8 md:h-9 w-full overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    if (cartItem.quantity === 1) {
                      removeFromCart(plant.id);
                    } else {
                      updateQuantity(plant.id, cartItem.quantity - 1);
                    }
                  }}
                  className="flex-1 h-full hover:bg-leaf-600 active:bg-leaf-700 transition flex items-center justify-center text-xs sm:text-sm select-none"
                >
                  -
                </button>
                <span className="text-[11px] sm:text-xs select-none px-1">{cartItem.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(plant.id, cartItem.quantity + 1)}
                  className="flex-1 h-full hover:bg-leaf-600 active:bg-leaf-700 transition flex items-center justify-center text-xs sm:text-sm select-none"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                disabled={plant.stock <= 0}
                onClick={() => addToCart(plant)}
                className={clsx(
                  "flex h-7 sm:h-8 md:h-9 w-full items-center justify-center rounded-lg border text-xs sm:text-sm font-extrabold uppercase transition shadow-sm",
                  plant.stock <= 0
                    ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed dark:border-white/10 dark:bg-white/5"
                    : "border-leaf-500 bg-white text-leaf-500 hover:bg-leaf-50 dark:bg-slate-900 dark:hover:bg-leaf-950/20"
                )}
              >
                Add
              </button>
            )}
          </div>
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
