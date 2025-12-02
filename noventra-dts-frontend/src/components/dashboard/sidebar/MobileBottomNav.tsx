// src/components/dashboard/navigation/MobileBottomNav.tsx
import { useLocation, Link } from "react-router-dom";
import { sidebarLinks } from "../../../config/sidebar.config";

export default function MobileBottomNav() {
  const location = useLocation();

  // pick only few important routes for mobile
  const mobileItems = sidebarLinks.filter((item) =>
    ["/", "/projects", "/tasks", "/attendance"].includes(item.path)
  );

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-between border-t bg-white/95 px-2 py-1 shadow-lg md:hidden dark:bg-slate-900/95">
      {mobileItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={[
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-xs font-medium transition-colors",
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-500 dark:text-slate-300",
            ].join(" ")}
          >
            <Icon
              size={20}
              className={
                isActive
                  ? "opacity-100"
                  : "opacity-70"
              }
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
