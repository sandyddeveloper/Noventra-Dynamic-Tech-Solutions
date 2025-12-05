// src/components/dashboard/sidebar/MobileDrawerSidebar.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawerSidebar({ open, onClose }: Props) {
  const location = useLocation();

  // 🔁 Close drawer automatically whenever route/path changes
  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <div className="relative h-full w-64 bg-slate-900 shadow-xl overflow-y-auto">
        {/* 🔹 Reuse main Sidebar, but Chevron will now CLOSE the drawer */}
        <Sidebar
          isCollapsed={false}      // always expanded in drawer
          onToggleCollapse={onClose} // Chevron acts as "close"
          role="super_admin"
        />
      </div>
    </div>
  );
}
