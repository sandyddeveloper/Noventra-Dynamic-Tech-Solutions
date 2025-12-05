// src/pages/user-management/UserManagementPage.tsx
import React, { useMemo, useState } from "react";
import {
    UserPlus,
    Users,
    Shield,
    Building2,
    Trash2,
    Pencil,
    Eye,
    BadgeCheck,
} from "lucide-react";
import type {
    ColumnDef,
    SortDirection,
} from "../../types/datatable.types";
import type { Employee } from "../../types/employee.types"; import { DataTable } from "../../components/shared/DataTable";
import { EmployeeFormModal } from "../../components/common/modal/EmployeeFormModal";
import { EmployeeQuickViewDrawer } from "../../components/employee/EmployeeQuickViewDrawer";
import { useNavigate } from "react-router-dom";
;

// ---- Mock data ----
const mockEmployees: Employee[] = [
    {
        id: "1",
        code: "EMP-001",
        name: "Harini Rao",
        email: "harini.rao@example.com",
        role: "Super Admin",
        department: "Management",
        employmentType: "Full-time",
        workMode: "WFO",
        phone: "+91 98xx 000001",
        location: "Chennai HQ",
        timezone: "Asia/Kolkata (IST)",
        avatarColor: "#6366f1",
        createdAt: "2025-01-10T09:15:00.000Z",
        lastLoginAt: "2025-12-05T07:30:00.000Z",
        status: "Active",
    },
    {
        id: "2",
        code: "EMP-002",
        name: "Aarav Mehta",
        email: "aarav.mehta@example.com",
        role: "Manager",
        department: "Human Resources",
        employmentType: "Full-time",
        workMode: "WFO",
        phone: "+91 98xx 000002",
        location: "Chennai",
        timezone: "Asia/Kolkata (IST)",
        avatarColor: "#22c55e",
        createdAt: "2025-02-01T10:00:00.000Z",
        lastLoginAt: "2025-12-05T07:10:00.000Z",
        status: "Active",
    },
    {
        id: "3",
        code: "EMP-003",
        name: "Sneha Kapoor",
        email: "sneha.kapoor@example.com",
        role: "Staff",
        department: "Engineering",
        employmentType: "Full-time",
        workMode: "Hybrid",
        avatarColor: "#ec4899",
        createdAt: "2025-02-10T11:00:00.000Z",
        lastLoginAt: undefined,
        status: "Invited",
    },
    {
        id: "4",
        code: "EMP-004",
        name: "Nisha Gupta",
        email: "nisha.gupta@example.com",
        role: "Staff",
        department: "Design",
        employmentType: "Contract",
        workMode: "WFH",
        avatarColor: "#f97316",
        createdAt: "2025-03-01T09:00:00.000Z",
        lastLoginAt: "2025-11-30T06:50:00.000Z",
        status: "Suspended",
    },
];

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

// ------------- Page -------------
const UserManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] =
        useState<Employee[]>(mockEmployees);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("All");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [departmentFilter, setDepartmentFilter] =
        useState<string>("All");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<string | undefined>("name");
    const [sortDirection, setSortDirection] =
        useState<SortDirection>("asc");

    const [formOpen, setFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] =
        useState<Employee | null>(null);

    const [quickViewEmployee, setQuickViewEmployee] =
        useState<Employee | null>(null);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const openAttendanceForEmployee = (emp: Employee) => {
        navigate("/attendance", {
            state: {
                employeeId: emp.id,
                employeeName: emp.name,
                employeeEmail: emp.email,
            },
        });
    };

    const openProjectsForEmployee = (emp: Employee) => {
        navigate("/projects", {
            state: {
                employeeId: emp.id,
                employeeName: emp.name,
                employeeEmail: emp.email,
                filter: "assigned",
            },
        });
    };


    // ---- table data processing ----
    const filteredEmployees = useMemo(() => {
        let rows = [...employees];

        if (roleFilter !== "All") {
            rows = rows.filter((e) => e.role === roleFilter);
        }
        if (statusFilter !== "All") {
            rows = rows.filter((e) => e.status === statusFilter);
        }
        if (departmentFilter !== "All") {
            rows = rows.filter((e) => e.department === departmentFilter);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            rows = rows.filter(
                (e) =>
                    e.name.toLowerCase().includes(q) ||
                    e.email.toLowerCase().includes(q) ||
                    e.code.toLowerCase().includes(q),
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
    }, [
        employees,
        roleFilter,
        statusFilter,
        departmentFilter,
        search,
        sortBy,
        sortDirection,
    ]);

    const totalItems = filteredEmployees.length;
    const startIdx = (page - 1) * pageSize;
    const pageRows = filteredEmployees.slice(
        startIdx,
        startIdx + pageSize,
    );

    // ---- helpers ----
    const departments = useMemo(
        () =>
            Array.from(
                new Set(employees.map((e) => e.department).filter(Boolean)),
            ),
        [employees],
    );

    const handleSaveEmployee = (
        employee: Employee,
        password: string | null,
    ) => {
        setEmployees((prev) => {
            const exists = prev.some((e) => e.id === employee.id);
            if (exists) {
                return prev.map((e) =>
                    e.id === employee.id ? employee : e,
                );
            }
            return [...prev, employee];
        });

        if (password) {
            console.log("New / reset password (send to API):", {
                employeeId: employee.id,
                password,
            });
        }

        setFormOpen(false);
        setEditingEmployee(null);
    };

    const toggleSelected = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id],
        );
    };

    const selectAllOnPage = () => {
        const ids = pageRows.map((e) => e.id);
        const allSelected = ids.every((id) => selectedIds.includes(id));
        if (allSelected) {
            setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
        } else {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])));
        }
    };

    const bulkDelete = () => {
        if (!selectedIds.length) return;
        if (
            !window.confirm(
                `Delete ${selectedIds.length} employees? Their history will remain.`,
            )
        )
            return;
        setEmployees((prev) =>
            prev.filter((e) => !selectedIds.includes(e.id)),
        );
        setSelectedIds([]);
    };

    // ---- DataTable columns ----
    const columns: ColumnDef<Employee>[] = [
        {
            id: "select",
            header: (
                <input
                    type="checkbox"
                    aria-label="Select all"
                    onChange={selectAllOnPage}
                    className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-blue-500"
                />
            ),
            cell: (row) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={(e) => {
                        e.stopPropagation();
                        toggleSelected(row.id);
                    }}
                    className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-blue-500"
                />
            ),
            align: "center",
        },
        {
            id: "name",
            header: "Employee",
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-slate-900"
                        style={{
                            backgroundColor: row.avatarColor ?? "#22c55e",
                        }}
                    >
                        {row.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/profile/${row.code}`, {
                                    state: { employee: row },
                                });
                            }}
                            className="text-left text-xs font-medium text-blue-300 hover:underline"
                        >
                            {row.name}
                        </button>
                        <span className="text-[11px] text-slate-400">
                            {row.email}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            id: "role",
            header: "Role",
            sortable: true,
            cell: (row) => (
                <span
                    className={`rounded-full px-2 py-[2px] text-[10px] ${roleChipClasses[row.role]}`}
                >
                    {row.role}
                </span>
            ),
        },
        {
            id: "department",
            header: "Department",
            sortable: true,
            cell: (row) => (
                <span className="text-xs text-slate-100">
                    {row.department || "—"}
                </span>
            ),
        },
        {
            id: "employmentType",
            header: "Type",
            sortable: true,
            cell: (row) => (
                <span className="text-xs text-slate-200">
                    {row.employmentType}
                </span>
            ),
            hideOnMobile: true,
        },
        {
            id: "workMode",
            header: "Mode",
            sortable: true,
            cell: (row) => (
                <span
                    className={`rounded-full px-2 py-[2px] text-[10px] ${workModeChip[row.workMode]}`}
                >
                    {row.workMode}
                </span>
            ),
        },
        {
            id: "status",
            header: "Status",
            sortable: true,
            cell: (row) => (
                <span
                    className={`rounded-full px-2 py-[2px] text-[10px] ${statusBadgeClasses[row.status]}`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            id: "lastLoginAt",
            header: "Last login",
            sortable: true,
            cell: (row) => (
                <span className="text-[11px] text-slate-300">
                    {row.lastLoginAt
                        ? new Date(row.lastLoginAt).toLocaleString()
                        : "Never"}
                </span>
            ),
            hideOnMobile: true,
        },
        {
            id: "actions",
            header: "Actions",
            align: "right",
            cell: (row) => (
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewEmployee(row);
                        }}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800"
                        title="View profile"
                    >
                        <Eye size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingEmployee(row);
                            setFormOpen(true);
                        }}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800"
                        title="Edit employee"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (
                                window.confirm(
                                    `Delete employee "${row.name}"? Attendance / history will not be removed.`,
                                )
                            ) {
                                setEmployees((prev) =>
                                    prev.filter((emp) => emp.id !== row.id),
                                );
                                setSelectedIds((prev) =>
                                    prev.filter((id) => id !== row.id),
                                );
                            }
                        }}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-red-300 hover:bg-red-900/60"
                        title="Delete employee"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ),
        },
    ];

    // stats
    const totalActive = employees.filter(
        (e) => e.status === "Active",
    ).length;
    const totalInvited = employees.filter(
        (e) => e.status === "Invited",
    ).length;
    const totalSuspended = employees.filter(
        (e) => e.status === "Suspended",
    ).length;

    return (
        <div className="space-y-4">
            {/* header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-slate-50">
                        User management
                    </h1>
                    <p className="text-xs text-slate-400">
                        Create, onboard and control access for every employee account.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {selectedIds.length > 0 && (
                        <button
                            type="button"
                            onClick={bulkDelete}
                            className="inline-flex items-center gap-1 rounded-xl bg-red-900/60 px-3 py-2 text-[11px] font-medium text-red-100 hover:bg-red-800"
                        >
                            <Trash2 size={12} />
                            Delete selected ({selectedIds.length})
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            setEditingEmployee(null);
                            setFormOpen(true);
                        }}
                        className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500"
                    >
                        <UserPlus size={14} />
                        New employee
                    </button>
                </div>
            </div>

            {/* summary cards */}
            <div className="grid gap-3 text-xs md:grid-cols-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="inline-flex items-center gap-1">
                            <Users size={12} /> Total employees
                        </span>
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-100">
                        {employees.length}
                    </div>
                </div>
                <div className="rounded-2xl border border-emerald-800 bg-slate-950 px-4 py-3">
                    <div className="flex items-center justify-between text-[11px] text-emerald-200">
                        <span className="inline-flex items-center gap-1">
                            <BadgeCheck size={12} /> Active
                        </span>
                    </div>
                    <div className="mt-1 text-lg font-semibold text-emerald-300">
                        {totalActive}
                    </div>
                </div>
                <div className="rounded-2xl border border-blue-800 bg-slate-950 px-4 py-3">
                    <div className="flex items-center justify-between text-[11px] text-blue-200">
                        <span className="inline-flex items-center gap-1">
                            <Shield size={12} /> Invited
                        </span>
                    </div>
                    <div className="mt-1 text-lg font-semibold text-blue-300">
                        {totalInvited}
                    </div>
                </div>
                <div className="rounded-2xl border border-red-800 bg-slate-950 px-4 py-3">
                    <div className="flex items-center justify-between text-[11px] text-red-200">
                        <span className="inline-flex items-center gap-1">
                            <Building2 size={12} /> Suspended
                        </span>
                    </div>
                    <div className="mt-1 text-lg font-semibold text-red-300">
                        {totalSuspended}
                    </div>
                </div>
            </div>

            {/* filter bar */}
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                    {/* role filters */}
                    <div className="flex flex-wrap items-center gap-1">
                        {["All", "Super Admin", "Admin", "Manager", "Staff"].map(
                            (role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => {
                                        setRoleFilter(role);
                                        setPage(1);
                                    }}
                                    className={`rounded-full px-2 py-[3px] text-[11px] ${roleFilter === role
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                                        }`}
                                >
                                    {role}
                                </button>
                            ),
                        )}
                    </div>

                    {/* status filter */}
                    <div className="flex flex-wrap items-center gap-1">
                        {["All", "Active", "Invited", "Suspended"].map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => {
                                    setStatusFilter(status);
                                    setPage(1);
                                }}
                                className={`rounded-full px-2 py-[3px] text-[11px] ${statusFilter === status
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* department filter */}
                    <div className="flex items-center gap-1">
                        <span className="text-[11px] text-slate-400">Department</span>
                        <select
                            value={departmentFilter}
                            onChange={(e) => {
                                setDepartmentFilter(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-100 outline-none hover:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                        >
                            <option value="All">All</option>
                            {departments.map((dep) => (
                                <option key={dep} value={dep}>
                                    {dep}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* search – uses DataTable’s global search */}
                </div>
            </div>

            {/* main table */}
            <DataTable<Employee>
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
                enableGlobalSearch
                globalSearchValue={search}
                onGlobalSearchChange={(v) => {
                    setSearch(v);
                    setPage(1);
                }}
                isLoading={false}
                emptyMessage="No employees match your filters."
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
            />

            {/* modals */}
            <EmployeeFormModal
                open={formOpen}
                initial={editingEmployee}
                onClose={() => {
                    setFormOpen(false);
                    setEditingEmployee(null);
                }}
                onSave={handleSaveEmployee}
            />

            <EmployeeQuickViewDrawer
                open={!!quickViewEmployee}
                employee={quickViewEmployee}
                onClose={() => setQuickViewEmployee(null)}
                onOpenAttendance={openAttendanceForEmployee}
                onOpenProjects={openProjectsForEmployee}
            />

        </div>
    );
};

export default UserManagementPage;
