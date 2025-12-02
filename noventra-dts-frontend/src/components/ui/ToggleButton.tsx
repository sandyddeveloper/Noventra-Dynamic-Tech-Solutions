// src/components/ui/ThemeToggleButton.tsx
import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all 
                 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      {isDark ? (
        <SunMedium size={16} className="transition-transform" />
      ) : (
        <Moon size={16} className="transition-transform" />
      )}
    </button>
  );
}
