import React, { useMemo, useState } from "react";
import {
  Plus,
  Users,
  Building2,
  ChevronRight,
  ChevronLeft,
  Pencil,
  Trash2,
  User,
  Search,
  Eye,
} from "lucide-react";

import type {
  ColumnDef,
  SortDirection,
} from "../../types/datatable.types";
import { DataTable } from "../../components/shared/DataTable";
import { getEmployeeById, mockDepartments, mockEmployees, mockTeams, type Department, type StatusFilter, type Team } from "../../types/team.types";
import { DepartmentModal } from "../../components/common/modal/DepartmentModal";
import { TeamModal } from "../../components/common/modal/TeamModal";
import { TeamQuickView } from "./TeamQuickView";


const DepartmentsTeamsPage: React.FC = () => {
  const [departments, setDepartments] =
    useState<Department[]>(mockDepartments);
  const [teams, setTeams] = useState<Team[]>(mockTeams);

  // include pseudo department "Unassigned"
  const UNASSIGNED_ID = "__unassigned";

  const departmentsWithUnassigned = useMemo(
    () => [
      ...departments,
      {
        id: UNASSIGNED_ID,
        name: "Unassigned teams",
        code: "UNASSIGNED",
        headId: "",
        description: "Teams that are not attached to any department yet.",
      } as Department,
    ],
    [departments],
  );

  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    departments[0]?.id ?? UNASSIGNED_ID,
  );

  // teams table controls
  const [teamSearch, setTeamSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");
  const [sortBy, setSortBy] = useState<string | undefined>("name");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // drag & drop state
  const [draggingTeamId, setDraggingTeamId] =
    useState<string | null>(null);
  const [dragOverDeptId, setDragOverDeptId] =
    useState<string | null>(null);

  // modals
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(
    null,
  );
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [quickViewTeam, setQuickViewTeam] = useState<Team | null>(
    null,
  );

  const selectedDept =
    departmentsWithUnassigned.find((d) => d.id === selectedDeptId) ??
    departmentsWithUnassigned[0] ??
    null;

  const isSelectedUnassigned = selectedDeptId === UNASSIGNED_ID;

  const departmentTeams = useMemo(() => {
    if (!selectedDept) return [];
    if (selectedDept.id === UNASSIGNED_ID) {
      // teams with no department
      return teams.filter(
        (t) => !t.departmentId || t.departmentId === "",
      );
    }
    return teams.filter((t) => t.departmentId === selectedDept.id);
  }, [teams, selectedDept]);

  const filteredTeams = useMemo(() => {
    let rows = [...departmentTeams];

    // status filter (per department)
    if (statusFilter !== "All") {
      rows = rows.filter((t) => t.status === statusFilter);
    }

    if (teamSearch.trim()) {
      const q = teamSearch.toLowerCase();
      rows = rows.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q),
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
  }, [departmentTeams, teamSearch, sortBy, sortDirection, statusFilter]);

  const totalItems = filteredTeams.length;
  const startIdx = (page - 1) * pageSize;
  const pageTeams = filteredTeams.slice(
    startIdx,
    startIdx + pageSize,
  );

  // global stats
  const totalTeams = teams.length;
  const totalHeadcount = teams.reduce(
    (acc, t) => acc + t.memberIds.length,
    0,
  );
  const maxCapacity = teams.reduce(
    (acc, t) => acc + t.capacity,
    0,
  );
  const unassignedEmployees =
    mockEmployees.length -
    new Set(
      teams.flatMap((t) => t.memberIds),
    ).size;

  // DataTable columns (same as before)
  const teamColumns: ColumnDef<Team>[] = [
    {
      id: "name",
      header: "Team",
      sortable: true,
      cell: (team) => {
        const lead = getEmployeeById(team.leadId);
        return (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-100">
                {team.name}
              </span>
              <span className="text-[11px] text-slate-500">
                {team.code}
              </span>
            </div>
            {lead && (
              <span className="ml-2 rounded-full bg-slate-900 px-2 py-[2px] text-[10px] text-slate-300">
                Lead · {lead.name}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "mode",
      header: "Mode",
      sortable: true,
      cell: (team) => (
        <span className="text-xs text-slate-200">{team.workMode}</span>
      ),
    },
    {
      id: "members",
      header: "Members",
      sortable: true,
      cell: (team) => {
        const count = team.memberIds.length;
        return (
          <span className="text-xs text-slate-200">
            {count} / {team.capacity}
          </span>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      cell: (team) => (
        <span
          className={`rounded-full px-2 py-[2px] text-[10px] ${
            team.status === "Active"
              ? "bg-emerald-900/70 text-emerald-100"
              : team.status === "Hiring"
              ? "bg-blue-900/70 text-blue-100"
              : team.status === "Paused"
              ? "bg-amber-900/70 text-amber-100"
              : "bg-slate-800 text-slate-200"
          }`}
        >
          {team.status}
        </span>
      ),
    },
    {
      id: "tags",
      header: "Tags",
      cell: (team) =>
        team.tags.length ? (
          <div className="flex flex-wrap gap-1">
            {team.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-900 px-2 py-[2px] text-[10px] text-slate-200"
              >
                {tag}
              </span>
            ))}
            {team.tags.length > 3 && (
              <span className="rounded-full bg-slate-900 px-2 py-[2px] text-[10px] text-slate-400">
                +{team.tags.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-slate-500">—</span>
        ),
      hideOnMobile: true,
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (team) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewTeam(team);
            }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800"
            title="Quick view"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setEditingTeam(team);
              setTeamModalOpen(true);
            }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800"
            title="Edit team"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm(
                  `Delete team "${team.name}"? This will not delete employees.`,
                )
              ) {
                setTeams((prev) =>
                  prev.filter((t) => t.id !== team.id),
                );
              }
            }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-red-300 hover:bg-red-900/60"
            title="Delete team"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const handleSaveDepartment = (dep: Department) => {
    setDepartments((prev) => {
      const exists = prev.some((d) => d.id === dep.id);
      if (exists) {
        return prev.map((d) => (d.id === dep.id ? dep : d));
      }
      return [...prev, dep];
    });
    setEditingDept(null);
    setDeptModalOpen(false);
  };

  const handleSaveTeam = (team: Team) => {
    setTeams((prev) => {
      const exists = prev.some((t) => t.id === team.id);
      if (exists) {
        return prev.map((t) => (t.id === team.id ? team : t));
      }
      return [...prev, team];
    });
    setEditingTeam(null);
    setTeamModalOpen(false);
  };

  // drag handlers: pills -> department cards
  const handleTeamDragStart = (teamId: string) => {
    setDraggingTeamId(teamId);
  };

  const handleDeptDragOver = (deptId: string, e: React.DragEvent) => {
    if (!draggingTeamId) return;
    e.preventDefault();
    setDragOverDeptId(deptId);
  };

  const handleDeptDrop = (deptId: string) => {
    if (!draggingTeamId) return;
    setTeams((prev) =>
      prev.map((t) =>
        t.id === draggingTeamId
          ? {
              ...t,
              departmentId: deptId === UNASSIGNED_ID ? "" : deptId,
            }
          : t,
      ),
    );
    setDraggingTeamId(null);
    setDragOverDeptId(null);
  };

  const handleDeptDragLeave = (deptId: string) => {
    if (dragOverDeptId === deptId) {
      setDragOverDeptId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Departments &amp; Teams
          </h1>
          <p className="text-xs text-slate-400">
            Create departments, structure teams and assign employees.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingDept(null);
              setDeptModalOpen(true);
            }}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-800"
          >
            <Building2 size={14} />
            New department
          </button>
          <button
            type="button"
            onClick={() => {
              if (!selectedDept) return;
              setEditingTeam(null);
              setTeamModalOpen(true);
            }}
            className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500"
          >
            <Plus size={14} />
            New team in {selectedDept?.code}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-3 text-xs md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Building2 size={12} /> Departments
            </span>
          </div>
          <div className="mt-1 text-lg font-semibold text-blue-300">
            {departments.length}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Users size={12} /> Teams
            </span>
          </div>
          <div className="mt-1 text-lg font-semibold text-emerald-300">
            {totalTeams}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Users size={12} /> Assigned headcount
            </span>
          </div>
          <div className="mt-1 text-lg font-semibold text-slate-100">
            {totalHeadcount}
            <span className="ml-1 text-sm text-slate-400">
              / {maxCapacity}
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <User size={12} /> Unassigned employees
            </span>
          </div>
          <div className="mt-1 text-lg font-semibold text-amber-300">
            {unassignedEmployees < 0 ? 0 : unassignedEmployees}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
        {/* Departments list with drag/drop */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Building2 size={13} />
              Departments (drag teams between departments)
            </span>
          </div>
          <div className="space-y-2">
            {departmentsWithUnassigned.map((dep) => {
              const isActive = dep.id === selectedDeptId;
              const head =
                dep.id === UNASSIGNED_ID
                  ? null
                  : getEmployeeById(dep.headId);
              const depTeams =
                dep.id === UNASSIGNED_ID
                  ? teams.filter(
                      (t) => !t.departmentId || t.departmentId === "",
                    )
                  : teams.filter((t) => t.departmentId === dep.id);
              const depMembers = new Set(
                depTeams.flatMap((t) => t.memberIds),
              ).size;

              const isDragOver = dragOverDeptId === dep.id;

              return (
                <div
                  key={dep.id}
                  onDragOver={(e) => handleDeptDragOver(dep.id, e)}
                  onDrop={() => handleDeptDrop(dep.id)}
                  onDragLeave={() => handleDeptDragLeave(dep.id)}
                  className={`rounded-xl border px-3 py-2 ${
                    isDragOver
                      ? "border-blue-500/80 bg-blue-950/40"
                      : isActive
                      ? "border-blue-500 bg-blue-950/40"
                      : "border-slate-800 bg-slate-950"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDeptId(dep.id)}
                    className="flex w-full items-center justify-between text-left text-xs text-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-semibold text-slate-100">
                        {dep.code === "UNASSIGNED" ? "UN" : dep.code}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">
                          {dep.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {head
                            ? `Head · ${head.name}`
                            : dep.id === UNASSIGNED_ID
                            ? "Drop here to unassign"
                            : "Head not assigned"}
                        </span>
                        <span className="mt-1 text-[10px] text-slate-500">
                          {depTeams.length} teams · {depMembers} members
                        </span>
                      </div>
                    </div>

                    {dep.id !== UNASSIGNED_ID && (
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDept(dep);
                              setDeptModalOpen(true);
                            }}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  `Delete department "${dep.name}"? Teams will remain as unassigned.`,
                                )
                              ) {
                                setDepartments((prev) =>
                                  prev.filter((d) => d.id !== dep.id),
                                );
                                setTeams((prev) =>
                                  prev.map((t) =>
                                    t.departmentId === dep.id
                                      ? { ...t, departmentId: "" }
                                      : t,
                                  ),
                                );
                                if (selectedDeptId === dep.id) {
                                  setSelectedDeptId(UNASSIGNED_ID);
                                }
                              }
                            }}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-red-300 hover:bg-red-900/60"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <ChevronRight
                          size={14}
                          className={
                            isActive
                              ? "text-blue-400"
                              : "text-slate-500"
                          }
                        />
                      </div>
                    )}
                  </button>

                  {/* small drag pills */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {depTeams.map((team) => (
                      <span
                        key={team.id}
                        draggable
                        onDragStart={() =>
                          handleTeamDragStart(team.id)
                        }
                        className="inline-flex cursor-grab items-center gap-1 rounded-full bg-slate-900 px-2 py-[2px] text-[10px] text-slate-200 hover:bg-slate-800"
                        title="Drag to another department"
                      >
                        {team.code}
                      </span>
                    ))}
                    {depTeams.length === 0 && (
                      <span className="text-[10px] text-slate-500">
                        No teams
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Teams table */}
        <div className="flex flex-col gap-3">
          {/* Teams header + search + status filter */}
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ChevronLeft size={14} className="text-slate-500" />
                <span className="font-semibold text-slate-100">
                  {selectedDept?.name ?? "Unassigned teams"}
                </span>
                <span className="rounded-full bg-slate-900 px-2 py-[2px] text-[10px] text-slate-400">
                  {departmentTeams.length} teams ·{" "}
                  {new Set(
                    departmentTeams.flatMap((t) => t.memberIds),
                  ).size}{" "}
                  members
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* status filter chips */}
                <div className="flex flex-wrap items-center gap-1 text-[11px]">
                  {(["All", "Active", "Hiring", "Paused", "Archived"] as StatusFilter[]).map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => {
                          setStatusFilter(status);
                          setPage(1);
                        }}
                        className={`rounded-full px-2 py-[3px] ${
                          statusFilter === status
                            ? "bg-blue-600 text-white"
                            : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        {status}
                      </button>
                    ),
                  )}
                </div>

                {/* search */}
                <div className="relative">
                  <Search
                    size={13}
                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    value={teamSearch}
                    onChange={(e) => {
                      setTeamSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search teams..."
                    className="w-44 rounded-full border border-slate-700 bg-slate-950 py-1.5 pl-7 pr-3 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Teams DataTable */}
          <DataTable<Team>
            columns={teamColumns}
            data={pageTeams}
            totalItems={totalItems}
            page={page}
            pageSize={pageSize}
            pageSizeOptions={[5, 10, 25]}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={(col, dir) => {
              setSortBy(col);
              setSortDirection(dir);
              setPage(1);
            }}
            enableGlobalSearch={false}
            isLoading={false}
            emptyMessage={
              selectedDept
                ? "No teams in this view yet."
                : "No teams created."
            }
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
            onRowClick={(row) => setQuickViewTeam(row)}
          />
        </div>
      </div>

      {/* Modals / drawers */}
      <DepartmentModal
        open={deptModalOpen}
        initial={editingDept}
        onClose={() => {
          setDeptModalOpen(false);
          setEditingDept(null);
        }}
        onSave={handleSaveDepartment}
      />

      <TeamModal
        open={teamModalOpen}
        department={isSelectedUnassigned ? null : selectedDept}
        initial={editingTeam}
        onClose={() => {
          setTeamModalOpen(false);
          setEditingTeam(null);
        }}
        onSave={handleSaveTeam}
      />

      <TeamQuickView
        team={quickViewTeam}
        onClose={() => setQuickViewTeam(null)}
      />
    </div>
  );
};

export default DepartmentsTeamsPage;



