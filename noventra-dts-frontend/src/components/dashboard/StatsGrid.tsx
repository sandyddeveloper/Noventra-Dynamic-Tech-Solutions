// src/components/dashboard/widgets/StatsGrid.tsx
import type { ReactNode } from "react";

interface StatsGridProps {
  children: ReactNode;
}

export function StatsGrid({ children }: StatsGridProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
      {children}
    </section>
  );
}
