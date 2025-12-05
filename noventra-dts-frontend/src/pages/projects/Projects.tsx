import React, { useEffect, useMemo, useState } from "react";
import { LayoutList, Activity, Wrench, Plus } from "lucide-react";
import { useLocation } from "react-router-dom";

import type {
  Project,
  ProjectLocationState,
  ProjectStatus,
} from "../../types/project.types";
import { ProjectManagementTable } from "./ProjectList";
import { ProjectTrackerBoard } from "./TaskBoard";
import { ProjectMaintenanceGrid } from "./ProjectMaintenanceGrid";
import { ProjectFormModal } from "../../components/common/modal/ProjectFormModal";
import { ProjectReassignModal } from "../../components/common/modal/ProjectReassignModal";
import { ProjectQuickViewModal } from "../../components/common/modal/ProjectQuickViewModal";

type ViewMode = "management" | "tracker" | "maintenance";

const VIEW_KEY = "projects_view_mode";

export const mockProjects: Project[] = [
  {
    id: "PJT-001",
    name: "Nova AI Platform",
    code: "NOVA-AI",
    description:
      "End-to-end AI platform for intelligent document processing and workflow automation.",
    status: "Active",
    priority: "Critical",
    owner: "Harini Rao",
    assignee: "Aarav Mehta",
    team: ["Harini Rao", "Aarav Mehta", "Sneha Kapoor"],
    startDate: "2025-01-10",
    dueDate: "2025-04-30",
    tags: ["AI", "Platform", "Backend"],
    estimatedHours: 480,
    loggedHours: 210,
    tasks: { todo: 18, inProgress: 9, done: 35 },
    client: "Noventra",
    isFavorite: true,
  },
  {
    id: "PJT-002",
    name: "Customer Portal Revamp",
    code: "CP-REVAMP",
    description:
      "Modern customer self-service portal with responsive design and analytics.",
    status: "On Hold",
    priority: "High",
    owner: "Dev Sharma",
    assignee: "Nisha Gupta",
    team: ["Nisha Gupta", "Vikram Singh"],
    startDate: "2025-02-01",
    dueDate: "2025-05-15",
    tags: ["Frontend", "UX", "Customer"],
    estimatedHours: 320,
    loggedHours: 80,
    tasks: { todo: 22, inProgress: 4, done: 10 },
    client: "Apex Bank",
    isFavorite: false,
  },
  {
    id: "PJT-003",
    name: "Data Lake Migration",
    code: "DL-MIG",
    description:
      "Migrate legacy data warehouse to cloud-native data lake with governance.",
    status: "Completed",
    priority: "Medium",
    owner: "Karan Patel",
    assignee: "Rohit Nair",
    team: ["Karan Patel", "Rohit Nair", "Meera Iyer"],
    startDate: "2024-10-01",
    dueDate: "2025-01-05",
    tags: ["Data", "Cloud", "Migration"],
    estimatedHours: 420,
    loggedHours: 430,
    tasks: { todo: 0, inProgress: 0, done: 58 },
    client: "CloudCore",
    isFavorite: false,
  },
];

const ProjectsPage: React.FC = () => {
  const location = useLocation();
  const state = (location.state || {}) as ProjectLocationState;

  // main project data
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  // deep-link: filter by employee name (assignee or in team)
  const [assigneeFilterName, setAssigneeFilterName] = useState<string | null>(
    state.employeeName ?? null,
  );

  // view + filters
  const [view, setView] = useState<ViewMode>("management");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">(
    "All",
  );

  // modals
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [reassignOpen, setReassignOpen] = useState(false);
  const [reassignProject, setReassignProject] = useState<Project | null>(null);

  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewProject, setQuickViewProject] = useState<Project | null>(
    null,
  );

  // load initial view from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(VIEW_KEY) as ViewMode | null;
    if (stored === "management" || stored === "tracker" || stored === "maintenance") {
      setView(stored);
    }
  }, []);

  // persist view mode
  useEffect(() => {
    localStorage.setItem(VIEW_KEY, view);
  }, [view]);

  // when coming from User Management, set the filter by employee name
  useEffect(() => {
    if (state.employeeName) {
      setAssigneeFilterName(state.employeeName);
    }
  }, [state.employeeName]);

  const totalTasks = useMemo(
    () =>
      projects.reduce(
        (acc, p) => {
          acc.todo += p.tasks.todo;
          acc.inProgress += p.tasks.inProgress;
          acc.done += p.tasks.done;
          return acc;
        },
        { todo: 0, inProgress: 0, done: 0 },
      ),
    [projects],
  );

  // 🔍 Combined filtering (assignee/team + status)
  const filteredProjects = useMemo(() => {
    let list = [...projects];

    if (assigneeFilterName) {
      list = list.filter(
        (p) =>
          p.assignee === assigneeFilterName ||
          p.team.includes(assigneeFilterName),
      );
    }

    if (statusFilter !== "All") {
      list = list.filter((p) => p.status === statusFilter);
    }

    return list;
  }, [projects, assigneeFilterName, statusFilter]);

  const handleSaveProject = (project: Project) => {
    setProjects((prev) => {
      const exists = prev.find((p) => p.id === project.id);
      if (exists) {
        return prev.map((p) => (p.id === project.id ? project : p));
      }
      return [project, ...prev];
    });
    setFormOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (project: Project) => {
    const ok = window.confirm(
      `Delete project "${project.name}"? This cannot be undone.`,
    );
    if (!ok) return;
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
  };

  const handleReassignClick = (project: Project) => {
    setReassignProject(project);
    setReassignOpen(true);
  };

  const handleReassignConfirm = (
    projectId: string,
    newAssignee: string,
    addToTeam: boolean,
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedTeam =
          addToTeam && !p.team.includes(newAssignee)
            ? [...p.team, newAssignee]
            : p.team;
        return {
          ...p,
          assignee: newAssignee,
          team: updatedTeam,
        };
      }),
    );
    setReassignOpen(false);
    setReassignProject(null);
  };

  const handleToggleFavorite = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p,
      ),
    );
  };

  const activeCount = projects.filter((p) => p.status === "Active").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Projects</h1>
          <p className="text-xs text-slate-400">
            Manage, track and maintain projects in a single workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingProject(null);
            setFormOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-500"
        >
          <Plus size={14} />
          Create project
        </button>
      </div>

      {/* Context pill when coming from Employee page */}
      {assigneeFilterName && (
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-200">
          Viewing projects for{" "}
          <span className="font-medium">{assigneeFilterName}</span>
          {state.employeeEmail && (
            <span className="text-slate-400">({state.employeeEmail})</span>
          )}
          <button
            type="button"
            onClick={() => setAssigneeFilterName(null)}
            className="text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top mode cards */}
      <div className="grid gap-3 md:grid-cols-3">
        {/* Project Management */}
        <button
          type="button"
          onClick={() => setView("management")}
          className={`flex flex-col items-start gap-2 rounded-2xl border px-4 py-3 text-left text-xs transition ${
            view === "management"
              ? "border-blue-500 bg-slate-900"
              : "border-slate-800 bg-slate-950 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-500/10 p-2 text-blue-400">
              <LayoutList size={16} />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Project Management
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Table view with advanced search, filters, export and reassignment.
          </p>
        </button>

        {/* Project Tracker */}
        <button
          type="button"
          onClick={() => setView("tracker")}
          className={`flex flex-col items-start gap-2 rounded-2xl border px-4 py-3 text-left text-xs transition ${
            view === "tracker"
              ? "border-blue-500 bg-slate-900"
              : "border-slate-800 bg-slate-950 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/10 p-2 text-emerald-300">
              <Activity size={16} />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Project Tracker
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Track owners, assignments, todo, in-progress and completed tasks.
          </p>
        </button>

        {/* Project Maintenance */}
        <button
          type="button"
          onClick={() => setView("maintenance")}
          className={`flex flex-col items-start gap-2 rounded-2xl border px-4 py-3 text-left text-xs transition ${
            view === "maintenance"
              ? "border-blue-500 bg-slate-900"
              : "border-slate-800 bg-slate-950 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-500/10 p-2 text-amber-300">
              <Wrench size={16} />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Project Maintenance
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            See due dates, overdue work and maintenance actions per project.
          </p>
        </button>
      </div>

      {/* Quick global stats */}
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-200 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="text-slate-400">
            Active:{" "}
            <span className="font-medium text-emerald-300">
              {activeCount}
            </span>
          </span>
          <span className="text-slate-400">
            Completed:{" "}
            <span className="font-medium text-blue-300">
              {completedCount}
            </span>
          </span>
          <span className="text-slate-400">
            Tasks —{" "}
            <span className="text-amber-300">
              Todo {totalTasks.todo}
            </span>
            ,{" "}
            <span className="text-blue-300">
              In progress {totalTasks.inProgress}
            </span>
            ,{" "}
            <span className="text-emerald-300">
              Done {totalTasks.done}
            </span>
          </span>
        </div>

        {/* status filter chips */}
        <div className="flex flex-wrap items-center gap-1 text-[11px]">
          {(["All", "Active", "On Hold", "Completed", "Archived"] as const).map(
            (s) => (
              <button
                key={s}
                type="button"
                onClick={() =>
                  setStatusFilter(s === "All" ? "All" : (s as ProjectStatus))
                }
                className={`rounded-full px-3 py-1 ${
                  statusFilter === s
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                }`}
              >
                {s}
              </button>
            ),
          )}
        </div>
      </div>

      {/* View content (filtered by status + assignee/team) */}
      {view === "management" && (
        <ProjectManagementTable
          projects={filteredProjects}
          onEdit={(p) => {
            setEditingProject(p);
            setFormOpen(true);
          }}
          onDelete={handleDeleteProject}
          onReassign={handleReassignClick}
          onToggleFavorite={handleToggleFavorite}
          onOpenDetails={(p) => {
            setQuickViewProject(p);
            setQuickViewOpen(true);
          }}
        />
      )}

      {view === "tracker" && <ProjectTrackerBoard projects={filteredProjects} />}

      {view === "maintenance" && (
        <ProjectMaintenanceGrid projects={filteredProjects} />
      )}

      {/* Create / Edit modal */}
      <ProjectFormModal
        open={formOpen}
        initial={editingProject}
        onClose={() => {
          setFormOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
      />

      {/* Reassign modal */}
      <ProjectReassignModal
        open={reassignOpen}
        project={reassignProject}
        onClose={() => {
          setReassignOpen(false);
          setReassignProject(null);
        }}
        onConfirm={handleReassignConfirm}
      />

      {/* Quick view modal */}
      <ProjectQuickViewModal
        open={quickViewOpen}
        project={quickViewProject}
        onClose={() => {
          setQuickViewOpen(false);
          setQuickViewProject(null);
        }}
      />
    </div>
  );
};

export default ProjectsPage;
