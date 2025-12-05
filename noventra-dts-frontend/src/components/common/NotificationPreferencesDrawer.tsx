// src/components/notifications/NotificationPreferencesDrawer.tsx
import React from "react";
import {
  X,
  Bell,
  Mail,
  Smartphone,
  Moon,
  SunMedium,
  Clock,
  Activity,
} from "lucide-react";
import type {
  NotificationPreferences,
  NotificationCategoryPreference,
  NotificationCategory,
} from "../../types/notification.types";

interface NotificationPreferencesDrawerProps {
  open: boolean;
  preferences: NotificationPreferences;
  onClose: () => void;
  onChange: (next: NotificationPreferences) => void;
}

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  system: "System & platform",
  project: "Projects & tasks",
  attendance: "Attendance & geo-fence",
  user: "Users & HR",
  security: "Security & login",
};

export const NotificationPreferencesDrawer: React.FC<
  NotificationPreferencesDrawerProps
> = ({ open, preferences, onClose, onChange }) => {
  if (!open) return null;

  const updateCategory = (cat: NotificationCategory, updater: (c: NotificationCategoryPreference) => NotificationCategoryPreference) => {
    onChange({
      ...preferences,
      categories: preferences.categories.map((c) =>
        c.category === cat ? updater(c) : c,
      ),
    });
  };

  const setQuiet = (field: "quietHoursFrom" | "quietHoursTo", value: string) => {
    onChange({
      ...preferences,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-950 px-4 py-4 text-xs text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-blue-400" />
              <h2 className="text-sm font-semibold text-slate-50">
                Notification preferences
              </h2>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Choose how and when you want to be notified across the workspace.
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

        <div className="space-y-3 overflow-y-auto pr-1">
          {/* Global channels */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
            <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <Bell size={12} />
              Global channels
            </div>
            <p className="text-[11px] text-slate-400">
              Turn off a channel to mute *all* notifications on that channel.
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...preferences,
                    globalInApp: !preferences.globalInApp,
                  })
                }
                className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2 ${
                  preferences.globalInApp
                    ? "border-blue-500 bg-blue-500/10 text-blue-100"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Bell size={14} />
                <span>In-app</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...preferences,
                    globalEmail: !preferences.globalEmail,
                  })
                }
                className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2 ${
                  preferences.globalEmail
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-100"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Mail size={14} />
                <span>Email</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...preferences,
                    globalSms: !preferences.globalSms,
                  })
                }
                className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2 ${
                  preferences.globalSms
                    ? "border-amber-500 bg-amber-500/10 text-amber-100"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Smartphone size={14} />
                <span>SMS</span>
              </button>
            </div>
          </div>

          {/* Quiet hours */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
            <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <Moon size={12} />
              Quiet hours
            </div>
            <p className="text-[11px] text-slate-400">
              Temporarily mute push / email notifications during specific hours.
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...preferences,
                    quietHoursEnabled: !preferences.quietHoursEnabled,
                  })
                }
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] ${
                  preferences.quietHoursEnabled
                    ? "bg-emerald-600/90 text-emerald-50"
                    : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                }`}
              >
                {preferences.quietHoursEnabled ? (
                  <Moon size={12} />
                ) : (
                  <SunMedium size={12} />
                )}
                <span>
                  {preferences.quietHoursEnabled ? "Quiet hours enabled" : "Quiet hours off"}
                </span>
              </button>

              <div className="flex items-center gap-2 text-[11px]">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock size={12} />
                  From
                </span>
                <input
                  type="time"
                  value={preferences.quietHoursFrom}
                  onChange={(e) => setQuiet("quietHoursFrom", e.target.value)}
                  className="h-7 rounded-lg border border-slate-700 bg-slate-950 px-2 text-[11px] text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="time"
                  value={preferences.quietHoursTo}
                  onChange={(e) => setQuiet("quietHoursTo", e.target.value)}
                  className="h-7 rounded-lg border border-slate-700 bg-slate-950 px-2 text-[11px] text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                />
              </div>
            </div>
          </div>

          {/* Digest frequency */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
            <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <Activity size={12} />
              Summary emails
            </div>
            <p className="text-[11px] text-slate-400">
              Receive grouped summaries instead of individual emails.
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              {(["realtime", "hourly", "daily"] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...preferences,
                      digestFrequency: freq,
                    })
                  }
                  className={`rounded-full px-3 py-1 ${
                    preferences.digestFrequency === freq
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {freq === "realtime" ? "Real-time" : freq === "hourly" ? "Hourly" : "Daily"}
                </button>
              ))}
            </div>
          </div>

          {/* Per-category controls */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Per-category controls
            </div>
            <p className="text-[11px] text-slate-400">
              Fine-tune which channels are used for different notification types.
            </p>

            <div className="mt-2 space-y-2">
              {preferences.categories.map((c) => (
                <div
                  key={c.category}
                  className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-200">
                      {CATEGORY_LABELS[c.category]}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCategory(c.category, (cat) => ({
                          ...cat,
                          muted: !cat.muted,
                        }))
                      }
                      className={`rounded-full px-2 py-[2px] text-[10px] ${
                        c.muted
                          ? "bg-slate-900 text-slate-400"
                          : "bg-emerald-700 text-emerald-50"
                      }`}
                    >
                      {c.muted ? "Muted" : "Active"}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() =>
                        updateCategory(c.category, (cat) => ({
                          ...cat,
                          inApp: !cat.inApp,
                        }))
                      }
                      className={`rounded-full px-2 py-1 ${
                        c.inApp
                          ? "bg-blue-600 text-white"
                          : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      In-app
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateCategory(c.category, (cat) => ({
                          ...cat,
                          email: !cat.email,
                        }))
                      }
                      className={`rounded-full px-2 py-1 ${
                        c.email
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateCategory(c.category, (cat) => ({
                          ...cat,
                          sms: !cat.sms,
                        }))
                      }
                      className={`rounded-full px-2 py-1 ${
                        c.sms
                          ? "bg-amber-600 text-white"
                          : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      SMS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-3 border-t border-slate-800 pt-2 text-[10px] text-slate-500">
          These settings apply to your user only and do not affect other admins or employees.
        </div>
      </div>
    </div>
  );
};
