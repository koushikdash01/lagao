import { SectionHeader } from "../components/ui";

const content: Record<string, string> = {
  about: "Lagao brings greenery back into everyday homes with healthy plants, careful delivery, and practical care guidance.",
  contact: "Reach support for orders, returns, care questions, and business enquiries.",
  faqs: "Find answers about delivery, payments, plant care, refunds, and account management.",
  "shipping-policy": "Shipping timelines, delivery charges, safe packaging, and serviceability rules.",
  "return-policy": "Return windows, damaged plant policy, replacement rules, and refund processing.",
  "privacy-policy": "How customer data, addresses, payments, wishlist, and notifications are handled.",
  "terms-and-conditions": "Terms for using Lagao.shop, placing orders, cancellations, payments, and account responsibilities."
};

export function StaticPage({ slug }: { slug: string }) {
  const title = slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
  return <main className="mx-auto max-w-4xl px-4 py-14"><SectionHeader title={title} /><div className="rounded-lg bg-white p-8 leading-8 shadow-soft dark:bg-white/10">{content[slug] ?? content.about}</div></main>;
}
