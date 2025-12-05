// src/components/dashboard/layout/MobileSidebarToggle.tsx
import { Menu } from "lucide-react";

interface MobileSidebarToggleProps {
  onToggle?: () => void;
}

export function MobileSidebarToggle({ onToggle }: MobileSidebarToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle sidebar"
      className="
        inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 
        bg-white text-slate-700 shadow-sm md:hidden
        hover:bg-slate-50
        dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800
      "
    >
      <Menu size={18} />
    </button>
  );
}
