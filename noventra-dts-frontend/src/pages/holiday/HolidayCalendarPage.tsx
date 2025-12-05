// src/pages/holidays/HolidayCalendarPage.tsx
import React, { useMemo, useState } from "react";
import { CalendarDays, Plus, Globe2 } from "lucide-react";

interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  type: "Public" | "Company" | "Optional";
  region: string;
}

const initialHolidays: Holiday[] = [
  {
    id: "1",
    date: "2025-01-01",
    name: "New Year",
    type: "Public",
    region: "All",
  },
  {
    id: "2",
    date: "2025-01-14",
    name: "Pongal",
    type: "Public",
    region: "TN / South",
  },
  {
    id: "3",
    date: "2025-01-26",
    name: "Republic Day",
    type: "Public",
    region: "All",
  },
  {
    id: "4",
    date: "2025-08-15",
    name: "Independence Day",
    type: "Public",
    region: "All",
  },
  {
    id: "5",
    date: "2025-10-22",
    name: "Diwali",
    type: "Company",
    region: "All",
  },
];

const typeClass: Record<Holiday["type"], string> = {
  Public: "bg-emerald-900/70 text-emerald-100",
  Company: "bg-blue-900/70 text-blue-100",
  Optional: "bg-amber-900/70 text-amber-100",
};

function getYear(dateStr: string) {
  return Number(dateStr.slice(0, 4));
}

function getMonth(dateStr: string) {
  return Number(dateStr.slice(5, 7)) - 1;
}

export function getDay(dateStr: string) {
  return Number(dateStr.slice(8, 10));
}

interface AddHolidayModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (holiday: Holiday) => void;
  defaultYear: number;
}

const AddHolidayModal: React.FC<AddHolidayModalProps> = ({
  open,
  onClose,
  onSave,
  defaultYear,
}) => {
  const [date, setDate] = useState<string>(`${defaultYear}-01-01`);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<Holiday["type"]>("Public");
  const [region, setRegion] = useState<string>("All");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;

    onSave({
      id: Date.now().toString(),
      date,
      name: name.trim(),
      type,
      region: region.trim() || "All",
    });

    setName("");
    setRegion("All");
    setType("Public");
    setDate(`${defaultYear}-01-01`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-50">
            Add Holiday
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">
              Holiday name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Diwali, Christmas, Company Retreat"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Holiday["type"])}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              >
                <option value="Public">Public</option>
                <option value="Company">Company</option>
                <option value="Optional">Optional</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">
                Region / Office
              </label>
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. All, Chennai, India"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-blue-500"
            >
              <Plus size={12} />
              Save holiday
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const HolidayCalendarPage: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [year, setYear] = useState<number>(2025);
  const [month, setMonth] = useState<number>(new Date().getMonth()); // 0-11
  const [modalOpen, setModalOpen] = useState(false);

  const yearHolidays = useMemo(
    () => holidays.filter((h) => getYear(h.date) === year),
    [holidays, year],
  );

  const monthHolidays = useMemo(
    () =>
      yearHolidays.filter((h) => getMonth(h.date) === month),
    [yearHolidays, month],
  );

  const totalPublic = yearHolidays.filter((h) => h.type === "Public").length;
  const totalCompany = yearHolidays.filter((h) => h.type === "Company").length;
  const totalOptional = yearHolidays.filter((h) => h.type === "Optional").length;

  const daysInMonth = (() => {
    const d = new Date(year, month + 1, 0);
    return d.getDate();
  })();

  const firstDayOfWeek = (() => {
    const d = new Date(year, month, 1);
    return (d.getDay() + 6) % 7; // 0=Mon
  })();

  const monthLabel = new Date(year, month, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const handleAddHoliday = (holiday: Holiday) => {
    setHolidays((prev) =>
      [...prev, holiday].sort(
        (a, b) => +new Date(a.date) - +new Date(b.date),
      ),
    );
  };

  const handleDeleteHoliday = (id: string) => {
    if (!window.confirm("Delete this holiday?")) return;
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  const goPrevMonth = () => {
    setMonth((prev) => {
      if (prev === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goNextMonth = () => {
    setMonth((prev) => {
      if (prev === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const yearsAround = [year - 1, year, year + 1];

  // build a simple calendar grid array
  const calendarCells: { day: number | null }[] = [
    ...Array.from({ length: firstDayOfWeek }, () => ({ day: null })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1 })),
  ];

  const dayHasHoliday = (day: number | null) => {
    if (!day) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
    return monthHolidays.some((h) => h.date === dateStr);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
            <CalendarDays size={18} className="text-blue-400" />
            Holiday Calendar
          </h1>
          <p className="text-xs text-slate-400">
            Manage public, company and optional holidays for all locations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500"
        >
          <Plus size={14} />
          Add holiday
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 text-xs md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Year</span>
          </div>
          <div className="mt-1 text-lg font-semibold text-slate-100">
            {year}
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-emerald-200">
            <span>Public / Company holidays</span>
          </div>
          <div className="mt-1 text-lg font-semibold text-emerald-300">
            {totalPublic + totalCompany}
          </div>
        </div>
        <div className="rounded-2xl border border-amber-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-amber-200">
            <span>Optional holidays</span>
          </div>
          <div className="mt-1 text-lg font-semibold text-amber-300">
            {totalOptional}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)]">
        {/* Mini calendar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3">
          {/* Month + year controls */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <button
                type="button"
                onClick={goPrevMonth}
                className="rounded-full bg-slate-900 px-2 py-1 text-slate-200 hover:bg-slate-800"
              >
                ‹
              </button>
              <span className="font-semibold">{monthLabel}</span>
              <button
                type="button"
                onClick={goNextMonth}
                className="rounded-full bg-slate-900 px-2 py-1 text-slate-200 hover:bg-slate-800"
              >
                ›
              </button>
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              {yearsAround.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className={`rounded-full px-2 py-[3px] ${
                    y === year
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar grid */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-2 py-2 text-[11px] text-slate-200">
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-500">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1 text-center">
              {calendarCells.map((cell, idx) => {
                const isHoliday = dayHasHoliday(cell.day);
                return (
                  <div
                    key={idx}
                    className={`flex min-h-[42px] flex-col items-center justify-center rounded-lg border border-slate-800 text-[11px] ${
                      cell.day
                        ? isHoliday
                          ? "bg-blue-900/60 text-slate-50"
                          : "bg-slate-950/90"
                        : "bg-transparent border-none"
                    }`}
                  >
                    {cell.day && (
                      <>
                        <span>{cell.day}</span>
                        {isHoliday && (
                          <span className="mt-0.5 h-1 w-1 rounded-full bg-amber-300" />
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Public & Company holiday
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              Optional holiday
            </span>
          </div>
        </div>

        {/* Holiday list */}
        <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Globe2 size={14} className="text-slate-400" />
              <span className="font-semibold">
                {yearHolidays.length} holidays in {year}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
            {yearHolidays.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2 text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-100">
                    {h.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(h.date).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      weekday: "short",
                    })}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-2 text-[11px] text-slate-400">
                    <span
                      className={`rounded-full px-2 py-[2px] ${typeClass[h.type]}`}
                    >
                      {h.type}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Globe2 size={11} />
                      {h.region}
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteHoliday(h.id)}
                  className="text-[11px] text-slate-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            ))}

            {yearHolidays.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-6 text-center text-xs text-slate-400">
                No holidays configured for {year}. Click{" "}
                <span className="font-semibold text-blue-300">
                  “Add holiday”
                </span>{" "}
                to create your calendar.
              </div>
            )}
          </div>
        </div>
      </div>

      <AddHolidayModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddHoliday}
        defaultYear={year}
      />
    </div>
  );
};

export default HolidayCalendarPage;
