// src/hooks/useSidebarState.ts
import { useEffect, useState } from "react";

const STORAGE_KEY = "noventra-sidebar-collapsed";

export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) setIsCollapsed(saved === "true");
    } catch {
      // ignore if localStorage not available
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isCollapsed));
    } catch {
      // ignore
    }
  }, [isCollapsed]);

  const toggle = () => setIsCollapsed((prev) => !prev);
  const expand = () => setIsCollapsed(false);
  const collapse = () => setIsCollapsed(true);

  return { isCollapsed, toggle, expand, collapse };
}
