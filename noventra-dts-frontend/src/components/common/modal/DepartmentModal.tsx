import React, { useState } from "react";
import { mockEmployees, type DepartmentModalProps } from "../../../types/team.types";
import { X } from "lucide-react";

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  open,
  initial,
  onClose,
  onSave,
}) => {
  const isEdit = !!initial;

  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [headId, setHeadId] = useState(initial?.headId ?? mockEmployees[0].id);
  const [description, setDescription] = useState(
    initial?.description ?? "",
  );

  React.useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setCode(initial?.code ?? "");
    setHeadId(initial?.headId ?? mockEmployees[0].id);
    setDescription(initial?.description ?? "");
  }, [open, initial]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = initial?.id ?? `dep-${Date.now()}`;
    onSave({
      id,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      headId,
      description: description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-slate-950 px-5 py-4 text-slate-100 shadow-2xl">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">
              {isEdit ? "Edit department" : "Create department"}
            </h2>
            <p className="text-[11px] text-slate-400">
              Organise teams and reporting structure.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-900 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">
                Department name
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
                Code
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={8}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs uppercase outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">
              Department head
            </label>
            <select
              value={headId}
              onChange={(e) => setHeadId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
            >
              {mockEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} · {emp.role}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Short mission statement or scope for this department."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
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
              {isEdit ? "Save changes" : "Create department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
