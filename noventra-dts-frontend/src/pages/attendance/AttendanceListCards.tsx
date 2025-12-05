import React from "react";
import { Clock, MapPin, User2 } from "lucide-react";
import type { AttendanceRecord } from "../../types/attendance.types";
import { EntityCardList } from "../../components/shared/EntityCardList";

interface AttendanceListCardsProps {
  records: AttendanceRecord[];
  loading?: boolean;
  title?: string;
  description?: string;
  headerRight?: React.ReactNode;

  onOpenDetails?: (record: AttendanceRecord) => void;
  onEdit?: (record: AttendanceRecord) => void;
}

export const AttendanceListCards: React.FC<AttendanceListCardsProps> = ({
  records,
  loading = false,
  title = "Attendance (mobile view)",
  description = "Tap a record to see full details.",
  headerRight,
  onOpenDetails,
  onEdit,
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-slate-800 bg-slate-950/80 p-3"
          >
            <div className="h-4 w-44 rounded bg-slate-800" />
            <div className="mt-2 h-3 w-32 rounded bg-slate-900" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <EntityCardList<AttendanceRecord>
      items={records}
      title={title}
      description={description}
      headerRight={headerRight}
      getId={(r) => r.id}
      onCardClick={onOpenDetails}
      enableSearch
      searchPlaceholder="Search by name, ID, email, date…"
      getSearchText={(r) =>
        `${r.name} ${r.employeeId} ${r.email} ${r.date} ${r.status} ${r.workMode} ${r.department} ${r.role}`
      }
      // MAIN
      renderMain={(r) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-slate-100">
                {r.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-50">
                  {r.name}
                </div>
                <div className="text-[11px] text-slate-400">
                  {r.employeeId} • {r.role}
                </div>
              </div>
            </div>

            <span className="rounded-full bg-slate-900 px-2 py-[3px] text-[10px] text-slate-200">
              {r.date}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Clock size={12} className="text-slate-500" />
            <span>
              {r.loginTime} – {r.logoutTime}
            </span>
            <span className="text-slate-500">•</span>
            <span>{r.totalHours || 0} h</span>
          </div>
        </div>
      )}
      // META
      renderMeta={(r) => (
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-[2px]">
            <User2 size={11} className="text-slate-500" />
            <span>{r.department}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-[2px]">
            <MapPin size={11} className="text-slate-500" />
            <span>{r.workMode}</span>
          </span>
        </div>
      )}
      // TAGS
      renderTags={(r) => (
        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
          <span
            className={`rounded-full px-2 py-[2px] ${
              r.status === "Present"
                ? "bg-emerald-900/70 text-emerald-100"
                : r.status === "Late"
                ? "bg-amber-900/70 text-amber-100"
                : r.status === "Absent"
                ? "bg-red-900/70 text-red-100"
                : "bg-blue-900/70 text-blue-100"
            }`}
          >
            {r.status}
          </span>

          {r.notes && (
            <span className="rounded-full bg-slate-900 px-2 py-[2px] text-slate-200">
              Note: {r.notes.slice(0, 30)}
              {r.notes.length > 30 ? "…" : ""}
            </span>
          )}
        </div>
      )}
      // ACTIONS
      renderActions={(r) =>
        onEdit ? (
          <div className="flex w-full items-center justify-end gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(r);
              }}
              className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-slate-800"
            >
              Edit attendance
            </button>
          </div>
        ) : null
      }
    />
  );
};
