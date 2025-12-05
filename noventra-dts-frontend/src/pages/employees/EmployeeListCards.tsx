import React from "react";
import { EntityCardList } from "../../components/shared/EntityCardList";

export interface EmployeeCard {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface EmployeeListCardsProps {
  employees: EmployeeCard[];
  loading?: boolean;
  title?: string;
  description?: string;
  headerRight?: React.ReactNode;

  /** Called when a card is tapped */
  onItemClick?: (emp: EmployeeCard) => void;
}

export const EmployeeListCards: React.FC<EmployeeListCardsProps> = ({
  employees,
  loading = false,
  title = "Employees",
  description = "Quick mobile-friendly view of employee details.",
  headerRight,
  onItemClick,
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-slate-800 bg-slate-950/80 p-3"
          >
            <div className="h-4 w-32 rounded bg-slate-800" />
            <div className="mt-2 h-3 w-48 rounded bg-slate-900" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <EntityCardList<EmployeeCard>
      items={employees}
      title={title}
      description={description}
      headerRight={headerRight}
      getId={(e) => e.id}
      onCardClick={onItemClick}
      enableSearch
      searchPlaceholder="Search employees…"
      getSearchText={(e) =>
        `${e.name} ${e.email} ${e.role} ${e.department}`
      }
      // MAIN CONTENT (top of card)
      renderMain={(e) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-50">
              {e.name}
            </span>
            <span className="rounded-full bg-slate-900 px-2 py-[3px] text-[10px] text-slate-300">
              {e.role}
            </span>
          </div>
          <div className="truncate text-[11px] text-slate-400">
            {e.email}
          </div>
        </div>
      )}
      // META ROW (small details under main)
      renderMeta={(e) => (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span className="rounded-full bg-slate-900/80 px-2 py-[2px]">
            Dept:{" "}
            <span className="font-medium text-slate-200">
              {e.department}
            </span>
          </span>
          <span className="rounded-full bg-slate-900/80 px-2 py-[2px]">
            ID: <span className="font-mono text-slate-300">{e.id}</span>
          </span>
        </div>
      )}
      // TAGS (if you want, can be removed)
      renderTags={(e) => (
        <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-300">
          <span className="rounded-full bg-slate-900 px-2 py-[2px]">
            {e.role}
          </span>
          <span className="rounded-full bg-slate-900 px-2 py-[2px]">
            {e.department}
          </span>
        </div>
      )}
    />
  );
};
