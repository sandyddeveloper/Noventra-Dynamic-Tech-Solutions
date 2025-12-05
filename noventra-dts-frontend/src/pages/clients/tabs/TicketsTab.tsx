// src/pages/clients/tabs/TicketsTab.tsx
import React from "react";
import { CheckCircle2, Clock, MessageSquare } from "lucide-react";
import type { Client } from "../../../types/client.types"; // <-- ADD THIS

interface Ticket {
  id: string;
  title: string;
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
}

// ADD THIS INTERFACE
interface TicketsTabProps {
  client: Client;
}

const sampleTickets: Ticket[] = [
  {
    id: "TCK-101",
    title: "Error while uploading documents",
    status: "Open",
    createdAt: "2025-12-01 10:30 AM",
  },
  {
    id: "TCK-089",
    title: "Incorrect invoice amount",
    status: "In Progress",
    createdAt: "2025-11-25 01:14 PM",
  },
  {
    id: "TCK-066",
    title: "Slow performance on dashboard",
    status: "Resolved",
    createdAt: "2025-11-18 05:10 PM",
  },
];

// ACCEPT PROPS HERE
const TicketsTab: React.FC<TicketsTabProps> = ({ client }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4 text-xs text-slate-200 space-y-3">
      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
        <MessageSquare size={13} />
        Support tickets — {client.name} {/* Example usage */}
      </div>

      <div className="space-y-2">
        {sampleTickets.map((t) => (
          <div
            key={t.id}
            className="flex justify-between items-center rounded-lg bg-slate-900 px-3 py-2"
          >
            <div>
              <div className="text-slate-100 text-sm">{t.title}</div>
              <div className="text-[11px] text-slate-500">{t.createdAt}</div>
            </div>

            <div
              className={`inline-flex items-center gap-1 text-[10px] px-2 py-[3px] rounded-full ${
                t.status === "Open"
                  ? "bg-red-900/60 text-red-100"
                  : t.status === "In Progress"
                  ? "bg-amber-900/60 text-amber-100"
                  : "bg-emerald-900/60 text-emerald-100"
              }`}
            >
              {t.status === "Resolved" ? (
                <CheckCircle2 size={10} />
              ) : (
                <Clock size={10} />
              )}
              {t.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketsTab;
