// src/pages/settings/tabs/IntegrationsTab.tsx
import React, { useState } from "react";
import { Slack, Github, Activity, DollarSign } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  status: "Connected" | "Not connected";
  icon: React.ReactNode;
  category: "Communication" | "Dev" | "Finance";
}

const IntegrationsTab: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "slack",
      name: "Slack",
      description: "Send NDTS notifications & alerts to your Slack channels.",
      status: "Connected",
      icon: <Slack className="h-4 w-4 text-purple-300" />,
      category: "Communication",
    },
    {
      id: "github",
      name: "GitHub",
      description: "Link PRs and issues to projects in NDTS.",
      status: "Not connected",
      icon: <Github className="h-4 w-4 text-slate-100" />,
      category: "Dev",
    },
    {
      id: "zoho-books",
      name: "Zoho Books",
      description: "Sync invoices and payments for CRM clients.",
      status: "Not connected",
      icon: <DollarSign className="h-4 w-4 text-emerald-300" />,
      category: "Finance",
    },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "Connected" ? "Not connected" : "Connected" }
          : i,
      ),
    );
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)] text-xs text-slate-200">
      {/* LEFT – LIST */}
      <div className="space-y-3">
        {integrations.map((i) => (
          <div
            key={i.id}
            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900">
                {i.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-100">
                    {i.name}
                  </span>
                  <span className="rounded-full bg-slate-900 px-2 py-[2px] text-[10px] text-slate-300">
                    {i.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">{i.description}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleIntegration(i.id)}
              className={`rounded-full px-3 py-1.5 text-[11px] ${
                i.status === "Connected"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 text-slate-200 hover:bg-slate-800"
              }`}
            >
              {i.status === "Connected" ? "Connected" : "Connect"}
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT – ACTIVITY */}
      <div className="space-y-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Activity size={13} />
            Integration activity
          </div>
          <div className="space-y-2 text-[11px] text-slate-300">
            <div className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <div>
                <div className="text-slate-100">
                  Slack · Alerts synced with Notifications module.
                </div>
                <div className="text-slate-500">Today, 09:15</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-500" />
              <div>
                <div className="text-slate-100">
                  GitHub · Ready to link PRs to Projects page.
                </div>
                <div className="text-slate-500">Yesterday, 18:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsTab;
