// src/pages/settings/tabs/AITab.tsx
import React, { useState } from "react";
import { Cpu, Sparkles, MessageCircle, SlidersHorizontal } from "lucide-react";

const AITab: React.FC = () => {
  const [style, setStyle] = useState<"formal" | "friendly" | "technical">(
    "technical",
  );
  const [features, setFeatures] = useState({
    smartSuggestions: true,
    autoSummaries: true,
    explainFields: false,
  });

  const toggleFeature = (key: keyof typeof features) =>
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)] text-xs text-slate-200">
      {/* LEFT */}
      <div className="space-y-4">
        {/* Personality */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Cpu size={13} />
            AI assistant behaviour
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setStyle("formal")}
              className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2 ${
                style === "formal"
                  ? "border-blue-500 bg-slate-900"
                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <MessageCircle size={13} className="text-slate-300" />
              <span className="text-xs text-slate-100">Formal</span>
              <span className="text-[11px] text-slate-500">
                Enterprise review & strict wording.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStyle("friendly")}
              className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2 ${
                style === "friendly"
                  ? "border-blue-500 bg-slate-900"
                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <Sparkles size={13} className="text-emerald-300" />
              <span className="text-xs text-slate-100">Friendly</span>
              <span className="text-[11px] text-slate-500">
                More casual tone for internal teams.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStyle("technical")}
              className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2 ${
                style === "technical"
                  ? "border-blue-500 bg-slate-900"
                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <SlidersHorizontal size={13} className="text-purple-300" />
              <span className="text-xs text-slate-100">Technical</span>
              <span className="text-[11px] text-slate-500">
                Precise, concise, dev-focused answers.
              </span>
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Workspace automation
          </div>

          <div className="space-y-2 text-[11px]">
            <label className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2">
              <div>
                <div className="text-slate-100">Smart suggestions</div>
                <div className="text-slate-500">
                  AI proposes actions on projects, tickets and clients.
                </div>
              </div>
              <input
                type="checkbox"
                checked={features.smartSuggestions}
                onChange={() => toggleFeature("smartSuggestions")}
                className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-blue-500"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2">
              <div>
                <div className="text-slate-100">Auto-summarise activity</div>
                <div className="text-slate-500">
                  Generates daily digests in your Notifications module.
                </div>
              </div>
              <input
                type="checkbox"
                checked={features.autoSummaries}
                onChange={() => toggleFeature("autoSummaries")}
                className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-blue-500"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2">
              <div>
                <div className="text-slate-100">Explain fields</div>
                <div className="text-slate-500">
                  Show tooltips with AI explanations for complex settings.
                </div>
              </div>
              <input
                type="checkbox"
                checked={features.explainFields}
                onChange={() => toggleFeature("explainFields")}
                className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-blue-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* RIGHT – PREVIEW */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-xs">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Example reply preview
        </div>

        <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-[10px] text-slate-500 mb-1">User question</div>
          <div className="rounded-xl bg-slate-900 px-3 py-2 text-[11px] text-slate-200">
            “Summarise today’s project and attendance changes for my team.”
          </div>

          <div className="text-[10px] text-slate-500 mt-2">AI ({style})</div>
          <div className="rounded-xl bg-blue-950/60 px-3 py-2 text-[11px] text-slate-100">
            {style === "technical" && (
              <>
                • 3 projects changed status (2 → <span className="text-emerald-300">Active</span>,
                1 → <span className="text-amber-300">On Hold</span>).
                <br />
                • Attendance: 1{" "}
                <span className="text-amber-300 font-medium">Late</span>, 0{" "}
                <span className="text-red-300 font-medium">Absent</span>.
                <br />
                • No billing or AI-risk anomalies detected.
              </>
            )}
            {style === "formal" && (
              <>
                Today, three projects experienced a status update. Attendance remained stable, with
                one late check-in and no unplanned absences. No critical risk or billing issues were
                observed.
              </>
            )}
            {style === "friendly" && (
              <>
                Quick heads-up 💡 — 3 projects moved around today, mostly in a good way. Attendance
                was fine overall, just one late login and no surprises. Billing and risk look clean.
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITab;
