import React, { useEffect, useMemo, useState } from "react";
import { Eye, Edit2, CalendarDays, MapPin } from "lucide-react";
import { useLocation } from "react-router-dom";

import type { ColumnDef, SortDirection } from "../../types/datatable.types";
import {
  OFFICE_LOCATION,
  type AttendanceRecord,
  type AttendanceStatus,
  type WorkMode,
} from "../../types/attendance.types";
import { DataTable } from "../../components/shared/DataTable";
import { AttendanceQuickViewModal } from "../../components/common/modal/AttendanceQuickViewModal";
import { AttendanceEditModal } from "../../components/common/modal/AttendanceEditModal";

// --- for navigation state coming from User Management ---
interface AttendanceLocationState {
  employeeId?: string;
  employeeName?: string;
  employeeEmail?: string;
}

const mockAttendance: AttendanceRecord[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    name: "Harini Rao",
    email: "harini.rao@example.com",
    role: "Super Admin",
    department: "Management",
    date: "2025-12-05",
    loginTime: "09:10",
    logoutTime: "18:05",
    totalHours: 8.9,
    workMode: "WFO",
    status: "Present",
    notes: "Joined daily leadership sync.",
    geoLat: OFFICE_LOCATION.lat + 0.0005,
    geoLng: OFFICE_LOCATION.lng + 0.0005,
    geoVerified: true,
    geoDistanceMeters: 80,
  },
  {
    id: "2",
    employeeId: "EMP-002",
    name: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    role: "HR Manager",
    department: "Human Resources",
    date: "2025-12-05",
    loginTime: "10:05",
    logoutTime: "19:15",
    totalHours: 8.5,
    workMode: "WFO",
    status: "Late",
    notes: "Traffic delay, informed manager.",
    geoLat: OFFICE_LOCATION.lat + 0.003,
    geoLng: OFFICE_LOCATION.lng + 0.003,
    geoVerified: false,
    geoDistanceMeters: 500,
  },
  {
    id: "3",
    employeeId: "EMP-003",
    name: "Sneha Kapoor",
    email: "sneha.kapoor@example.com",
    role: "Software Engineer",
    department: "Engineering",
    date: "2025-12-05",
    loginTime: "09:00",
    logoutTime: "17:45",
    totalHours: 8.4,
    workMode: "WFH",
    status: "Present",
  },
  {
    id: "4",
    employeeId: "EMP-004",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    role: "Product Manager",
    department: "Product",
    date: "2025-12-05",
    loginTime: "-",
    logoutTime: "-",
    totalHours: 0,
    workMode: "WFO",
    status: "On Leave",
    notes: "Planned leave – approved.",
  },
  {
    id: "5",
    employeeId: "EMP-005",
    name: "Nisha Gupta",
    email: "nisha.gupta@example.com",
    role: "UI/UX Designer",
    department: "Design",
    date: "2025-12-05",
    loginTime: "-",
    logoutTime: "-",
    totalHours: 0,
    workMode: "WFH",
    status: "Absent",
    notes: "No check-in recorded.",
  },
];

// ---------- Main Attendance Page ----------
const AttendancePage: React.FC = () => {
  const location = useLocation();
  const state = (location.state || {}) as AttendanceLocationState;

  // core data
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendance);

  // navigation / deep-link from user management
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    state.employeeId ?? null,
  );

  // table + filters
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState(
    state.employeeEmail || state.employeeName || "",
  );
  const [sortBy, setSortBy] = useState<string | undefined>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [statusFilter, setStatusFilter] =
    useState<AttendanceStatus | "All">("All");
  const [modeFilter, setModeFilter] = useState<WorkMode | "All">("All");
  const [dateFilter, setDateFilter] = useState<string>("");

  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewRecord, setQuickViewRecord] =
    useState<AttendanceRecord | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null);

  // when coming from navigation (click employee → attendance)
  useEffect(() => {
    if (state.employeeId) {
      setSelectedEmployeeId(state.employeeId);
      setSearch(state.employeeEmail || state.employeeName || "");
      setPage(1);
    }
  }, [state.employeeId, state.employeeEmail, state.employeeName]);

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      id: "name",
      header: "Employee",
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-100">
            {row.name}
          </span>
          <span className="text-[11px] text-slate-400">
            {row.employeeId}
          </span>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      field: "role",
      sortable: true,
      hideOnMobile: true,
    },
    {
      id: "department",
      header: "Department",
      field: "department",
      sortable: true,
      hideOnMobile: true,
    },
    {
      id: "date",
      header: "Date",
      field: "date",
      sortable: true,
    },
    {
      id: "loginTime",
      header: "Login",
      field: "loginTime",
      sortable: true,
    },
    {
      id: "logoutTime",
      header: "Logout",
      field: "logoutTime",
      sortable: true,
    },
    {
      id: "totalHours",
      header: "Hours",
      sortable: true,
      cell: (row) => `${row.totalHours || 0} h`,
      hideOnMobile: true,
    },
    {
      id: "status",
      header: "Status",
      field: "status",
      sortable: true,
    },
    {
      id: "workMode",
      header: "Work Mode",
      field: "workMode",
      sortable: true,
      hideOnMobile: true,
    },
    {
      id: "geo",
      header: "Geo",
      cell: (row) => {
        if (row.workMode === "WFH") {
          return (
            <span className="rounded-full bg-slate-900 px-2 py-[2px] text-[10px] text-slate-200">
              WFH
            </span>
          );
        }
        if (!row.geoLat || !row.geoLng) {
          return (
            <span className="rounded-full bg-slate-900 px-2 py-[2px] text-[10px] text-slate-300">
              No geo
            </span>
          );
        }
        return row.geoVerified ? (
          <span className="rounded-full bg-emerald-900/70 px-2 py-[2px] text-[10px] text-emerald-100">
            In office
          </span>
        ) : (
          <span className="rounded-full bg-red-900/70 px-2 py-[2px] text-[10px] text-red-100">
            Outside
          </span>
        );
      },
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
              setQuickViewRecord(row);
              setQuickViewOpen(true);
            }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800"
            title="View details"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setEditRecord(row);
              setEditOpen(true);
            }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800"
            title="Edit attendance"
          >
            <Edit2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  // process / filter / sort
  const processed = useMemo(() => {
    let rows = [...records];

    // deep-link filter: specific employee
    if (selectedEmployeeId) {
      rows = rows.filter((r) => r.employeeId === selectedEmployeeId);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.employeeId.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      rows = rows.filter((r) => r.status === statusFilter);
    }

    if (modeFilter !== "All") {
      rows = rows.filter((r) => r.workMode === modeFilter);
    }

    if (dateFilter) {
      rows = rows.filter((r) => r.date === dateFilter);
    }

    if (sortBy) {
      rows.sort((a, b) => {
        const av = (a as any)[sortBy];
        const bv = (b as any)[sortBy];
        if (av == null) return 1;
        if (bv == null) return -1;
        const comp = String(av).localeCompare(String(bv));
        return sortDirection === "asc" ? comp : -comp;
      });
    }

    return rows;
  }, [
    records,
    selectedEmployeeId,
    search,
    statusFilter,
    modeFilter,
    dateFilter,
    sortBy,
    sortDirection,
  ]);

  const totalItems = processed.length;
  const startIndex = (page - 1) * pageSize;
  const pageData = processed.slice(startIndex, startIndex + pageSize);

  const totalPresent = records.filter((r) => r.status === "Present").length;
  const totalLate = records.filter((r) => r.status === "Late").length;
  const totalAbsent = records.filter((r) => r.status === "Absent").length;
  const totalOnLeave = records.filter((r) => r.status === "On Leave").length;

  const handleSaveEdit = (updated: AttendanceRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r)),
    );
    setEditOpen(false);
    setEditRecord(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Attendance
          </h1>
          <p className="text-xs text-slate-400">
            View and manage daily login / logout, work mode and geo-fencing for all employees.
          </p>
        </div>
      </div>

      {/* Context pill when coming from employee page */}
      {selectedEmployeeId && (
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-200">
          Viewing attendance for{" "}
          <span className="font-medium">
            {state.employeeName ?? selectedEmployeeId}
          </span>
          {state.employeeEmail && (
            <span className="text-slate-400">({state.employeeEmail})</span>
          )}
          <button
            type="button"
            onClick={() => {
              setSelectedEmployeeId(null);
              setSearch("");
              setPage(1);
            }}
            className="text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-3 text-xs md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="text-[11px] uppercase tracking-wide text-slate-500">
            Present
          </div>
          <div className="mt-1 text-lg font-semibold text-emerald-300">
            {totalPresent}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="text-[11px] uppercase tracking-wide text-slate-500">
            Late
          </div>
          <div className="mt-1 text-lg font-semibold text-amber-300">
            {totalLate}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="text-[11px] uppercase tracking-wide text-slate-500">
            Absent
          </div>
          <div className="mt-1 text-lg font-semibold text-red-300">
            {totalAbsent}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="text-[11px] uppercase tracking-wide text-slate-500">
            On leave
          </div>
          <div className="mt-1 text-lg font-semibold text-blue-300">
            {totalOnLeave}
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-200">
        {/* Date filter */}
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-slate-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
          />
          {dateFilter && (
            <button
              type="button"
              onClick={() => {
                setDateFilter("");
                setPage(1);
              }}
              className="text-[11px] text-slate-400 hover:text-slate-200"
            >
              Clear date
            </button>
          )}
        </div>

        {/* Status chips */}
        <div className="flex flex-wrap items-center gap-1">
          {(["All", "Present", "Late", "Absent", "On Leave"] as const).map(
            (s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStatusFilter(s === "All" ? "All" : (s as AttendanceStatus));
                  setPage(1);
                }}
                className={`rounded-full px-3 py-1 text-[11px] ${statusFilter === s
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                  }`}
              >
                {s}
              </button>
            ),
          )}
        </div>

        {/* Work mode filter */}
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-slate-400" />
          <select
            value={modeFilter}
            onChange={(e) => {
              setModeFilter(e.target.value as WorkMode | "All");
              setPage(1);
            }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
          >
            <option value="All">All modes</option>
            <option value="WFO">Work From Office</option>
            <option value="WFH">Work From Home</option>
          </select>

        </div>
      </div>

      {/* DataTable */}
      <DataTable<AttendanceRecord>
        columns={columns}
        data={pageData}
        totalItems={totalItems}
        page={page}
        pageSize={pageSize}
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
        emptyMessage="No attendance records found."
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
          setQuickViewRecord(row);
          setQuickViewOpen(true);
        }}
      />

      {/* Modals */}
      <AttendanceQuickViewModal
        open={quickViewOpen}
        record={quickViewRecord}
        onClose={() => {
          setQuickViewOpen(false);
          setQuickViewRecord(null);
        }}
      />

      <AttendanceEditModal
        open={editOpen}
        record={editRecord}
        onClose={() => {
          setEditOpen(false);
          setEditRecord(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default AttendancePage;
