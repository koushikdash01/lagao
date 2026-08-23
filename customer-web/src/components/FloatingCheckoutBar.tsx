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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Quick Cart Drawer */}
      <div
        className={`fixed left-0 right-0 z-50 mx-auto max-w-2xl px-4 transition-all duration-300 ease-out ${
          isExpanded
            ? "bottom-20 sm:bottom-24 opacity-100 translate-y-0 pointer-events-auto"
            : "bottom-0 opacity-0 translate-y-8 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-stone-900/80 p-4 shadow-2xl backdrop-blur-xl dark:border-emerald-400/40 dark:bg-stone-950/85">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Cart Items ({cartCount})
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearCart}
                className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="rounded-full p-1 text-stone-400 hover:bg-white/10 hover:text-white transition"
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
                className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-2.5 border border-white/5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-sm"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-white">
                      {item.name}
                    </p>
                    <p className="text-[11px] font-semibold text-emerald-400">
                      ₹{item.discountPrice ?? item.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center rounded-xl border border-emerald-500 bg-emerald-600 text-white font-bold h-7 w-20 overflow-hidden shadow-sm shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (item.quantity === 1) {
                        removeFromCart(item.id);
                      } else {
                        updateQuantity(item.id, item.quantity - 1);
                      }
                    }}
                    className="flex-1 h-full hover:bg-emerald-700 active:bg-emerald-800 transition flex items-center justify-center text-xs select-none"
                  >
                    -
                  </button>
                  <span className="text-xs select-none px-1 font-bold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex-1 h-full hover:bg-emerald-700 active:bg-emerald-800 transition flex items-center justify-center text-xs select-none"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Bottom Checkout Bar (High Visibility in Light & Dark Mode) */}
      <div className="fixed bottom-3 sm:bottom-4 left-0 right-0 z-40 mx-auto max-w-xl sm:max-w-2xl px-3 sm:px-4 pointer-events-auto animate-floatSlideUp">
        <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-400/40 bg-stone-900/75 dark:bg-stone-950/80 dark:border-emerald-400/60 p-3 sm:p-3.5 text-white shadow-[0_16px_50px_rgba(0,0,0,0.6)] dark:shadow-[0_16px_50px_rgba(5,46,22,0.6)] ring-1 ring-emerald-500/30 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/70 hover:shadow-[0_20px_60px_rgba(16,185,129,0.25)] hover:-translate-y-0.5">
          
          {/* Glowing Ambient Top Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
            <div
              className={`h-full transition-all duration-500 ${
                isFreeDelivery
                  ? "bg-gradient-to-r from-amber-300 via-emerald-400 to-green-300 shadow-[0_0_10px_#34d399]"
                  : "bg-emerald-400 shadow-[0_0_8px_#34d399]"
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
                    className="h-10 w-10 sm:h-11 sm:w-11 rounded-full sm:rounded-xl object-cover border-2 border-stone-800 shadow-md ring-1 ring-emerald-500/40"
                  />
                ))}
                {remainingCount > 0 && (
                  <div
                    style={{ zIndex: 6 }}
                    className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full sm:rounded-xl border-2 border-stone-800 bg-emerald-950/80 backdrop-blur-md text-[11px] font-black text-emerald-300 shadow-md ring-1 ring-emerald-500/40"
                  >
                    +{remainingCount}
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-xs font-extrabold tracking-wider uppercase text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {cartCount} {cartCount === 1 ? "Item" : "Items"}
                  </span>
                  <button
                    type="button"
                    aria-label="Toggle cart drawer"
                    className="text-stone-300 hover:text-white transition-transform duration-200"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronUp className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white">
                    ₹{cartTotal}
                  </span>
                  <span className="text-[10px] sm:text-xs text-stone-400">plus taxes</span>
                </div>

                {/* Free Delivery Promo Pill */}
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-stone-300 truncate">
                  {isFreeDelivery ? (
                    <>
                      <Sparkles className="h-3 w-3 text-amber-300 shrink-0" />
                      <span className="text-amber-300 font-bold truncate">FREE Delivery unlocked!</span>
                    </>
                  ) : (
                    <span>
                      Add ₹{amountNeeded} for <strong className="text-emerald-300">FREE Delivery</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section: Vibrant High-Contrast Checkout CTA Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="hidden sm:inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-stone-200 border border-white/10 hover:bg-white/20 transition active:scale-95"
              >
                View Cart
              </button>

              <Link
                to="/checkout"
                className="relative inline-flex items-center gap-1.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-black text-stone-950 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-200 hover:from-emerald-400 hover:to-green-400 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] active:scale-95"
              >
                <span>Checkout</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 text-stone-950" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
