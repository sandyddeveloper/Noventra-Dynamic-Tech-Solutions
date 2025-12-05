/* src/pages/clients/tabs/FinanceTab.tsx */
import React from "react";
import { BadgeDollarSign, Download} from "lucide-react";
import type { Client } from "../../../types/client.types";

interface Invoice {
  id: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  date: string;
}

const invoices: Invoice[] = [
  { id: "INV-884", amount: 450000, status: "Paid", date: "2025-11-14" },
  { id: "INV-912", amount: 120000, status: "Pending", date: "2025-12-01" },
  { id: "INV-771", amount: 220000, status: "Overdue", date: "2025-10-26" },
];

const FinanceTab: React.FC<{ client: Client }> = ({ client }) => {
  const totalDue = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const statusClass = (s: Invoice["status"]) =>
    s === "Paid"
      ? "bg-emerald-900/60 text-emerald-100"
      : s === "Pending"
      ? "bg-amber-900/60 text-amber-100"
      : "bg-red-900/60 text-red-100";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-4 text-xs text-slate-200">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] uppercase tracking-wide text-slate-400 flex items-center gap-2">
          <BadgeDollarSign size={14} /> Financial overview
        </h3>
        <button className="rounded-full bg-blue-600 px-3 py-1 text-[11px] hover:bg-blue-500">
          Generate Statement
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <div className="text-slate-400 text-[11px]">Outstanding</div>
          <div className="text-lg font-semibold text-red-300">
            ₹{(totalDue / 100000).toFixed(2)} L
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <div className="text-slate-400 text-[11px]">Monthly MRR</div>
          <div className="text-lg font-semibold text-emerald-300">
            ₹{(client.mrr / 100000).toFixed(2)} L
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <div className="text-slate-400 text-[11px]">Credit score (AI)</div>
          <div className="text-lg font-semibold text-blue-300">
            {client.aiRiskScore}/100
          </div>
        </div>
      </div>

      {/* Invoice list */}
      <div className="space-y-2">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2"
          >
            <div className="flex flex-col">
              <span className="text-slate-100 text-sm">{inv.id}</span>
              <span className="text-[11px] text-slate-500">{inv.date}</span>
            </div>

            <span className="text-[11px] text-emerald-300 font-semibold">
              ₹{inv.amount.toLocaleString()}
            </span>

            <span className={`rounded-full px-2 py-[3px] text-[10px] ${statusClass(inv.status)}`}>
              {inv.status}
            </span>

            <button className="hover:text-blue-300">
              <Download size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinanceTab;
