import React from "react";
import { Users, Tag } from "lucide-react";
import type { Team } from "../../types/team.types";
import { EntityCardList } from "../../components/shared/EntityCardList";

interface TeamListCardsProps {
  teams: Team[];
  title?: string;
  description?: string;
  onQuickView?: (team: Team) => void;
  onEdit?: (team: Team) => void;
  onDelete?: (team: Team) => void;
}

export const TeamListCards: React.FC<TeamListCardsProps> = ({
  teams,
  title = "Teams",
  description = "Tap a team to see details.",
  onQuickView,
  onEdit,
  onDelete,
}) => {
  return (
    <EntityCardList<Team>
      items={teams}
      title={title}
      description={description}
      getId={(t) => t.id}
      // we already handle search/filter in page → disable internal search
      enableSearch={false}
      // MAIN CONTENT
      renderMain={(t) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-slate-50">
                {t.name}
              </div>
              <div className="text-[11px] text-slate-400">
                {t.code} • {t.workMode}
              </div>
            </div>

            <span
              className={`rounded-full px-2 py-[2px] text-[10px] ${
                t.status === "Active"
                  ? "bg-emerald-900/70 text-emerald-100"
                  : t.status === "Hiring"
                  ? "bg-blue-900/70 text-blue-100"
                  : t.status === "Paused"
                  ? "bg-amber-900/70 text-amber-100"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              {t.status}
            </span>
          </div>
        </div>
      )}
      // META ROW
      renderMeta={(t) => {
        const used = t.memberIds.length;
        return (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-[2px]">
              <Users size={11} className="text-slate-500" />
              <span>
                {used} / {t.capacity} members
              </span>
            </span>
          </div>
        );
      }}
      // TAGS
      renderTags={(t) =>
        t.tags.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
            {t.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-[2px] text-slate-200"
              >
                <Tag size={10} className="text-slate-500" />
                {tag}
              </span>
            ))}
            {t.tags.length > 3 && (
              <span className="rounded-full bg-slate-900 px-2 py-[2px] text-slate-400">
                +{t.tags.length - 3}
              </span>
            )}
          </div>
        ) : null
      }
      // ACTION BUTTONS
      renderActions={(t) => (
        <div className="flex w-full flex-wrap items-center justify-end gap-2 text-[11px]">
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(t);
              }}
              className="rounded-full bg-slate-900 px-3 py-1.5 text-slate-100 hover:bg-slate-800"
            >
              View
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(t);
              }}
              className="rounded-full bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(t);
              }}
              className="rounded-full bg-red-900/80 px-3 py-1.5 text-red-100 hover:bg-red-800"
            >
              Delete
            </button>
          )}
        </div>
      )}
    />
  );
};
