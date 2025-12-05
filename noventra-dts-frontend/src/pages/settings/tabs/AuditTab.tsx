// src/pages/settings/tabs/AuditTab.tsx
import React from "react";
import { ListOrdered, Filter, Clock } from "lucide-react";

const AuditTab: React.FC = () => {
  const events = [
    {
      at: "2025-12-05 09:22",
      action: "Updated notification rules",
      module: "Settings",
      ip: "103.24.56.10",
    },
    {
      at: "2025-12-05 09:05",
      action: "Edited project Nova AI Platform",
      module: "Projects",
      ip: "103.24.56.10",
    },
    {
      at: "2025-12-04 18:11",
      action: "Created client Apex Bank",
      module: "Clients",
      ip: "103.24.56.10",
    },
  ];

  return (
    <div className="space-y-4 text-xs text-slate-200">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Filter size={12} />
          <span>Filter by module</span>
        </div>
        <select className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40">
          <option>All</option>
          <option>Settings</option>
          <option>Projects</option>
          <option>Clients</option>
          <option>Attendance</option>
        </select>

        <div className="ml-auto flex items-center gap-2 text-[11px] text-slate-400">
          <Clock size={12} />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          <ListOrdered size={13} />
          Recent account actions
        </div>

        <div className="space-y-2">
          {events.map((e, i) => (
            <div
              key={i}
              className="flex items-start justify-between rounded-xl bg-slate-900 px-3 py-2"
            >
              <div>
                <div className="text-xs text-slate-100">{e.action}</div>
                <div className="text-[11px] text-slate-500">
                  {e.module} • IP {e.ip}
                </div>
              </div>
              <div className="text-[11px] text-slate-500">{e.at}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-[11px] text-slate-500">
          Full audit logs can be exported from the admin console for compliance.
        </div>
      </div>
    </div>
  );
};

export default AuditTab;
    