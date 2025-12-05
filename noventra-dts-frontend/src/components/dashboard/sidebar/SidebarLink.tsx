// src/components/dashboard/sidebar/SidebarLink.tsx
import { NavLink, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface SidebarLinkProps {
  label: string;
  icon: LucideIcon;
  path: string;
  isCollapsed?: boolean;
}

export default function SidebarLink({
  label,
  icon: Icon,
  path,
  isCollapsed,
}: SidebarLinkProps) {
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); // ❌ prevent normal NavLink navigation

    // 🔐 Clear session
    localStorage.removeItem("lastLoginEmail");
    localStorage.removeItem("sidebar-collapsed");
    localStorage.removeItem("lastActiveAt");
    localStorage.removeItem("authToken"); // if you had one

    // Navigate to login page
    navigate("/login", { replace: true });
  };

  const isLogout = path === "/logout";

  return (
    <NavLink
      to={path}
      onClick={isLogout ? handleLogout : undefined}
      className={({ isActive }) =>
        [
          "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800",
          isActive
            ? "bg-blue-600 text-white shadow-sm hover:bg-blue-600 dark:bg-blue-500"
            : "text-slate-700 dark:text-slate-200",
          isCollapsed ? "justify-center px-2" : "px-3",
        ].join(" ")
      }
    >
      {/* Left active indicator bar */}
      {!isLogout && (
        <span className="absolute inset-y-1 left-0 w-1 rounded-full bg-blue-500 opacity-0 group-[.active]:opacity-100" />
      )}

      <Icon
        size={20}
        className="shrink-0 opacity-90 group-hover:opacity-100"
      />

      {!isCollapsed && (
        <span className="truncate">{label}</span>
      )}

      {/* Tooltip on hover when collapsed */}
      {isCollapsed && (
        <span
          className="pointer-events-none absolute  z-30 rounded-md bg-slate-900  py-1 text-xs text-white
                     opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
        >
          {label}
        </span>
      )}
    </NavLink>
  );
}
