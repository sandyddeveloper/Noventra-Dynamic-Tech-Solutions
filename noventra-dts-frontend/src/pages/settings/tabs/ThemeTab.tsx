// src/pages/settings/tabs/ThemeTab.tsx
import React, { useState } from "react";
import { Palette, Monitor, Sun, Moon, LayoutDashboard } from "lucide-react";

type Mode = "system" | "light" | "dark";

const ThemeTab: React.FC = () => {
  const [mode, setMode] = useState<Mode>("dark");
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] text-xs text-slate-200">
      {/* LEFT – CONTROLS */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Palette size={13} />
            Display mode
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setMode("system")}
              className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2 ${
                mode === "system"
                  ? "border-blue-500 bg-slate-900"
                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <Monitor size={14} className="text-slate-300" />
              <span className="text-xs text-slate-100">System</span>
              <span className="text-[11px] text-slate-500">
                Follows OS appearance.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode("light")}
              className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2 ${
                mode === "light"
                  ? "border-blue-500 bg-slate-900"
                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <Sun size={14} className="text-amber-300" />
              <span className="text-xs text-slate-100">Light</span>
              <span className="text-[11px] text-slate-500">
                Brighter look for daylight use.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode("dark")}
              className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2 ${
                mode === "dark"
                  ? "border-blue-500 bg-slate-900"
                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <Moon size={14} className="text-blue-300" />
              <span className="text-xs text-slate-100">Dark</span>
              <span className="text-[11px] text-slate-500">
                Optimized for NDTS neon dashboard.
              </span>
            </button>
          </div>
        </div>

        {/* Density */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Layout density
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setDensity("comfortable")}
              className={`rounded-full px-3 py-1.5 text-[11px] ${
                density === "comfortable"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-200 hover:bg-slate-800"
              }`}
            >
              Comfortable
            </button>
            <button
              type="button"
              onClick={() => setDensity("compact")}
              className={`rounded-full px-3 py-1.5 text-[11px] ${
                density === "compact"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-200 hover:bg-slate-800"
              }`}
            >
              Compact
            </button>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Changes paddings in tables and cards. Helpful if you manage a lot of rows.
          </p>
        </div>
      </div>

      {/* RIGHT – LIVE PREVIEW */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          <LayoutDashboard size={13} />
          Dashboard preview
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-[11px] text-slate-300">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-blue-500/80" />
              <div>
                <div className="text-xs font-semibold text-slate-100">
                  NDTS • Neon Analytics
                </div>
                <div className="text-[10px] text-slate-500">
                  Mode: <span className="text-blue-300">{mode}</span> • Density:{" "}
                  <span className="text-blue-300">{density}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <div className="h-5 w-10 rounded-full bg-slate-800" />
              <div className="h-5 w-10 rounded-full bg-slate-800" />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
              <div className="text-[10px] text-slate-400">Projects</div>
              <div className="mt-1 text-lg font-semibold text-blue-300">12</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
              <div className="text-[10px] text-slate-400">Clients</div>
              <div className="mt-1 text-lg font-semibold text-emerald-300">8</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
              <div className="text-[10px] text-slate-400">Alerts</div>
              <div className="mt-1 text-lg font-semibold text-amber-300">3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTab;
