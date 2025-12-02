// src/components/dashboard/stats/StatCard.tsx
import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";

export interface StatCardProps {
  label: string;
  value?: string | number;
  helperText?: string;
  icon?: ReactNode;
  trendValue?: string;
  trendDirection?: TrendDirection;
  /** When true, renders skeleton instead of actual content */
  isLoading?: boolean;
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-pulse">
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between gap-2">
        <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-8 w-8 rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Value */}
      <div className="mt-4 h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />

      {/* Helper / trend */}
      <div className="mt-3 flex items-center gap-2">
        <div className="h-3 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  helperText,
  icon,
  trendValue,
  trendDirection = "neutral",
  isLoading,
}: StatCardProps) {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  const TrendIcon =
    trendDirection === "up"
      ? ArrowUpRight
      : trendDirection === "down"
      ? ArrowDownRight
      : Minus;

  const trendColor =
    trendDirection === "up"
      ? "text-emerald-600 dark:text-emerald-400"
      : trendDirection === "down"
      ? "text-rose-600 dark:text-rose-400"
      : "text-slate-500 dark:text-slate-400";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {label}
          </p>
        </div>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-50">
        {value ?? "--"}
      </p>

      {/* Bottom row: helper + trend */}
      {(helperText || trendValue) && (
        <div className="mt-3 flex items-center justify-between gap-2 text-xs">
          {helperText && (
            <p className="truncate text-slate-500 dark:text-slate-400">
              {helperText}
            </p>
          )}

          {trendValue && (
            <div className={`inline-flex items-center gap-1 text-xs ${trendColor}`}>
              <TrendIcon size={14} />
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
