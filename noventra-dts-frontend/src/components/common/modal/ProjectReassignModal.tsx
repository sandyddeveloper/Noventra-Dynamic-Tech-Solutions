import React, { useEffect, useState } from "react";

import { User, Users, ArrowRight } from "lucide-react";
import type { Project } from "../../../types/project.types";

interface ProjectReassignModalProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onConfirm: (projectId: string, newAssignee: string, addToTeam: boolean) => void;
}

export const ProjectReassignModal: React.FC<ProjectReassignModalProps> = ({
  open,
  project,
  onClose,
  onConfirm,
}) => {
  const [assignee, setAssignee] = useState("");
  const [addToTeam, setAddToTeam] = useState(true);

  useEffect(() => {
    if (project) {
      setAssignee(project.assignee);
      setAddToTeam(!project.team.includes(project.assignee));
    } else {
      setAssignee("");
      setAddToTeam(true);
    }
  }, [project, open]);

  if (!open || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignee.trim()) return;
    onConfirm(project.id, assignee.trim(), addToTeam);
  };

  const uniqueTeam = Array.from(new Set([project.owner, ...project.team]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-slate-950 px-5 py-4 text-slate-100 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Reassign project</h2>
            <p className="text-[11px] text-slate-400">
              Change the responsible person for{" "}
              <span className="font-medium text-slate-100">
                {project.name}
              </span>
              .
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

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Current → new assignee */}
          <div className="rounded-xl bg-slate-900 px-3 py-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-slate-400">
                <User size={12} />
                Current assignee
              </span>
              <span className="text-slate-100">{project.assignee}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-slate-500">
              <ArrowRight size={12} />
              <span>New assignee will override this.</span>
            </div>
          </div>

          {/* Quick pick from team */}
          {uniqueTeam.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Users size={12} />
                <span>Quick pick from team</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {uniqueTeam.map((member) => (
                  <button
                    key={member}
                    type="button"
                    onClick={() => setAssignee(member)}
                    className={`rounded-full px-2 py-[2px] text-[11px] ${
                      assignee === member
                        ? "bg-blue-600 text-white"
                        : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {member}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom assignee input */}
          <div className="space-y-1">
            <label className="block text-[11px] text-slate-400">
              New assignee (name or email)
            </label>
            <input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Type a name or email"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
            />
          </div>

          {/* Add to team toggle */}
          <label className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-300">
            <input
              type="checkbox"
              checked={addToTeam}
              onChange={(e) => setAddToTeam(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-950 text-blue-500 focus:ring-blue-500"
            />
            <span>Add this person to project team if not already present</span>
          </label>

          <div className="mt-3 flex items-center justify-end gap-2">
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
              Confirm reassignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
