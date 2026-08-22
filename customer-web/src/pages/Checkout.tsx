import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Banknote, Building2, Check, CreditCard, ShieldCheck, Smartphone } from "lucide-react";
import { Button, SectionHeader } from "../components/ui";
import { useStore } from "../lib/store";
import { apiRequest } from "../lib/api";
import { LocationPickerModal } from "../components/LocationPickerModal";

export function Checkout() {
  const {
    cart,
    cartTotal,
    clearCart,
    loadPlants,
    addresses,
    selectedAddressId,
    selectAddress,
    selectedAddress
  } = useStore();
  const location = useLocation();
  const appliedCoupon = location.state?.coupon || null;

  const [deliveryTarget, setDeliveryTarget] = useState<"self" | "gift">("self");
  const [recipientName, setRecipientName] = useState(() => selectedAddress?.name || "Koushik Dash");
  const [email, setEmail] = useState("koushik@email.com");
  const [phone, setPhone] = useState(() => selectedAddress?.phone || "+91 98765 43210");
  const [addressLine, setAddressLine] = useState(() => selectedAddress?.line || "Salt Lake, Sector V");
  const [city, setCity] = useState(() => selectedAddress?.city || "Kolkata");
  const [postalCode, setPostalCode] = useState(() => selectedAddress?.pin || "700091");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "net_banking" | "cod">("cod");

  const [latitude, setLatitude] = useState<number | null>(() => selectedAddress?.latitude || 22.5726);
  const [longitude, setLongitude] = useState<number | null>(() => selectedAddress?.longitude || 88.3639);

  const [locating, setLocating] = useState(false);
  const [locationMsg, setLocationMsg] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

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

    try {
      // 1. CASH ON DELIVERY (COD): Place order directly
      if (paymentMethod === "cod") {
        const res = await apiRequest<{ data: any }>("/demo/orders", {
          method: "POST",
          body: JSON.stringify(orderPayload)
        });

        setSuccessOrder(res.data);
        clearCart();
        await loadPlants();
        setLoading(false);
        return;
      }

      // 2. ONLINE PAYMENTS (UPI / Card / Net Banking via Razorpay)
      const paymentInit = await apiRequest<{
        orderNumber: string;
        razorpayOrderId: string;
        amount: number;
        currency: string;
        keyId: string;
        grandTotal: number;
      }>("/demo/orders/initiate-payment", {
        method: "POST",
        body: JSON.stringify({
          customerName: recipientName,
          customerEmail: email,
          items: orderPayload.items,
          couponCode: orderPayload.couponCode,
        }),
      });

      if (typeof window === "undefined" || !(window as any).Razorpay) {
        throw new Error("Razorpay payment gateway SDK failed to load. Please refresh and try again.");
      }

      const options = {
        key: paymentInit.keyId || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "rzp_test_TNIkLmGdzO9Bei",
        amount: paymentInit.amount,
        currency: paymentInit.currency || "INR",
        name: "Lagao.shop",
        description: `Order ${paymentInit.orderNumber} - Fresh Plants`,
        image: "/favicon.png",
        order_id: paymentInit.razorpayOrderId,
        prefill: {
          name: recipientName,
          email: email,
          contact: phone.replace(/[^\d+]/g, "") || "9876543210",
        },
        theme: {
          color: "#2d6a4f",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment popup was closed. You can retry anytime.");
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            setLoading(true);
            const res = await apiRequest<{ data: any }>("/demo/orders", {
              method: "POST",
              body: JSON.stringify({
                ...orderPayload,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            setSuccessOrder(res.data);
            clearCart();
            await loadPlants();
          } catch (err: any) {
            setError(err.message || "Payment verification failed. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setError(`Payment failed: ${response.error?.description || "Transaction declined"}`);
        setLoading(false);
      });
      rzp.open();

    } catch (err: any) {
      setError(err.message || "Failed to process checkout. Please try again.");
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
          <Panel title="Delivery Address & Location">
            <div className="space-y-4">
              {/* Delivery Target Selector */}
              <div className="rounded-lg bg-slate-100/70 p-3 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
                <p className="mb-2 text-xs font-bold text-slate-700 dark:text-slate-200">Who is this order for?</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-slate-800 dark:text-white">
                    <input
                      type="radio"
                      name="deliveryTarget"
                      checked={deliveryTarget === "self"}
                      onChange={() => setDeliveryTarget("self")}
                      className="accent-leaf-500"
                    />
                    <span>Deliver to Myself</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-slate-800 dark:text-white">
                    <input
                      type="radio"
                      name="deliveryTarget"
                      checked={deliveryTarget === "gift"}
                      onChange={() => setDeliveryTarget("gift")}
                      className="accent-leaf-500"
                    />
                    <span>Send as a Gift / Someone Else 🎁</span>
                  </label>
                </div>
              </div>

              {/* Saved Address Quick Selector (When delivering to self) */}
              {addresses.length > 0 && deliveryTarget === "self" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Select Saved Address
                    </span>
                    <Link
                      to="/profile"
                      className="text-xs font-bold text-leaf-600 dark:text-leaf-400 hover:underline"
                    >
                      + Manage Addresses
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => {
                            selectAddress(addr.id);
                            setRecipientName(addr.name);
                            setPhone(addr.phone);
                            setAddressLine(addr.line);
                            setCity(addr.city);
                            setPostalCode(addr.pin);
                            if (addr.latitude && addr.longitude) {
                              setLatitude(addr.latitude);
                              setLongitude(addr.longitude);
                            }
                          }}
                          className={`group cursor-pointer rounded-xl border p-3 transition-all flex flex-col justify-between ${
                            isSelected
                              ? "border-leaf-500 bg-leaf-50/70 dark:bg-leaf-950/40 shadow-sm ring-2 ring-leaf-500/60"
                              : "border-slate-200/80 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-white/5"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="rounded-md bg-leaf-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-leaf-800 dark:bg-leaf-950 dark:text-leaf-300">
                                  {addr.type}
                                </span>
                                {addr.isDefault && (
                                  <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                    Default
                                  </span>
                                )}
                              </div>
                              {isSelected ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-leaf-700 dark:text-leaf-400 bg-leaf-100 dark:bg-leaf-950 px-2 py-0.5 rounded-full">
                                  <Check className="h-3 w-3 stroke-[3]" /> Deliver Here
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400 group-hover:text-leaf-600 transition">
                                  Use this
                                </span>
                              )}
                            </div>

                            <h4 className="mt-2 font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              {addr.name}
                            </h4>
                            <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                              {addr.line}, {addr.city} - {addr.pin}
                            </p>
                          </div>
                          <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                            📞 {addr.phone}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500">
                    {deliveryTarget === "gift" ? "Recipient Name" : "Your Name"}
                  </label>
                  <input required value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Recipient name" className="w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500">
                    {deliveryTarget === "gift" ? "Recipient Phone Number" : "Phone Number"}
                  </label>
                  <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className="w-full" />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-slate-500">Email Address (for Order Updates)</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full" />
                </div>

                {/* Geolocation & Interactive Map Card */}
                <div className="md:col-span-2 rounded-lg bg-leaf-50/70 p-4 border border-leaf-200 dark:bg-white/5 dark:border-white/10 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-leaf-900 dark:text-white flex items-center gap-1.5">
                        <span>🗺️</span> Delivery Spot & Distance
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {deliveryTarget === "gift"
                          ? "Pin recipient's house or delivery location on the map so admin can calculate exact delivery distance."
                          : "Pin your delivery spot or use GPS to calculate precise delivery distance."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setIsMapOpen(true)}
                        className="rounded-lg bg-leaf-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-leaf-700 transition flex items-center gap-1"
                      >
                        <span>🗺️</span> Pin on Map (Search/Drag)
                      </button>
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={locating}
                        className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white disabled:opacity-50 transition"
                      >
                        {locating ? "Detecting..." : "📍 Use My GPS"}
                      </button>
                    </div>
                  </div>

                  {locationMsg && (
                    <p className="text-xs font-semibold text-leaf-700 dark:text-leaf-300">{locationMsg}</p>
                  )}

                  <div className="flex items-center justify-between rounded-md bg-white p-2.5 dark:bg-black/30 border border-leaf-100 dark:border-white/5 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      📍 Pinned Coordinates: <span className="font-bold text-leaf-800 dark:text-leaf-400">{latitude ?? 22.5726}° N, {longitude ?? 88.3639}° E</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsMapOpen(true)}
                      className="text-xs font-bold text-leaf-600 hover:underline dark:text-leaf-400"
                    >
                      Change Pin
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-slate-500">Street Address / Landmark</label>
                  <input required value={addressLine} onChange={e => setAddressLine(e.target.value)} placeholder="House/Flat No., Street, Landmark" className="w-full" />
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
            </div>
          </Panel>

          <Panel title="Payment Method">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {[
                {
                  key: "upi",
                  label: "UPI / QR",
                  subtitle: "GPay, PhonePe, Paytm, BHIM",
                  badge: "Instant ⚡",
                  icon: Smartphone,
                  iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40",
                },
                {
                  key: "card",
                  label: "Cards",
                  subtitle: "Credit & Debit (Visa, Master, RuPay)",
                  badge: "All Cards",
                  icon: CreditCard,
                  iconColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40",
                },
                {
                  key: "net_banking",
                  label: "Net Banking",
                  subtitle: "SBI, HDFC, ICICI & 50+ Banks",
                  badge: "50+ Banks",
                  icon: Building2,
                  iconColor: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40",
                },
                {
                  key: "cod",
                  label: "Cash on Delivery",
                  subtitle: "Pay cash/UPI at doorstep",
                  badge: "Pay at Door",
                  icon: Banknote,
                  iconColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40",
                },
              ].map((item) => {
                const isSelected = paymentMethod === item.key;
                const IconComponent = item.icon;
                return (
                  <label
                    key={item.key}
                    onClick={() => setPaymentMethod(item.key as any)}
                    className={`group relative flex items-center justify-between gap-2.5 rounded-xl border p-2.5 sm:p-3 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-leaf-500 bg-leaf-50/60 dark:bg-leaf-950/30 text-leaf-950 dark:text-white shadow-sm ring-1 ring-leaf-500/60"
                        : "border-slate-200/80 bg-slate-50/40 dark:border-white/10 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg ${item.iconColor} transition-transform group-hover:scale-105`}>
                        <IconComponent className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold truncate">{item.label}</span>
                          <span className="hidden xs:inline-block sm:inline-block rounded bg-leaf-100/80 px-1.5 py-0.2 text-[9px] font-bold text-leaf-800 dark:bg-leaf-950/60 dark:text-leaf-300">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 pl-1">
                      <div
                        className={`flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border transition-all ${
                          isSelected
                            ? "border-leaf-500 bg-leaf-500 text-white shadow-sm"
                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[3]" />}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Security Assurance Badge */}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50/80 px-3 py-2 text-[11px] sm:text-xs text-slate-600 dark:bg-white/5 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
              <div className="flex items-center gap-1.5 truncate">
                <ShieldCheck className="h-4 w-4 shrink-0 text-leaf-600 dark:text-leaf-400" />
                <span className="truncate">
                  {paymentMethod === "cod"
                    ? "Safe contactless doorstep delivery available."
                    : "256-Bit SSL Encrypted Online Payment via Razorpay."}
                </span>
              </div>
              <span className="shrink-0 font-bold text-[10px] sm:text-[11px] text-leaf-700 dark:text-leaf-400 ml-2">
                {paymentMethod === "cod" ? "Verified Delivery" : "Razorpay Verified"}
              </span>
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
            className={`mt-6 w-full rounded-lg bg-leaf-500 py-3.5 font-bold text-white transition shadow-soft flex items-center justify-center gap-2 ${loading || cart.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-leaf-700"}`}
          >
            {loading ? (
              <span>Processing...</span>
            ) : paymentMethod === "cod" ? (
              <span>Place Order (COD Rs. {grandTotal})</span>
            ) : (
              <span>Pay Rs. {grandTotal} with Razorpay ⚡</span>
            )}
          </button>
        </aside>
      </form>

      {/* Interactive Leaflet Map Location Picker Modal (Flipkart / Zomato style) */}
      <LocationPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialLat={latitude ?? 22.5726}
        initialLng={longitude ?? 88.3639}
        onConfirm={(data) => {
          setLatitude(data.latitude);
          setLongitude(data.longitude);
          if (data.addressLine) setAddressLine(data.addressLine);
          if (data.city) setCity(data.city);
          if (data.postalCode) setPostalCode(data.postalCode);
          setLocationMsg(`Location pinned via Map: ${data.latitude}°N, ${data.longitude}°E`);
        }}
      />
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-soft dark:bg-white/10">
      <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-leaf-900 dark:text-white">{title}</h3>
      <div className="[&_input:not([type='radio']):not([type='checkbox'])]:w-full [&_input:not([type='radio']):not([type='checkbox'])]:rounded-lg [&_input:not([type='radio']):not([type='checkbox'])]:border [&_input:not([type='radio']):not([type='checkbox'])]:border-slate-200 [&_input:not([type='radio']):not([type='checkbox'])]:bg-transparent [&_input:not([type='radio']):not([type='checkbox'])]:px-3 [&_input:not([type='radio']):not([type='checkbox'])]:py-2.5 [&_input:not([type='radio']):not([type='checkbox'])]:outline-none [&_input:not([type='radio']):not([type='checkbox'])]:focus:border-leaf-500 [&_input:not([type='radio']):not([type='checkbox'])]:dark:border-white/10 dark:text-white">
        {children}
      </div>
    </div>
  );
}

