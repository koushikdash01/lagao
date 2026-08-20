import { Link } from "react-router-dom";

export function AuthPage({ mode }: { mode: "login" | "signup" | "forgot" | "reset" | "verify" }) {
  const title = {
    login: "Login",
    signup: "Create Account",
    forgot: "Forgot Password",
    reset: "Reset Password",
    verify: "Verify Email"
  }[mode];
  return (
    <main className="grid min-h-[calc(100vh-80px)] place-items-center px-4 py-10">
      <form className="w-full max-w-md rounded-lg bg-white p-8 shadow-soft dark:bg-white/10">
        <img src="/logo.png" alt="Lagao.shop" className="mb-6 h-16 w-auto transition-all duration-300 dark:brightness-110 dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.85)]" />
        <h1 className="text-3xl font-black text-leaf-900 dark:text-white">{title}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">JWT authentication, protected routes, remember me, email verification, and reset flows are supported by the API.</p>
        {mode === "signup" ? <input className="mt-6 w-full rounded-lg border px-3 py-3 dark:bg-transparent" placeholder="Full name" /> : null}
        {mode !== "reset" && mode !== "verify" ? <input className="mt-4 w-full rounded-lg border px-3 py-3 dark:bg-transparent" type="email" placeholder="Email" /> : null}
        {mode === "login" || mode === "signup" || mode === "reset" ? <input className="mt-4 w-full rounded-lg border px-3 py-3 dark:bg-transparent" type="password" placeholder="Password" /> : null}
        {mode === "login" ? <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" /> Remember me</label> : null}
        <button className="mt-6 w-full rounded-lg bg-leaf-500 py-3 font-bold text-white">{title}</button>
        <div className="mt-5 flex justify-between text-sm font-bold text-leaf-500"><Link to="/login">Login</Link><Link to="/signup">Sign up</Link><Link to="/forgot-password">Forgot?</Link></div>
      </form>
    </main>
  );
}
