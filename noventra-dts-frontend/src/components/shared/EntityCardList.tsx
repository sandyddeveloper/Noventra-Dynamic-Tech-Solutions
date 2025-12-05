import React, { useMemo, useState } from "react";
import {
  Star,
  StarOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface EntityCardListProps<T> {
  items: T[];
  title?: string;
  description?: string;

  /** Unique id for each item */
  getId: (item: T) => string;

  /** Called when whole card is tapped */
  onCardClick?: (item: T) => void;

  /** Enable built-in text search */
  enableSearch?: boolean;
  searchPlaceholder?: string;
  /** Text used for internal search */
  getSearchText?: (item: T) => string;

  /** Optional “favorite / pin” icon on the left */
  getIsFavorite?: (item: T) => boolean;
  onToggleFavorite?: (item: T) => void;

  /** Main card body (title, code, status chips etc.) */
  renderMain: (item: T) => React.ReactNode;

  /** Small meta grid under main (owner, assignee, due date…) */
  renderMeta?: (item: T) => React.ReactNode;

  /** Tags row (chips) */
  renderTags?: (item: T) => React.ReactNode;

  /** Extra section shown when expanded */
  renderExpanded?: (item: T) => React.ReactNode;

  /** Bottom-right action buttons */
  renderActions?: (item: T) => React.ReactNode;

  /** Extra content in header (right side) */
  headerRight?: React.ReactNode;
}

export function EntityCardList<T>({
  items,
  title,
  description,
  getId,
  onCardClick,
  enableSearch = true,
  searchPlaceholder = "Search…",
  getSearchText,
  getIsFavorite,
  onToggleFavorite,
  renderMain,
  renderMeta,
  renderTags,
  renderExpanded,
  renderActions,
  headerRight,
}: EntityCardListProps<T>) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const processedItems = useMemo(() => {
    let rows = [...items];

    if (enableSearch && search.trim() && getSearchText) {
      const q = search.toLowerCase();
      rows = rows.filter((item) =>
        getSearchText(item).toLowerCase().includes(q),
      );
    }

    // optional: favorites at top
    if (getIsFavorite) {
      rows.sort((a, b) => {
        const fa = getIsFavorite(a) ? 1 : 0;
        const fb = getIsFavorite(b) ? 1 : 0;
        return fb - fa;
      });
    }

    return rows;
  }, [items, search, enableSearch, getSearchText, getIsFavorite]);

  return (
    <div className="flex w-full max-w-full flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 sm:p-4 text-xs sm:text-sm text-slate-100 shadow-xl shadow-black/40">
      {/* HEADER + SEARCH */}
      {(title || enableSearch || headerRight) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            {title && (
              <h2 className="text-sm sm:text-base font-semibold text-slate-50">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-[11px] sm:text-xs text-slate-400">
                {description}
              </p>
            )}
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            {enableSearch && (
              <div className="relative w-full sm:w-64">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-full border border-slate-700 bg-slate-950 py-2 pl-3 pr-9 text-xs sm:text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {headerRight && (
              <div className="flex justify-end">{headerRight}</div>
            )}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {processedItems.length === 0 && (
        <div className="mt-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-6 text-center text-xs text-slate-400">
          No records to show.
        </div>
      )}

      {/* CARD LIST */}
      <div className="flex flex-col gap-3">
        {processedItems.map((item) => {
          const id = getId(item);
          const isExpanded = expandedId === id;
          const hasFavorite = !!getIsFavorite && !!onToggleFavorite;

          return (
            <div
              key={id}
              className="rounded-2xl border border-slate-800 bg-slate-950/95 p-3 sm:p-4 shadow-sm shadow-black/40"
            >
              {/* TOP ROW: FAVORITE + MAIN + EXPAND TOGGLE */}
              <div className="flex items-start gap-2">
                {hasFavorite && (
                  <button
                    type="button"
                    onClick={() => onToggleFavorite?.(item)}
                    className="mt-[2px] inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-yellow-300 hover:bg-slate-900"
                  >
                    {getIsFavorite?.(item) ? (
                      <Star size={14} className="fill-yellow-300" />
                    ) : (
                      <StarOff size={14} />
                    )}
                  </button>
                )}

                <div
                  className={`flex-1 ${onCardClick ? "cursor-pointer" : ""}`}
                  onClick={() => onCardClick?.(item)}
                >
                  {renderMain(item)}
                </div>

                {renderExpanded && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId((prev) => (prev === id ? null : id))
                    }
                    className="ml-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800"
                  >
                    {isExpanded ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                )}
              </div>

              {/* META */}
              {renderMeta && (
                <div className="mt-3">{renderMeta(item)}</div>
              )}

              {/* TAGS */}
              {renderTags && (
                <div className="mt-2">{renderTags(item)}</div>
              )}

              {/* EXPANDED CONTENT */}
              {renderExpanded && isExpanded && (
                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 sm:p-3">
                  {renderExpanded(item)}
                </div>
              )}

              {/* ACTIONS */}
              {renderActions && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  {renderActions(item)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
