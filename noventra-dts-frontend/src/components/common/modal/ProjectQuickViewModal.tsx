import React from "react";
import {
  X,
  User,
  Calendar,
  Clock,
  Tag,
  ListTodo,
  CheckCircle2,
} from "lucide-react";
import type { Project } from "../../../types/project.types";

interface ProjectQuickViewModalProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}

export const ProjectQuickViewModal: React.FC<ProjectQuickViewModalProps> = ({
  open,
  project,
  onClose,
}) => {
  if (!open || !project) return null;

  const totalTasks =
    project.tasks.todo + project.tasks.inProgress + project.tasks.done;
  const completion =
    totalTasks === 0
      ? 0
      : Math.round((project.tasks.done / totalTasks) * 100);

  const utilization =
    project.estimatedHours === 0
      ? 0
      : Math.round(
          (project.loggedHours / project.estimatedHours) * 100,
        );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-5xl rounded-2xl bg-slate-950 px-7 py-6 text-slate-100 shadow-2xl shadow-black/60">
        {/* HEADER */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
              <span className="font-mono">{project.code}</span>
              {project.client && (
                <span className="rounded-full bg-slate-900 px-3 py-[3px] text-[11px]">
                  Client: {project.client}
                </span>
              )}
            </div>
            <h2 className="mt-1 text-lg font-semibold text-slate-50">
              {project.name}
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-400">
              {project.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-4 text-xs md:grid-cols-3">
          {/* People */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              People
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <User size={13} className="text-slate-400" />
              <span>
                Owner:{" "}
                <span className="text-slate-200">{project.owner}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <User size={13} className="text-slate-400" />
              <span>
                Assignee:{" "}
                <span className="text-slate-200">{project.assignee}</span>
              </span>
            </div>
            <div className="mt-1 text-[12px] text-slate-400">
              Team:{" "}
              <span className="text-slate-200">
                {project.team.join(", ") || "Not set"}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Schedule
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <Calendar size={13} className="text-slate-400" />
              <span>
                Start:{" "}
                <span className="text-slate-200">
                  {project.startDate || "Not set"}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <Calendar size={13} className="text-slate-400" />
              <span>
                Due:{" "}
                <span className="text-slate-200">
                  {project.dueDate || "Not set"}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <Clock size={13} className="text-slate-400" />
              <span>
                {project.loggedHours}/{project.estimatedHours} h ·{" "}
                <span className="text-slate-200">{utilization}% used</span>
              </span>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Tasks
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-amber-300">
                Todo {project.tasks.todo}
              </span>
              <span className="text-blue-300">
                In progress {project.tasks.inProgress}
              </span>
              <span className="text-emerald-300">
                Done {project.tasks.done}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Completion</span>
                <span className="text-slate-200">
                  {completion}% ({project.tasks.done}/{totalTasks || 0})
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags / status / priority */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-[4px]">
            <ListTodo size={11} />
            Status: {project.status}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-[4px]">
            <CheckCircle2 size={11} />
            Priority: {project.priority}
          </span>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-[4px]"
            >
              <Tag size={11} />
              {tag}
            </span>
          ))}
          {project.tags.length === 0 && (
            <span className="text-[11px] text-slate-500">
              No tags assigned.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
