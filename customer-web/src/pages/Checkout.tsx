import { SectionHeader } from "../components/ui";

export function Checkout() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader title="Checkout" subtitle="Address management, order summary, payments, and order creation after payment." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <Panel title="Address Management"><div className="grid gap-3 md:grid-cols-2"><input placeholder="Recipient name" /><input placeholder="Phone" /><input placeholder="Address line" className="md:col-span-2" /><input placeholder="City" /><input placeholder="Postal code" /></div></Panel>
          <Panel title="Payment Methods"><div className="grid gap-3 sm:grid-cols-2">{["UPI", "Debit/Credit Card", "Net Banking", "Cash on Delivery"].map((item) => <label key={item} className="rounded-lg border p-3 dark:border-white/10"><input type="radio" name="payment" className="mr-2" />{item}</label>)}</div></Panel>
        </section>
        <aside className="rounded-lg bg-white p-5 shadow-soft dark:bg-white/10"><h3 className="text-xl font-bold">Order Summary</h3><p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Products, quantity, discounts, delivery charges, and final total are calculated by the checkout API.</p><button className="mt-5 w-full rounded-lg bg-leaf-500 py-3 font-bold text-white">Place Order</button></aside>
      </div>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-lg bg-white p-5 shadow-soft dark:bg-white/10"><h3 className="mb-4 text-xl font-bold">{title}</h3><div className="[&_input]:rounded-lg [&_input]:border [&_input]:border-slate-200 [&_input]:bg-transparent [&_input]:px-3 [&_input]:py-2 [&_input]:outline-none [&_input]:dark:border-white/10">{children}</div></div>;
}
