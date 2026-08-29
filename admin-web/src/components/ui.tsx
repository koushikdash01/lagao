import clsx from "clsx";
import { TrendingUp, TrendingDown, ArrowUpRight, LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm font-medium text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-leaf-500/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        variant === "primary" &&
          "bg-leaf-600 text-white shadow-md shadow-leaf-600/20 hover:bg-leaf-700 active:bg-leaf-800",
        variant === "secondary" &&
          "bg-white text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:bg-white/10 dark:border-white/15 dark:text-slate-100 dark:hover:bg-white/20 dark:hover:text-white",
        variant === "outline" &&
          "border border-leaf-600/40 text-leaf-700 hover:bg-leaf-50 dark:border-leaf-400/40 dark:text-leaf-300 dark:hover:bg-leaf-950/60",
        variant === "ghost" &&
          "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10",
        variant === "danger" &&
          "bg-red-600 text-white shadow-md shadow-red-600/20 hover:bg-red-700 active:bg-red-800",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
  hoverable = false,
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-200/90 bg-white p-5 shadow-soft transition-all duration-200 text-slate-900 dark:border-white/10 dark:bg-[#0c1a11] dark:text-slate-100 dark:shadow-none",
        hoverable && "hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 dark:hover:border-white/20",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  title,
  value,
  trend,
  trendType = "neutral",
  subtitle,
  icon: Icon,
  color = "emerald",
}: {
  title: string;
  value: string | number;
  trend?: string;
  trendType?: "up" | "down" | "neutral" | "warning";
  subtitle?: string;
  icon?: LucideIcon;
  color?: "emerald" | "amber" | "blue" | "purple" | "rose";
}) {
  const colorMap = {
    emerald: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20",
    blue: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-500/20",
    rose: "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-500/20",
  };

  return (
    <Card hoverable className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
              {value}
            </h3>
          </div>
        </div>
        {Icon && (
          <div
            className={clsx(
              "flex h-12 w-12 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110",
              colorMap[color]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/10">
        {trend ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            {trendType === "up" && (
              <span className="flex items-center gap-1 rounded-md bg-emerald-100/80 px-2 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <TrendingUp className="h-3.5 w-3.5" />
                {trend}
              </span>
            )}
            {trendType === "down" && (
              <span className="flex items-center gap-1 rounded-md bg-rose-100/80 px-2 py-0.5 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                <TrendingDown className="h-3.5 w-3.5" />
                {trend}
              </span>
            )}
            {trendType === "warning" && (
              <span className="flex items-center gap-1 rounded-md bg-amber-100/80 px-2 py-0.5 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                <ArrowUpRight className="h-3.5 w-3.5" />
                {trend}
              </span>
            )}
            {trendType === "neutral" && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                {trend}
              </span>
            )}
          </div>
        ) : <div />}

        {subtitle && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {subtitle}
          </span>
        )}
      </div>
    </Card>
  );
}

export function StatusPill({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  
  let pillStyle = "bg-slate-100 text-slate-800 border-slate-200 dark:bg-white/10 dark:text-slate-200 dark:border-white/10";

  if (["available", "delivered", "active", "approved", "completed", "in stock"].includes(normalized)) {
    pillStyle = "bg-emerald-100/80 text-emerald-800 border-emerald-300/80 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700/60";
  } else if (["packed", "shipped", "pending", "placed", "processing", "needs review"].includes(normalized)) {
    pillStyle = "bg-amber-100/80 text-amber-800 border-amber-300/80 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700/60";
  } else if (["out of stock", "cancelled", "hidden", "inactive", "requires action", "low stock"].includes(normalized)) {
    pillStyle = "bg-rose-100/80 text-rose-800 border-rose-300/80 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700/60";
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold capitalize tracking-wide shadow-2xs",
        pillStyle
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}

export function DataTable({
  columns,
  rows,
  emptyMessage = "No records found.",
}: {
  columns: string[];
  rows: ReactNode[][];
  emptyMessage?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-soft dark:border-white/10 dark:bg-[#0c1a11]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/80 text-sm dark:divide-white/10">
          <thead className="bg-slate-100/90 text-left text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:bg-[#06110a] dark:text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-3.5">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={index}
                  className="transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="whitespace-nowrap px-5 py-4 text-slate-800 dark:text-slate-200">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/15 dark:bg-[#0c1a11] text-slate-900 dark:text-white animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}


