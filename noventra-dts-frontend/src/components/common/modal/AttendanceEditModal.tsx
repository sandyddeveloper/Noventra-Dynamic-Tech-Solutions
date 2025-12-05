import React, { useState } from "react";
import { distanceInMeters, OFFICE_LOCATION, OFFICE_RADIUS_METERS, type AttendanceEditModalProps, type AttendanceRecord, type AttendanceStatus, type WorkMode } from "../../../types/attendance.types";
import { Crosshair, ShieldAlert, ShieldCheck, X } from "lucide-react";

export const AttendanceEditModal: React.FC<AttendanceEditModalProps> = ({
  open,
  record,
  onClose,
  onSave,
}) => {
  const [editable, setEditable] = useState<AttendanceRecord | null>(record);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  React.useEffect(() => {
    setEditable(record);
    setGeoError(null);
    setGeoLoading(false);
  }, [record, open]);

  if (!open || !editable) return null;

  const handleChange = (
    field: keyof AttendanceRecord,
    value: string | AttendanceStatus | WorkMode | number,
  ) => {
    setEditable((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editable) return;
    onSave(editable);
  };

  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported in this browser.");
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const dist = distanceInMeters(
          latitude,
          longitude,
          OFFICE_LOCATION.lat,
          OFFICE_LOCATION.lng,
        );

        const inside = dist <= OFFICE_RADIUS_METERS;

        setEditable((prev) =>
          prev
            ? {
                ...prev,
                geoLat: latitude,
                geoLng: longitude,
                geoDistanceMeters: dist,
                geoVerified:
                  prev.workMode === "WFO" ? inside : undefined,
              }
            : prev,
        );
        setGeoLoading(false);
      },
      (err) => {
        setGeoError(err.message || "Failed to get current location.");
        setGeoLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const geoText =
    editable.workMode === "WFH"
      ? "WFH — geo-fencing is optional and not enforced."
      : !editable.geoLat || !editable.geoLng
      ? "No location captured yet. Capture location from employee device."
      : editable.geoVerified
      ? `Inside office geofence · ${Math.round(
          editable.geoDistanceMeters || 0,
        )} m from office`
      : `Outside office geofence · ${Math.round(
          editable.geoDistanceMeters || 0,
        )} m from office`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-slate-950 px-6 py-5 text-slate-100 shadow-2xl shadow-black/60">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold">
              Edit attendance · {editable.name}
            </h2>
            <p className="text-[11px] text-slate-400">
              {editable.date} · {editable.employeeId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <X size={14} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 text-xs"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">
                Date
              </label>
              <input
                type="date"
                value={editable.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">
                Work mode
              </label>
              <select
                value={editable.workMode}
                onChange={(e) =>
                  handleChange(
                    "workMode",
                    e.target.value as WorkMode,
                  )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              >
                <option value="Work From Office">Work From Office</option>
                <option value="Work From Home">Work From Home</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">
                Login time
              </label>
              <input
                type="time"
                value={editable.loginTime !== "-" ? editable.loginTime : ""}
                onChange={(e) =>
                  handleChange("loginTime", e.target.value || "-")
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">
                Logout time
              </label>
              <input
                type="time"
                value={
                  editable.logoutTime !== "-" ? editable.logoutTime : ""
                }
                onChange={(e) =>
                  handleChange("logoutTime", e.target.value || "-")
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">
                Total hours
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={editable.totalHours}
                onChange={(e) =>
                  handleChange("totalHours", Number(e.target.value) || 0)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">
                Status
              </label>
              <select
                value={editable.status}
                onChange={(e) =>
                  handleChange("status", e.target.value as AttendanceStatus)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              >
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          {/* Geo-fencing box */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Crosshair size={12} /> Geo-fencing (office radius{" "}
                {OFFICE_RADIUS_METERS} m)
              </span>
              {editable.workMode === "WFO" && (
                <span className="text-[10px] text-slate-500">
                  Recommended for office logins
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <button
                type="button"
                disabled={geoLoading}
                onClick={handleCaptureLocation}
                className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-blue-500 disabled:opacity-60"
              >
                <Crosshair size={12} />
                {geoLoading ? "Capturing…" : "Capture location & verify"}
              </button>

              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-[3px] text-[11px]">
                {editable.workMode === "WFH" ? (
                  <ShieldCheck size={12} className="text-slate-300" />
                ) : editable.geoVerified ? (
                  <ShieldCheck size={12} className="text-emerald-300" />
                ) : (
                  <ShieldAlert size={12} className="text-red-300" />
                )}
                <span>{geoText}</span>
              </span>
            </div>

            {editable.geoLat && editable.geoLng && (
              <div className="text-[10px] text-slate-500">
                Lat: {editable.geoLat.toFixed(6)} · Lng:{" "}
                {editable.geoLng.toFixed(6)} · Dist:{" "}
                {Math.round(editable.geoDistanceMeters || 0)} m
              </div>
            )}

            {geoError && (
              <p className="text-[10px] text-red-400">
                {geoError}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">
              Notes
            </label>
            <textarea
              value={editable.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              placeholder="Optional remarks, reasons, etc."
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-500"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};