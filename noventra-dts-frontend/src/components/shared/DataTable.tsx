// src/components/common/table/DataTable.tsx
import { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
} from "lucide-react";
import type { ColumnDef, DataTableProps, SortDirection } from "../../types/datatable.types";

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
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const sizeClasses = useMemo(() => {
    switch (size) {
      case "sm":
        return {
          row: "text-sm", // ~14px
          cell: "px-3 py-2",
          header: "px-3 py-2",
        };
      case "lg":
        return {
          row: "text-base", // ~16px
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

  const handleSort = (col: ColumnDef<T>) => {
    if (!onSortChange || !col.sortable) return;
    const nextDirection: SortDirection =
      sortBy === col.id && sortDirection === "asc" ? "desc" : "asc";
    onSortChange(col.id, nextDirection);
  };

  const handlePageChange = (nextPage: number) => {
    if (!onPageChange) return;
    const clamped = Math.min(Math.max(nextPage, 1), totalPages);
    onPageChange(clamped);
  };

  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* TOP BAR: Search + actions */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          {enableGlobalSearch && (
            <div className="relative w-full max-w-sm">
              <input
                value={globalSearchValue}
                onChange={(e) => onGlobalSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="block w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-500/40"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                ⌘K
              </span>
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {/* Page size selector */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {rightHeaderContent && (
            <div className="flex items-center gap-2">{rightHeaderContent}</div>
          )}
        </div>
      </div>

      {/* TABLE WRAPPER */}
      <div className="relative -mx-2 sm:-mx-4 overflow-x-auto overflow-y-hidden rounded-lg border border-slate-100 bg-slate-50/40 scroll-smooth no-scrollbar dark:border-slate-800 dark:bg-slate-950/30">
        <table className="min-w-full divide-y divide-slate-200 text-left dark:divide-slate-800">
          <thead className="sticky top-0 z-10 bg-slate-100/95 text-xs font-semibold uppercase tracking-wide text-slate-500 backdrop-blur dark:bg-slate-900/95 dark:text-slate-400">
            <tr>
              {columns.map((col) => {
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
                      "whitespace-nowrap",
                      align,
                      col.headerClassName || "",
                      responsiveClassNames,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col)}
                        className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                      >
                        {col.header}
                        <ArrowUpDown
                          size={14}
                          className={
                            isSorted
                              ? sortDirection === "asc"
                                ? "rotate-180 text-blue-500"
                                : "text-blue-500"
                              : "text-slate-400"
                          }
                        />
                      </button>
                    ) : (
                      <span className="text-xs font-semibold">{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-950">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <span className="h-2 w-2 animate-ping rounded-full bg-blue-500" />
                    <span>Loading data… Please wait.</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const rowId =
                  getRowId?.(row, index) ?? (index as string | number);

                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick?.(row)}
                    className={[
                      sizeClasses.row,
                      "transition-colors odd:bg-white even:bg-slate-50/60 hover:bg-slate-100/80 dark:odd:bg-slate-950 dark:even:bg-slate-900/80 dark:hover:bg-slate-900",
                      onRowClick ? "cursor-pointer" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {columns.map((col) => {
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
                            "whitespace-normal md:whitespace-nowrap text-slate-800 dark:text-slate-100",
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
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:text-slate-400">
        <div className="leading-tight">
          {totalItems > 0 ? (
            <span>
              Showing{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {from}
              </span>{" "}
              –{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {to}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {totalItems}
              </span>{" "}
              records
            </span>
          ) : (
            <span>No records</span>
          )}
        </div>

        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="px-2 text-sm">
            Page{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {totalPages}
            </span>
          </span>

          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
