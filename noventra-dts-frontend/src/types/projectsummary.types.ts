export type UpcomingItem = {
  id: string;
  name: string;
  dueLabel: string; // e.g. "Today", "In 3 days"
  status?: "On Track" | "At Risk" | "Delayed";
};

export interface ProjectSummaryWidgetProps {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueProjects: number;
  completionRate: number; // 0 - 100
  upcoming?: UpcomingItem[];
}