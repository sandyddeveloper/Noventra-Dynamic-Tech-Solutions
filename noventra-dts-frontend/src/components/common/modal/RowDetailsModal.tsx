import React from "react";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

export interface RowDetailsField<T> {
  label: string;
  value: (item: T) => React.ReactNode;
  /** make field span full width row (like Full-time in the screenshot) */
  fullWidth?: boolean;
}

interface RowDetailsModalProps<T> {
  isOpen: boolean;
  item: T | null;
  title: string | ((item: T) => React.ReactNode);
  fields: RowDetailsField<T>[];

  onClose: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function RowDetailsModal<T>({
  isOpen,
  item,
  title,
  fields,
  onClose,
  onEdit,
  onDelete,
}: RowDetailsModalProps<T>) {
  if (!isOpen || !item) return null;

  const resolvedTitle =
    typeof title === "function" ? title(item) : title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col gap-4 rounded-2xl bg-slate-950 px-6 py-5 text-slate-100 shadow-2xl">
        {/* Title */}
        <h2 className="text-2xl font-semibold tracking-tight">
          {resolvedTitle}
        </h2>

        {/* Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field, idx) => (
            <div
              key={idx}
              className={
                "rounded-xl bg-slate-900 px-4 py-3 text-sm shadow-sm md:py-4 " +
                (field.fullWidth
                  ? "md:col-span-2"
                  : "md:col-span-1")
              }
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {field.label}
              </div>
              <div className="mt-1.5 text-sm text-slate-50">
                {field.value(item)}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-2 border-t border-slate-800" />

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-200"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-200"
              >
                <Edit2 size={16} />
                <span>Edit</span>
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-800"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
