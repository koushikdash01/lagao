import { FormEvent, useState } from "react";
import { apiRequest } from "../lib/api";

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
    <main className="grid min-h-screen place-items-center bg-[#f5f7f3] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-soft">
        <div className="mb-8 flex items-center gap-3">
          <img src="/logo.png" alt="Lagao.shop" className="h-16 w-auto" />
          <div>
            <h1 className="text-2xl font-bold text-leaf-900">Lagao Admin</h1>
            <p className="text-sm text-slate-500">Secure admin login</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">
            ⚠️ {error}
          </div>
        )}

        <label className="mb-2 block text-sm font-bold">Email</label>
        <input 
          className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-leaf-500" 
          type="email" 
          required 
          placeholder="admin@lagao.shop" 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="mb-2 block text-sm font-bold">Password</label>
        <input 
          className="mb-6 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-leaf-500" 
          type="password" 
          required 
          minLength={8} 
          placeholder="At least 8 characters" 
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="w-full rounded-lg bg-leaf-500 px-4 py-3 font-bold text-white hover:bg-leaf-700" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
