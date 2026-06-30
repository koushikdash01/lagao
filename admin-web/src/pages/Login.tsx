import { FormEvent, useState } from "react";

export function Login({ onLogin }: { onLogin: () => void }) {
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("lagao_admin_token", "demo-token");
      setLoading(false);
      onLogin();
    }, 450);
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

        <label className="mb-2 block text-sm font-bold">Email</label>
        <input className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-leaf-500" type="email" required placeholder="admin@lagao.shop" />

        <label className="mb-2 block text-sm font-bold">Password</label>
        <input className="mb-6 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-leaf-500" type="password" required minLength={8} placeholder="At least 8 characters" />

        <button className="w-full rounded-lg bg-leaf-500 px-4 py-3 font-bold text-white hover:bg-leaf-700" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
