import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  LayoutGrid,
  Filter as FilterIcon,
  Download,
  Search as SearchIcon,
  MoreVertical,
  X,
  Printer,
  FileDown,
  CheckSquare,
  Square,
  Plus,
} from "lucide-react";
import type {
  ColumnDef,
  DataTableProps,
  SortDirection,
} from "../../types/datatable.types";

type FilterOperator = "contains" | "equals" | "startsWith" | "endsWith";

interface FilterRule {
  id: string;
  columnId: string;
  operator: FilterOperator;
  value: string;
}

function createFilterId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getHeaderLabel<T>(col: ColumnDef<T>): string {
  if (typeof col.header === "string" || typeof col.header === "number") {
    return String(col.header);
  }
  return col.id;
}

export function DataTable<T>({
  columns,
  data,
  totalItems,
  page,
  pageSize,
  pageSizeOptions = [5, 10, 25, 50, 100],
  sortBy,
  sortDirection = "asc",
  onSortChange,
  onPageChange,
  onPageSizeChange,
  enableGlobalSearch = true,
  globalSearchValue = "",
  onGlobalSearchChange,
  searchPlaceholder = "Search...",
  rightHeaderContent,
  isLoading = false,
  emptyMessage = "No data to display.",
  onRowClick,
  getRowId,
  size = "md",
  // new feature toggles
  enableColumnVisibility = true,
  enableFilters = true,
  enableExport = true,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {},
  );
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [columnSearch, setColumnSearch] = useState("");
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const [openHeaderMenuId, setOpenHeaderMenuId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // initialise visible columns when columns change
  useEffect(() => {
    setVisibleColumns((prev) => {
      const next: Record<string, boolean> = {};
      columns.forEach((c) => {
        next[c.id] = prev[c.id] ?? true;
      });
      return next;
    });
  }, [columns]);

  const sizeClasses = useMemo(() => {
    switch (size) {
      case "sm":
        return {
          row: "text-xs",
          cell: "px-3 py-2",
          header: "px-3 py-2",
        };
      case "lg":
        return {
          row: "text-base",
          cell: "px-5 py-3.5",
          header: "px-5 py-3.5",
        };
      case "md":
      default:
        return {
          row: "text-sm",
          cell: "px-4 py-2.5",
          header: "px-4 py-2.5",
        };
    }
  }, [size]);

  const handleSortToggle = (col: ColumnDef<T>) => {
    if (!onSortChange || !col.sortable) return;
    const nextDirection: SortDirection =
      sortBy === col.id && sortDirection === "asc" ? "desc" : "asc";
    onSortChange(col.id, nextDirection);
  };

  const handleSortExplicit = (col: ColumnDef<T>, dir: SortDirection) => {
    if (!onSortChange || !col.sortable) return;
    onSortChange(col.id, dir);
  };

  const handlePageChange = (nextPage: number) => {
    if (!onPageChange) return;
    const clamped = Math.min(Math.max(nextPage, 1), totalPages);
    onPageChange(clamped);
  };

  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  const effectiveSearchValue = onGlobalSearchChange
    ? globalSearchValue ?? ""
    : internalSearch;

  const handleSearchChange = (value: string) => {
    if (onGlobalSearchChange) {
      onGlobalSearchChange(value);
    } else {
      setInternalSearch(value);
    }
  };

  // basic client-side search + filter for the current page’s data
  const processedData = useMemo(() => {
    let rows = data;

    if (enableGlobalSearch && effectiveSearchValue && !onGlobalSearchChange) {
      const query = effectiveSearchValue.toLowerCase();
      rows = rows.filter((row) =>
        columns.some((col) => {
          if (!col.field) return false;
          const value = (row as any)[col.field];
          if (value == null) return false;
          return String(value).toLowerCase().includes(query);
        }),
      );
    }

    if (enableFilters && filters.length > 0) {
      rows = rows.filter((row) =>
        filters.every((rule) => {
          const col = columns.find((c) => c.id === rule.columnId);
          if (!col || !col.field) return true;
          const raw = (row as any)[col.field];
          const str = raw == null ? "" : String(raw).toLowerCase();
          const val = rule.value.toLowerCase();

          switch (rule.operator) {
            case "equals":
              return str === val;
            case "startsWith":
              return str.startsWith(val);
            case "endsWith":
              return str.endsWith(val);
            case "contains":
            default:
              return str.includes(val);
          }
        }),
      );
    }

    return rows;
  }, [
    data,
    columns,
    enableGlobalSearch,
    effectiveSearchValue,
    onGlobalSearchChange,
    enableFilters,
    filters,
  ]);

  const visibleColumnDefs = useMemo(
    () =>
      columns.filter((c) => {
        return visibleColumns[c.id] !== false;
      }),
    [columns, visibleColumns],
  );

  const visibleColumnCount = visibleColumnDefs.length || 1;

  const allColumnsVisible = useMemo(
    () => columns.every((c) => visibleColumns[c.id] !== false),
    [columns, visibleColumns],
  );

  const toggleColumnVisibility = (id: string) => {
    setVisibleColumns((prev) => {
      const next = { ...prev };
      const willHide = next[id] !== false;

      // don’t allow hiding the last visible column
      const currentlyVisible = columns.filter(
        (c) => next[c.id] !== false,
      ).length;
      if (willHide && currentlyVisible <= 1) return prev;

      next[id] = !willHide;
      return next;
    });
  };

  const resetColumnVisibility = () => {
    const next: Record<string, boolean> = {};
    columns.forEach((c) => {
      next[c.id] = true;
    });
    setVisibleColumns(next);
  };

  const toggleAllColumns = () => {
    if (allColumnsVisible) {
      if (!columns.length) return;
      const firstId = columns[0].id;
      const next: Record<string, boolean> = {};
      columns.forEach((c) => {
        next[c.id] = c.id === firstId;
      });
      setVisibleColumns(next);
    } else {
      resetColumnVisibility();
    }
  };

  const addFilter = () => {
    if (!columns.length) return;
    const firstFilterable =
      columns.find((c) => !!c.field && c.filterable !== false) ?? columns[0];
    setFilters((prev) => [
      ...prev,
      {
        id: createFilterId(),
        columnId: firstFilterable.id,
        operator: "contains",
        value: "",
      },
    ]);
  };

  const handleExportCsv = () => {
    try {
      const exportableCols = visibleColumnDefs.filter((c) => c.field);
      if (!exportableCols.length) return;

      const header = exportableCols
        .map((c) => {
          const label = getHeaderLabel(c);
          return `"${label.replace(/"/g, '""')}"`;
        })
        .join(",");

      const rows = processedData.map((row) =>
        exportableCols
          .map((c) => {
            const value = (row as any)[c.field as string];
            const str = value == null ? "" : String(value);
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(","),
      );

      const csv = [header, ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "table-data.csv";
      a.click();
      URL.revokeObjectURL(url);
      setShowExportMenu(false);
    } catch (err) {
      // fail silently – it’s a helper
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
    setShowExportMenu(false);
  };

  const filterableColumns = columns.filter((c) => c.field);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm shadow-xl shadow-black/40 backdrop-blur dark:bg-slate-950/80">
      {/* TOP TOOLBAR */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm font-semibold text-slate-100">
          {/* Optional: place table title here if needed */}
        </div>

        <div className="relative flex items-center gap-2">
          {enableColumnVisibility && (
            <button
              type="button"
              onClick={() =>
                setShowColumnManager((prev) => !prev)
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 shadow-sm hover:border-slate-500 hover:bg-slate-800 hover:text-white"
            >
              <LayoutGrid size={16} />
            </button>
          )}

          {enableFilters && (
            <button
              type="button"
              onClick={() => {
                setShowFilters((prev) => !prev);
                if (!showFilters && filters.length === 0) {
                  addFilter();
                }
              }}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 shadow-sm hover:border-slate-500 hover:bg-slate-800 hover:text-white ${showFilters ? "border-blue-500 text-blue-400" : ""
                }`}
            >
              <FilterIcon size={16} />
            </button>
          )}

          {enableExport && (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowExportMenu((prev) => !prev)
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 shadow-sm hover:border-slate-500 hover:bg-slate-800 hover:text-white"
              >
                <Download size={16} />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 z-30 mt-2 w-48 rounded-xl border border-slate-700 bg-slate-900 py-1 text-xs text-slate-100 shadow-xl">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex w-full items-center gap-2 px-3 py-2 hover:bg-slate-800"
                  >
                    <Printer size={14} />
                    <span>Print</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="flex w-full items-center gap-2 px-3 py-2 hover:bg-slate-800"
                  >
                    <FileDown size={14} />
                    <span>Download as CSV</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SEARCH ICON + DROPDOWN PANEL */}
          {enableGlobalSearch && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSearchInput((prev) => !prev);
                  setTimeout(
                    () => searchInputRef.current?.focus(),
                    30,
                  );
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 shadow-sm hover:border-slate-500 hover:bg-slate-800 hover:text-white"
              >
                <SearchIcon size={16} />
              </button>

              {showSearchInput && (
  <div className="absolute right-0 top-11 z-40 w-80 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-3 text-xs text-slate-100 shadow-2xl shadow-black/50 backdrop-blur">
    {/* Header */}
    <div className="mb-2 flex items-center justify-between gap-2">
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Global search
        </span>
        <span className="text-[11px] text-slate-500">
          Search across all visible columns
        </span>
      </div>
      <button
        type="button"
        onClick={() => setShowSearchInput(false)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-500 hover:bg-slate-800 hover:text-slate-100"
      >
        <X size={13} />
      </button>
    </div>

    {/* Input */}
    <div className="relative">
      <SearchIcon
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
      />
      <input
        ref={searchInputRef}
        value={effectiveSearchValue}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        className="w-full rounded-full border border-slate-700 bg-slate-950 py-2 pl-8 pr-16 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
      />
      {/* clear button */}
      {effectiveSearchValue && (
        <button
          type="button"
          onClick={() => handleSearchChange("")}
          className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
        >
          <X size={11} />
        </button>
      )}
      {/* shortcut hint pill */}
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-800 px-2 py-[2px] text-[9px] font-medium tracking-wide text-slate-300">
        ⌘K
      </span>
    </div>

    {/* Helper text */}
    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
      <span>Press Enter to apply filters faster</span>
      <span className="rounded-full bg-slate-800/80 px-2 py-[2px] text-[9px] text-slate-300">
        Searching {visibleColumnDefs.length} columns
      </span>
    </div>
  </div>
)}

            </div>
          )}

          {rightHeaderContent && (
            <div className="ml-2 flex items-center gap-2">
              {rightHeaderContent}
            </div>
          )}

          {/* COLUMN MANAGER PANEL */}
          {enableColumnVisibility && showColumnManager && (
            <div className="absolute right-0 top-11 z-40 w-64 rounded-2xl border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">Columns</span>
                <button
                  type="button"
                  onClick={() => setShowColumnManager(false)}
                  className="rounded-full p-1 hover:bg-slate-800"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="relative mb-3">
                <SearchIcon
                  size={14}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={columnSearch}
                  onChange={(e) =>
                    setColumnSearch(e.target.value)
                  }
                  placeholder="Search"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-1.5 pl-7 pr-2 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                />
              </div>

              <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
                {columns
                  .filter((c) => {
                    const label = getHeaderLabel(c).toLowerCase();
                    return label.includes(
                      columnSearch.toLowerCase(),
                    );
                  })
                  .map((col) => {
                    const label = getHeaderLabel(col);
                    const isVisible =
                      visibleColumns[col.id] !== false;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() =>
                          toggleColumnVisibility(col.id)
                        }
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-slate-800"
                      >
                        {isVisible ? (
                          <CheckSquare
                            size={14}
                            className="text-blue-400"
                          />
                        ) : (
                          <Square size={14} />
                        )}
                        <span className="truncate text-xs">
                          {label}
                        </span>
                      </button>
                    );
                  })}
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={toggleAllColumns}
                  className="font-medium text-blue-400 hover:text-blue-300"
                >
                  Show/Hide All
                </button>
                <button
                  type="button"
                  onClick={resetColumnVisibility}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FILTER BUILDER */}
      {enableFilters && showFilters && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-100">
          {filters.length > 0 && (
            <div className="mb-1 flex gap-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              <span className="w-40">Columns</span>
              <span className="w-32">Operator</span>
              <span className="flex-1">Value</span>
            </div>
          )}

          <div className="space-y-2">
            {filters.map((rule) => (
              <div
                key={rule.id}
                className="flex flex-wrap items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) =>
                      prev.filter((f) => f.id !== rule.id),
                    )
                  }
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-950 hover:bg-slate-800"
                >
                  <X size={12} />
                </button>

                <select
                  value={rule.columnId}
                  onChange={(e) =>
                    setFilters((prev) =>
                      prev.map((f) =>
                        f.id === rule.id
                          ? {
                            ...f,
                            columnId: e.target.value,
                          }
                          : f,
                      ),
                    )
                  }
                  className="h-8 w-40 rounded-lg border border-slate-700 bg-slate-950 px-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                >
                  {filterableColumns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {getHeaderLabel(c)}
                    </option>
                  ))}
                </select>

                <select
                  value={rule.operator}
                  onChange={(e) =>
                    setFilters((prev) =>
                      prev.map((f) =>
                        f.id === rule.id
                          ? {
                            ...f,
                            operator:
                              e.target
                                .value as FilterOperator,
                          }
                          : f,
                      ),
                    )
                  }
                  className="h-8 w-32 rounded-lg border border-slate-700 bg-slate-950 px-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                >
                  <option value="contains">contains</option>
                  <option value="equals">equals</option>
                  <option value="startsWith">starts with</option>
                  <option value="endsWith">ends with</option>
                </select>

                <input
                  value={rule.value}
                  onChange={(e) =>
                    setFilters((prev) =>
                      prev.map((f) =>
                        f.id === rule.id
                          ? { ...f, value: e.target.value }
                          : f,
                      ),
                    )
                  }
                  placeholder="Filter value"
                  className="h-8 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                />
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={addFilter}
              className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-600 px-2 py-1 text-[11px] text-slate-200 hover:border-slate-400 hover:bg-slate-800/60"
            >
              <Plus size={12} />
              <span>Add filter</span>
            </button>

            {filters.length > 0 && (
              <button
                type="button"
                onClick={() => setFilters([])}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

    

      {/* TABLE WRAPPER */}
      <div className="relative -mx-2 overflow-x-auto overflow-y-hidden rounded-2xl border border-slate-800 bg-slate-950/40 scroll-smooth no-scrollbar sm:-mx-4">
        <table className="min-w-full divide-y divide-slate-800 text-left">
          <thead className="sticky top-0 z-10 bg-slate-950/95 text-xs font-semibold uppercase tracking-wide text-slate-400 backdrop-blur">
            <tr>
              {visibleColumnDefs.map((col) => {
                const align =
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                      ? "text-right"
                      : "text-left";

                const isSorted = sortBy === col.id;

                const responsiveClassNames = [
                  col.hideOnMobile ? "hidden md:table-cell" : "",
                  col.hideOnTablet ? "hidden lg:table-cell" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <th
                    key={col.id}
                    scope="col"
                    className={[
                      sizeClasses.header,
                      "relative whitespace-nowrap",
                      align,
                      col.headerClassName || "",
                      responsiveClassNames,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div className="flex items-center justify-between gap-1">
                      {col.sortable ? (
                        <button
                          type="button"
                          onClick={() => handleSortToggle(col)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-slate-200 hover:text-white"
                        >
                          <span>{col.header}</span>
                          <ArrowUpDown
                            size={13}
                            className={
                              isSorted
                                ? sortDirection === "asc"
                                  ? "rotate-180 text-blue-400"
                                  : "text-blue-400"
                                : "text-slate-500"
                            }
                          />
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-200">
                          {col.header}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setOpenHeaderMenuId((prev) =>
                            prev === col.id ? null : col.id,
                          )
                        }
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-800 hover:text-slate-100"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {openHeaderMenuId === col.id && (
                        <div className="absolute right-0 top-full z-40 mt-2 w-40 rounded-xl border border-slate-700 bg-slate-900 py-1 text-[11px] text-slate-100 shadow-xl">
                          {col.sortable && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSortExplicit(col, "asc")
                                }
                                className="flex w-full items-center px-3 py-1.5 hover:bg-slate-800"
                              >
                                Sort ascending
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSortExplicit(col, "desc")
                                }
                                className="flex w-full items-center px-3 py-1.5 hover:bg-slate-800"
                              >
                                Sort descending
                              </button>
                              <div className="my-1 border-t border-slate-700" />
                            </>
                          )}

                          {enableColumnVisibility && (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenHeaderMenuId(null);
                                toggleColumnVisibility(col.id);
                              }}
                              className="flex w-full items-center px-3 py-1.5 hover:bg-slate-800"
                            >
                              Hide column
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800 bg-slate-950 text-slate-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={visibleColumnCount}
                  className="px-6 py-10 text-center text-sm text-slate-400"
                >
                  <div className="inline-flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs shadow-sm">
                    <span className="h-2 w-2 animate-ping rounded-full bg-blue-500" />
                    <span>Loading data… Please wait.</span>
                  </div>
                </td>
              </tr>
            ) : processedData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumnCount}
                  className="px-6 py-12 text-center text-sm text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              processedData.map((row, index) => {
                const rowId =
                  getRowId?.(row, index) ??
                  (index as string | number);

                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick?.(row)}
                    className={[
                      sizeClasses.row,
                      "transition-colors odd:bg-slate-950 even:bg-slate-900/80 hover:bg-slate-900",
                      onRowClick ? "cursor-pointer" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {visibleColumnDefs.map((col) => {
                      const align =
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                            ? "text-right"
                            : "text-left";

                      const responsiveClassNames = [
                        col.hideOnMobile ? "hidden md:table-cell" : "",
                        col.hideOnTablet ? "hidden lg:table-cell" : "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      const value = col.cell
                        ? col.cell(row)
                        : col.field
                          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (row as any)[col.field]
                          : null;

                      return (
                        <td
                          key={col.id}
                          className={[
                            sizeClasses.cell,
                            align,
                            "whitespace-nowrap text-slate-100",
                            "max-w-xs md:max-w-none truncate",
                            col.className || "",
                            responsiveClassNames,
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* BOTTOM BAR: Info + Pagination */}
      <div className="flex flex-col gap-3 border-t border-slate-800 pt-3 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
        <div className="leading-tight">
          {totalItems > 0 ? (
            <span>
              Showing{" "}
              <span className="font-semibold text-slate-100">
                {from}
              </span>{" "}
              –{" "}
              <span className="font-semibold text-slate-100">
                {to}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-100">
                {totalItems}
              </span>{" "}
              records
            </span>
          ) : (
            <span>No records</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Page size selector */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) =>
                onPageSizeChange?.(Number(e.target.value))
              }
              className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none hover:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="px-2 text-xs">
              Page{" "}
              <span className="font-semibold text-slate-100">
                {page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-100">
                {totalPages}
              </span>
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(totalPages)}
              disabled={page === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
