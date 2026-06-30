import { Link } from "react-router-dom";
import { Button, SectionHeader } from "../components/ui";
import { useStore } from "../lib/store";

export function Cart() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useStore();
  const delivery = cartTotal > 999 ? 0 : 79;
  const finalTotal = cartTotal + delivery;
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader title="Shopping Cart" subtitle="Update quantities, apply coupons, review totals, and continue to checkout." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">{cart.length ? cart.map((item) => <div key={item.id} className="flex gap-4 rounded-lg bg-white p-4 shadow-soft dark:bg-white/10"><img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" /><div className="flex-1"><h3 className="font-bold">{item.name}</h3><p>Rs. {item.discountPrice ?? item.price}</p><input type="number" min={1} value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} className="mt-2 w-20 rounded border px-2 py-1 dark:bg-transparent" /></div><button onClick={() => removeFromCart(item.id)} className="text-red-500">Remove</button></div>) : <p className="rounded-lg bg-white p-8 text-center shadow-soft dark:bg-white/10">Your cart is empty.</p>}</div>
        <aside className="rounded-lg bg-white p-5 shadow-soft dark:bg-white/10"><h3 className="text-xl font-bold">Cart Summary</h3><input className="mt-4 w-full rounded-lg border px-3 py-2 dark:bg-transparent" placeholder="Coupon code" /><div className="mt-5 space-y-2 text-sm"><p className="flex justify-between"><span>Subtotal</span><strong>Rs. {cartTotal}</strong></p><p className="flex justify-between"><span>Delivery</span><strong>Rs. {delivery}</strong></p><p className="flex justify-between border-t pt-3 text-lg"><span>Total</span><strong>Rs. {finalTotal}</strong></p></div><Link to="/checkout" className="mt-5 block rounded-lg bg-leaf-500 px-4 py-3 text-center font-bold text-white">Proceed to Checkout</Link><Link to="/catalog" className="mt-3 block text-center text-sm font-bold text-leaf-500">Continue Shopping</Link></aside>
      </div>
    </main>
  );
}
