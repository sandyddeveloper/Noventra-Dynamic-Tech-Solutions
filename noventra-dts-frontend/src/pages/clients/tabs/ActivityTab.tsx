/* src/pages/clients/tabs/ActivityTab.tsx */
import React from "react";
import { CalendarClock, Kanban, MessageSquare } from "lucide-react";
import type { Client } from "../../../types/client.types";

const events = [
  {
    type: "Project",
    icon: <Kanban size={12} className="text-blue-400" />,
    text: "Nova AI Platform milestone reached",
    date: "2025-12-03 11:45 AM",
  },
  {
    type: "Ticket",
    icon: <MessageSquare size={12} className="text-amber-300" />,
    text: "Support ticket #TCK-089 updated",
    date: "2025-12-02 10:30 AM",
  },
  {
    type: "Invoice",
    icon: <CalendarClock size={12} className="text-emerald-300" />,
    text: "Payment received for INV-884",
    date: "2025-11-14 10:00 AM",
  },
];

const ActivityTab: React.FC<{ client: Client }> = () => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs text-slate-200">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">
        Recent activity
      </div>

      {events.map((e, i) => (
        <div key={i} className="flex gap-3">
          <div className="mt-[2px]">{e.icon}</div>
          <div className="flex-1">
            <div className="text-slate-100 text-sm">{e.text}</div>
            <div className="text-[11px] text-slate-500">{e.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTab;
