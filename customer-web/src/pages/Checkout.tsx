import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, SectionHeader } from "../components/ui";
import { useStore } from "../lib/store";
import { apiRequest } from "../lib/api";

export function Checkout() {
  const { cart, cartTotal, clearCart, loadPlants } = useStore();
  const location = useLocation();
  const appliedCoupon = location.state?.coupon || null;

  const [recipientName, setRecipientName] = useState("Koushik Dash");
  const [email, setEmail] = useState("koushik@email.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [addressLine, setAddressLine] = useState("Salt Lake, Sector V");
  const [city, setCity] = useState("Kolkata");
  const [postalCode, setPostalCode] = useState("700091");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "net_banking" | "cod">("cod");

  const [latitude, setLatitude] = useState<number | null>(22.5726);
  const [longitude, setLongitude] = useState<number | null>(88.3639);
  const [locating, setLocating] = useState(false);
  const [locationMsg, setLocationMsg] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationMsg("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setLocationMsg("Detecting your location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(Number(pos.coords.latitude.toFixed(6)));
        setLongitude(Number(pos.coords.longitude.toFixed(6)));
        setLocating(false);
        setLocationMsg(`Location detected: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
      },
      (err) => {
        setLocating(false);
        setLocationMsg(`Location access denied (${err.message}). Using manual coordinates.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
  const taxableAmount = Math.max(0, cartTotal - discount);
  const gst = Number((taxableAmount * 0.05).toFixed(2));
  const delivery = cartTotal > 499 || cartTotal === 0 ? 0 : 49;
  const grandTotal = taxableAmount + gst + delivery;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderPayload = {
        customerName: recipientName,
        customerEmail: email,
        paymentMethod,
        addressLine,
        city,
        postalCode,
        latitude: latitude !== null ? Number(latitude) : null,
        longitude: longitude !== null ? Number(longitude) : null,
        couponCode: appliedCoupon?.code || null,
        items: cart.map(item => ({
          plantId: item.id,
          quantity: item.quantity
        }))
      };

      const res = await apiRequest<{ data: any }>("/demo/orders", {
        method: "POST",
        body: JSON.stringify(orderPayload)
      });

      setSuccessOrder(res.data);
      clearCart();
      // Reload plants from database to sync updated stock counts across the UI
      await loadPlants();
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="rounded-lg bg-white p-8 shadow-soft dark:bg-white/10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-leaf-100 text-leaf-600">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-leaf-900 dark:text-white">Order Confirmed!</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Thank you for shopping at **Lagao**. Your order has been placed successfully and stock has been allocated.
          </p>
          <div className="mt-6 rounded-lg bg-[#f5f7f3] p-4 text-left dark:bg-white/5">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Order Details:</p>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p><span className="font-semibold">Order Number:</span> {successOrder.order_number}</p>
              <p><span className="font-semibold">Recipient:</span> {recipientName}</p>
              <p><span className="font-semibold">Total Amount:</span> Rs. {successOrder.total_amount}</p>
              <p><span className="font-semibold">Payment Status:</span> {successOrder.payment_status}</p>
              <p><span className="font-semibold">Deliver To:</span> {addressLine}, {city} - {postalCode}</p>
              {successOrder.distance_meters != null && (
                <p><span className="font-semibold">Calculated Distance:</span> {successOrder.distance_meters < 1000 ? `${successOrder.distance_meters} meters` : `${(successOrder.distance_meters / 1000).toFixed(1)} km`}</p>
              )}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <Link to="/catalog" className="w-full rounded-lg bg-leaf-500 py-3 font-bold text-white hover:bg-leaf-700 block text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader title="Checkout" subtitle="Fill in your delivery details, choose a payment method, and complete your purchase." />
      
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-bold text-red-700 dark:bg-red-950/20 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-5">
          <Panel title="Delivery Address & Geolocation">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Recipient Name</label>
                <input required value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Recipient name" className="w-full" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Phone Number</label>
                <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className="w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-bold text-slate-500">Email Address</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full" />
              </div>

              {/* Geolocation Card */}
              <div className="md:col-span-2 rounded-lg bg-leaf-50/60 p-4 border border-leaf-200 dark:bg-white/5 dark:border-white/10 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-leaf-900 dark:text-white flex items-center gap-1.5">
                      <span>📍</span> Location Service
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Enable GPS location to calculate precise delivery distance to admin house.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={locating}
                    className="rounded-lg bg-leaf-500 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-leaf-600 disabled:opacity-50 transition"
                  >
                    {locating ? "Detecting..." : "📍 Detect My Location"}
                  </button>
                </div>
                {locationMsg && (
                  <p className="text-xs font-semibold text-leaf-700 dark:text-leaf-300">{locationMsg}</p>
                )}
                <div className="grid gap-2 grid-cols-2 pt-1">
                  <div>
                    <label className="mb-0.5 block text-[11px] font-bold text-slate-500">Latitude (°N)</label>
                    <input
                      type="number"
                      step="any"
                      value={latitude ?? ""}
                      onChange={e => setLatitude(e.target.value ? Number(e.target.value) : null)}
                      placeholder="e.g. 22.5726"
                      className="w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-[11px] font-bold text-slate-500">Longitude (°E)</label>
                    <input
                      type="number"
                      step="any"
                      value={longitude ?? ""}
                      onChange={e => setLongitude(e.target.value ? Number(e.target.value) : null)}
                      placeholder="e.g. 88.3639"
                      className="w-full text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-bold text-slate-500">Street Address</label>
                <input required value={addressLine} onChange={e => setAddressLine(e.target.value)} placeholder="Address line" className="w-full" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">City</label>
                <input required value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="w-full" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Postal Code</label>
                <input required value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="Postal code" className="w-full" />
              </div>
            </div>
          </Panel>

          <Panel title="Payment Methods">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { key: "cod", label: "Cash on Delivery" },
                { key: "upi", label: "UPI (GPay / PhonePe / Paytm)" },
                { key: "card", label: "Debit/Credit Card" },
                { key: "net_banking", label: "Net Banking" },
              ].map((item) => (
                <label key={item.key} className={`flex items-center cursor-pointer rounded-lg border p-4 transition ${paymentMethod === item.key ? "border-leaf-500 bg-leaf-50/30 dark:bg-white/5 text-leaf-900 dark:text-white" : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === item.key}
                    onChange={() => setPaymentMethod(item.key as any)}
                    className="mr-3 h-4 w-4 accent-leaf-500"
                  />
                  <span className="font-bold text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </Panel>
        </section>

        <aside className="rounded-lg bg-white p-5 shadow-soft dark:bg-white/10 h-fit self-start">
          <h3 className="text-xl font-bold">Order Summary</h3>
          {cart.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Your cart is currently empty.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100 dark:divide-white/5">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex justify-between gap-3 text-sm">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white">{item.name}</span>
                    <p className="text-xs text-slate-500">Qty: {item.quantity} x Rs. {item.discountPrice ?? item.price}</p>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">Rs. {(item.discountPrice ?? item.price) * item.quantity}</span>
                </div>
              ))}
              <div className="py-3 text-sm space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>Rs. {cartTotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-leaf-600 font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>- Rs. {discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>GST (5%)</span>
                  <span>Rs. {gst}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charge</span>
                  <span>{delivery === 0 ? <span className="text-leaf-500 font-bold">FREE</span> : `Rs. ${delivery}`}</span>
                </div>
              </div>
              <div className="pt-3 flex justify-between text-base font-black text-leaf-900 dark:text-white">
                <span>Grand Total</span>
                <span>Rs. {grandTotal}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className={`mt-6 w-full rounded-lg bg-leaf-500 py-3.5 font-bold text-white transition shadow-soft ${loading || cart.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-leaf-700"}`}
          >
            {loading ? "Placing Order..." : `Place Order (Rs. ${grandTotal})`}
          </button>
        </aside>
      </form>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-soft dark:bg-white/10">
      <h3 className="mb-4 text-xl font-bold text-leaf-900 dark:text-white">{title}</h3>
      <div className="[&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-slate-200 [&_input]:bg-transparent [&_input]:px-3 [&_input]:py-2.5 [&_input]:outline-none [&_input]:focus:border-leaf-500 [&_input]:dark:border-white/10 dark:text-white">
        {children}
      </div>
    </div>
  );
}
