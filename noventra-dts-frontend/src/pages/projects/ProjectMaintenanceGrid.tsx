import React from "react";
import type { Project } from "../../types/project.types";
import { Calendar, Clock, AlertTriangle } from "lucide-react";

interface ProjectMaintenanceGridProps {
  projects: Project[];
}

export const ProjectMaintenanceGrid: React.FC<ProjectMaintenanceGridProps> = ({
  projects,
}) => {
  const now = new Date();

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-100">
        Project Maintenance
      </h2>
      <p className="text-xs text-slate-400">
        Keep an eye on deadlines, overdue work, and projects that need
        maintenance actions.
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const due = project.dueDate ? new Date(project.dueDate) : null;
          const msDiff = due ? due.getTime() - now.getTime() : NaN;
          const daysDiff = isNaN(msDiff) ? null : Math.round(msDiff / (1000 * 60 * 60 * 24));

          let statusLabel = "No due date";
          let statusColor = "text-slate-300 bg-slate-900";

          if (daysDiff !== null) {
            if (daysDiff < 0) {
              statusLabel = `Overdue by ${Math.abs(daysDiff)} days`;
              statusColor = "bg-red-900/80 text-red-100";
            } else if (daysDiff === 0) {
              statusLabel = "Due today";
              statusColor = "bg-amber-900/80 text-amber-100";
            } else if (daysDiff <= 7) {
              statusLabel = `Due in ${daysDiff} days`;
              statusColor = "bg-amber-900/60 text-amber-100";
            } else {
              statusLabel = `Due in ${daysDiff} days`;
              statusColor = "bg-emerald-900/50 text-emerald-100";
            }
          }

          return (
            <div
              key={project.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {project.code}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-50">
                    {project.name}
                  </h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] ${statusColor}`}
                >
                  {statusLabel}
                </span>
              </div>

              <p className="line-clamp-2 text-[11px] text-slate-400">
                {project.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} />
                  Start:{" "}
                  <span className="text-slate-200">
                    {project.startDate || "Not set"}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} />
                  Due:{" "}
                  <span className="text-slate-200">
                    {project.dueDate || "Not set"}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} />
                  {project.loggedHours}/{project.estimatedHours} h
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <AlertTriangle size={12} className="text-amber-300" />
                  Maintenance actions:
                </span>
                <span className="text-slate-300">
                  Review scope, re-assign, adjust dates
                </span>
              </div>

              <div className="mt-1 flex flex-wrap gap-2 text-[10px]">
                <button className="rounded-full bg-slate-900 px-3 py-1 text-slate-200 hover:bg-slate-800">
                  Extend due date
                </button>
                <button className="rounded-full bg-slate-900 px-3 py-1 text-slate-200 hover:bg-slate-800">
                  Re-evaluate priority
                </button>
                <button className="rounded-full bg-slate-900 px-3 py-1 text-slate-200 hover:bg-slate-800">
                  Notify team
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
