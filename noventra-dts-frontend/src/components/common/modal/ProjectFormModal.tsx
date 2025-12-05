import React, { useEffect, useState } from "react";
import type { Project, ProjectPriority, ProjectStatus } from "../../../types/project.types";

const emptyProject: Project = {
  id: "",
  name: "",
  code: "",
  description: "",
  status: "Active",
  priority: "Medium",
  owner: "",
  assignee: "",
  team: [],
  startDate: "",
  dueDate: "",
  tags: [],
  estimatedHours: 0,
  loggedHours: 0,
  tasks: { todo: 0, inProgress: 0, done: 0 },
};

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  initial?: Project | null;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  open,
  onClose,
  onSave,
  initial,
}) => {
  const [form, setForm] = useState<Project>(initial ?? emptyProject);

  useEffect(() => {
    setForm(initial ?? emptyProject);
  }, [initial, open]);

  if (!open) return null;

  const isEdit = Boolean(initial);

  const handleChange = (
    field: keyof Project,
    value: string | number | ProjectStatus | ProjectPriority,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagChange = (value: string) => {
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, tags }));
  };

  const handleTeamChange = (value: string) => {
    const team = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, team }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const generatedId =
      form.id || `${form.code || "PJT"}-${now.getTime().toString().slice(-4)}`;

    onSave({
      ...form,
      id: generatedId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col gap-4 rounded-2xl bg-slate-950 px-6 py-5 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {isEdit ? "Edit project" : "Create new project"}
            </h2>
            <p className="text-xs text-slate-400">
              Define core details, ownership and scheduling for this project.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-900 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1 text-xs"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {/* Name / code */}
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Project name
              </label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                placeholder="Nova AI Platform"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Project code
              </label>
              <input
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                placeholder="NOVA-AI"
              />
            </div>

            {/* Owner / assignee */}
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Owner / Created by
              </label>
              <input
                value={form.owner}
                onChange={(e) => handleChange("owner", e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                placeholder="Person who created this project"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Assigned to (Lead)
              </label>
              <input
                value={form.assignee}
                onChange={(e) => handleChange("assignee", e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                placeholder="Primary responsible person"
              />
            </div>

            {/* Status / priority */}
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  handleChange("status", e.target.value as ProjectStatus)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              >
                <option>Active</option>
                <option>On Hold</option>
                <option>Completed</option>
                <option>Archived</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  handleChange("priority", e.target.value as ProjectPriority)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>

            {/* Dates */}
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Start date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Due date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>

            {/* Hours */}
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Estimated hours
              </label>
              <input
                type="number"
                min={0}
                value={form.estimatedHours}
                onChange={(e) =>
                  handleChange("estimatedHours", Number(e.target.value) || 0)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Logged hours
              </label>
              <input
                type="number"
                min={0}
                value={form.loggedHours}
                onChange={(e) =>
                  handleChange("loggedHours", Number(e.target.value) || 0)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                placeholder="High-level summary, goals, scope…"
              />
            </div>

            {/* Tags / team */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Tags (comma separated)
              </label>
              <input
                value={form.tags.join(", ")}
                onChange={(e) => handleTagChange(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                placeholder="AI, Backend, Internal"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Team members (comma separated)
              </label>
              <input
                value={form.team.join(", ")}
                onChange={(e) => handleTeamChange(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                placeholder="Harini Rao, Aarav Mehta, Sneha Kapoor"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-3">
            <span className="text-[11px] text-slate-500">
              You can refine detailed tasks in the tracker view.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-500"
              >
                {isEdit ? "Save changes" : "Create project"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
