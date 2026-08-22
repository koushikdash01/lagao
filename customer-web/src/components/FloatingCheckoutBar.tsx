import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronUp, ChevronDown, ShoppingBag, Sparkles, Trash2, X } from "lucide-react";
import { useStore } from "../lib/store";

export function FloatingCheckoutBar() {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Do not show on Cart, Checkout, Profile, Orders, or Auth pages
  const isHiddenRoute =
    location.pathname === "/cart" ||
    location.pathname === "/checkout" ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/orders") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup");

  if (cartCount === 0 || isHiddenRoute) {
    return null;
  }

  const freeDeliveryThreshold = 999;
  const isFreeDelivery = cartTotal >= freeDeliveryThreshold;
  const amountNeeded = Math.max(0, freeDeliveryThreshold - cartTotal);
  const progressPercent = Math.min(100, Math.round((cartTotal / freeDeliveryThreshold) * 100));

  // Get distinct preview items (up to 3)
  const previewItems = cart.slice(0, 3);
  const remainingCount = cart.length - previewItems.length;

  return (
    <>
      {/* Quick Drawer Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Quick Cart Drawer */}
      <div
        className={`fixed left-0 right-0 z-45 mx-auto max-w-2xl px-4 transition-all duration-300 ease-out ${
          isExpanded
            ? "bottom-24 sm:bottom-28 opacity-100 translate-y-0 pointer-events-auto"
            : "bottom-0 opacity-0 translate-y-8 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-[#102517]/95">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-leaf-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Cart Items ({cartCount})
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearCart}
                className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Cart Item Rows */}
          <div className="max-h-60 space-y-2.5 overflow-y-auto py-3 pr-1">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-2.5 dark:bg-white/5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-11 w-11 shrink-0 rounded-lg object-cover shadow-sm"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                      {item.name}
                    </p>
                    <p className="text-[11px] font-semibold text-leaf-600 dark:text-leaf-400">
                      ₹{item.discountPrice ?? item.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center rounded-lg border border-leaf-500 bg-leaf-500 text-white font-bold h-7 w-20 overflow-hidden shadow-sm shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (item.quantity === 1) {
                        removeFromCart(item.id);
                      } else {
                        updateQuantity(item.id, item.quantity - 1);
                      }
                    }}
                    className="flex-1 h-full hover:bg-leaf-600 active:bg-leaf-700 transition flex items-center justify-center text-xs select-none"
                  >
                    -
                  </button>
                  <span className="text-xs select-none px-1">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex-1 h-full hover:bg-leaf-600 active:bg-leaf-700 transition flex items-center justify-center text-xs select-none"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Bottom Checkout Bar (Zomato / Blinkit Style) */}
      <div className="fixed bottom-3 sm:bottom-5 left-0 right-0 z-45 mx-auto max-w-xl sm:max-w-2xl px-3 sm:px-4 pointer-events-auto animate-floatSlideUp">
        <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-r from-[#143a1e] via-[#1b5e20] to-[#207a38] p-3 sm:p-3.5 text-white shadow-[0_14px_40px_rgba(20,58,30,0.5)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_18px_50px_rgba(20,58,30,0.65)] hover:-translate-y-0.5">
          
          {/* Subtle Ambient Top Progress / Shimmer Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-black/20">
            <div
              className={`h-full transition-all duration-500 ${
                isFreeDelivery
                  ? "bg-gradient-to-r from-amber-300 to-emerald-300"
                  : "bg-emerald-400"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2.5 sm:gap-4 pt-1">
            {/* Left Section: Thumbnails + Item count & Price */}
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer select-none group/info min-w-0"
              title="Click to preview cart items"
            >
              {/* Stacked Product Avatars */}
              <div className="flex items-center -space-x-3 sm:-space-x-3.5 shrink-0 pl-0.5">
                {previewItems.map((item, idx) => (
                  <img
                    key={item.id}
                    src={item.image}
                    alt={item.name}
                    style={{ zIndex: 10 - idx }}
                    className="h-10 w-10 sm:h-11 sm:w-11 rounded-full sm:rounded-xl object-cover border-2 border-white dark:border-leaf-900 shadow-md ring-1 ring-black/10"
                  />
                ))}
                {remainingCount > 0 && (
                  <div
                    style={{ zIndex: 6 }}
                    className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full sm:rounded-xl border-2 border-white bg-white/20 backdrop-blur-md text-[11px] font-black text-white shadow-md"
                  >
                    +{remainingCount}
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase text-leaf-100 bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {cartCount} {cartCount === 1 ? "Item" : "Items"}
                  </span>
                  <button
                    type="button"
                    aria-label="Toggle cart drawer"
                    className="text-white/80 hover:text-white transition-transform duration-200"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronUp className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white">
                    ₹{cartTotal}
                  </span>
                  <span className="text-[10px] sm:text-xs text-white/70">plus taxes</span>
                </div>

                {/* Free Delivery Promo Pill */}
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-100 truncate">
                  {isFreeDelivery ? (
                    <>
                      <Sparkles className="h-3 w-3 text-amber-300 shrink-0" />
                      <span className="text-amber-200 font-bold truncate">FREE Delivery unlocked!</span>
                    </>
                  ) : (
                    <span>
                      Add ₹{amountNeeded} for <strong className="text-amber-200">FREE Delivery</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section: Prominent Checkout CTA Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="hidden sm:inline-flex items-center justify-center rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-white backdrop-blur hover:bg-white/25 transition active:scale-95"
              >
                View Cart
              </button>

              <Link
                to="/checkout"
                className="relative inline-flex items-center gap-1.5 rounded-xl sm:rounded-2xl bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-black text-leaf-900 shadow-lg transition-all duration-200 hover:bg-emerald-50 hover:shadow-xl active:scale-95"
              >
                <span>Checkout</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 text-leaf-700" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
