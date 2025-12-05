// src/pages/shifts/ShiftPlannerPage.tsx
import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type ShiftType = "Morning" | "Evening" | "Night" | "Off";

interface Employee {
  id: string;
  name: string;
  role: string;
  team: string;
}

interface ShiftAssignment {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  shift: ShiftType;
}

const mockEmployees: Employee[] = [
  { id: "1", name: "Harini Rao", role: "Team Lead", team: "Engineering" },
  { id: "2", name: "Aarav Mehta", role: "HR Manager", team: "HR" },
  { id: "3", name: "Sneha Kapoor", role: "Developer", team: "Engineering" },
  { id: "4", name: "Nisha Gupta", role: "Designer", team: "Design" },
];

const SHIFT_OPTIONS: { label: string; value: ShiftType; color: string }[] = [
  { label: "Morning (9–6)", value: "Morning", color: "bg-emerald-900/60" },
  { label: "Evening (1–10)", value: "Evening", color: "bg-blue-900/60" },
  { label: "Night (10–7)", value: "Night", color: "bg-purple-900/60" },
  { label: "Off", value: "Off", color: "bg-slate-800/80" },
];

function formatYMD(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getWeekDates(anchor: Date): Date[] {
  const day = anchor.getDay(); // 0=Sun
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() - diffToMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const dayNamesShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ShiftPlannerPage: React.FC = () => {
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [teamFilter, setTeamFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const [assignments, setAssignments] = useState<ShiftAssignment[]>(() => {
    const todayWeek = getWeekDates(new Date());
    return mockEmployees.flatMap((emp) =>
      todayWeek.map((d) => ({
        id: `${emp.id}-${formatYMD(d)}`,
        employeeId: emp.id,
        date: formatYMD(d),
        shift: "Morning" as ShiftType,
      })),
    );
  });

  const weekDates = useMemo(() => getWeekDates(anchorDate), [anchorDate]);

  const filteredEmployees = useMemo(() => {
    let rows = [...mockEmployees];
    if (teamFilter !== "All") {
      rows = rows.filter((e) => e.team === teamFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.team.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [teamFilter, search]);

  const teams = useMemo(
    () => Array.from(new Set(mockEmployees.map((e) => e.team))).sort(),
    [],
  );

  const handleShiftChange = (
    employeeId: string,
    date: string,
    shift: ShiftType,
  ) => {
    setAssignments((prev) => {
      const key = `${employeeId}-${date}`;
      const exists = prev.find((a) => a.id === key);

      if (exists) {
        return prev.map((a) =>
          a.id === key
            ? {
                ...a,
                shift,
              }
            : a,
        );
      }

      return [
        ...prev,
        { id: key, employeeId, date, shift },
      ];
    });
  };

  const stats = useMemo(() => {
    const weekDatesYMD = weekDates.map(formatYMD);
    const weekAssignments = assignments.filter((a) =>
      weekDatesYMD.includes(a.date),
    );

    const counts: Record<ShiftType, number> = {
      Morning: 0,
      Evening: 0,
      Night: 0,
      Off: 0,
    };
    weekAssignments.forEach((a) => {
      counts[a.shift] += 1;
    });

    return counts;
  }, [assignments, weekDates]);

  const weekLabel = (() => {
    const first = weekDates[0];
    const last = weekDates[weekDates.length - 1];
    const fmt = (d: Date) =>
      d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
      });
    return `${fmt(first)} – ${fmt(last)} (${first.getFullYear()})`;
  })();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
            <CalendarDays size={18} className="text-blue-400" />
            Shift Planner
          </h1>
          <p className="text-xs text-slate-400">
            Plan weekly shifts for each employee and keep teams balanced.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() =>
              setAnchorDate((prev) => {
                const d = new Date(prev);
                d.setDate(prev.getDate() - 7);
                return d;
              })
            }
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
          >
            <ChevronLeft size={14} /> Prev week
          </button>
          <button
            type="button"
            onClick={() => setAnchorDate(new Date())}
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() =>
              setAnchorDate((prev) => {
                const d = new Date(prev);
                d.setDate(prev.getDate() + 7);
                return d;
              })
            }
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
          >
            Next week <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Week + stats */}
      <div className="grid gap-3 text-xs md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Week</span>
            <Clock size={12} className="text-slate-500" />
          </div>
          <div className="mt-1 text-[13px] font-semibold text-slate-100">
            {weekLabel}
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-800 bg-slate-950 px-4 py-3">
          <div className="text-[11px] text-emerald-200">Morning shifts</div>
          <div className="mt-1 text-lg font-semibold text-emerald-300">
            {stats.Morning}
          </div>
        </div>
        <div className="rounded-2xl border border-blue-800 bg-slate-950 px-4 py-3">
          <div className="text-[11px] text-blue-200">Evening shifts</div>
          <div className="mt-1 text-lg font-semibold text-blue-300">
            {stats.Evening}
          </div>
        </div>
        <div className="rounded-2xl border border-purple-800 bg-slate-950 px-4 py-3">
          <div className="text-[11px] text-purple-200">Night shifts</div>
          <div className="mt-1 text-lg font-semibold text-purple-300">
            {stats.Night}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-slate-200">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-slate-500" />
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100 outline-none hover:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
          >
            <option value="All">All teams</option>
            {teams.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee or role..."
            className="w-48 rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
          />
        </div>
      </div>

      {/* Shift legend */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
        {SHIFT_OPTIONS.map((opt) => (
          <span
            key={opt.value}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${opt.color}`}
          >
            <span className="h-2 w-2 rounded-full bg-slate-100" />
            {opt.label}
          </span>
        ))}
      </div>

      {/* Weekly grid – horizontally scrollable on mobile */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
        <table className="min-w-[720px] w-full text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/90 text-[11px] uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-3 py-2 text-left">Employee</th>
              {weekDates.map((d, idx) => (
                <th key={idx} className="px-2 py-2 text-center">
                  <div className="flex flex-col items-center">
                    <span>{dayNamesShort[idx]}</span>
                    <span className="text-[10px] text-slate-500">
                      {d.getDate().toString().padStart(2, "0")}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr
                key={emp.id}
                className="border-t border-slate-800 odd:bg-slate-950 even:bg-slate-900/60"
              >
                <td className="px-3 py-2 align-top">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-100">
                      {emp.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {emp.role} · {emp.team}
                    </span>
                  </div>
                </td>
                {weekDates.map((d, idx) => {
                  const dateStr = formatYMD(d);
                  const key = `${emp.id}-${dateStr}`;
                  const current =
                    assignments.find((a) => a.id === key)?.shift ?? "Off";

                  return (
                    <td
                      key={idx}
                      className="px-2 py-2 text-center align-top"
                    >
                      <select
                        value={current}
                        onChange={(e) =>
                          handleShiftChange(
                            emp.id,
                            dateStr,
                            e.target.value as ShiftType,
                          )
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-1.5 py-1 text-[11px] text-slate-100 outline-none hover:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                      >
                        {SHIFT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}

            {filteredEmployees.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-sm text-slate-400"
                >
                  No employees match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftPlannerPage;
