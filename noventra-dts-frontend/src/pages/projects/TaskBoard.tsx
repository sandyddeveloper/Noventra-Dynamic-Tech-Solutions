import React from "react";
import type { Project } from "../../types/project.types";
import { User, ListTodo, CheckCircle2, Clock } from "lucide-react";

interface ProjectTrackerBoardProps {
  projects: Project[];
}

export const ProjectTrackerBoard: React.FC<ProjectTrackerBoardProps> = ({
  projects,
}) => {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-100">
        Project Tracker
      </h2>
      <p className="text-xs text-slate-400">
        Monitor owners, assignments, task states, and time usage across projects.
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const totalTasks =
            project.tasks.todo +
            project.tasks.inProgress +
            project.tasks.done;
          const completion =
            totalTasks === 0
              ? 0
              : Math.round((project.tasks.done / totalTasks) * 100);

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
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] text-slate-200">
                  {project.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <User size={12} /> Owner:{" "}
                  <span className="text-slate-200">{project.owner}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <User size={12} /> Assigned:{" "}
                  <span className="text-slate-200">{project.assignee}</span>
                </span>
              </div>

              {/* Task metrics */}
              <div className="grid gap-2 md:grid-cols-3">
                <div className="rounded-xl bg-slate-900 px-3 py-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Todo</span>
                    <ListTodo size={12} />
                  </div>
                  <div className="mt-1 text-lg font-semibold text-amber-300">
                    {project.tasks.todo}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-900 px-3 py-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>In progress</span>
                    <Clock size={12} />
                  </div>
                  <div className="mt-1 text-lg font-semibold text-blue-300">
                    {project.tasks.inProgress}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-900 px-3 py-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Done</span>
                    <CheckCircle2 size={12} />
                  </div>
                  <div className="mt-1 text-lg font-semibold text-emerald-300">
                    {project.tasks.done}
                  </div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Task completion</span>
                    <span className="text-slate-200">
                      {completion}% ({project.tasks.done}/{totalTasks || 0})
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-500"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Time used</span>
                    <span className="text-slate-200">
                      {project.loggedHours}/{project.estimatedHours} h
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                      style={{
                        width: `${
                          project.estimatedHours === 0
                            ? 0
                            : Math.min(
                                (project.loggedHours / project.estimatedHours) *
                                  100,
                                100,
                              )
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Placeholder for deeper task board */}
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-500">
                Integrate detailed task board (Todo / In Progress / Done) for
                this project here – can reuse your existing task components.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
