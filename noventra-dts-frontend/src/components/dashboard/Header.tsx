// src/components/dashboard/layout/DashboardHeader.tsx
import { Search, Menu } from "lucide-react";
import { ThemeToggleButton } from "../ui/ToggleButton";
import { NotificationWidget } from "../../pages/dashboard/widgets/Notifications";

interface DashboardHeaderProps {
    onToggleSidebar?: () => void;
}

export default function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
    return (
        <header
            className="
        sticky top-0 z-30 flex items-center justify-between my-1 border-b 
        bg-white/80 px-3 py-2 backdrop-blur md:px-6
        dark:bg-slate-950/80 dark:border-slate-800
      "
        >
            {/* Left part: brand + mobile menu */}
            <div className="flex items-center gap-3">
                {/* Mobile: toggle sidebar */}
                <button
                    className="
            inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 
            bg-white text-slate-700 shadow-sm md:hidden
            hover:bg-slate-50
            dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800
          "
                    onClick={onToggleSidebar}
                >
                    <Menu size={18} />
                </button>

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
                    <span className="hidden text-[10px] text-slate-400 md:inline dark:text-slate-500">
                        ⌘K
                    </span>
                </div>
            </div>

            {/* Right: theme, notifications, profile */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Theme toggle (global) */}
                <ThemeToggleButton />

                {/* Notifications */}
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
                        H
                    </div>
                    <div className="hidden flex-col leading-tight md:flex">
                        <span className="font-semibold text-slate-900 dark:text-slate-50">
                            Harini
                        </span>
                        <span className="text-[10px] uppercase tracking-wide text-blue-600 dark:text-blue-300">
                            Super Admin
                        </span>
                    </div>
                </button>
            </div>
        </header>
    );
}
