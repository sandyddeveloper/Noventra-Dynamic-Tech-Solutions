
import { Search } from "lucide-react";
import { ThemeToggleButton } from "../ui/ToggleButton";
import { NotificationWidget } from "../../pages/dashboard/widgets/Notifications";
import { MobileSidebarToggle } from "./MobileSidebarToggle";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../../lib/axios/user";

interface DashboardHeaderProps {
    onToggleSidebar?: () => void;
}

type UserInfo = {
    id?: number | string;
    fullName?: string | null;
    email?: string;
    roleName?: string | null;
};

export default function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchCurrentUser()
            .then((data) => {
                if (!mounted) return;
                // normalize keys: backend might return full_name or fullName depending on mapping
                const normalized = {
                    id: data.id,
                    fullName: data.fullName ?? data.full_name ?? data.full_name_camelcase ?? null,
                    email: data.email,
                    roleName: data.roleName ?? data.role_name ?? data.role?.name ?? null,
                };
                setUser(normalized);
            })
            .catch((err) => {
                console.warn("Could not fetch current user:", err?.response?.data ?? err?.message ?? err);
                setUser(null);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    // derive avatar initial from fullName or email
    const avatarInitial = (() => {
        if (user?.fullName) {
            const parts = user.fullName.trim().split(/\s+/);
            if (parts.length >= 2) {
                // use first letter of first + last name
                return (parts[0][0] + (parts[parts.length - 1][0] ?? "")).toUpperCase();
            }
            return user.fullName[0].toUpperCase();
        }
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return "?";
    })();

    // nicer role label (SUPER_ADMIN -> Super Admin)
    const roleLabel = user?.roleName
        ? user.roleName.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
        : loading
            ? "Loading..."
            : "Unknown";
    return (
        <header
            className="
        sticky top-0 z-30 my-1 flex items-center justify-between border-b 
        bg-white/80 px-3 py-2 backdrop-blur md:px-6
        dark:border-slate-800 dark:bg-slate-950/80
      "
        >
            {/* Left part: brand + mobile menu */}
            <div className="flex items-center gap-3">
                {/* Mobile: toggle sidebar */}
                <MobileSidebarToggle onToggle={onToggleSidebar} />

                <div className="hidden md:block">
                    <h1 className="text-md font-semibold text-slate-900 dark:text-slate-50">
                        NOVENTRA Command Center
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Futuristic Company Management • Real-time insights
                    </p>
                </div>
            </div>

            {/* Center: search bar */}
            <div className="flex-1 px-2 md:px-10">
                <div
                    className="
            mx-auto flex max-w-xl items-center gap-2 rounded-full border border-slate-200 
            bg-slate-50 px-3 py-1 text-sm shadow-inner
            focus-within:ring-1 focus-within:ring-blue-500
            dark:border-slate-700 dark:bg-slate-900
          "
                >
                    <Search size={16} className="text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search employees, projects, tasks..."
                        className="
              h-8 w-full bg-transparent text-xs outline-none
              placeholder:text-slate-400
              dark:text-slate-100 dark:placeholder:text-slate-500
            "
                    />
                    <span className="hidden text-[10px] text-slate-400 dark:text-slate-500 md:inline">
                        ⌘K
                    </span>
                </div>
            </div>

            {/* Right: theme, notifications, profile */}
            <div className="flex items-center gap-2 md:gap-4">
                <ThemeToggleButton />
                <NotificationWidget />

                {/* Profile */}
                <button
                    className="
            flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs 
            shadow-sm hover:bg-slate-50
            dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800
          "
                >
                    <div
                        className="
              flex h-8 w-8 items-center justify-center rounded-full 
              bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-bold text-white
            "
                    >
                        {avatarInitial}
                    </div>
                    <div className="hidden flex-col leading-tight md:flex">
                        <span className="font-semibold text-slate-900 dark:text-slate-50">
                            {user?.fullName ?? user?.email ?? (loading ? "Loading..." : "Unknown")}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide text-blue-600 dark:text-blue-300">
                            {roleLabel}
                        </span>
                    </div>
                </button>
            </div>
        </header>
    );
}
