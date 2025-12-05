// src/pages/leave/LeaveManagementPage.tsx
import React, { useMemo, useState } from "react";
import {
    CalendarCheck2,
    User,
    CheckCircle2,
    XCircle,
    Clock3,
    Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { ColumnDef, SortDirection } from "../../types/datatable.types";
import type { LeaveRequest, LeaveStatus, LeaveType } from "../../types/leave.types";
import { DataTable } from "../../components/shared/DataTable";
import { EntityCardList } from "../../components/shared/EntityCardList";

// ---- MOCK DATA (replace with API later) ----
const mockLeaves: LeaveRequest[] = [
    {
        id: "LR-001",
        employeeId: "1",
        employeeName: "Harini Rao",
        employeeCode: "EMP-001",
        department: "Management",
        role: "Super Admin",
        type: "Privilege",
        status: "Approved",
        startDate: "2025-12-10",
        endDate: "2025-12-12",
        days: 3,
        reason: "Family function",
        approver: "CEO",
        createdAt: "2025-11-30T09:30:00.000Z",
    },
    {
        id: "LR-002",
        employeeId: "2",
        employeeName: "Aarav Mehta",
        employeeCode: "EMP-002",
        department: "Human Resources",
        role: "HR Manager",
        type: "Sick",
        status: "Pending",
        startDate: "2025-12-06",
        endDate: "2025-12-06",
        days: 1,
        reason: "Fever & rest",
        approver: "Harini Rao",
        createdAt: "2025-12-05T08:10:00.000Z",
    },
    {
        id: "LR-003",
        employeeId: "3",
        employeeName: "Sneha Kapoor",
        employeeCode: "EMP-003",
        department: "Engineering",
        role: "Software Engineer",
        type: "Work From Home",
        status: "Approved",
        startDate: "2025-12-07",
        endDate: "2025-12-07",
        days: 1,
        reason: "Personal work, staying remote",
        approver: "Aarav Mehta",
        createdAt: "2025-12-04T12:30:00.000Z",
    },
    {
        id: "LR-004",
        employeeId: "4",
        employeeName: "Nisha Gupta",
        employeeCode: "EMP-004",
        department: "Design",
        role: "Designer",
        type: "Casual",
        status: "Rejected",
        startDate: "2025-12-09",
        endDate: "2025-12-09",
        days: 1,
        reason: "Short trip",
        approver: "Aarav Mehta",
        createdAt: "2025-12-02T10:45:00.000Z",
    },
];

const statusChipClass: Record<LeaveStatus, string> = {
    Pending: "bg-amber-900/70 text-amber-100",
    Approved: "bg-emerald-900/70 text-emerald-100",
    Rejected: "bg-red-900/70 text-red-100",
    Cancelled: "bg-slate-800 text-slate-100",
};

const typeChipClass: Record<LeaveType, string> = {
    Casual: "bg-slate-900 text-slate-100",
    Sick: "bg-rose-900/70 text-rose-100",
    Privilege: "bg-indigo-900/70 text-indigo-100",
    Unpaid: "bg-slate-800 text-slate-100",
    "Work From Home": "bg-sky-900/70 text-sky-100",
};

const LeaveManagementPage: React.FC = () => {
    const navigate = useNavigate();

    const [leaves] = useState<LeaveRequest[]>(mockLeaves);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<LeaveStatus | "All">("All");
    const [typeFilter, setTypeFilter] = useState<LeaveType | "All">("All");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<string | undefined>("startDate");
    const [sortDirection, setSortDirection] =
        useState<SortDirection>("desc");

    // ---- FILTER + SORT ----
    const filtered = useMemo(() => {
        let rows = [...leaves];

        if (statusFilter !== "All") {
            rows = rows.filter((r) => r.status === statusFilter);
        }
        if (typeFilter !== "All") {
            rows = rows.filter((r) => r.type === typeFilter);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            rows = rows.filter(
                (r) =>
                    r.employeeName.toLowerCase().includes(q) ||
                    r.employeeCode.toLowerCase().includes(q) ||
                    r.department.toLowerCase().includes(q) ||
                    r.role.toLowerCase().includes(q) ||
                    (r.reason ?? "").toLowerCase().includes(q),
            );
        }

        if (sortBy) {
            rows.sort((a, b) => {
                const av = (a as any)[sortBy];
                const bv = (b as any)[sortBy];
                const comp = String(av ?? "").localeCompare(String(bv ?? ""));
                return sortDirection === "asc" ? comp : -comp;
            });
        }

        return rows;
    }, [leaves, statusFilter, typeFilter, search, sortBy, sortDirection]);

    const totalItems = filtered.length;
    const startIdx = (page - 1) * pageSize;
    const pageRows = filtered.slice(startIdx, startIdx + pageSize);

    // ---- SUMMARY NUMBERS ----
    const totalApproved = leaves.filter((l) => l.status === "Approved").length;
    const totalPending = leaves.filter((l) => l.status === "Pending").length;
    const totalRejected = leaves.filter((l) => l.status === "Rejected").length;

    const totalDaysApproved = leaves
        .filter((l) => l.status === "Approved")
        .reduce((sum, l) => sum + (l.days || 0), 0);

    // ---- DATATABLE COLUMNS ----
    const columns: ColumnDef<LeaveRequest>[] = [
        {
            id: "employee",
            header: "Employee",
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-100">
                        {row.employeeName
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-100">
                            {row.employeeName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                            {row.employeeCode} · {row.department}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            id: "type",
            header: "Type",
            sortable: true,
            cell: (row) => (
                <span
                    className={`rounded-full px-2 py-[2px] text-[10px] ${typeChipClass[row.type]}`}
                >
                    {row.type}
                </span>
            ),
        },
        {
            id: "dateRange",
            header: "Dates",
            sortable: true,
            cell: (row) => (
                <div className="flex flex-col text-[11px] text-slate-200">
                    <span>
                        {row.startDate} → {row.endDate}
                    </span>
                    <span className="text-slate-400">
                        {row.days} day{row.days !== 1 ? "s" : ""}
                    </span>
                </div>
            ),
        },
        {
            id: "status",
            header: "Status",
            sortable: true,
            cell: (row) => (
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] ${statusChipClass[row.status]}`}
                >
                    {row.status === "Approved" && <CheckCircle2 size={11} />}
                    {row.status === "Rejected" && <XCircle size={11} />}
                    {row.status === "Pending" && <Clock3 size={11} />}
                    {row.status}
                </span>
            ),
        },
        {
            id: "approver",
            header: "Approver",
            sortable: true,
            cell: (row) => (
                <span className="text-xs text-slate-200">
                    {row.approver || "—"}
                </span>
            ),
            hideOnMobile: true,
        },
        {
            id: "reason",
            header: "Reason",
            sortable: false,
            cell: (row) => (
                <span className="line-clamp-2 text-[11px] text-slate-400">
                    {row.reason || "—"}
                </span>
            ),
            hideOnMobile: true,
        },
    ];

    // ---- MOBILE CARD RENDERING (EntityCardList) ----
    const renderCardMain = (item: LeaveRequest) => (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-100">
                {item.employeeName
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .toUpperCase()}
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-50">
                            {item.employeeName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                            {item.employeeCode} · {item.department}
                        </span>
                    </div>
                    <span
                        className={`rounded-full px-2 py-[2px] text-[10px] ${typeChipClass[item.type]}`}
                    >
                        {item.type}
                    </span>
                </div>

                <div className="text-[11px] text-slate-300">
                    {item.startDate} → {item.endDate} ·{" "}
                    <span className="font-medium">
                        {item.days} day{item.days !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>
        </div>
    );

    const renderCardMeta = (item: LeaveRequest) => (
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
            <div className="inline-flex items-center gap-1">
                <User size={11} className="text-slate-500" />
                <span>{item.role}</span>
            </div>
            <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] ${statusChipClass[item.status]}`}
            >
                {item.status === "Approved" && <CheckCircle2 size={11} />}
                {item.status === "Rejected" && <XCircle size={11} />}
                {item.status === "Pending" && <Clock3 size={11} />}
                {item.status}
            </span>
        </div>
    );

    const renderCardExpanded = (item: LeaveRequest) => (
        <div className="space-y-2 text-[11px] text-slate-200">
            <div>
                <span className="text-slate-400">Reason: </span>
                <span>{item.reason || "Not provided"}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <div>
                    <span className="text-slate-400">Approver: </span>
                    <span>{item.approver || "—"}</span>
                </div>
                <div>
                    <span className="text-slate-400">Requested on: </span>
                    <span>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );

    const renderCardActions = (item: LeaveRequest) => (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {item.status === "Pending" && (
                <>
                    <button
                        type="button"
                        className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-emerald-500"
                        onClick={() => {
                            // TODO: API approve
                            console.log("Approve leave", item.id);
                        }}
                    >
                        Approve
                    </button>
                    <button
                        type="button"
                        className="rounded-full bg-red-700 px-3 py-1 text-[11px] font-medium text-white hover:bg-red-600"
                        onClick={() => {
                            // TODO: API reject
                            console.log("Reject leave", item.id);
                        }}
                    >
                        Reject
                    </button>
                </>
            )}

            <button
                type="button"
                className="rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-100 hover:bg-slate-800"
                onClick={() => {
                    navigate("/attendance", {
                        state: {
                            employeeId: item.employeeId,
                            employeeName: item.employeeName,
                            employeeEmail: "", // if you have it later
                        },
                    });
                }}
            >
                View in attendance
            </button>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-lg font-semibold text-slate-50">
                        <CalendarCheck2 size={18} className="text-blue-400" />
                        Shift &amp; Leave Management
                    </h1>
                    <p className="text-xs text-slate-400">
                        Approve leave requests, monitor balances and plan shifts in sync with attendance.
                    </p>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500"
                >
                    + New leave request
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid gap-3 text-xs md:grid-cols-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">
                        Total requests
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-100">
                        {leaves.length}
                    </div>
                </div>
                <div className="rounded-2xl border border-emerald-800 bg-slate-950 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-wide text-emerald-200">
                        Approved
                    </div>
                    <div className="mt-1 text-lg font-semibold text-emerald-300">
                        {totalApproved}
                    </div>
                </div>
                <div className="rounded-2xl border border-amber-800 bg-slate-950 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-wide text-amber-200">
                        Pending
                    </div>
                    <div className="mt-1 text-lg font-semibold text-amber-300">
                        {totalPending}
                    </div>
                </div>
                <div className="rounded-2xl border border-red-800 bg-slate-950 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-wide text-red-200">
                        Approved leave days
                    </div>
                    <div className="mt-1 text-lg font-semibold text-red-300">
                        {totalDaysApproved}
                    </div>
                </div>
                <div className="rounded-2xl border border-red-800 bg-slate-950 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-wide text-red-200">
                        Rejected
                    </div>
                    <div className="mt-1 text-lg font-semibold text-red-300">
                        {totalRejected}
                    </div>
                </div>

            </div>

            {/* Filters bar */}
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-slate-200">
                <div className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <Filter size={12} />
                    Filters
                </div>

                {/* Status filter */}
                <div className="flex flex-wrap items-center gap-1">
                    {(["All", "Pending", "Approved", "Rejected", "Cancelled"] as const).map(
                        (s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => {
                                    setStatusFilter(s === "All" ? "All" : (s as LeaveStatus));
                                    setPage(1);
                                }}
                                className={`rounded-full px-2 py-[3px] text-[11px] ${statusFilter === s
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                                    }`}
                            >
                                {s}
                            </button>
                        ),
                    )}
                </div>

                {/* Type filter */}
                <div className="flex flex-wrap items-center gap-1">
                    {(["All", "Casual", "Sick", "Privilege", "Unpaid", "Work From Home"] as const).map(
                        (t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => {
                                    setTypeFilter(t === "All" ? "All" : (t as LeaveType));
                                    setPage(1);
                                }}
                                className={`rounded-full px-2 py-[3px] text-[11px] ${typeFilter === t
                                        ? "bg-emerald-600 text-white"
                                        : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                                    }`}
                            >
                                {t}
                            </button>
                        ),
                    )}
                </div>

                {/* Search box */}
                <div className="ml-auto flex-1 sm:flex-none">
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search employee, dept, reason..."
                        className="w-full rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                    />
                </div>
            </div>

            {/* Desktop: DataTable */}
            <div className="hidden md:block">
                <DataTable<LeaveRequest>
                    columns={columns}
                    data={pageRows}
                    totalItems={totalItems}
                    page={page}
                    pageSize={pageSize}
                    pageSizeOptions={[5, 10, 25, 50]}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSortChange={(col, dir) => {
                        setSortBy(col);
                        setSortDirection(dir);
                        setPage(1);
                    }}
                    enableGlobalSearch={false}
                    isLoading={false}
                    emptyMessage="No leave requests found."
                    onPageChange={setPage}
                    onPageSizeChange={(s) => {
                        setPageSize(s);
                        setPage(1);
                    }}
                    getRowId={(row) => row.id}
                    size="md"
                    enableColumnVisibility
                    enableExport
                    enableFilters={false}
                    onRowClick={(row) => {
                        console.log("Open leave details drawer/modal", row);
                    }}
                />
            </div>

            {/* Mobile: Card list */}
            <div className="block md:hidden">
                <EntityCardList<LeaveRequest>
                    items={filtered} // you can also use pageRows if you want pagination effect
                    title="Leave requests"
                    description="Swipe and tap on a card to review leave details."
                    getId={(item) => item.id}
                    enableSearch={false}
                    renderMain={renderCardMain}
                    renderMeta={renderCardMeta}
                    renderTags={undefined}
                    renderExpanded={renderCardExpanded}
                    renderActions={renderCardActions}
                />
            </div>
        </div>
    );
};

export default LeaveManagementPage;
