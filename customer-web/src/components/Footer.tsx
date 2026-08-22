import { Link } from "react-router-dom";
import {
  Clock,
  Heart,
  Leaf,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  Truck
} from "lucide-react";

export function Footer() {
  const policies = [
    { label: "Shipping Policy", path: "/pages/shipping-policy" },
    { label: "Return Policy", path: "/pages/return-policy" },
    { label: "Privacy Policy", path: "/pages/privacy-policy" },
    { label: "Terms and Conditions", path: "/pages/terms-and-conditions" },
    { label: "Contact Us", path: "/contact" },
    { label: "About Us", path: "/about" },
    { label: "FAQs", path: "/faqs" }
  ];

  return (
    <footer className="relative mt-20 border-t border-leaf-800/40 bg-gradient-to-b from-[#112a19] via-[#0d2214] to-[#07130b] text-white">
      {/* Top Value Badges (Mobile & Desktop) */}
      <div className="border-b border-white/10 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-500/20 text-leaf-300 ring-1 ring-leaf-400/30">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white">Express Delivery</p>
                <p className="text-[10px] sm:text-[11px] text-white/60 truncate">Free over ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30">
                <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white">Fresh Nursery Plants</p>
                <p className="text-[10px] sm:text-[11px] text-white/60 truncate">100% Healthy Guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/30">
                <PackageCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white">Secure Packaging</p>
                <p className="text-[10px] sm:text-[11px] text-white/60 truncate">Damage-proof transit</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white">Secure Payments</p>
                <p className="text-[10px] sm:text-[11px] text-white/60 truncate">UPI, Cards & COD</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand Info */}
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Lagao.shop"
                className="h-11 sm:h-13 w-auto rounded-xl bg-white/95 p-1.5 shadow-md transition hover:opacity-90"
              />
            </Link>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/75">
              Lagao brings curated greens straight to your doorstep with careful packaging, premium nursery quality, and plant care support.
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap md:flex-col gap-2.5 sm:gap-4 md:gap-2 text-xs text-white/75 bg-white/5 md:bg-transparent p-3.5 sm:p-4 md:p-0 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-leaf-400" />
              <span>Salt Lake, Sector V, Kolkata, WB 700091</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-leaf-400" />
              <a href="mailto:support@lagao.shop" className="hover:text-white transition">
                support@lagao.shop
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-leaf-400" />
              <a href="tel:+919876543210" className="hover:text-white transition">
                +91 98765 43210 (9 AM - 9 PM)
              </a>
            </div>
          </div>
        </div>

        {/* Essential Policy Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/10 pt-6 text-xs text-white/70">
          {policies.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="hover:text-white hover:underline transition"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Accepted Payment Methods Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-white/60 uppercase tracking-wider">
              100% Safe Payments:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-white/80">
              <span className="rounded bg-white/10 px-2 py-0.5">UPI</span>
              <span className="rounded bg-white/10 px-2 py-0.5">Google Pay</span>
              <span className="rounded bg-white/10 px-2 py-0.5">PhonePe</span>
              <span className="rounded bg-white/10 px-2 py-0.5">Cards</span>
              <span className="rounded bg-white/10 px-2 py-0.5">NetBanking</span>
              <span className="rounded bg-white/10 px-2 py-0.5">COD</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-white/60">
            <Clock className="h-3.5 w-3.5 text-leaf-400" />
            <span>Fast Dispatch in 24-48 Hours</span>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="mt-5 flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-5 text-center text-[11px] sm:text-xs text-white/50 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Lagao.shop · All rights reserved.</p>
          <p className="flex items-center justify-center gap-1 text-white/70">
            Handcrafted with <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 inline" /> for green living in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
