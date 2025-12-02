import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc";

export interface ColumnDef<T> {
  /** Unique id for column (used for sorting) */
  id: string;
  /** Header label */
  header: string;
  /** Optional accessor key if your row is a simple object */
  field?: keyof T;
  /** Custom cell renderer (overrides `field`) */
  cell?: (row: T) => ReactNode;
  /** Center / right alignment etc. */
  align?: "left" | "center" | "right";
  /** Is this column sortable? */
  sortable?: boolean;
  /** Optional classNames */
  className?: string;
  headerClassName?: string;

  /** 🔹 Smart responsive visibility */
  /** Hide this column on small screens (< md) */
  hideOnMobile?: boolean;
  /** Hide this column on medium screens (< lg), still visible on desktop */
  hideOnTablet?: boolean;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];

  /** Total items (for server-side pagination) */
  totalItems: number;

  /** 1-based current page */
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];

  sortBy?: string | null;
  sortDirection?: SortDirection;
  onSortChange?: (columnId: string, direction: SortDirection) => void;

  /** Called when user changes page (1-based index) */
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  /** Search / filter controls */
  enableGlobalSearch?: boolean;
  globalSearchValue?: string;
  onGlobalSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  /** Extra content (e.g. filters, buttons) on the right side of header */
  rightHeaderContent?: ReactNode;

  /** States */
  isLoading?: boolean;
  emptyMessage?: string;

  /** Row interactions */
  onRowClick?: (row: T) => void;
  getRowId?: (row: T, index: number) => string | number;

  /** Optional compact / density mode */
  size?: "sm" | "md" | "lg";
}
