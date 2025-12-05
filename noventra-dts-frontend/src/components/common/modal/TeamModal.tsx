import React, { useState } from "react";
import { initials, mockEmployees, type TeamModalProps, type TeamStatus, type WorkMode } from "../../../types/team.types";
import { X } from "lucide-react";

export const TeamModal: React.FC<TeamModalProps> = ({
  open,
  department,
  initial,
  onClose,
  onSave,
}) => {
  if (!open || !department) return null;

  const isEdit = !!initial;

  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [leadId, setLeadId] = useState(
    initial?.leadId ?? mockEmployees[0].id,
  );
  const [workMode, setWorkMode] = useState<WorkMode>(
    initial?.workMode ?? "Hybrid",
  );
  const [status, setStatus] = useState<TeamStatus>(
    initial?.status ?? "Active",
  );
  const [capacity, setCapacity] = useState<number>(
    initial?.capacity ?? 6,
  );
  const [memberIds, setMemberIds] = useState<string[]>(
    initial?.memberIds ?? [leadId],
  );
  const [tags, setTags] = useState<string[]>(
    initial?.tags ?? [],
  );
  const [tagInput, setTagInput] = useState("");

  React.useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setCode(initial?.code ?? "");
    setLeadId(initial?.leadId ?? mockEmployees[0].id);
    setWorkMode(initial?.workMode ?? "Hybrid");
    setStatus(initial?.status ?? "Active");
    setCapacity(initial?.capacity ?? 6);
    setMemberIds(initial?.memberIds ?? [initial?.leadId ?? mockEmployees[0].id]);
    setTags(initial?.tags ?? []);
    setTagInput("");
  }, [open, initial]);

  // ensure lead is always a member
  React.useEffect(() => {
    setMemberIds((prev) =>
      prev.includes(leadId) ? prev : [...prev, leadId],
    );
  }, [leadId]);

  const toggleMember = (id: string) => {
    setMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = initial?.id ?? `team-${Date.now()}`;
    onSave({
      id,
      departmentId: department.id,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      leadId,
      workMode,
      status,
      capacity: capacity || 0,
      memberIds,
      tags,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-950 px-6 py-5 text-slate-100 shadow-2xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-500">
              {department.code} · {department.name}
            </p>
            <h2 className="text-sm font-semibold">
              {isEdit ? "Edit team" : "Create team"}
            </h2>
            <p className="text-[11px] text-slate-400">
              Manage squad, ownership and staffing.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <X size={14} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 text-xs md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)]"
        >
          {/* Left: basic info */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">
                Team name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">
                Team code
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={10}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs uppercase outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">
                Team lead
              </label>
              <select
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              >
                {mockEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} · {emp.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">
                  Work mode
                </label>
                <select
                  value={workMode}
                  onChange={(e) =>
                    setWorkMode(e.target.value as WorkMode)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                >
                  <option>On-site</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as TeamStatus)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                >
                  <option>Active</option>
                  <option>Hiring</option>
                  <option>Paused</option>
                  <option>Archived</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">
                Capacity (target headcount)
              </label>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={(e) =>
                  setCapacity(Number(e.target.value) || 0)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
          </div>

          {/* Right: members + tags */}
          <div className="space-y-3">
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Members
                </span>
                <span className="text-[11px] text-slate-400">
                  {memberIds.length} / {capacity || "-"}
                </span>
              </div>
              <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
                {mockEmployees.map((emp) => {
                  const selected = memberIds.includes(emp.id);
                  return (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => toggleMember(emp.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[11px] ${
                        selected
                          ? "bg-blue-600/20 text-slate-100"
                          : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold"
                          style={{
                            backgroundColor:
                              emp.avatarColor ?? "#1e293b",
                          }}
                        >
                          {initials(emp.name)}
                        </div>
                        <div className="flex flex-col">
                          <span>{emp.name}</span>
                          <span className="text-[10px] text-slate-400">
                            {emp.role}
                          </span>
                        </div>
                      </div>
                      {selected && (
                        <span className="rounded-full bg-blue-600 px-2 py-[2px] text-[10px]">
                          Member
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-[2px] text-[10px]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setTags((prev) =>
                          prev.filter((t) => t !== tag),
                        )
                      }
                      className="text-slate-400 hover:text-slate-200"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag & press Enter"
                  className="mt-1 flex-1 min-w-[120px] rounded-full border border-dashed border-slate-700 bg-slate-950 px-2 py-1 text-[10px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                />
              </div>
            </div>
          </div>

          <div className="col-span-full mt-1 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-500"
            >
              {isEdit ? "Save changes" : "Create team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};