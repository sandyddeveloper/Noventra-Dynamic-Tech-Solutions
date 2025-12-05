// src/pages/user-management/components/EmployeeQuickViewDrawer.tsx
import React from "react";
import {
    X,
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Shield,
    Briefcase,
    Clock,
    Lock,
    CalendarClock,
    Kanban,
} from "lucide-react";
import type { Employee } from "../../types/employee.types";

interface EmployeeQuickViewDrawerProps {
    open: boolean;
    employee: Employee | null;
    onClose: () => void;
    onOpenAttendance: (employee: Employee) => void;
    onOpenProjects: (employee: Employee) => void;
}

export const EmployeeQuickViewDrawer: React.FC<
    EmployeeQuickViewDrawerProps
> = ({ open, employee, onClose, onOpenAttendance, onOpenProjects }) => {
    if (!open || !employee) return null;

    const statusColor =
        employee.status === "Active"
            ? "bg-emerald-900/70 text-emerald-100"
            : employee.status === "Invited"
                ? "bg-blue-900/70 text-blue-100"
                : "bg-red-900/70 text-red-100";

    return (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm">
            <div className="flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-950 px-4 py-4 text-xs text-slate-100 shadow-2xl">
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-slate-900"
                            style={{ backgroundColor: employee.avatarColor ?? "#22c55e" }}
                        >
                            {employee.name
                                .split(" ")
                                .map((p) => p[0])
                                .join("")
                                .toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-semibold text-slate-50">
                                    {employee.name}
                                </h2>
                                <span
                                    className={`rounded-full px-2 py-[2px] text-[10px] ${statusColor}`}
                                >
                                    {employee.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                                <span>{employee.code}</span>
                                <span>•</span>
                                <span>{employee.role}</span>
                                <span>•</span>
                                <span>{employee.department}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-slate-700 bg-slate-900 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    >
                        <X size={14} />
                    </button>
                </div>

                <div className="space-y-3 overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                <User size={12} />
                                Profile
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-300">
                                <Mail size={12} className="text-slate-400" />
                                <span>{employee.email}</span>
                            </div>
                            {employee.phone && (
                                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                                    <Phone size={12} className="text-slate-400" />
                                    <span>{employee.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-[11px] text-slate-300">
                                <MapPin size={12} className="text-slate-400" />
                                <span>{employee.location || "Location not set"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-300">
                                <Globe size={12} className="text-slate-400" />
                                <span>{employee.timezone || "Timezone not set"}</span>
                            </div>
                        </div>

                        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                <Shield size={12} />
                                Role & work
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300">
                                <span className="inline-flex items-center gap-1">
                                    <Briefcase size={11} className="text-slate-400" />
                                    Role
                                </span>
                                <span>{employee.role}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300">
                                <span>Employment</span>
                                <span>{employee.employmentType}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300">
                                <span>Work mode</span>
                                <span>{employee.workMode}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300">
                                <span>Department</span>
                                <span>{employee.department}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Linked pages
                        </div>
                        <p className="text-[11px] text-slate-400">
                            Jump into this employee's attendance and project activity.
                        </p>
                        <div className="flex flex-wrap gap-2 text-[11px]">
                            <button
                                type="button"
                                onClick={() => onOpenAttendance(employee)}
                                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-slate-100 hover:bg-slate-800"
                            >
                                <CalendarClock size={12} />
                                View attendance history
                            </button>
                            <button
                                type="button"
                                onClick={() => onOpenProjects(employee)}
                                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-slate-100 hover:bg-slate-800"
                            >
                                <Kanban size={12} />
                                View assigned projects
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            <Clock size={12} />
                            Activity
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>Created at</span>
                            <span>
                                {new Date(employee.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>Last login</span>
                            <span>
                                {employee.lastLoginAt
                                    ? new Date(employee.lastLoginAt).toLocaleString()
                                    : "Never logged in"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            <Lock size={12} />
                            Account controls
                        </div>
                        <div className="flex flex-wrap gap-2 text-[11px]">
                            <button
                                type="button"
                                className="rounded-full bg-slate-900 px-3 py-1 text-slate-100 hover:bg-slate-800"
                            >
                                Send password reset link
                            </button>
                            <button
                                type="button"
                                className="rounded-full bg-slate-900 px-3 py-1 text-slate-100 hover:bg-slate-800"
                            >
                                Force log out on all devices
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
