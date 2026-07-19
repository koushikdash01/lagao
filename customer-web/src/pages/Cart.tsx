import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, SectionHeader } from "../components/ui";
import { useStore } from "../lib/store";
import { apiRequest } from "../lib/api";

export function Cart() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError(null);
    setCouponSuccess(null);
    try {
      const res = await apiRequest<{ data: any }>(`/demo/coupons/validate/${couponCode.trim()}`);
      const coupon = res.data;

      if (cartTotal < Number(coupon.minimum_order_amount)) {
        setCouponError(`Min. order of Rs. ${coupon.minimum_order_amount} required`);
        setAppliedCoupon(null);
        return;
      }

      // Check selective coupon applicability
      if (coupon.category_id) {
        const matchesCategory = cart.some(item => item.categoryId === coupon.category_id);
        if (!matchesCategory) {
          setCouponError("Coupon is not applicable to any items in your cart");
          setAppliedCoupon(null);
          return;
        }
      } else if (coupon.plant_id) {
        const matchesPlant = cart.some(item => item.id === coupon.plant_id);
        if (!matchesPlant) {
          setCouponError("Coupon is not applicable to the selected items in your cart");
          setAppliedCoupon(null);
          return;
        }
      }

      setAppliedCoupon(coupon);
      setCouponSuccess(`Coupon "${coupon.code}" applied successfully!`);
    } catch (e: any) {
      setCouponError("Invalid or expired coupon code");
      setAppliedCoupon(null);
    }
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    
    let eligibleSubtotal = cartTotal;

    if (appliedCoupon.category_id) {
      eligibleSubtotal = cart
        .filter(item => item.categoryId === appliedCoupon.category_id)
        .reduce((sum, item) => sum + (item.discountPrice ?? item.price) * item.quantity, 0);
    } else if (appliedCoupon.plant_id) {
      eligibleSubtotal = cart
        .filter(item => item.id === appliedCoupon.plant_id)
        .reduce((sum, item) => sum + (item.discountPrice ?? item.price) * item.quantity, 0);
    }

    if (appliedCoupon.discount_type === "percentage") {
      return Number((eligibleSubtotal * (Number(appliedCoupon.discount_value) / 100)).toFixed(2));
    } else {
      return Math.min(Number(appliedCoupon.discount_value), eligibleSubtotal);
    }
  };

  const discount = getDiscountAmount();
  const delivery = cartTotal > 999 || cartTotal === 0 ? 0 : 79;
  const finalTotal = Math.max(0, cartTotal - discount + delivery);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader title="Shopping Cart" subtitle="Update quantities, apply coupons, review totals, and continue to checkout." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart.length ? (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-lg bg-white p-4 shadow-soft dark:bg-white/10">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-slate-500">{item.category}</p>
                  <p className="mt-1 font-semibold">Rs. {item.discountPrice ?? item.price}</p>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                    className="mt-2 w-20 rounded border px-2 py-1 dark:bg-transparent"
                  />
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 font-medium hover:text-red-700">Remove</button>
              </div>
            ))
          ) : (
            <p className="rounded-lg bg-white p-8 text-center shadow-soft dark:bg-white/10">Your cart is empty.</p>
          )}
        </div>

        <aside className="rounded-lg bg-white p-5 shadow-soft dark:bg-white/10 self-start">
          <h3 className="text-xl font-bold">Cart Summary</h3>
          <div className="mt-4 flex gap-2">
            <input
              className="w-full rounded-lg border px-3 py-2 dark:bg-transparent text-sm"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button onClick={handleApplyCoupon} className="py-2 text-sm">Apply</Button>
          </div>
          
          {couponError && <p className="mt-2 text-xs font-bold text-red-500">⚠️ {couponError}</p>}
          {couponSuccess && <p className="mt-2 text-xs font-bold text-leaf-600">✓ {couponSuccess}</p>}

          <div className="mt-5 space-y-2 text-sm border-t pt-4">
            <p className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <strong>Rs. {cartTotal}</strong>
            </p>
            {discount > 0 && (
              <p className="flex justify-between text-leaf-600 font-semibold">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>- Rs. {discount}</span>
              </p>
            )}
            <p className="flex justify-between text-slate-500">
              <span>Delivery</span>
              <strong>{delivery === 0 ? "FREE" : `Rs. ${delivery}`}</strong>
            </p>
            <p className="flex justify-between border-t pt-3 text-lg font-black text-leaf-900 dark:text-white">
              <span>Total</span>
              <strong>Rs. {finalTotal}</strong>
            </p>
          </div>
          
          <Link
            to="/checkout"
            state={{ coupon: appliedCoupon }}
            className={`mt-5 block rounded-lg bg-leaf-500 px-4 py-3 text-center font-bold text-white transition hover:bg-leaf-700 ${
              cart.length === 0 ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Proceed to Checkout
          </Link>
          <Link to="/catalog" className="mt-3 block text-center text-sm font-bold text-leaf-500 hover:underline">Continue Shopping</Link>
        </aside>
      </div>
    </main>
  );
}
