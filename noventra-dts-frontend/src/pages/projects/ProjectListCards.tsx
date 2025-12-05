import React from "react";
import type { Project } from "../../types/project.types";
import {
  Clock,
  User,
  UserSquare,
  Tag,
  Briefcase,
  Edit2,
  Trash2,
} from "lucide-react";
import { EntityCardList } from "../../components/shared/EntityCardList";

interface ProjectListCardsProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onReassign: (project: Project) => void;
  onToggleFavorite: (projectId: string) => void;
  onOpenDetails: (project: Project) => void;
}

const statusChipClasses: Record<Project["status"], string> = {
  Active: "bg-emerald-900/70 text-emerald-100",
  "On Hold": "bg-amber-900/70 text-amber-100",
  Completed: "bg-slate-800 text-slate-100",
  Archived: "bg-slate-900/80 text-slate-300",
};

const priorityChipClasses: Record<Project["priority"], string> = {
  Low: "bg-slate-800 text-slate-100",
  Medium: "bg-sky-900/70 text-sky-100",
  High: "bg-orange-900/70 text-orange-100",
  Critical: "bg-red-900/80 text-red-100",
};

export const ProjectListCards: React.FC<ProjectListCardsProps> = ({
  projects,
  onEdit,
  onDelete,
  onReassign,
  onToggleFavorite,
  onOpenDetails,
}) => {
  return (
    <EntityCardList<Project>
      items={projects}
      title="Projects (card view)"
      description="Mobile-friendly list of projects with quick actions."
      getId={(p) => p.id}
      onCardClick={onOpenDetails}
      enableSearch
      searchPlaceholder="Search projects…"
      getSearchText={(p) =>
        [
          p.name,
          p.code,
          p.owner,
          p.assignee,
          p.description ?? "",
          p.client ?? "",
        ].join(" ")
      }
      getIsFavorite={(p) => !!p.isFavorite}
      onToggleFavorite={(p) => onToggleFavorite(p.id)}
      renderMain={(p) => {
        const dueLabel = p.dueDate
          ? new Date(p.dueDate).toLocaleDateString()
          : "No due date";

        return (
          <>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-slate-50">
                {p.name}
              </h3>
              <span className="rounded-full bg-slate-900 px-2 py-[1px] text-[10px] font-mono text-slate-400">
                {p.code}
              </span>
            </div>

            {p.description && (
              <p className="mt-1 line-clamp-2 text-[11px] sm:text-xs text-slate-400">
                {p.description}
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] ${statusChipClasses[p.status]}`}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
                {p.status}
              </span>
              <span
                className={`rounded-full px-2 py-[2px] text-[10px] ${priorityChipClasses[p.priority]}`}
              >
                Priority: {p.priority}
              </span>
              {p.client && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-[2px] text-[10px] text-slate-200">
                  <Briefcase size={10} />
                  {p.client}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-[2px] text-[10px] text-slate-200">
                <Clock size={10} />
                Due: {dueLabel}
              </span>
            </div>
          </>
        );
      }}
      renderMeta={(p) => (
        <div className="grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-3 sm:text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <User size={13} className="text-slate-500" />
            <span className="truncate">
              Owner: <span className="font-medium">{p.owner}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <UserSquare size={13} className="text-slate-500" />
            <span className="truncate">
              Assignee: <span className="font-medium">{p.assignee}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock size={13} className="text-slate-500" />
            <span>
              Est: {p.estimatedHours ?? 0}h • Logged: {p.loggedHours ?? 0}h
            </span>
          </div>
        </div>
      )}
      renderTags={(p) =>
        !!p.tags?.length && (
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px]">
            <Tag size={11} className="text-slate-500" />
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-slate-900 px-2 py-[2px] text-slate-200"
              >
                {t}
              </span>
            ))}
          </div>
        )
      }
      renderExpanded={(p) => (
        <div className="flex flex-wrap gap-3 text-[11px] sm:text-xs text-slate-300">
          <div>
            <div className="text-slate-500">Team size</div>
            <div className="font-semibold">{p.team?.length ?? 0}</div>
          </div>
          <div>
            <div className="text-slate-500">Code</div>
            <div className="font-mono text-slate-200">{p.code}</div>
          </div>
        </div>
      )}
      renderActions={(p) => (
        <>
          <button
            type="button"
            onClick={() => onOpenDetails(p)}
            className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] sm:text-xs text-slate-100 hover:bg-slate-800"
          >
            Open details
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onReassign(p)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800"
            >
              <UserSquare size={14} />
            </button>
            <button
              type="button"
              onClick={() => onEdit(p)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800"
            >
              <Edit2 size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(p)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-900/80 text-red-100 hover:bg-red-800"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </>
      )}
    />
  );
};
