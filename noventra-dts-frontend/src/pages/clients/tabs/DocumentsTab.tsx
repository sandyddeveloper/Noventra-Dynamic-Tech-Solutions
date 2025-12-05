/* src/pages/clients/tabs/DocumentsTab.tsx */
import React from "react";
import { FileText, Upload, Trash2 } from "lucide-react";
import type { Client } from "../../../types/client.types";

const docs = [
  { id: "DOC-01", name: "NDA Agreement.pdf", uploaded: "2025-06-10", size: "480 KB" },
  { id: "DOC-02", name: "SOW - Phase 1.docx", uploaded: "2025-07-01", size: "1.2 MB" },
  { id: "DOC-03", name: "Design Guidelines.png", uploaded: "2025-07-15", size: "900 KB" },
];

const DocumentsTab: React.FC<{ client: Client }> = () => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-4 text-xs text-slate-200">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] uppercase tracking-wide text-slate-400 flex items-center gap-2">
          <FileText size={14} /> Client Documents
        </h3>

        <button className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-[11px] text-white hover:bg-blue-500">
          <Upload size={13} /> Upload new
        </button>
      </div>

      <div className="space-y-2">
        {docs.map((d) => (
          <div
            key={d.id}
            className="flex justify-between items-center bg-slate-900 rounded-xl px-3 py-2"
          >
            <div className="flex flex-col">
              <span className="text-slate-100 text-sm">{d.name}</span>
              <span className="text-[11px] text-slate-500">
                {d.uploaded} • {d.size}
              </span>
            </div>

            <button className="text-red-300 hover:text-red-400">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsTab;
