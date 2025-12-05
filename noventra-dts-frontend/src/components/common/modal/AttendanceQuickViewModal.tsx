import { CalendarDays, CheckCircle2, Clock, MapPin, ShieldAlert, ShieldCheck, X } from "lucide-react";
import type { AttendanceQuickViewModalProps } from "../../../types/attendance.types";

export const AttendanceQuickViewModal: React.FC<AttendanceQuickViewModalProps> = ({
  open,
  record,
  onClose,
}) => {
  if (!open || !record) return null;

  const geoStatusLabel =
    record.workMode === "WFH"
      ? "WFH – geofence not required"
      : !record.geoLat || !record.geoLng
      ? "Location not captured"
      : record.geoVerified
      ? "Inside office geofence"
      : "Outside office geofence";

  const geoStatusColor =
    record.workMode === "WFH"
      ? "bg-slate-900 text-slate-200"
      : !record.geoLat || !record.geoLng
      ? "bg-slate-900 text-slate-200"
      : record.geoVerified
      ? "bg-emerald-900/60 text-emerald-100"
      : "bg-red-900/70 text-red-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-950 px-6 py-5 text-slate-100 shadow-2xl shadow-black/60">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="font-mono">{record.employeeId}</span>
              <span className="rounded-full bg-slate-900 px-3 py-[3px]">
                {record.role} · {record.department}
              </span>
            </div>
            <h2 className="mt-1 text-lg font-semibold text-slate-50">
              {record.name}
            </h2>
            <p className="mt-1 text-[12px] text-slate-400">
              {record.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-4 text-xs md:grid-cols-3">
          {/* Attendance info */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Attendance
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <CalendarDays size={13} className="text-slate-400" />
              <span>
                Date:{" "}
                <span className="text-slate-200">{record.date}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <Clock size={13} className="text-slate-400" />
              <span>
                Login:{" "}
                <span className="text-slate-200">
                  {record.loginTime || "-"}
                </span>{" "}
                · Logout:{" "}
                <span className="text-slate-200">
                  {record.logoutTime || "-"}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <Clock size={13} className="text-slate-400" />
              <span>
                Total hours:{" "}
                <span className="text-slate-200">
                  {record.totalHours || 0} h
                </span>
              </span>
            </div>
          </div>

          {/* Status / work mode / geo */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Status & Mode
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <CheckCircle2 size={13} className="text-slate-400" />
              <span>
                Status:{" "}
                <span className="text-slate-200">{record.status}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <MapPin size={13} className="text-slate-400" />
              <span>
                Work mode:{" "}
                <span className="text-slate-200">
                  {record.workMode}
                </span>
              </span>
            </div>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full px-3 py-[3px] text-[11px] font-medium">
              {record.workMode === "WFH" ? (
                <ShieldCheck size={12} className="text-slate-300" />
              ) : record.geoVerified ? (
                <ShieldCheck size={12} className="text-emerald-300" />
              ) : (
                <ShieldAlert size={12} className="text-red-300" />
              )}
              <span className={geoStatusColor}>{geoStatusLabel}</span>
            </div>
          </div>

          {/* Geo details */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Geo details
            </div>
            {record.geoLat && record.geoLng ? (
              <>
                <div className="text-[11px] text-slate-400">
                  Lat:{" "}
                  <span className="text-slate-200">
                    {record.geoLat.toFixed(6)}
                  </span>
                  <br />
                  Lng:{" "}
                  <span className="text-slate-200">
                    {record.geoLng.toFixed(6)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Distance from office:{" "}
                  <span className="text-slate-200">
                    {Math.round(record.geoDistanceMeters || 0)} m
                  </span>
                </div>
              </>
            ) : (
              <p className="text-[11px] text-slate-500">
                No location captured for this entry.
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-[12px] text-slate-200">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Notes
          </div>
          <p className="mt-1 text-[12px] text-slate-300">
            {record.notes || "No additional notes for this day."}
          </p>
        </div>
      </div>
    </div>
  );
};