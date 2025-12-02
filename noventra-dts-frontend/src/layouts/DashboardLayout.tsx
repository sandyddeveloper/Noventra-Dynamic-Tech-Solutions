// src/layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import DashboardHeader from "../components/dashboard/Header";
import MobileBottomNav from "../components/dashboard/sidebar/MobileBottomNav";

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored != null) {
      setIsSidebarCollapsed(stored === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Desktop sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        role="super_admin"
      />

      {/* Main area */}
      <div className="flex h-screen flex-1 flex-col">
        <DashboardHeader onToggleSidebar={toggleSidebar} />

        <main className="relative flex-1 overflow-y-auto px-3 pb-16 pt-3 md:px-6 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
