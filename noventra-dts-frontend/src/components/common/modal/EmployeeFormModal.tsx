// src/pages/user-management/components/EmployeeFormModal.tsx
import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Shield,
  Building2,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Lock,
} from "lucide-react";
import type { Employee } from "../../../types/employee.types";

interface EmployeeFormModalProps {
  open: boolean;
  initial?: Employee | null;
  onClose: () => void;
  /**
   * password will be present ONLY when creating or resetting from this UI.
   * For simple profile edits, it's null.
   */
  onSave: (employee: Employee, password: string | null) => void;
}

const emptyEmployeeBase: Omit<Employee, "id" | "code" | "createdAt"> = {
  name: "",
  email: "",
  role: "Staff",
  department: "",
  employmentType: "Full-time",
  workMode: "WFO",
  phone: "",
  location: "",
  timezone: "Asia/Kolkata (IST)",
  avatarColor: "#3b82f6",
  status: "Invited",
  lastLoginAt: undefined,
};

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  open,
  initial,
  onClose,
  onSave,
}) => {
  const isEdit = Boolean(initial);

  const [form, setForm] = useState<Employee>(() => {
    if (initial) return initial;
    const now = new Date().toISOString();
    return {
      ...emptyEmployeeBase,
      id: crypto.randomUUID(),
      code: "EMP-" + Math.floor(Math.random() * 900 + 100),
      createdAt: now,
    };
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setForm(initial);
      setPassword("");
      setConfirmPassword("");
      setError(null);
    } else {
      const now = new Date().toISOString();
      setForm({
        ...emptyEmployeeBase,
        id: crypto.randomUUID(),
        code: "EMP-" + Math.floor(Math.random() * 900 + 100),
        createdAt: now,
      });
      setPassword("");
      setConfirmPassword("");
      setError(null);
    }
  }, [initial, open]);

  if (!open) return null;

  const handleChange = (
    field: keyof Employee,
    value: Employee[keyof Employee],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    let passwordToSend: string | null = null;

    if (!isEdit) {
      if (!password) {
        setError("Password is required for new employees.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      passwordToSend = password;
    }

    setError(null);
    onSave(form, passwordToSend);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-xs text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {isEdit ? "Edit employee" : "Create new employee"}
            </div>
            <h2 className="text-base font-semibold text-slate-50">
              {isEdit ? form.name : "Invite employee"}
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              {isEdit
                ? "Update profile, role and access for this employee."
                : "Create an account for a new employee and send them credentials."}
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

        <form
          onSubmit={handleSubmit}
          className="grid gap-3 md:grid-cols-2 text-xs"
        >
          {/* Left column */}
          <div className="space-y-3">
            {/* Name + Email */}
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <User size={12} />
                Basic info
              </div>

              <label className="mt-1 block text-[11px] text-slate-300">
                Name
                <input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                  placeholder="Harini Rao"
                />
              </label>

              <label className="block text-[11px] text-slate-300">
                Email
                <div className="relative mt-1">
                  <Mail
                    size={13}
                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-7 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                    placeholder="name@company.com"
                  />
                </div>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="text-[11px] text-slate-300">
                  Phone
                  <div className="relative mt-1">
                    <Phone
                      size={13}
                      className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      value={form.phone ?? ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-7 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                      placeholder="+91 98xx xxxxx"
                    />
                  </div>
                </label>

                <label className="text-[11px] text-slate-300">
                  Location
                  <div className="relative mt-1">
                    <MapPin
                      size={13}
                      className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      value={form.location ?? ""}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-7 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                      placeholder="Chennai · HQ"
                    />
                  </div>
                </label>
              </div>

              <label className="text-[11px] text-slate-300">
                Timezone
                <div className="relative mt-1">
                  <Globe
                    size={13}
                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    value={form.timezone ?? ""}
                    onChange={(e) =>
                      handleChange("timezone", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-7 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                    placeholder="Asia/Kolkata (IST)"
                  />
                </div>
              </label>
            </div>

            {/* Security (only for create) */}
            {!isEdit && (
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <Lock size={12} />
                  Account security
                </div>

                <label className="text-[11px] text-slate-300">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                    placeholder="Min. 8 characters"
                  />
                </label>

                <label className="text-[11px] text-slate-300">
                  Confirm password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                    placeholder="Re-type password"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-3">
            {/* Role / Department */}
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <Shield size={12} />
                Role & access
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="text-[11px] text-slate-300">
                  Role
                  <select
                    value={form.role}
                    onChange={(e) =>
                      handleChange(
                        "role",
                        e.target.value as Employee["role"],
                      )
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                  >
                    <option>Super Admin</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Staff</option>
                  </select>
                </label>

                <label className="text-[11px] text-slate-300">
                  Status
                  <select
                    value={form.status}
                    onChange={(e) =>
                      handleChange(
                        "status",
                        e.target.value as Employee["status"],
                      )
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                  >
                    <option>Active</option>
                    <option>Invited</option>
                    <option>Suspended</option>
                  </select>
                </label>
              </div>

              <label className="mt-1 text-[11px] text-slate-300">
                Department
                <div className="relative mt-1">
                  <Building2
                    size={13}
                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    value={form.department}
                    onChange={(e) =>
                      handleChange("department", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-7 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                    placeholder="Engineering, HR, Finance..."
                  />
                </div>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="text-[11px] text-slate-300">
                  Employment type
                  <select
                    value={form.employmentType}
                    onChange={(e) =>
                      handleChange(
                        "employmentType",
                        e.target.value as Employee["employmentType"],
                      )
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Intern</option>
                  </select>
                </label>

                <label className="text-[11px] text-slate-300">
                  Work mode
                  <select
                    value={form.workMode}
                    onChange={(e) =>
                      handleChange(
                        "workMode",
                        e.target.value as Employee["workMode"],
                      )
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                  >
                    <option>WFO</option>
                    <option>WFH</option>
                    <option>Hybrid</option>
                  </select>
                </label>
              </div>

              <label className="mt-2 text-[11px] text-slate-300">
                Avatar accent color
                <input
                  type="color"
                  value={form.avatarColor ?? "#3b82f6"}
                  onChange={(e) =>
                    handleChange("avatarColor", e.target.value)
                  }
                  className="mt-1 h-8 w-16 cursor-pointer rounded-md border border-slate-700 bg-slate-950 p-1"
                />
              </label>
            </div>

            {/* System info */}
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold uppercase tracking-wide">
                  System
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Employee ID</span>
                <span className="font-mono text-slate-200">
                  {form.code}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Created at</span>
                <span className="text-slate-200">
                  {new Date(form.createdAt).toLocaleString()}
                </span>
              </div>
              {form.lastLoginAt && (
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Last login</span>
                  <span className="text-slate-200">
                    {new Date(form.lastLoginAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="col-span-2 mt-2 flex items-center justify-between pt-2">
            {error && (
              <span className="text-[11px] text-red-400">{error}</span>
            )}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-blue-500"
              >
                <Briefcase size={12} />
                {isEdit ? "Save changes" : "Create employee"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
