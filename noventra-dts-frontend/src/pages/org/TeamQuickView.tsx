import { Briefcase, GaugeCircle, MapPin, User, Users, X } from "lucide-react";
import { getEmployeeById, initials, mockDepartments, type EmployeeMini, type TeamQuickViewProps } from "../../types/team.types";

export const TeamQuickView: React.FC<TeamQuickViewProps> = ({
  team,
  onClose,
}) => {
  if (!team) return null;
  const lead = getEmployeeById(team.leadId);
  const members = team.memberIds
    .map((id) => getEmployeeById(id))
    .filter(Boolean) as EmployeeMini[];

  const utilization =
    team.capacity === 0
      ? 0
      : Math.round((members.length / team.capacity) * 100);

  const deptLabel = mockDepartments.find(
    (d) => d.id === team.departmentId,
  );

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-950 px-4 py-4 text-slate-100">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] text-slate-500">
              {deptLabel?.code ?? ""} · {deptLabel?.name ?? ""}
            </p>
            <h2 className="text-sm font-semibold">
              {team.name}{" "}
              <span className="text-[11px] text-slate-400">
                ({team.code})
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-900 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <User size={12} /> Lead
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} /> {team.workMode}
              </span>
            </div>
            {lead && (
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold"
                  style={{ backgroundColor: lead.avatarColor }}
                >
                  {initials(lead.name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs">{lead.name}</span>
                  <span className="text-[11px] text-slate-400">
                    {lead.role}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
            <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Users size={12} /> Members
              </span>
              <span>
                {members.length} / {team.capacity}
              </span>
            </div>
            <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-400"
                style={{ width: `${utilization}%` }}
              />
            </div>
            <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg bg-slate-900 px-2 py-1 text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold"
                      style={{ backgroundColor: m.avatarColor }}
                    >
                      {initials(m.name)}
                    </div>
                    <div className="flex flex-col">
                      <span>{m.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {m.role}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {m.email}
                  </span>
                </div>
              ))}
              {members.length === 0 && (
                <p className="text-[11px] text-slate-500">
                  No members assigned yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Briefcase size={12} /> Status
              </span>
              <span className="inline-flex items-center gap-1">
                <GaugeCircle size={12} /> Utilization {utilization}%
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2 py-[2px] text-[10px] ${
                  team.status === "Active"
                    ? "bg-emerald-900/70 text-emerald-100"
                    : team.status === "Hiring"
                    ? "bg-blue-900/70 text-blue-100"
                    : team.status === "Paused"
                    ? "bg-amber-900/60 text-amber-100"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                {team.status}
              </span>

              {team.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-900 px-2 py-[2px] text-[10px] text-slate-200"
                >
                  {tag}
                </span>
              ))}

              {team.tags.length === 0 && (
                <span className="text-[11px] text-slate-500">
                  No tags configured.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};