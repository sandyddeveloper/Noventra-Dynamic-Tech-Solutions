// src/pages/settings/tabs/BillingTab.tsx
import React from "react";
import { CreditCard, BadgeDollarSign, FileText, AlertTriangle } from "lucide-react";

const BillingTab: React.FC = () => {
  const currentPlan = {
    name: "NDTS Pro",
    seats: 25,
    price: "₹24,999 / month",
    renewsOn: "2026-01-10",
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)] text-xs text-slate-200">
      {/* LEFT – PLAN */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <CreditCard size={13} />
            Current subscription
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-100">
                  {currentPlan.name}
                </div>
                <div className="text-[11px] text-slate-400">
                  {currentPlan.seats} seats • AI + CRM + Projects
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-emerald-300">
                  {currentPlan.price}
                </div>
                <div className="text-[10px] text-slate-500">
                  Renews on {currentPlan.renewsOn}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-2 rounded-full bg-slate-900 px-4 py-1.5 text-[11px] text-slate-100 hover:bg-slate-800"
            >
              Manage plan & seats
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT – INVOICES & ALERTS */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <FileText size={13} />
            Recent invoices
          </div>
          <div className="space-y-2 text-[11px]">
            {[
              { id: "INV-884", date: "2025-12-01", amount: "₹24,999", status: "Paid" },
              { id: "INV-853", date: "2025-11-01", amount: "₹24,999", status: "Paid" },
            ].map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2"
              >
                <div>
                  <div className="text-slate-100">{inv.id}</div>
                  <div className="text-slate-500">{inv.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-300">{inv.amount}</div>
                  <div className="text-slate-500">{inv.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-800 bg-slate-950 px-5 py-4">
          <div className="flex items-start gap-2 text-xs text-amber-100">
            <AlertTriangle size={14} className="mt-[2px]" />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide">
                Billing alerts
              </div>
              <p className="mt-1 text-[11px] text-amber-100/80">
                Configure alerts from the Notifications settings for failures, upcoming renewals or
                over-usage.
              </p>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-100">
                <BadgeDollarSign size={12} />
                Predictive usage reports coming soon.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingTab;
