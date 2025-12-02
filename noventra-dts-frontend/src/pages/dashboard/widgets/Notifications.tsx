import { useEffect, useRef, useState } from "react";
import {
    Bell,
    Check,
    AlertCircle,
    Clock3,
    ArrowRight,
    X,
} from "lucide-react";
import type { NotificationItem, NotificationType } from "../../../types/notification";


const mockNotifications: NotificationItem[] = [
    {
        id: "1",
        title: "New Task Assigned",
        message: "You have been assigned to task NDTS-202: Employee tracking module.",
        time: "2m ago",
        type: "info",
        read: false,
    },
    {
        id: "2",
        title: "Attendance Alert",
        message: "Geo-location mismatch detected for one check-in today.",
        time: "15m ago",
        type: "warning",
        read: false,
    },
    {
        id: "3",
        title: "Payout Processed",
        message: "Your last sprint payout for Project NOV-ALPHA is completed.",
        time: "1h ago",
        type: "success",
        read: true,
    },
];

export function NotificationWidget() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] =
        useState<NotificationItem[]>(mockNotifications);

    const panelRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (!open) return;
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }

        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    const toggleOpen = () => setOpen((prev) => !prev);

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
        );
    };

    const getTypeStyles = (type: NotificationType) => {
        switch (type) {
            case "warning":
                return "border-amber-400/70 bg-amber-50/60 dark:bg-amber-500/5";
            case "success":
                return "border-emerald-400/70 bg-emerald-50/60 dark:bg-emerald-500/5";
            case "info":
            default:
                return "border-blue-400/70 bg-blue-50/60 dark:bg-blue-500/5";
        }
    };

    const renderTypeIcon = (type: NotificationType) => {
        switch (type) {
            case "warning":
                return <AlertCircle size={16} className="text-amber-500" />;
            case "success":
                return <Check size={16} className="text-emerald-500" />;
            case "info":
            default:
                return <Clock3 size={16} className="text-blue-500" />;
        }
    };

    return (
        <div className="relative">
            {/* Bell button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={toggleOpen}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                aria-label="Notifications"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white shadow-sm">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Backdrop on mobile */}
            {open && (
                <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px] md:hidden" />
            )}

            {/* Panel */}
            {open && (
                <div
                    ref={panelRef}
                    className="
            fixed inset-x-3 top-16 z-40 rounded-2xl border border-slate-200 bg-white/95 
            shadow-xl dark:border-slate-700 dark:bg-slate-900/95 
            md:absolute md:inset-auto md:right-0 md:top-11 md:w-96
          "
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                                Notifications
                            </h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {unreadCount === 0
                                    ? "You’re all caught up 🎉"
                                    : `${unreadCount} unread • Stay on top of NOVENTRA events`}
                            </p>
                        </div>

                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="hidden rounded-full px-3 py-1 text-[11px] font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800 md:inline-flex"
                                >
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100 md:h-6 md:w-6"
                                aria-label="Close notifications"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-h-[60vh] space-y-1 overflow-y-auto px-3 py-2 md:max-h-96">
                        {notifications.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                <Bell className="mb-2 h-6 w-6 text-slate-300 dark:text-slate-600" />
                                <p>No notifications yet</p>
                                <p className="text-[11px]">
                                    System activity, project updates, and alerts will appear here.
                                </p>
                            </div>
                        )}

                        {notifications.map((n) => (
                            <button
                                key={n.id}
                                className={`
                  group flex w-full items-start gap-3 rounded-xl border-l-4 px-3 py-2.5 text-left text-sm transition-all
                  ${getTypeStyles(n.type)}
                  ${!n.read ? "shadow-[0_0_0_1px_rgba(59,130,246,0.1)]" : "opacity-90"}
                  hover:-translate-y-[1px] hover:shadow-md
                  dark:text-slate-100
                `}
                            >
                                {/* Icon column */}
                                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/70 shadow-sm dark:bg-slate-900/70">
                                    {renderTypeIcon(n.type)}
                                </div>

                                {/* Text column */}
                                <div className="flex-1 space-y-0.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="line-clamp-1 text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                                            {n.title}
                                        </p>
                                        <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                                            <Clock3 size={11} />
                                            {n.time}
                                        </span>
                                    </div>
                                    <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                                        {n.message}
                                    </p>

                                    <div className="mt-1 flex items-center justify-between text-[11px]">
                                        <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-500 dark:bg-slate-50/5 dark:text-slate-400">
                                            {n.type === "warning"
                                                ? "System Alert"
                                                : n.type === "success"
                                                    ? "Payout · Finance"
                                                    : "Activity"}
                                        </span>

                                        <span className="flex items-center gap-1 text-[10px] text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-300">
                                            View details
                                            <ArrowRight size={11} />
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer (mobile mark all) */}
                    {unreadCount > 0 && (
                        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 text-[11px] md:hidden dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400">
                                Tap to open any notification
                            </span>
                            <button
                                onClick={markAllAsRead}
                                className="rounded-full bg-blue-600 px-3 py-1 font-medium text-white shadow-sm hover:bg-blue-700 active:scale-[0.98]"
                            >
                                Mark all read
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
