import React from "react";
import {
  Building2,
  AlertTriangle,
  BadgeDollarSign,
  MapPin,
} from "lucide-react";

import type { Client, ClientHealth, ClientTier } from "../../types/client.types";
import { EntityCardList } from "../../components/shared/EntityCardList";

const healthClass: Record<ClientHealth, string> = {
  Healthy: "bg-emerald-900/70 text-emerald-100",
  "At Risk": "bg-amber-900/70 text-amber-100",
  Critical: "bg-red-900/70 text-red-100",
};

const tierClass: Record<ClientTier, string> = {
  Standard: "bg-slate-800 text-slate-100",
  Premium: "bg-blue-900/70 text-blue-100",
  Enterprise: "bg-purple-900/70 text-purple-100",
};

interface ClientListCardsProps {
  clients: Client[];
  title?: string;
  description?: string;
  onOpenWorkspace?: (client: Client) => void;
}

export const ClientListCards: React.FC<ClientListCardsProps> = ({
  clients,
  title = "Clients",
  description = "Tap a client to open workspace.",
  onOpenWorkspace,
}) => {
  return (
    <EntityCardList<Client>
      items={clients}
      title={title}
      description={description}
      getId={(c) => c.id}
      // We already apply filters & search in the page
      enableSearch={false}
      // Card click also opens workspace
      onCardClick={onOpenWorkspace}
      // MAIN CONTENT
      renderMain={(c) => (
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-100">
                {c.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-50">
                  {c.name}
                </span>
                <span className="text-[11px] text-slate-400">{c.code}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span
                className={`rounded-full px-2 py-[2px] text-[10px] ${tierClass[c.tier]}`}
              >
                {c.tier}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] ${healthClass[c.health]}`}
              >
                <AlertTriangle size={10} />
                {c.health}
              </span>
            </div>
          </div>
        </div>
      )}
      // META INFO
      renderMeta={(c) => (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-[2px]">
            <Building2 size={11} className="text-slate-500" />
            <span>{c.industry || "No industry"}</span>
          </span>

          {c.location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-[2px]">
              <MapPin size={11} className="text-slate-500" />
              <span>{c.location}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-[2px] text-emerald-300">
            <BadgeDollarSign size={11} />
            ₹{(c.mrr / 100000).toFixed(2)}
            <span className="text-[10px] text-slate-400">L / mo</span>
          </span>
        </div>
      )}
      // TAGS: project info
      renderTags={(c) => (
        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-slate-300">
          <span className="rounded-full bg-slate-900 px-2 py-[2px]">
            {c.activeProjects}/{c.totalProjects} active projects
          </span>
          <span className="rounded-full bg-slate-900 px-2 py-[2px]">
            AI risk: {c.aiRiskScore}/100
          </span>
        </div>
      )}
      // ACTIONS
      renderActions={(c) =>
        onOpenWorkspace && (
          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenWorkspace(c);
              }}
              className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-slate-800"
            >
              Open workspace
            </button>
          </div>
        )
      }
    />
  );
};
