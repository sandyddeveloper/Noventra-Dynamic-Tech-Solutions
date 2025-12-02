// src/components/dashboard/widgets/TimelineWidget.tsx
import React, { useMemo, useState } from "react";
import { Clock, User2, ChevronDown, ChevronUp } from "lucide-react";
import {
  categoryIcon,
  statusColorClasses,
  type TimelineCategory,
  type TimelineItem,
  type TimelineWidgetProps,
} from "../../../types/timeline.types";

export const TimelineWidget: React.FC<TimelineWidgetProps> = ({
  title = "Activity Timeline",
  items,
  initialLimit = 6,
  categories,
  emptyMessage = "No recent activity yet.",
}) => {
  const [activeCategory, setActiveCategory] = useState<
    TimelineCategory | "all"
  >("all");
  const [showAll, setShowAll] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categoryOptions =
    categories ??
    [
      { id: "all" as const, label: "All" },
      { id: "project", label: "Projects" },
      { id: "task", label: "Tasks" },
      { id: "attendance", label: "Attendance" },
      { id: "payment", label: "Payments" },
      { id: "system", label: "System" },
    ];

  /** Filter items by category */
  const filteredItems = useMemo(() => {
    const base =
      activeCategory === "all"
        ? items
        : items.filter((i) => i.category === activeCategory);

    return showAll ? base : base.slice(0, initialLimit);
  }, [items, activeCategory, showAll, initialLimit]);

  /** Group items by groupLabel */
  const grouped = useMemo(() => {
    const map = new Map<string, TimelineItem[]>();
    filteredItems.forEach((item) => {
      const key = item.groupLabel ?? "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
    return Array.from(map.entries());
  }, [filteredItems]);

  return (
    <section
      className="
        flex h-full w-full flex-col rounded-2xl border border-slate-200
        bg-white/90 p-3 text-sm shadow-sm backdrop-blur
        dark:border-slate-800 dark:bg-slate-900/85
        sm:p-4
      "
    >
      {/* Header */}
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
            <Clock size={18} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50 sm:text-base">
              {title}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
              Live stream of project, employee & system events
            </p>
          </div>
        </div>

        {/* Collapse toggle (desktop + mobile) */}
        <button
          type="button"
          onClick={() => setIsCollapsed((v) => !v)}
          className="
            inline-flex items-center gap-1 rounded-full border border-slate-200
            bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm
            hover:bg-slate-50
            dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200
          "
        >
          {isCollapsed ? (
            <>
              Expand <ChevronDown size={12} />
            </>
          ) : (
            <>
              Collapse <ChevronUp size={12} />
            </>
          )}
        </button>
      </header>

      {/* Filters */}
      {!isCollapsed && (
        <div
          className="
            mb-3 -mx-1 flex gap-1.5 overflow-x-auto pb-1
            scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent
            dark:scrollbar-thumb-slate-700
            sm:mx-0 sm:flex-wrap sm:overflow-visible
          "
        >
          {categoryOptions.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setActiveCategory(cat.id as TimelineCategory | "all")
                }
                className={[
                  "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                  isActive
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-200"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                ].join(" ")}
              >
                {cat.id === "all" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Body (scrollable timeline) */}
      {!isCollapsed && (
        <div
          className="
            relative -mx-1 flex-1 overflow-y-auto px-1 pt-1 pb-2
            scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent
            dark:scrollbar-thumb-slate-700
          "
        >
          {grouped.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 text-center text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              <span className="text-lg">🛰️</span>
              <span>{emptyMessage}</span>
            </div>
          ) : (
            <ol className="space-y-4">
              {grouped.map(([groupLabel, groupItems]) => (
                <li key={groupLabel}>
                  {/* Date / group header */}
                  <div
                    className="
                      sticky top-0 z-10 mb-2 flex items-center gap-2
                      bg-gradient-to-r from-white via-white/95 to-transparent
                      py-1 text-[11px] font-semibold uppercase tracking-wide
                      text-slate-400 backdrop-blur
                      dark:from-slate-900 dark:via-slate-900/95
                    "
                  >
                    <span className="h-[1px] w-4 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <span>{groupLabel}</span>
                  </div>

                  {/* Timeline items */}
                  <ul className="space-y-3">
                    {groupItems.map((item, idx) => {
                      const status = item.status ?? "default";
                      const colors = statusColorClasses[status];
                      const Icon =
                        item.icon ||
                        categoryIcon[item.category ?? "other"] ||
                        Clock;

                      const showConnector = idx !== groupItems.length - 1; // line to next item

                      return (
                        <li
                          key={item.id}
                          className="relative flex gap-3 sm:gap-4"
                        >
                          {/* Left: dot + vertical line */}
                          <div className="relative flex w-6 flex-col items-center">
                            <div
                              className={[
                                "mt-1 h-3 w-3 rounded-full ring-2 ring-offset-2 dark:ring-offset-slate-900",
                                colors.dot,
                                status === "default"
                                  ? "ring-slate-100 dark:ring-slate-700"
                                  : "ring-current/20",
                              ].join(" ")}
                            />
                            {showConnector && (
                              <div className="mt-1 flex-1 border-l border-dashed border-slate-200 dark:border-slate-700" />
                            )}
                          </div>

                          {/* Right: card */}
                          <article
                            className={[
                              "flex flex-1 flex-col rounded-xl border px-3 py-2.5 text-xs shadow-sm transition",
                              "hover:-translate-y-[1px] hover:shadow-md",
                              colors.border,
                              colors.bgSoft,
                              "sm:px-4 sm:py-3 sm:text-sm",
                            ].join(" ")}
                          >
                            {/* Top row */}
                            <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                              <div className="flex flex-1 items-center gap-2">
                                {/* Avatar / icon */}
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/5 text-slate-700 dark:bg-slate-900/60 dark:text-slate-100 sm:h-9 sm:w-9">
                                  {item.avatarInitials ? (
                                    <span className="text-[11px] font-semibold sm:text-xs">
                                      {item.avatarInitials}
                                    </span>
                                  ) : (
                                    <Icon size={16} />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <h3 className="truncate text-xs font-semibold text-slate-900 dark:text-slate-50 sm:text-sm">
                                    {item.title}
                                  </h3>

                                  {/* Meta line: actor, role */}
                                  <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                                    {item.actorName && (
                                      <span className="inline-flex items-center gap-1">
                                        <User2 size={11} />
                                        <span className="truncate max-w-[120px] sm:max-w-none">
                                          {item.actorName}
                                        </span>
                                      </span>
                                    )}
                                    {item.actorRole && (
                                      <>
                                        <span className="mx-1 h-0.5 w-0.5 rounded-full bg-slate-400" />
                                        <span className="uppercase tracking-wide">
                                          {item.actorRole}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Status / meta pill */}
                              <div className="flex flex-col items-end gap-1 text-right">
                                {item.meta && (
                                  <div className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700">
                                    {item.meta}
                                  </div>
                                )}
                                <time className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {item.timestamp}
                                </time>
                              </div>
                            </div>

                            {/* Description */}
                            {item.description && (
                              <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xs">
                                {item.description}
                              </p>
                            )}
                          </article>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* Footer controls */}
      {!isCollapsed && items.length > initialLimit && (
        <div className="mt-2 flex flex-col gap-2 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
          <span className="hidden sm:inline">
            Showing{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {filteredItems.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {items.length}
            </span>{" "}
            events
          </span>

          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="
              ml-auto inline-flex items-center justify-center gap-1 rounded-full
              bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm
              hover:bg-slate-800
              dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200
            "
          >
            {showAll ? "Show less" : "Show full history"}
            {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      )}
    </section>
  );
};

export default TimelineWidget;
