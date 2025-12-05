// src/pages/settings/tabs/AccessTab.tsx
import React from "react";
import { Lock, Shield, Users } from "lucide-react";

const AccessTab: React.FC = () => {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)] text-xs text-slate-200">
      {/* LEFT – ROLE SNAPSHOT */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Shield size={13} />
            Your role & permissions
          </div>

          <div className="space-y-2 text-[11px] text-slate-300">
            <div className="flex items-center justify-between">
              <span>Role</span>
              <span className="rounded-full bg-purple-900/70 px-2 py-[2px] text-[10px] text-purple-100">
                Super Admin
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Scope</span>
              <span className="text-slate-100">Entire NDTS workspace</span>
            </div>
          </div>

          <div className="mt-3 border-t border-slate-800 pt-3 text-[11px] text-slate-400">
            To change your own role, contact a workspace owner. To manage others, use{" "}
            <span className="text-slate-100">User Management</span> and{" "}
            <span className="text-slate-100">Org Structure</span>.
          </div>
        </div>
      </div>

      {/* RIGHT – PERMISSION MATRIX (SAMPLE) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          <Users size={13} />
          Module access overview
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[11px]">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-2 py-1.5">Module</th>
                <th className="px-2 py-1.5">Read</th>
                <th className="px-2 py-1.5">Write</th>
                <th className="px-2 py-1.5">Admin</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Projects", read: true, write: true, admin: true },
                { name: "Clients (CRM)", read: true, write: true, admin: true },
                { name: "Attendance", read: true, write: true, admin: true },
                { name: "User Management", read: true, write: true, admin: true },
                { name: "Settings", read: true, write: true, admin: true },
              ].map((row) => (
                <tr key={row.name} className="border-b border-slate-900">
                  <td className="px-2 py-1.5 text-slate-100">{row.name}</td>
                  <td className="px-2 py-1.5">
                    {row.read && <span className="text-emerald-300">✔</span>}
                  </td>
                  <td className="px-2 py-1.5">
                    {row.write && <span className="text-emerald-300">✔</span>}
                  </td>
                  <td className="px-2 py-1.5">
                    {row.admin && <span className="text-emerald-300">✔</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
          <Lock size={12} />
          <span>
            Full permission matrix for all roles is configured by workspace owners in the admin
            console.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccessTab;
