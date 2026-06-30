import clsx from "clsx";
import type { ReactNode } from "react";

export function PageHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-leaf-900 dark:text-white">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Button({ children, variant = "primary" }: { children: ReactNode; variant?: "primary" | "secondary" | "danger" }) {
  return (
    <button
      className={clsx(
        "rounded-lg px-4 py-2 text-sm font-bold transition",
        variant === "primary" && "bg-leaf-500 text-white hover:bg-leaf-700",
        variant === "secondary" && "bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:bg-white/10 dark:text-white",
        variant === "danger" && "bg-red-500 text-white hover:bg-red-600",
      )}
    >
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("rounded-lg bg-white p-5 shadow-soft dark:bg-white/10", className)}>{children}</div>;
}

export function StatusPill({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
        ["available", "delivered", "active", "approved"].includes(normalized) && "bg-leaf-100 text-leaf-700",
        ["packed", "shipped", "pending", "placed"].includes(normalized) && "bg-amber-100 text-amber-700",
        ["out of stock", "cancelled", "hidden", "inactive"].includes(normalized) && "bg-red-100 text-red-700",
      )}
    >
      {value}
    </span>
  );
}

export function DataTable({ columns, rows }: { columns: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-soft dark:bg-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-white/10">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <tr>{columns.map((column) => <th key={column} className="px-5 py-3 font-bold">{column}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/80 dark:hover:bg-white/5">
                {row.map((cell, cellIndex) => <td key={cellIndex} className="whitespace-nowrap px-5 py-4">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
