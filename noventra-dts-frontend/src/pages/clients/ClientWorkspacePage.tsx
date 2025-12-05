// src/pages/clients/ClientWorkspacePage.tsx
import React, { useMemo, useState } from "react";
import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    MapPin,
    Globe,
    UserCircle2,
    FolderKanban,
    ReceiptIndianRupee,
    FileArchive,
    Activity,
    ShieldAlert,
    Settings,
    BarChart3,
    Tags,
    Users,
    MessageSquare,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { Client } from "../../types/client.types";
import { mockClients } from "../../data/mockClients";
import ProjectsTab from "./tabs/ProjectsTab";
import ContactsTab from "./tabs/ContactsTab";
import DocumentsTab from "./tabs/DocumentsTab";
import ActivityTab from "./tabs/ActivityTab";


type Tab =
    | "projects"
    | "contacts"
    | "billing"
    | "documents"
    | "activity"
    | "risk"
    | "settings";

interface ClientLocationState {
    client?: Client;
}

const ClientWorkspacePage: React.FC = () => {
    const navigate = useNavigate();
    const { clientId } = useParams<{ clientId: string }>();
    const location = useLocation();
    const state = (location.state || {}) as ClientLocationState;

    const client: Client | undefined =
        state.client || mockClients.find((c) => c.id === clientId);

    const [tab, setTab] = useState<Tab>("projects");

    const aiSummary = useMemo(() => {
        if (!client) return null;

        const risk =
            client.aiRiskScore < 30
                ? "Low risk"
                : client.aiRiskScore < 70
                    ? "Medium risk"
                    : "High risk";

        const sentiment =
            client.sentimentScore > 0.4
                ? "Positive"
                : client.sentimentScore > -0.2
                    ? "Neutral"
                    : "Negative";

        const recommendations: string[] = [];

        if (client.aiRiskScore >= 70) {
            recommendations.push(
                "Schedule an executive check-in meeting within 7 days.",
                "Review SLA breaches with the client and propose an improvement plan.",
            );
        } else if (client.aiRiskScore >= 40) {
            recommendations.push(
                "Increase touchpoints to weekly status calls for the next month.",
            );
        } else {
            recommendations.push(
                "Maintain current cadence, but proactively share upcoming roadmap.",
            );
        }

        if (client.sentimentScore < 0) {
            recommendations.push(
                "Sentiment from recent tickets is negative — review support responses.",
            );
        }

        if (client.openTickets > 5) {
            recommendations.push(
                "High volume of open tickets — consider assigning a dedicated support engineer.",
            );
        }

        return {
            riskLabel: risk,
            sentimentLabel: sentiment,
            churnPercent: Math.round(client.aiChurnProbability * 100),
            recommendations,
        };
    }, [client]);

    if (!client) {
        return (
            <div className="max-w-6xl mx-auto space-y-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
                <div className="rounded-2xl border border-red-500/40 bg-red-950/40 px-6 py-4 text-sm text-red-100">
                    Client not found.
                </div>
            </div>
        );
    }

    const breadcrumbIndustry = client.industry || "All industries";

    return (
        <div className="max-w-[1400px] mx-auto space-y-5">
            {/* Top bar + breadcrumbs */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <button
                        type="button"
                        onClick={() => navigate("/clients")}
                        className="hover:text-slate-200"
                    >
                        Clients
                    </button>
                    <span>/</span>
                    <span>{breadcrumbIndustry}</span>
                    <span>/</span>
                    <span className="text-slate-200">{client.name}</span>
                </div>

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                        >
                            <ArrowLeft size={14} />
                            Back
                        </button>
                        <h1 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
                            <Building2 size={18} className="text-blue-400" />
                            {client.name}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-slate-200">
                            <UserCircle2 size={13} />
                            Owner: {client.accountOwner}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-slate-200">
                            <Tags size={13} />
                            {client.tier} • {client.health}
                        </span>
                    </div>
                </div>
            </div>

            {/* Header summary & AI card */}
            <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
                {/* Client info + KPIs */}
                <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950/90 px-6 py-4 shadow-xl">
                    {/* contact row */}
                    <div className="grid gap-3 text-xs md:grid-cols-4">
                        <InfoRow icon={Mail} label="Email" value={client.email} />
                        <InfoRow icon={Phone} label="Phone" value={client.phone} />
                        <InfoRow icon={MapPin} label="Location" value={client.location} />
                        <InfoRow icon={Globe} label="Website" value={client.website} />
                    </div>

                    {/* KPIs */}
                    <div className="mt-3 grid gap-3 md:grid-cols-3 text-xs">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                                <span>Active projects</span>
                                <FolderKanban size={14} className="text-blue-300" />
                            </div>
                            <div className="mt-1 text-lg font-semibold text-slate-100">
                                {client.activeProjects}
                                <span className="ml-1 text-[11px] text-slate-500">
                                    / {client.totalProjects}
                                </span>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-emerald-800 bg-slate-950 px-4 py-3">
                            <div className="flex items-center justify-between text-[11px] text-emerald-200">
                                <span>MRR</span>
                                <ReceiptIndianRupee size={14} className="text-emerald-300" />
                            </div>
                            <div className="mt-1 text-lg font-semibold text-emerald-300">
                                ₹{(client.mrr / 100000).toFixed(2)} L
                            </div>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                                <span>Open tickets</span>
                                <MessageSquare size={14} className="text-amber-300" />
                            </div>
                            <div className="mt-1 text-lg font-semibold text-amber-300">
                                {client.openTickets}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI insights card */}
                <div className="space-y-3 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 to-slate-900 px-6 py-4 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            <BarChart3 size={14} className="text-blue-300" />
                            AI client insights
                        </div>
                        <span className="rounded-full bg-slate-900 px-2 py-[2px] text-[10px] text-slate-300">
                            Preview • Scores from mock data
                        </span>
                    </div>

                    {aiSummary && (
                        <>
                            <div className="grid gap-3 text-xs md:grid-cols-3">
                                <div>
                                    <div className="text-[11px] text-slate-400">
                                        Risk level
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-slate-50">
                                        {aiSummary.riskLabel}
                                    </div>
                                    <div className="mt-0.5 text-[11px] text-slate-500">
                                        AI score: {client.aiRiskScore}/100
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-slate-400">
                                        Churn probability
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-amber-300">
                                        {aiSummary.churnPercent}%
                                    </div>
                                    <div className="mt-0.5 text-[11px] text-slate-500">
                                        Based on tickets, SLAs & revenue pattern
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-slate-400">
                                        Sentiment
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-slate-50">
                                        {aiSummary.sentimentLabel}
                                    </div>
                                    <div className="mt-0.5 text-[11px] text-slate-500">
                                        Score: {client.sentimentScore.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 space-y-1.5 text-[11px] text-slate-200">
                                <div className="text-[11px] text-slate-400">
                                    Recommended actions
                                </div>
                                <ul className="space-y-1">
                                    {aiSummary.recommendations.map((r) => (
                                        <li
                                            key={r}
                                            className="flex gap-2 rounded-xl bg-slate-900 px-3 py-1.5"
                                        >
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400" />
                                            <span>{r}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-slate-800 text-xs">
                {(
                    [
                        ["projects", "Projects", FolderKanban],
                        ["contacts", "Contacts", Users],
                        ["billing", "Billing", ReceiptIndianRupee],
                        ["documents", "Documents", FileArchive],
                        ["activity", "Activity", Activity],
                        ["risk", "Risk & SLA", ShieldAlert],
                        ["settings", "Settings", Settings],
                    ] as [Tab, string, React.ComponentType<any>][]
                ).map(([id, label, Icon]) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setTab(id)}
                        className={`inline-flex items-center gap-1 rounded-t-xl px-3 py-2 ${tab === id
                                ? "border border-slate-700 border-b-slate-950 bg-slate-900 text-slate-100"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        <Icon size={13} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {tab === "projects" && <ProjectsTab client={client} />}
            {tab === "contacts" && <ContactsTab client={client} />}
            {tab === "billing" && <BillingTab client={client} />}
            {tab === "documents" && <DocumentsTab client={client} />}
            {tab === "activity" && <ActivityTab client={client} />}
            {tab === "risk" && <RiskTab client={client} aiSummary={aiSummary} />}
            {tab === "settings" && <SettingsTab client={client} />}
        </div>
    );
};

const InfoRow = ({
    icon: Icon,
    value,
}: {
    icon: React.ComponentType<any>;
    label: string;
    value?: string;
}) => (
    <div className="flex items-center gap-2 text-slate-300">
        <Icon size={13} className="text-slate-500" />
        <span className="truncate">{value || "—"}</span>
    </div>
);

/* ---- SIMPLE TAB PLACEHOLDERS (you can expand later) ---- */


const BillingTab: React.FC<{ client: Client }> = ({ client }) => (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4 text-xs text-slate-200">
        {/* TODO: invoices, payments, retainers. */}
        <p>Billing, invoices and payment history for {client.name}.</p>
    </div>
);




const RiskTab: React.FC<{
    client: Client;
    aiSummary: ReturnType<typeof useMemo> | any;
}> = ({ client, aiSummary }) => (
    <div className="grid gap-4 lg:grid-cols-2 text-xs">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <ShieldAlert size={13} />
                SLA & support
            </div>
            <div className="mt-2 space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                    <span>SLA breaches (30d)</span>
                    <span>{client.slaBreachesLast30d}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Tickets (30d)</span>
                    <span>{client.ticketsLast30d}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Avg response time</span>
                    <span>{client.avgResponseHours.toFixed(1)} h</span>
                </div>
            </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <BarChart3 size={13} />
                AI risk analysis
            </div>
            {aiSummary && (
                <div className="mt-2 space-y-1.5 text-slate-300">
                    <div className="flex items-center justify-between">
                        <span>Risk level</span>
                        <span>{aiSummary.riskLabel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Churn probability</span>
                        <span>{aiSummary.churnPercent}%</span>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-400">
                        Suggested actions:
                    </div>
                    <ul className="mt-1 space-y-1">
                        {aiSummary.recommendations.map((r: string) => (
                            <li
                                key={r}
                                className="flex gap-2 rounded-xl bg-slate-900 px-3 py-1.5"
                            >
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                                <span>{r}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
);

const SettingsTab: React.FC<{ client: Client }> = ({ client }) => (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4 text-xs text-slate-200">
        {/* TODO: ownership, tags, SLAs, notification settings per client. */}
        <p>Client-specific settings for {client.name}.</p>
    </div>
);

export default ClientWorkspacePage;
