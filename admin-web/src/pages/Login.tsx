import { FormEvent, useState } from "react";
import { apiRequest } from "../lib/api";
import { Lock, Mail, Sprout } from "lucide-react";

export function Login({ onLogin }: { onLogin: () => void }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("admin@lagao.shop");
  const [password, setPassword] = useState("Password123");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("lagao_admin_token", res.token);
      onLogin();
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f8f5] px-4 dark:bg-[#06110a] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-[#0c1a11]"
        >
          <div className="mb-8 flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Lagao.shop"
              className="h-14 w-auto max-w-[150px] object-contain transition-all duration-300 dark:brightness-110 dark:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            />
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Lagao Admin
              </h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Nursery & Store Management Portal
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-300">
              ⚠️ {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-leaf-500 focus:bg-white focus:ring-2 focus:ring-leaf-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-[#06110a] dark:focus:border-leaf-400"
                type="email"
                required
                placeholder="admin@lagao.shop"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-leaf-500 focus:bg-white focus:ring-2 focus:ring-leaf-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-[#06110a] dark:focus:border-leaf-400"
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            className="w-full rounded-xl bg-leaf-600 py-3 text-sm font-extrabold text-white shadow-lg shadow-leaf-600/25 transition-all hover:bg-leaf-700 active:scale-[0.98] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In to Admin Portal"}
          </button>
        </form>
      </div>
    </main>
  );
}

