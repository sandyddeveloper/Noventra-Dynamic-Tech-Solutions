// src/pages/settings/tabs/ProfileTab.tsx
import React, { useState } from "react";
import { Mail, Phone, MapPin, Globe, User, Briefcase, Clock } from "lucide-react";

const ProfileTab: React.FC = () => {
  // mock loaded user
  const [form, setForm] = useState({
    name: "Harini Rao",
    role: "Super Admin",
    email: "harini.rao@example.com",
    phone: "+91 98xx 000001",
    location: "Chennai, India",
    timezone: "Asia/Kolkata (IST)",
    workTitle: "Head of Engineering & AI",
    bio: "Leading NDTS AI operations and delivery. Loves clean systems and strongly typed code.",
    workingHoursFrom: "09:30",
    workingHoursTo: "18:30",
    weeklyOff: "Sat, Sun",
    language: "English (India)",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // integrate with API later
    console.log("Profile save payload:", form);
    alert("Profile settings saved (mock).");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)] text-xs text-slate-200">
      {/* LEFT – MAIN FORM */}
      <div className="space-y-4">
        {/* Basic info */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <User size={13} />
            Personal profile
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Full name</label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Job title</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-2 py-1.5">
                <Briefcase size={13} className="text-slate-500" />
                <input
                  value={form.workTitle}
                  onChange={(e) => handleChange("workTitle", e.target.value)}
                  className="w-full bg-transparent text-xs outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Email</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-2 py-1.5">
                <Mail size={13} className="text-slate-500" />
                <input
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full bg-transparent text-xs outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Phone</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-2 py-1.5">
                <Phone size={13} className="text-slate-500" />
                <input
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full bg-transparent text-xs outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Location</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-2 py-1.5">
                <MapPin size={13} className="text-slate-500" />
                <input
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full bg-transparent text-xs outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Timezone</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-2 py-1.5">
                <Globe size={13} className="text-slate-500" />
                <input
                  value={form.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                  className="w-full bg-transparent text-xs outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <label className="text-[11px] text-slate-400">Short bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {/* Working hours */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Clock size={13} />
            Working preferences
          </div>

          <div className="grid gap-3 md:grid-cols-3 text-xs text-slate-300">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400">From</span>
              <input
                type="time"
                value={form.workingHoursFrom}
                onChange={(e) => handleChange("workingHoursFrom", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400">To</span>
              <input
                type="time"
                value={form.workingHoursTo}
                onChange={(e) => handleChange("workingHoursTo", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400">Weekly off</span>
              <input
                value={form.weeklyOff}
                onChange={(e) => handleChange("weeklyOff", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              These preferences are used in <span className="text-slate-300">Attendance</span> &
              <span className="text-slate-300"> Notification</span> modules.
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-blue-600 px-4 py-1.5 text-[11px] font-medium text-white hover:bg-blue-500"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT – SNAPSHOT CARD */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-xs">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Profile snapshot
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/80 text-sm font-semibold text-slate-950">
              {form.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">
                {form.name}
              </div>
              <div className="text-[11px] text-slate-400">{form.workTitle}</div>
            </div>
          </div>

          <div className="mt-3 space-y-1 text-[11px] text-slate-300">
            <div className="flex items-center justify-between">
              <span>Language</span>
              <span>{form.language}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Timezone</span>
              <span>{form.timezone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
