// src/pages/clients/ClientManagementPage.tsx
import React, { useMemo, useState } from "react";
import {
  Building2,
  UserCircle2,
  AlertTriangle,
  BadgeDollarSign,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { ColumnDef, SortDirection } from "../../types/datatable.types";
import type { Client, ClientHealth, ClientTier } from "../../types/client.types";
import { DataTable } from "../../components/shared/DataTable";
import { mockClients } from "../../data/mockClients";


const healthClass: Record<ClientHealth, string> = {
  Healthy: "bg-emerald-900/70 text-emerald-100",
  "At Risk": "bg-amber-900/70 text-amber-100",
  Critical: "bg-red-900/70 text-red-100",
};

const tierClass: Record<ClientTier, string> = {
  Standard: "bg-slate-800 text-slate-100",
  Premium: "bg-blue-900/70 text-blue-100",
  Enterprise: "bg-purple-900/70 text-purple-100",
};

const ClientManagementPage: React.FC = () => {
  const navigate = useNavigate();

  const [clients] = useState<Client[]>(mockClients);
  const [search, setSearch] = useState("");
  const [healthFilter, setHealthFilter] = useState<ClientHealth | "All">("All");
  const [tierFilter, setTierFilter] = useState<ClientTier | "All">("All");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | undefined>("name");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const filtered = useMemo(() => {
    let rows = [...clients];

    if (healthFilter !== "All") {
      rows = rows.filter((c) => c.health === healthFilter);
    }
    if (tierFilter !== "All") {
      rows = rows.filter((c) => c.tier === tierFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          (c.industry ?? "").toLowerCase().includes(q) ||
          (c.location ?? "").toLowerCase().includes(q),
      );
    }

    if (sortBy) {
      rows.sort((a, b) => {
        const av = (a as any)[sortBy];
        const bv = (b as any)[sortBy];
        const comp = String(av ?? "").localeCompare(String(bv ?? ""));
        return sortDirection === "asc" ? comp : -comp;
      });
    }

    return rows;
  }, [clients, healthFilter, tierFilter, search, sortBy, sortDirection]);

  const totalItems = filtered.length;
  const start = (page - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const totalMRR = clients.reduce((sum, c) => sum + c.mrr, 0);
  const avgRisk =
    clients.reduce((sum, c) => sum + c.aiRiskScore, 0) /
    (clients.length || 1);

  const columns: ColumnDef<Client>[] = [
    {
      id: "client",
      header: "Client",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-100">
            {row.name
              .split(" ")
              .map((p) => p[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-100">
              {row.name}
            </span>
            <span className="text-[11px] text-slate-400">
              {row.code}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "industry",
      header: "Industry",
      sortable: true,
      cell: (row) => (
        <span className="text-xs text-slate-200">
          {row.industry || "—"}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      id: "tier",
      header: "Tier",
      sortable: true,
      cell: (row) => (
        <span
          className={`rounded-full px-2 py-[2px] text-[10px] ${tierClass[row.tier]}`}
        >
          {row.tier}
        </span>
      ),
    },
    {
      id: "health",
      header: "Health",
      sortable: true,
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] ${healthClass[row.health]}`}
        >
          <AlertTriangle size={10} />
          {row.health}
        </span>
      ),
    },
    {
      id: "projects",
      header: "Projects",
      sortable: true,
      cell: (row) => (
        <span className="text-xs text-slate-100">
          {row.activeProjects}/{row.totalProjects} active
        </span>
      ),
      hideOnMobile: true,
    },
    {
      id: "mrr",
      header: "MRR",
      sortable: true,
      cell: (row) => (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-300">
          <BadgeDollarSign size={11} />
          ₹{(row.mrr / 100000).toFixed(2)}
          <span className="text-[10px] text-slate-400">L / mo</span>
        </span>
      ),
    },
    {
      id: "aiRiskScore",
      header: "AI Risk",
      sortable: true,
      cell: (row) => (
        <span className="text-xs text-slate-100">
          {row.aiRiskScore}
          <span className="text-[10px] text-slate-500"> / 100</span>
        </span>
      ),
      hideOnMobile: true,
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/clients/${row.id}`, { state: { client: row } });
          }}
          className="inline-flex h-7 items-center gap-1 rounded-full bg-slate-900 px-3 text-[11px] text-slate-100 hover:bg-slate-800"
        >
          <Eye size={13} />
          Open workspace
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
            <Building2 size={18} className="text-blue-400" />
            Client CRM
          </h1>
          <p className="text-xs text-slate-400">
            Full CRM workspace to manage client relationships, projects,
            billing and AI risk insights.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500"
        >
          <UserCircle2 size={16} />
          New client
        </button>
      </div>

      {/* Summary row */}
      <div className="grid gap-3 text-xs md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Total clients</span>
          </div>
          <div className="mt-1 text-lg font-semibold text-slate-100">
            {clients.length}
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-emerald-200">
            <span>Monthly recurring revenue</span>
          </div>
          <div className="mt-1 text-lg font-semibold text-emerald-300">
            ₹{(totalMRR / 100000).toFixed(2)} L
          </div>
        </div>
        <div className="rounded-2xl border border-amber-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-amber-200">
            <span>Avg AI risk score</span>
          </div>
          <div className="mt-1 text-lg font-semibold text-amber-300">
            {Math.round(avgRisk)}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs">
        {/* Health filter */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400">Health</span>
          {(["All", "Healthy", "At Risk", "Critical"] as const).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => {
                setHealthFilter(h === "All" ? "All" : (h as ClientHealth));
                setPage(1);
              }}
              className={`rounded-full px-2 py-[3px] text-[11px] ${
                healthFilter === h
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {h}
            </button>
          ))}
        </div>

        {/* Tier filter */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400">Tier</span>
          {(["All", "Standard", "Premium", "Enterprise"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTierFilter(t === "All" ? "All" : (t as ClientTier));
                setPage(1);
              }}
              className={`rounded-full px-2 py-[3px] text-[11px] ${
                tierFilter === t
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search (global uses DataTable search) */}
      </div>

      {/* DataTable */}
      <DataTable<Client>
        columns={columns}
        data={pageRows}
        totalItems={totalItems}
        page={page}
        pageSize={pageSize}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={(col, dir) => {
          setSortBy(col);
          setSortDirection(dir);
          setPage(1);
        }}
        enableGlobalSearch
        globalSearchValue={search}
        onGlobalSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
        getRowId={(row) => row.id}
        size="md"
        enableColumnVisibility
        enableExport
        enableFilters={false}
        emptyMessage="No clients match your filters."
        onRowClick={(row) =>
          navigate(`/clients/${row.id}`, { state: { client: row } })
        }
      />
    </div>
  );
};

export default ClientManagementPage;
