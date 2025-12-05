// src/pages/settings/tabs/NotificationTab.tsx
import React, { useState } from "react";
import { Bell, Mail, Smartphone, Globe2, AlertTriangle } from "lucide-react";

const NotificationTab: React.FC = () => {
  const [channels, setChannels] = useState({
    email: true,
    push: true,
    inApp: true,
  });

  const [rules, setRules] = useState({
    projectOverdue: true,
    invoiceOverdue: true,
    ticketUpdated: true,
    attendanceAnomaly: true,
    newClientAssigned: false,
  });

  const toggleChannel = (key: keyof typeof channels) =>
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleRule = (key: keyof typeof rules) =>
    setRules((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)] text-xs text-slate-200">
      {/* LEFT – CHANNELS */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Bell size={13} />
            Channels
          </div>

          <div className="space-y-3">
            {/* Email */}
            <button
              type="button"
              onClick={() => toggleChannel("email")}
              className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-left"
            >
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-300" />
                <div>
                  <div className="text-xs text-slate-100">Email</div>
                  <div className="text-[11px] text-slate-500">
                    Detailed notifications & reports.
                  </div>
                </div>
              </div>
              <span
                className={`text-[11px] ${
                  channels.email ? "text-emerald-300" : "text-slate-500"
                }`}
              >
                {channels.email ? "Enabled" : "Disabled"}
              </span>
            </button>

            {/* Push (PWA) */}
            <button
              type="button"
              onClick={() => toggleChannel("push")}
              className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-left"
            >
              <div className="flex items-center gap-2">
                <Smartphone size={14} className="text-emerald-300" />
                <div>
                  <div className="text-xs text-slate-100">Push (NDTS PWA)</div>
                  <div className="text-[11px] text-slate-500">
                    Instant alerts from your Notifications module.
                  </div>
                </div>
              </div>
              <span
                className={`text-[11px] ${
                  channels.push ? "text-emerald-300" : "text-slate-500"
                }`}
              >
                {channels.push ? "Enabled" : "Disabled"}
              </span>
            </button>

            {/* In–app */}
            <button
              type="button"
              onClick={() => toggleChannel("inApp")}
              className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-left"
            >
              <div className="flex items-center gap-2">
                <Globe2 size={14} className="text-purple-300" />
                <div>
                  <div className="text-xs text-slate-100">In-app feed</div>
                  <div className="text-[11px] text-slate-500">
                    Visible in your CRM Notifications page.
                  </div>
                </div>
              </div>
              <span
                className={`text-[11px] ${
                  channels.inApp ? "text-emerald-300" : "text-slate-500"
                }`}
              >
                {channels.inApp ? "Enabled" : "Disabled"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT – RULES & QUIET HOURS */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Routing rules
          </div>

          <div className="space-y-2 text-[11px]">
            {[
              { key: "projectOverdue", label: "Project overdue" },
              { key: "invoiceOverdue", label: "Invoice overdue / failed payment" },
              { key: "ticketUpdated", label: "Support ticket updated" },
              { key: "attendanceAnomaly", label: "Attendance anomaly (late / missed)" },
              { key: "newClientAssigned", label: "New client assigned to me" },
            ].map((r) => (
              <label
                key={r.key}
                className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2"
              >
                <div className="text-slate-100">{r.label}</div>
                <input
                  type="checkbox"
                  checked={rules[r.key as keyof typeof rules]}
                  onChange={() => toggleRule(r.key as keyof typeof rules)}
                  className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-blue-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Quiet hours */}
        <div className="rounded-2xl border border-amber-800 bg-slate-950 px-5 py-4">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Quiet hours
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            NDTS will still log events but avoid disturbing you during quiet hours.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-slate-400">From</span>
            <input
              defaultValue="22:00"
              type="time"
              className="rounded-xl border border-slate-700 bg-slate-950 px-2 py-1 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
            />
            <span className="text-slate-400">to</span>
            <input
              defaultValue="07:00"
              type="time"
              className="rounded-xl border border-slate-700 bg-slate-950 px-2 py-1 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-amber-200">
            <AlertTriangle size={12} />
            Critical alerts (security, billing failures) may still be sent.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTab;
