// src/pages/notifications/NotificationsPage.tsx
import React, { useMemo, useState } from "react";
import {
  Bell,
  Filter,
  Search,
  CheckCheck,
  Trash2,
  Settings2,
  Pin,
  PinOff,
  ChevronRight,
  AlertTriangle,
  User,
  ClipboardList,
  CalendarClock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AppNotification, NotificationCategory, NotificationImportance, NotificationPreferences, NotificationTab } from "../../../types/notification.types";
import { NotificationPreferencesDrawer } from "../../common/NotificationPreferencesDrawer";


const mockNotifications: AppNotification[] = [
  {
    id: "1",
    title: "You were assigned to project “Nova AI Platform”",
    body: "Harini Rao assigned you as the primary owner for Nova AI Platform.",
    category: "project",
    importance: "high",
    read: false,
    pinned: true,
    createdAt: new Date().toISOString(),
    relatedId: "PJT-001",
    link: { type: "project", id: "PJT-001" },
    tag: "@mention",
  },
  {
    id: "2",
    title: "Late check-in detected for Aarav Mehta",
    body: "Login marked at 10:05, outside normal window. Geo-fence distance ~500 m.",
    category: "attendance",
    importance: "normal",
    read: false,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    relatedId: "EMP-002",
    link: { type: "attendance", id: "EMP-002" },
  },
  {
    id: "3",
    title: "New employee invited: Sneha Kapoor",
    body: "Sneha has been invited as Software Engineer in Engineering department.",
    category: "user",
    importance: "low",
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    relatedId: "EMP-003",
    link: { type: "employee", id: "EMP-003" },
  },
  {
    id: "4",
    title: "System maintenance scheduled",
    body: "The platform will be in read-only mode on Sunday, 08:00–09:00 IST.",
    category: "system",
    importance: "low",
    read: false,
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    link: { type: "settings" },
  },
  {
    id: "5",
    title: "Unusual login location",
    body: "We detected a login attempt from a new device / location. Review security log.",
    category: "security",
    importance: "high",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    link: { type: "settings" },
  },
];

const defaultPreferences: NotificationPreferences = {
  globalInApp: true,
  globalEmail: true,
  globalSms: false,
  quietHoursEnabled: false,
  quietHoursFrom: "22:00",
  quietHoursTo: "07:00",
  digestFrequency: "realtime",
  categories: [
    { category: "system", inApp: true, email: true, sms: false, muted: false },
    { category: "project", inApp: true, email: true, sms: false, muted: false },
    { category: "attendance", inApp: true, email: false, sms: false, muted: false },
    { category: "user", inApp: true, email: false, sms: false, muted: false },
    { category: "security", inApp: true, email: true, sms: true, muted: false },
  ],
};

function formatTimeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

function groupLabel(dateStr: string): "Today" | "Yesterday" | "This week" | "Earlier" {
  const d = new Date(dateStr);
  const now = new Date();

  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())) /
      dayMs,
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "This week";
  return "Earlier";
}

const categoryIcon = (category: NotificationCategory, importance: NotificationImportance) => {
  const base =
    category === "project"
      ? <ClipboardList size={16} />
      : category === "attendance"
      ? <CalendarClock size={16} />
      : category === "user"
      ? <User size={16} />
      : category === "security"
      ? <AlertTriangle size={16} />
      : <Bell size={16} />;

  const color =
    importance === "high"
      ? "bg-red-500/15 text-red-300"
      : importance === "normal"
      ? "bg-blue-500/15 text-blue-300"
      : "bg-slate-500/15 text-slate-300";

  return (
    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${color}`}>
      {base}
    </span>
  );
};

const categoryLabel: Record<NotificationCategory, string> = {
  system: "System",
  project: "Project",
  attendance: "Attendance",
  user: "User",
  security: "Security",
};

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  // const [notifications, setNotifications] = useNotifications();
  const [tab, setTab] = useState<NotificationTab>("all");
  const [search, setSearch] = useState("");
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    defaultPreferences,
  );
  const [showMuted, setShowMuted] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pinnedCount = notifications.filter((n) => n.pinned).length;

  const handleOpenLink = (n: AppNotification) => {
    if (!n.link) return;
    switch (n.link.type) {
      case "project":
        navigate("/projects", {
          state: {
            employeeName: undefined,
            filter: n.relatedId,
          },
        });
        break;
      case "attendance":
        navigate("/attendance", {
          state: {
            employeeId: n.relatedId,
          },
        });
        break;
      case "employee":
        navigate("/user-management", {
          state: {
            employeeId: n.relatedId,
          },
        });
        break;
      case "settings":
        navigate("/settings");
        break;
      default:
        break;
    }
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              read: !n.read,
            }
          : n,
      ),
    );
  };

  const togglePinned = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              pinned: !n.pinned,
            }
          : n,
      ),
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  const mutedCategories = useMemo(
    () =>
      preferences.categories
        .filter((c) => c.muted)
        .map((c) => c.category),
    [preferences],
  );

  const filtered = useMemo(() => {
    let list = [...notifications];

    // apply per-category mute visibility toggle
    if (!showMuted && mutedCategories.length > 0) {
      list = list.filter((n) => !mutedCategories.includes(n.category));
    }

    // tab filter
    if (tab === "unread") {
      list = list.filter((n) => !n.read);
    } else if (tab === "mentions") {
      list = list.filter((n) => n.tag === "@mention");
    } else if (tab === "system") {
      list = list.filter((n) => n.category === "system");
    } else if (tab === "project") {
      list = list.filter((n) => n.category === "project");
    } else if (tab === "attendance") {
      list = list.filter((n) => n.category === "attendance");
    }

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q) ||
          categoryLabel[n.category].toLowerCase().includes(q),
      );
    }

    // pinned first, then newest
    list.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [notifications, tab, search, showMuted, mutedCategories]);

  type GroupLabel = "Today" | "Yesterday" | "This week" | "Earlier";
  const grouped = useMemo(() => {
    const groups: Record<GroupLabel, AppNotification[]> = {
      Today: [],
      Yesterday: [],
      "This week": [],
      Earlier: [],
    };

    filtered.forEach((n) => {
      const label = groupLabel(n.createdAt);
      groups[label].push(n);
    });

    return groups;
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
            <Bell size={16} />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">Notifications</h1>
            <p className="text-xs text-slate-400">
              Stay on top of project changes, attendance alerts and system updates.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
          >
            <CheckCheck size={14} />
            Mark all as read
          </button>
          <button
            type="button"
            onClick={clearRead}
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
          >
            <Trash2 size={14} />
            Clear read
          </button>
          <button
            type="button"
            onClick={() => setShowPreferences(true)}
            className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500"
          >
            <Settings2 size={14} />
            Preferences
          </button>
        </div>
      </div>

      {/* Quick stats & tabs */}
      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
            <span>
              Unread:{" "}
              <span className="font-semibold text-emerald-300">{unreadCount}</span>
            </span>
            <span>
              Pinned:{" "}
              <span className="font-semibold text-blue-300">{pinnedCount}</span>
            </span>
          </div>

          {/* search + muted toggle */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={12}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
                className="h-7 w-48 rounded-full border border-slate-700 bg-slate-950 pl-7 pr-2 text-[11px] text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowMuted((prev) => !prev)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] ${
                showMuted
                  ? "bg-slate-800 text-slate-100"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Filter size={12} />
              {showMuted ? "Showing muted" : "Hide muted"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1 text-[11px]">
          {([
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "mentions", label: "Mentions" },
            { id: "system", label: "System" },
            { id: "project", label: "Projects" },
            { id: "attendance", label: "Attendance" },
          ] as { id: NotificationTab; label: string }[]).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-3 py-1 ${
                tab === t.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-200 hover:bg-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification list */}
      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-slate-100">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-[11px] text-slate-400">
            <Bell size={18} className="text-slate-500" />
            <p>No notifications found for the current filters.</p>
          </div>
        ) : (
          (["Today", "Yesterday", "This week", "Earlier"] as const).map((label) => {
            const group = grouped[label];
            if (!group || group.length === 0) return null;
            return (
              <div key={label} className="space-y-1">
                <div className="flex items-center gap-2 py-1">
                  <span className="h-px flex-1 bg-slate-800" />
                  <span className="text-[10px] uppercase tracking-wide text-slate-500">
                    {label}
                  </span>
                  <span className="h-px flex-1 bg-slate-800" />
                </div>

                <div className="space-y-1">
                  {group.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => handleOpenLink(n)}
                      className={`flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left transition ${
                        !n.read
                          ? "bg-slate-900/80 hover:bg-slate-900"
                          : "bg-transparent hover:bg-slate-900/60"
                      }`}
                    >
                      {/* Icon / unread marker */}
                      <div className="mt-0.5 flex flex-col items-center gap-1">
                        {categoryIcon(n.category, n.importance)}
                        {!n.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-1">
                              <span
                                className={`text-[11px] font-medium ${
                                  !n.read ? "text-slate-50" : "text-slate-200"
                                }`}
                              >
                                {n.title}
                              </span>
                              {n.tag === "@mention" && (
                                <span className="rounded-full bg-purple-500/20 px-2 py-[1px] text-[10px] text-purple-200">
                                  Mention
                                </span>
                              )}
                              <span className="rounded-full bg-slate-800 px-2 py-[1px] text-[10px] text-slate-300">
                                {categoryLabel[n.category]}
                              </span>
                              {n.importance === "high" && (
                                <span className="rounded-full bg-red-500/20 px-2 py-[1px] text-[10px] text-red-200">
                                  High priority
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {n.body}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] text-slate-500">
                              {formatTimeAgo(n.createdAt)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePinned(n.id);
                                }}
                                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                              >
                                {n.pinned ? (
                                  <PinOff size={12} />
                                ) : (
                                  <Pin size={12} />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRead(n.id);
                                }}
                                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                              >
                                <CheckCheck size={12} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Secondary row: link hint */}
                        {n.link && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <ChevronRight size={10} />
                            <span>
                              {n.link.type === "project"
                                ? "Open project"
                                : n.link.type === "attendance"
                                ? "Open attendance"
                                : n.link.type === "employee"
                                ? "Open employee profile"
                                : "Open settings"}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Preferences drawer */}
      <NotificationPreferencesDrawer
        open={showPreferences}
        preferences={preferences}
        onClose={() => setShowPreferences(false)}
        onChange={setPreferences}
      />
    </div>
  );
};

export default NotificationsPage;
