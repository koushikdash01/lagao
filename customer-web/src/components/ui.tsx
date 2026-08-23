import clsx from "clsx";
import { Heart, Star, Sun, Eye, X, SlidersHorizontal, Check, ShieldCheck, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { type Plant } from "../data/catalog";
import { useStore } from "../lib/store";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 active:scale-95",
        variant === "primary" && "bg-leaf-600 text-white hover:bg-leaf-700 shadow-sm shadow-leaf-600/20",
        variant === "secondary" && "bg-white text-leaf-950 shadow-sm hover:bg-leaf-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
        variant === "ghost" && "text-leaf-900 hover:bg-leaf-50 dark:text-white dark:hover:bg-white/10",
        className
      )}
    >
      {children}
    </button>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-leaf-950 dark:text-white md:text-3xl tracking-tight">{title}</h2>
        {subtitle ? <p className="mt-1 max-w-2xl text-xs sm:text-sm text-stone-600 dark:text-stone-300">{subtitle}</p> : null}
      </div>
    </div>
  );
}

type PlantCardProps = {
  plant: Plant;
  viewMode?: "grid" | "list";
  onQuickView?: (plant: Plant) => void;
};

export function PlantCard({ plant, viewMode = "grid", onQuickView }: PlantCardProps) {
  const { cart, addToCart, removeFromCart, updateQuantity, toggleWishlist, wishlist } = useStore();
  const cartItem = cart.find((item) => item.id === plant.id);
  const wished = wishlist.some((item) => item.id === plant.id);

  const discountPercent = plant.discountPrice
    ? Math.round(((plant.price - plant.discountPrice) / plant.price) * 100)
    : 0;

  if (viewMode === "list") {
    return (
      <article className="group relative flex flex-col sm:flex-row gap-3 sm:gap-4 overflow-hidden rounded-2xl border border-leaf-900/10 bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md dark:border-white/10 dark:bg-stone-900/80">
        {/* Thumbnail Image */}
        <div className="relative h-44 sm:h-36 sm:w-36 w-full shrink-0 overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800">
          <Link to={`/plants/${plant.id}`} className="block h-full w-full">
            <img
              src={plant.image}
              alt={plant.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm backdrop-blur-md">
              {discountPercent}% OFF
            </span>
          )}

          {/* Quick View Button */}
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(plant)}
              className="absolute left-2 bottom-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-sm backdrop-blur-md transition hover:scale-110 active:scale-95 dark:bg-stone-900/80 dark:text-stone-200"
              title="Quick view details"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Wishlist Heart */}
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={() => toggleWishlist(plant)}
            className={clsx(
              "absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-90 dark:bg-black/60",
              wished ? "text-red-500" : "text-stone-400 hover:text-stone-600 dark:text-stone-300 dark:hover:text-white"
            )}
          >
            <Heart className={clsx("h-4 w-4", wished && "fill-current")} />
          </button>
        </div>

        {/* Content details */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="rounded-md bg-leaf-100/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-leaf-800 dark:bg-leaf-950/60 dark:text-leaf-300">
                  {plant.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-600 dark:bg-white/10 dark:text-stone-300">
                  <Sun className="h-2.5 w-2.5 text-amber-500" />
                  {plant.sunlight}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0">
                <Star className="h-3.5 w-3.5 fill-current" />
                {plant.rating}
              </span>
            </div>

            <Link
              to={`/plants/${plant.id}`}
              className="mt-1.5 block text-sm sm:text-base font-bold text-stone-900 hover:text-leaf-600 dark:text-white dark:hover:text-leaf-400"
            >
              {plant.name}
            </Link>

            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
              {plant.description}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-stone-100 pt-2.5 dark:border-white/5">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white">
                  ₹{plant.discountPrice ?? plant.price}
                </span>
                {plant.discountPrice ? (
                  <span className="text-xs text-stone-400 line-through font-normal">
                    ₹{plant.price}
                  </span>
                ) : null}
              </div>
              <span
                className={clsx(
                  "text-[10px] font-bold mt-0.5",
                  plant.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                )}
              >
                {plant.stock > 0 ? `In Stock (${plant.stock} left)` : "Out of stock"}
              </span>
            </div>

            {/* Cart actions */}
            <div className="w-24 sm:w-28">
              {cartItem ? (
                <div className="flex items-center justify-between rounded-xl border border-leaf-600 bg-leaf-600 text-white font-bold h-9 w-full overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => {
                      if (cartItem.quantity === 1) removeFromCart(plant.id);
                      else updateQuantity(plant.id, cartItem.quantity - 1);
                    }}
                    className="flex-1 h-full hover:bg-leaf-700 active:bg-leaf-800 transition flex items-center justify-center text-sm select-none"
                  >
                    -
                  </button>
                  <span className="text-xs select-none px-1.5 font-extrabold">{cartItem.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(plant.id, cartItem.quantity + 1)}
                    className="flex-1 h-full hover:bg-leaf-700 active:bg-leaf-800 transition flex items-center justify-center text-sm select-none"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  disabled={plant.stock <= 0}
                  onClick={() => addToCart(plant)}
                  className={clsx(
                    "flex h-9 w-full items-center justify-center rounded-xl border text-xs font-bold uppercase transition-all duration-200 active:scale-95 shadow-sm",
                    plant.stock <= 0
                      ? "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed dark:border-white/10 dark:bg-white/5"
                      : "border-leaf-600 bg-leaf-50 text-leaf-700 hover:bg-leaf-600 hover:text-white dark:bg-leaf-950/40 dark:text-leaf-300 dark:hover:bg-leaf-600 dark:hover:text-white"
                  )}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Default Grid View
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-leaf-900/10 bg-white p-2.5 sm:p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-stone-900/80">
      <div className="relative overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800">
        <Link to={`/plants/${plant.id}`} className="block">
          <img
            src={plant.image}
            alt={plant.name}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-emerald-600/95 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm backdrop-blur-md">
            {discountPercent}% OFF
          </span>
        )}

        {/* Type tag pill */}
        <span className="absolute left-2 bottom-2 z-10 rounded-md bg-stone-900/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 backdrop-blur-md dark:bg-black/80">
          {plant.type}
        </span>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(plant)}
            className="absolute right-2 bottom-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-sm backdrop-blur-md transition hover:scale-110 active:scale-95 dark:bg-stone-900/80 dark:text-stone-200"
            title="Quick View"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Wishlist Heart */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => toggleWishlist(plant)}
          className={clsx(
            "absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-90 dark:bg-black/60",
            wished ? "text-red-500" : "text-stone-400 hover:text-stone-600 dark:text-stone-300 dark:hover:text-white"
          )}
        >
          <Heart className={clsx("h-4 w-4", wished && "fill-current")} />
        </button>
      </div>

      <div className="mt-2.5 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-leaf-700 truncate max-w-[70%] dark:text-leaf-400">
              {plant.category}
            </span>
            <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500 shrink-0">
              <Star className="h-3 w-3 fill-current" />
              {plant.rating}
            </span>
          </div>

          <Link
            to={`/plants/${plant.id}`}
            className="mt-1 block text-xs sm:text-sm font-bold text-stone-900 hover:text-leaf-600 dark:text-stone-100 dark:hover:text-leaf-400 line-clamp-1 leading-tight"
          >
            {plant.name}
          </Link>

          <div className="mt-1 flex items-center gap-1 text-[10px] text-stone-500 dark:text-stone-400 truncate">
            <Sun className="h-2.5 w-2.5 text-amber-500 shrink-0" />
            <span className="truncate">{plant.sunlight}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-1.5 border-t border-stone-100 pt-2 dark:border-white/5">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm md:text-base font-extrabold text-stone-900 dark:text-white">
              ₹{plant.discountPrice ?? plant.price}
            </span>
            {plant.discountPrice ? (
              <span className="text-[9px] sm:text-[11px] text-stone-400 line-through">
                ₹{plant.price}
              </span>
            ) : null}
          </div>

          <div className="w-16 sm:w-20 md:w-24">
            {cartItem ? (
              <div className="flex items-center justify-between rounded-xl border border-leaf-600 bg-leaf-600 text-white font-bold h-7 sm:h-8 md:h-9 w-full overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    if (cartItem.quantity === 1) removeFromCart(plant.id);
                    else updateQuantity(plant.id, cartItem.quantity - 1);
                  }}
                  className="flex-1 h-full hover:bg-leaf-700 active:bg-leaf-800 transition flex items-center justify-center text-xs sm:text-sm select-none"
                >
                  -
                </button>
                <span className="text-[11px] sm:text-xs select-none px-1 font-bold">{cartItem.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(plant.id, cartItem.quantity + 1)}
                  className="flex-1 h-full hover:bg-leaf-700 active:bg-leaf-800 transition flex items-center justify-center text-xs sm:text-sm select-none"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                disabled={plant.stock <= 0}
                onClick={() => addToCart(plant)}
                className={clsx(
                  "flex h-7 sm:h-8 md:h-9 w-full items-center justify-center rounded-xl border text-xs font-extrabold uppercase transition-all duration-200 active:scale-95 shadow-sm",
                  plant.stock <= 0
                    ? "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed dark:border-white/10 dark:bg-white/5"
                    : "border-leaf-600 bg-leaf-50 text-leaf-700 hover:bg-leaf-600 hover:text-white dark:bg-leaf-950/40 dark:text-leaf-300 dark:hover:bg-leaf-600 dark:hover:text-white"
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

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-64 sm:h-80 animate-pulse rounded-2xl bg-stone-200/60 dark:bg-white/10" />
      ))}
    </div>
  );
}

/* Quick View Modal for Mobile & Desktop */
export function QuickViewModal({ plant, onClose }: { plant: Plant; onClose: () => void }) {
  const { cart, addToCart, removeFromCart, updateQuantity, toggleWishlist, wishlist } = useStore();
  const cartItem = cart.find((item) => item.id === plant.id);
  const wished = wishlist.some((item) => item.id === plant.id);

  const discountPercent = plant.discountPrice
    ? Math.round(((plant.price - plant.discountPrice) / plant.price) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white p-5 shadow-2xl dark:bg-stone-900 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-white/10 dark:text-stone-300 dark:hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative h-56 sm:h-48 sm:w-48 shrink-0 overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
            <img src={plant.image} alt={plant.name} className="h-full w-full object-cover" />
            {discountPercent > 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-leaf-100/70 px-2 py-0.5 text-xs font-bold text-leaf-800 dark:bg-leaf-950/60 dark:text-leaf-300">
                  {plant.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {plant.rating}
                </span>
              </div>

              <h3 className="mt-2 text-xl font-extrabold text-stone-900 dark:text-white">{plant.name}</h3>

              <div className="mt-2 flex flex-wrap gap-2 text-xs text-stone-600 dark:text-stone-300">
                <span className="flex items-center gap-1 rounded-lg bg-stone-100 px-2 py-1 dark:bg-white/10">
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  {plant.sunlight}
                </span>
                <span className="flex items-center gap-1 rounded-lg bg-stone-100 px-2 py-1 dark:bg-white/10">
                  <Sprout className="h-3.5 w-3.5 text-leaf-600" />
                  {plant.type}
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {plant.description}
              </p>
            </div>

            <div className="mt-5 border-t border-stone-100 pt-4 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xl font-extrabold text-stone-900 dark:text-white">
                    ₹{plant.discountPrice ?? plant.price}
                  </span>
                  {plant.discountPrice && (
                    <span className="ml-2 text-sm text-stone-400 line-through">₹{plant.price}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => toggleWishlist(plant)}
                  className={clsx(
                    "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition",
                    wished
                      ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/40 dark:bg-red-950/30"
                      : "border-stone-200 text-stone-600 dark:border-white/10 dark:text-stone-300"
                  )}
                >
                  <Heart className={clsx("h-4 w-4", wished && "fill-current")} />
                  {wished ? "Wishlisted" : "Add to Wishlist"}
                </button>
              </div>

              {cartItem ? (
                <div className="flex items-center justify-between rounded-2xl border border-leaf-600 bg-leaf-600 text-white font-bold h-11 w-full px-3 shadow-md">
                  <button
                    type="button"
                    onClick={() => {
                      if (cartItem.quantity === 1) removeFromCart(plant.id);
                      else updateQuantity(plant.id, cartItem.quantity - 1);
                    }}
                    className="h-full px-4 text-lg hover:bg-leaf-700 transition rounded-xl"
                  >
                    -
                  </button>
                  <span className="text-sm font-extrabold">{cartItem.quantity} In Cart</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(plant.id, cartItem.quantity + 1)}
                    className="h-full px-4 text-lg hover:bg-leaf-700 transition rounded-xl"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  disabled={plant.stock <= 0}
                  onClick={() => {
                    addToCart(plant);
                  }}
                  className={clsx(
                    "w-full rounded-2xl py-3 text-sm font-extrabold uppercase shadow-lg transition-all duration-200 active:scale-95",
                    plant.stock <= 0
                      ? "bg-stone-200 text-stone-400 cursor-not-allowed dark:bg-white/10"
                      : "bg-leaf-600 text-white hover:bg-leaf-700 shadow-leaf-600/30"
                  )}
                >
                  {plant.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              )}

              <Link
                to={`/plants/${plant.id}`}
                onClick={onClose}
                className="mt-3 block text-center text-xs font-bold text-leaf-600 hover:underline dark:text-leaf-400"
              >
                View Full Specifications & Care Guide →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Mobile Filter Drawer / Bottom Sheet */
export type FilterState = {
  priceRange: "all" | "under-300" | "300-600" | "above-600";
  sunlight: "all" | "low" | "medium" | "bright";
  type: "all" | "Indoor" | "Outdoor";
  minRating: number;
};

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  sort,
  onSortChange,
  matchCount,
  onReset,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  matchCount: number;
  onReset: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-stone-900 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-white/10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-leaf-600 dark:text-leaf-400" />
            <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">Filter & Sort</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-white/10 dark:text-stone-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-5">
          {/* Sorting Option */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Sort By
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { id: "newest", label: "Newest Arrival" },
                { id: "price-low", label: "Price: Low to High" },
                { id: "price-high", label: "Price: High to Low" },
                { id: "rating", label: "Top Rated ★" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSortChange(opt.id)}
                  className={clsx(
                    "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold border transition",
                    sort === opt.id
                      ? "border-leaf-600 bg-leaf-50 text-leaf-700 dark:bg-leaf-950/40 dark:text-leaf-300"
                      : "border-stone-200 text-stone-700 dark:border-white/10 dark:text-stone-300"
                  )}
                >
                  {opt.label}
                  {sort === opt.id && <Check className="h-3.5 w-3.5 text-leaf-600 dark:text-leaf-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Plant Type (Indoor / Outdoor) */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Environment / Type
            </label>
            <div className="mt-2 flex gap-2">
              {[
                { id: "all", label: "All Types" },
                { id: "Indoor", label: "Indoor 🪴" },
                { id: "Outdoor", label: "Outdoor ☀️" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, type: item.id as any })}
                  className={clsx(
                    "flex-1 rounded-xl py-2 text-xs font-bold border text-center transition",
                    filters.type === item.id
                      ? "border-leaf-600 bg-leaf-600 text-white shadow-sm"
                      : "border-stone-200 text-stone-700 dark:border-white/10 dark:text-stone-300"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Price Budget
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { id: "all", label: "Any Price" },
                { id: "under-300", label: "Under ₹300" },
                { id: "300-600", label: "₹300 - ₹600" },
                { id: "above-600", label: "Above ₹600" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, priceRange: p.id as any })}
                  className={clsx(
                    "rounded-xl py-2 px-3 text-xs font-bold border text-center transition",
                    filters.priceRange === p.id
                      ? "border-leaf-600 bg-leaf-50 text-leaf-700 dark:bg-leaf-950/40 dark:text-leaf-300"
                      : "border-stone-200 text-stone-700 dark:border-white/10 dark:text-stone-300"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sunlight Requirement */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Sunlight Needed
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { id: "all", label: "All Sunlight" },
                { id: "low", label: "Low Light ☁️" },
                { id: "medium", label: "Medium Light ⛅" },
                { id: "bright", label: "Bright Indirect ☀️" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, sunlight: s.id as any })}
                  className={clsx(
                    "rounded-xl py-2 px-3 text-xs font-bold border text-center transition",
                    filters.sunlight === s.id
                      ? "border-leaf-600 bg-leaf-50 text-leaf-700 dark:bg-leaf-950/40 dark:text-leaf-300"
                      : "border-stone-200 text-stone-700 dark:border-white/10 dark:text-stone-300"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Minimum Rating
            </label>
            <div className="mt-2 flex gap-2">
              {[
                { id: 0, label: "Any Rating" },
                { id: 4.5, label: "4.5★ & up" },
                { id: 4.8, label: "4.8★ & up" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, minRating: r.id })}
                  className={clsx(
                    "flex-1 rounded-xl py-2 text-xs font-bold border text-center transition",
                    filters.minRating === r.id
                      ? "border-leaf-600 bg-leaf-600 text-white shadow-sm"
                      : "border-stone-200 text-stone-700 dark:border-white/10 dark:text-stone-300"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-4 dark:border-white/10">
          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-stone-200 px-4 py-3 text-xs font-bold text-stone-600 hover:bg-stone-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/5"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-leaf-600 py-3 text-sm font-extrabold text-white shadow-lg shadow-leaf-600/30 hover:bg-leaf-700 active:scale-95 transition"
          >
            Show {matchCount} Plants
          </button>
        </div>
      </div>
    </div>
  );
}
