// src/pages/settings/tabs/APITab.tsx
import React, { useState } from "react";
import { KeyRound, Eye, EyeOff, Trash2, Globe, Link2 } from "lucide-react";

interface ApiKey {
  id: string;
  label: string;
  createdAt: string;
  lastUsed?: string;
  masked: string;
}

const APITab: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: "1",
      label: "Backend integration",
      createdAt: "2025-01-12",
      lastUsed: "2025-12-05 09:30",
      masked: "sk_live_8c2f••••••••5913",
    },
  ]);
  const [showSecrets, setShowSecrets] = useState(false);

  const createKey = () => {
    const id = String(Date.now());
    setKeys((prev) => [
      {
        id,
        label: "New key",
        createdAt: new Date().toISOString().slice(0, 10),
        masked: "sk_live_new_••••••••",
      },
      ...prev,
    ]);
  };

  const deleteKey = (id: string) => {
    if (!window.confirm("Revoke this API key?")) return;
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)] text-xs text-slate-200">
      {/* LEFT – KEYS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-2">
            <KeyRound size={13} />
            API keys
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSecrets((p) => !p)}
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-slate-800"
            >
              {showSecrets ? <EyeOff size={12} /> : <Eye size={12} />}
              {showSecrets ? "Hide" : "Show"} secrets
            </button>
            <button
              type="button"
              onClick={createKey}
              className="rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-blue-500"
            >
              + New key
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {keys.map((k) => (
            <div
              key={k.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3"
            >
              <div>
                <div className="text-xs font-medium text-slate-100">
                  {k.label}
                </div>
                <div className="text-[11px] text-slate-500">
                  {showSecrets ? k.masked.replace("••••••••", "VISIBLE") : k.masked}
                </div>
                <div className="mt-1 text-[10px] text-slate-500">
                  Created {k.createdAt} • Last used {k.lastUsed ?? "never"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteKey(k.id)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-red-300 hover:bg-red-900/60"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {keys.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-[11px] text-slate-400">
              No API keys created yet.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT – WEBHOOKS */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Globe size={13} />
            Webhooks
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="space-y-1">
              <span className="text-slate-400">Endpoint URL</span>
              <div className="flex items-center gap-2">
                <input
                  defaultValue="https://api.ndts-client.com/hooks/crm"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                />
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-slate-800"
                >
                  <Link2 size={12} />
                  Test
                </button>
              </div>
            </div>
            <p className="text-slate-500">
              NDTS can POST events for projects, tickets, clients and billing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITab;
