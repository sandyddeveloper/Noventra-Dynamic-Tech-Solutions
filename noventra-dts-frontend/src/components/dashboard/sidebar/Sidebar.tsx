// src/components/dashboard/sidebar/Sidebar.tsx
import { useMemo } from "react";
import { sidebarBottomLinks, sidebarLinks } from "../../../config/sidebar.config";
import SidebarLink from "./SidebarLink";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  role?: string;
}

export default function Sidebar({
  isCollapsed,
  onToggleCollapse,
  role = "super_admin",
}: SidebarProps) {
  const allowedLinks = useMemo(
    () => sidebarLinks.filter((item) => item.roles.includes(role as any)),
    [role],
  );

  const allowedBottomLinks = useMemo(
    () => sidebarBottomLinks.filter((item) => item.roles.includes(role as any)),
    [role],
  );

  return (
    <aside
      className={[
        "flex h-screen flex-col justify-between border-r bg-white/80 backdrop-blur dark:bg-slate-950/80",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
      ].join(" ")}
    >
      {/* TOP */}
      <div className="flex flex-col">
        {/* Brand + collapse button */}
        <div className="flex items-center justify-between border-b px-3 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 pl-2 items-center justify-center rounded-xl">
              <img src="/logo.svg" alt="" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-50">
                  NOVENTRA
                </div>
                <div className="text-[10px] uppercase tracking-wide text-slate-400">
                  Dynamic Tech Solutions
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border
                       border-slate-200 bg-white text-slate-600 shadow-sm
                       hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 "
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="mt-3 flex-1 space-y-4 overflow-y-auto px-2 py-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Main
              </p>
            )}
            {allowedLinks.map((item) => (
              <SidebarLink
                key={item.path}
                label={item.label}
                icon={item.icon}
                path={item.path}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="border-t px-2 py-3">
        <div className="space-y-1">
          {allowedBottomLinks.map((item) => (
            <SidebarLink
              key={item.path}
              label={item.label}
              icon={item.icon}
              path={item.path}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
