import React, { useMemo } from "react";
import {
    ArrowLeft,
    CalendarClock,
    Kanban,
    Mail,
    MapPin,
    Phone,
    Shield,
    User,
    Briefcase,
    Clock,
    Globe,
    Activity,
    Cpu,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Employee } from "../../types/employee.types";

interface EmployeeProfileLocationState {
    employee?: Employee;
}

const mockEmployees: Employee[] = [
    {
        id: "EMP-001",
        code: "EMP-001",
        name: "Harini Rao",
        email: "harini.rao@example.com",
        role: "Super Admin",
        department: "Management",
        status: "Active",
        employmentType: "Full-time",
        workMode: "WFO",
        location: "Chennai, India",
        timezone: "Asia/Kolkata",
        phone: "+91 98765 43210",
        avatarColor: "#22c55e",
        createdAt: new Date("2024-06-10").toISOString(),
        lastLoginAt: new Date().toISOString(),
    },
    {
        id: "EMP-002",
        code: "EMP-002",
        name: "Aarav Mehta",
        email: "aarav.mehta@example.com",
        role: "Manager",
        department: "Human Resources",
        status: "Active",
        employmentType: "Full-time",
        workMode: "WFO",
        location: "Chennai, India",
        timezone: "Asia/Kolkata",
        phone: "+91 98765 40000",
        avatarColor: "#3b82f6",
        createdAt: new Date("2024-08-01").toISOString(),
        lastLoginAt: new Date().toISOString(),
    },
];

// simple per-employee derived stats (replace with API later)
const useMockProfileStats = (employeeId: string | undefined) => {
    return useMemo(
        () => ({
            projectsTotal: 6,
            projectsActive: 3,
            projectsCompleted: 3,
            avgDailyHours: 8.2,
            thisMonthPresent: 18,
            thisMonthLate: 2,
            thisMonthAbsent: 1,
            wfoDaysThisMonth: 14,
            wfhDaysThisMonth: 7,
        }),
        [employeeId],
    );
};

const EmployeeProfilePage: React.FC = () => {
    const { employeeCode } = useParams<{ employeeCode: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const locationState = (location.state || {}) as EmployeeProfileLocationState;

    // 1️⃣ Prefer employee passed from navigation state
    // 2️⃣ Fallback to mock list using employeeCode (from URL)
    const employee: Employee | undefined =
        locationState.employee ||
        mockEmployees.find(
            (e) => e.code === employeeCode || e.id === employeeCode,
        );

    const stats = useMockProfileStats(employee?.id);

    if (!employee) {
        return (
            <div className="max-w-4xl mx-auto space-y-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
                <div className="rounded-2xl border border-red-500/40 bg-red-950/40 px-6 py-4 text-sm text-red-100">
                    Employee not found. They may have been removed or the link is invalid.
                </div>
            </div>
        );
    }

    const statusColor =
        employee.status === "Active"
            ? "bg-emerald-900/80 text-emerald-100"
            : employee.status === "Invited"
                ? "bg-blue-900/80 text-blue-100"
                : "bg-red-900/80 text-red-100";

    const initials = employee.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase();

    const createdAtFormatted = employee.createdAt
        ? new Date(employee.createdAt).toLocaleString()
        : "Unknown";
    const lastLoginFormatted = employee.lastLoginAt
        ? new Date(employee.lastLoginAt).toLocaleString()
        : "Never logged in";

    return (
        <div className="max-w-6xl mx-auto space-y-5">
            {/* Back button (top) */}
            <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <button
                    type="button"
                    onClick={() => navigate("/users")}
                    className="hover:text-slate-200 hover:underline"
                >
                    Users
                </button>

                <span className="text-slate-600">›</span>

                {employee.department && (
                    <>
                        <span className="truncate max-w-[160px]">
                            {employee.department}
                        </span>
                        <span className="text-slate-600">›</span>
                    </>
                )}

                <span className="font-medium text-slate-100 truncate max-w-[200px]">
                    {employee.name}
                </span>
            </nav>

            {/* HERO HEADER CARD */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-6 py-5 shadow-xl shadow-black/40">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Left: avatar + main info */}
                    <div className="flex items-start gap-4">
                        <div
                            className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold text-slate-900 shadow-md shadow-black/40"
                            style={{ backgroundColor: employee.avatarColor ?? "#22c55e" }}
                        >
                            {initials}
                        </div>
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-semibold text-slate-50">
                                    {employee.name}
                                </h1>
                                <span
                                    className={`rounded-full px-3 py-[3px] text-[11px] ${statusColor}`}
                                >
                                    {employee.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                    <Briefcase size={13} className="text-slate-500" />
                                    {employee.role}
                                </span>
                                <span>•</span>
                                <span>{employee.department}</span>
                                <span>•</span>
                                <span>{employee.employmentType}</span>
                            </div>
                            <div className="text-xs text-slate-500">
                                Employee ID:{" "}
                                <span className="font-mono text-slate-300">{employee.code}</span>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                    <MapPin size={13} className="text-slate-500" />
                                    {employee.location || "Location not set"}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Globe size={13} className="text-slate-500" />
                                    {employee.timezone || "Timezone not set"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: primary actions */}
                    <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/attendance", {
                                    state: {
                                        employeeId: employee.id,
                                        employeeName: employee.name,
                                        employeeEmail: employee.email,
                                    },
                                })
                            }
                            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-slate-800"
                        >
                            <CalendarClock size={15} />
                            Attendance history
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/projects", {
                                    state: {
                                        employeeId: employee.id,
                                        employeeName: employee.name,
                                        employeeEmail: employee.email,
                                    },
                                })
                            }
                            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-slate-800"
                        >
                            <Kanban size={15} />
                            Assigned projects
                        </button>
                    </div>
                </div>
            </div>

            {/* BIG STATS ROW */}
            <div className="grid gap-4 md:grid-cols-4 text-sm">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Projects</span>
                        <Kanban size={15} className="text-blue-400" />
                    </div>
                    <div className="mt-2 flex items-end gap-2">
                        <span className="text-2xl font-semibold text-slate-50">
                            {stats.projectsTotal}
                        </span>
                        <span className="text-[11px] text-slate-400">
                            {stats.projectsActive} active • {stats.projectsCompleted} completed
                        </span>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Attendance (this month)</span>
                        <Activity size={15} className="text-emerald-400" />
                    </div>
                    <div className="mt-2 text-[12px] text-slate-300 space-y-0.5">
                        <div>
                            <span className="font-semibold text-emerald-300">
                                {stats.thisMonthPresent}
                            </span>{" "}
                            days present
                        </div>
                        <div className="text-slate-400">
                            Late: <span className="text-amber-300">{stats.thisMonthLate}</span>{" "}
                            • Absent:{" "}
                            <span className="text-red-300">{stats.thisMonthAbsent}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Work mode mix</span>
                        <MapPin size={15} className="text-amber-300" />
                    </div>
                    <div className="mt-2 text-[12px] text-slate-300 space-y-0.5">
                        <div>WFO: {stats.wfoDaysThisMonth} days</div>
                        <div>WFH: {stats.wfhDaysThisMonth} days</div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Time tracking</span>
                        <Clock size={15} className="text-purple-300" />
                    </div>
                    <div className="mt-2 flex items-end gap-2">
                        <span className="text-2xl font-semibold text-purple-300">
                            {stats.avgDailyHours.toFixed(1)}
                        </span>
                        <span className="text-[11px] text-slate-400">hours / day</span>
                    </div>
                </div>
            </div>

            {/* MAIN TWO-COLUMN LAYOUT */}
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">
                {/* LEFT COLUMN */}
                <div className="space-y-4 text-sm">
                    {/* Profile & contact / role */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Profile details */}
                        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                <User size={13} />
                                Profile details
                            </div>
                            <div className="space-y-2 text-xs text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-slate-400" />
                                    <span>{employee.email}</span>
                                </div>
                                {employee.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="text-slate-400" />
                                        <span>{employee.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-slate-400" />
                                    <span>{employee.location || "Location not set"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={14} className="text-slate-400" />
                                    <span>{employee.timezone || "Timezone not set"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Role & work */}
                        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                <Briefcase size={13} />
                                Role & work
                            </div>
                            <div className="space-y-1.5 text-xs text-slate-300">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Role</span>
                                    <span>{employee.role}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Department</span>
                                    <span>{employee.department}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Employment</span>
                                    <span>{employee.employmentType}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Work mode</span>
                                    <span>{employee.workMode}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Working schedule / Security */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Schedule */}
                        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                <Clock size={13} />
                                Working schedule
                            </div>
                            <div className="space-y-1.5 text-xs text-slate-300">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Default shift</span>
                                    <span>09:30 – 18:30 IST</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Weekly off</span>
                                    <span>Saturday, Sunday</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Flex window</span>
                                    <span>± 30 minutes</span>
                                </div>
                            </div>
                        </div>

                        {/* Security & access */}
                        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                <Shield size={13} />
                                Security & access
                            </div>
                            <div className="space-y-1.5 text-xs text-slate-300">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Account created</span>
                                    <span>{createdAtFormatted}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Last login</span>
                                    <span>{lastLoginFormatted}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Active sessions</span>
                                    <span>2 devices</span>
                                </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                <button
                                    type="button"
                                    className="rounded-full bg-slate-900 px-3 py-1.5 text-slate-100 hover:bg-slate-800"
                                >
                                    Send password reset
                                </button>
                                <button
                                    type="button"
                                    className="rounded-full bg-slate-900 px-3 py-1.5 text-slate-100 hover:bg-slate-800"
                                >
                                    Force logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Skills / systems */}
                    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            <Cpu size={13} />
                            Skills & systems
                        </div>
                        <p className="text-xs text-slate-400">
                            You can sync skills from your HR system later. For now, this shows a
                            sample skill set.
                        </p>
                        <div className="flex flex-wrap gap-1.5 text-xs">
                            {["Java", "Spring Boot", "SQL", "Git", "Agile"].map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-full bg-slate-900 px-3 py-[3px] text-slate-100"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Activity & health */}
                <div className="space-y-4 text-sm">
                    {/* Activity timeline */}
                    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            <Activity size={13} />
                            Recent activity
                        </div>
                        <div className="space-y-3 text-xs text-slate-300">
                            <div className="flex gap-2">
                                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                                <div className="flex-1 space-y-0.5">
                                    <div className="flex items-center justify-between">
                                        <span>Checked in on time</span>
                                        <span className="text-slate-500">Today, 09:08</span>
                                    </div>
                                    <div className="text-slate-500">
                                        Attendance marked as{" "}
                                        <span className="text-emerald-300 font-medium">Present</span>{" "}
                                        (WFO, geo-verified)
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                                <div className="flex-1 space-y-0.5">
                                    <div className="flex items-center justify-between">
                                        <span>Updated task status</span>
                                        <span className="text-slate-500">Yesterday, 17:30</span>
                                    </div>
                                    <div className="text-slate-500">
                                        Moved 3 tasks to{" "}
                                        <span className="text-emerald-300 font-medium">Done</span> in
                                        Nova AI Platform.
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                                <div className="flex-1 space-y-0.5">
                                    <div className="flex items-center justify-between">
                                        <span>Late check-in</span>
                                        <span className="text-slate-500">Mon, 10:12</span>
                                    </div>
                                    <div className="text-slate-500">
                                        Marked as{" "}
                                        <span className="text-amber-300 font-medium">Late</span>{" "}
                                        (WFH).
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Health indicators */}
                    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            <CheckCircle2 size={13} />
                            Employee health indicators
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-300">
                            <div className="flex items-center justify-between">
                                <span>Attendance reliability</span>
                                <span className="text-emerald-300 font-medium">High</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Overtime trend</span>
                                <span className="text-slate-300">Within limits</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Project load</span>
                                <span className="text-amber-300">Balanced</span>
                            </div>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                            <AlertTriangle size={13} className="text-amber-300" />
                            <span>
                                This is a quick overview. Use detailed reports for formal reviews.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfilePage;
