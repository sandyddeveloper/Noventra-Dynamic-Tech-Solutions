import { AlertTriangle, Briefcase, CalendarDays, CheckCircle2, Clock, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type TimelineCategory =
  | "project"
  | "task"
  | "attendance"
  | "payment"
  | "system"
  | "other";

export type TimelineStatus = "default" | "success" | "warning" | "danger";

export interface TimelineItem {
  id: string | number;
  title: string;
  description?: string;
  /** ISO string or already formatted label */
  timestamp: string;
  /** Used for grouping headers (e.g. "Today", "Yesterday", "Dec 2025") */
  groupLabel?: string;
  category?: TimelineCategory;
  status?: TimelineStatus;
  actorName?: string;
  actorRole?: string;
  avatarInitials?: string;
  icon?: LucideIcon;
  /** Additional right-side content (e.g. pill, amount, tag) */
  meta?: ReactNode;
}

/** Props for the widget */
export interface TimelineWidgetProps {
  title?: string;
  items: TimelineItem[];

  /** Maximum items to show initially */
  initialLimit?: number;

  /** Optional categories filter chips (if omitted, built from data) */
  categories?: { id: TimelineCategory | "all"; label: string }[];

  /** Empty-state message */
  emptyMessage?: string;
}

 /** Helper: category -> default icon */
export const categoryIcon: Partial<Record<TimelineCategory, LucideIcon>> = {
  project: Briefcase,
  task: CheckCircle2,
  attendance: CalendarDays,
  payment: Clock,
  system: AlertTriangle,
};

/** Helper: status -> color classes */
export const statusColorClasses: Record<
  TimelineStatus,
  { dot: string; border: string; text: string; bgSoft: string }
> = {
  default: {
    dot: "bg-slate-400 dark:bg-slate-500",
    border: "border-slate-200 dark:border-slate-700",
    text: "text-slate-600 dark:text-slate-300",
    bgSoft: "bg-slate-50 dark:bg-slate-900/60",
  },
  success: {
    dot: "bg-emerald-500",
    border: "border-emerald-100 dark:border-emerald-900/60",
    text: "text-emerald-700 dark:text-emerald-300",
    bgSoft: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  warning: {
    dot: "bg-amber-500",
    border: "border-amber-100 dark:border-amber-900/60",
    text: "text-amber-700 dark:text-amber-300",
    bgSoft: "bg-amber-50 dark:bg-amber-900/20",
  },
  danger: {
    dot: "bg-rose-500",
    border: "border-rose-100 dark:border-rose-900/60",
    text: "text-rose-700 dark:text-rose-300",
    bgSoft: "bg-rose-50 dark:bg-rose-900/20",
  },
};