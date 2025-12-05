import React from "react";
import {
  Eye,
  CalendarDays,
  MapPin,
  Phone,
  BriefcaseBusiness,
  Building2,
} from "lucide-react";

import type { Employee } from "../../types/employee.types";
import { EntityCardList } from "../../components/shared/EntityCardList";

const statusBadgeClasses: Record<Employee["status"], string> = {
  Active: "bg-emerald-900/70 text-emerald-100",
  Invited: "bg-blue-900/70 text-blue-100",
  Suspended: "bg-red-900/70 text-red-100",
};

const roleChipClasses: Record<Employee["role"], string> = {
  "Super Admin": "bg-purple-900/70 text-purple-100",
  Admin: "bg-fuchsia-900/70 text-fuchsia-100",
  Manager: "bg-sky-900/70 text-sky-100",
  Staff: "bg-slate-800 text-slate-100",
};

const workModeChip: Record<Employee["workMode"], string> = {
  WFO: "bg-emerald-900/70 text-emerald-100",
  WFH: "bg-sky-900/70 text-sky-100",
  Hybrid: "bg-amber-900/70 text-amber-100",
};

interface EmployeeListCardsProps {
  employees: Employee[];
  title?: string;
  description?: string;

  onOpenQuickView?: (emp: Employee) => void;
  onOpenProfile?: (emp: Employee) => void;
  onOpenAttendance?: (emp: Employee) => void;
  onOpenProjects?: (emp: Employee) => void;
  onEdit?: (emp: Employee) => void;
  onDelete?: (emp: Employee) => void;
}

export const EmployeeListCards: React.FC<EmployeeListCardsProps> = ({
  employees,
  title = "Employees",
  description = "Tap an employee to view details.",
  onOpenQuickView,
  onOpenProfile,
  onOpenAttendance,
  onOpenProjects,
  onEdit,
  onDelete,
}) => {
  return (
    <EntityCardList<Employee>
      items={employees}
      title={title}
      description={description}
      getId={(e) => e.id}
      // search is handled at page level, so we disable internal search
      enableSearch={false}
      // Card tap → quick view (if provided)
      onCardClick={onOpenQuickView}
      // Main content: avatar, name, email, status, role
      renderMain={(e) => (
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold text-slate-900"
                style={{ backgroundColor: e.avatarColor ?? "#22c55e" }}
              >
                {e.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="flex flex-col">
                <button
                  type="button"
                  className="text-left text-sm font-semibold text-blue-300 hover:underline"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onOpenProfile?.(e);
                  }}
                >
                  {e.name}
                </button>
                <span className="text-[11px] text-slate-400">{e.email}</span>
                <span className="text-[10px] text-slate-500">{e.code}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span
                className={`rounded-full px-2 py-[2px] text-[10px] ${statusBadgeClasses[e.status]}`}
              >
                {e.status}
              </span>
              <span
                className={`rounded-full px-2 py-[2px] text-[10px] ${roleChipClasses[e.role]}`}
              >
                {e.role}
              </span>
            </div>
          </div>
        </div>
      )}
      // Meta row: department, type, work mode, location
      renderMeta={(e) => (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
          {e.department && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-[2px]">
              <Building2 size={11} className="text-slate-500" />
              {e.department}
            </span>
          )}

          {e.employmentType && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-[2px]">
              <BriefcaseBusiness size={11} className="text-slate-500" />
              {e.employmentType}
            </span>
          )}

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] ${workModeChip[e.workMode]}`}
          >
            {e.workMode}
          </span>

          {e.location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-[2px]">
              <MapPin size={11} className="text-slate-500" />
              {e.location}
            </span>
          )}
        </div>
      )}
      // Tags: phone, created, last login
      renderTags={(e) => (
        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-slate-300">
          {e.phone && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-[2px]">
              <Phone size={11} className="text-slate-500" />
              {e.phone}
            </span>
          )}

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-[2px]">
            <CalendarDays size={11} className="text-slate-500" />
            Joined{" "}
            {new Date(e.createdAt).toLocaleDateString(undefined, {
              month: "short",
              year: "numeric",
            })}
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-[2px] text-slate-400">
            Last login:{" "}
            {e.lastLoginAt
              ? new Date(e.lastLoginAt).toLocaleDateString()
              : "Never"}
          </span>
        </div>
      )}
      // Actions row: view, attendance, projects, edit, delete
      renderActions={(e) => (
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {onOpenQuickView && (
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onOpenQuickView(e);
                }}
                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-slate-800"
              >
                <Eye size={13} />
                Quick view
              </button>
            )}

            {onOpenAttendance && (
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onOpenAttendance(e);
                }}
                className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-slate-800"
              >
                Attendance
              </button>
            )}

            {onOpenProjects && (
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onOpenProjects(e);
                }}
                className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-slate-800"
              >
                Projects
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onEdit(e);
                }}
                className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-slate-800"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onDelete(e);
                }}
                className="rounded-full bg-red-900/70 px-3 py-1.5 text-[11px] text-red-100 hover:bg-red-800"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    />
  );
};
