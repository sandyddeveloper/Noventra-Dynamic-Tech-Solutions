// src/layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import DashboardHeader from "../components/dashboard/Header";
import MobileBottomNav from "../components/dashboard/sidebar/MobileBottomNav";
import MobileDrawerSidebar from "../components/dashboard/MobileDrawerSidebar";

const STORAGE_LAST_ACTIVE = "lastActiveAt";

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Restore sidebar collapsed state
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored != null) {
      setIsSidebarCollapsed(stored === "true");
    }
  }, []);

  // Idle tracking (unchanged)
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem(STORAGE_LAST_ACTIVE, Date.now().toString());
    };

    updateActivity();

    const events: (keyof WindowEventMap)[] = [
      "click",
      "keydown",
      "scroll",
      "mousemove",
      "touchstart",
    ];

    events.forEach((evt) =>
      window.addEventListener(evt, updateActivity, { passive: true }),
    );

    window.addEventListener("beforeunload", updateActivity);

    return () => {
      events.forEach((evt) =>
        window.removeEventListener(evt, updateActivity),
      );
      window.removeEventListener("beforeunload", updateActivity);
    };
  }, []);

  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Desktop sidebar only */}
      <div className="hidden md:flex">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapsed}
          role="super_admin"
        />
      </div>

      {/* Mobile drawer sidebar */}
      <MobileDrawerSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex h-screen flex-1 flex-col">
        <DashboardHeader
          // On mobile → open drawer
          onToggleSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="relative flex-1 overflow-y-auto px-3 pb-16 pt-3 md:px-6 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
