// src/types/datatable.types.ts
import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc";
export type ColumnAlign = "left" | "center" | "right";
export type DataTableSize = "sm" | "md" | "lg";

export interface ColumnDef<T> {
  id: string;
  header: ReactNode;
  field?: keyof T & string;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: ColumnAlign;
  className?: string;
  headerClassName?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  /** if false, column won’t appear in filterable list */
  filterable?: boolean;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];

  totalItems: number;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];

  sortBy?: string;
  sortDirection?: SortDirection;
  onSortChange?: (columnId: string, direction: SortDirection) => void;

  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  enableGlobalSearch?: boolean;
  globalSearchValue?: string;
  onGlobalSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  rightHeaderContent?: ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;

  onRowClick?: (row: T) => void;
  getRowId?: (row: T, index: number) => string | number;
  size?: DataTableSize;

  // new feature toggles
  enableColumnVisibility?: boolean;
  enableFilters?: boolean;
  enableExport?: boolean;
}


export interface AttendanceLocationState {
  employeeId?: string;
  employeeName?: string;
  employeeEmail?: string;
}