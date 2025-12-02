// src/pages/dashboard/DashboardPage.tsx
import {
  Users,
  FolderKanban,
  CheckCircle2,
  CalendarCheck2,
} from "lucide-react";
import { mockTimeline } from "../../data/mockTimeLine";
import TimelineWidget from "./widgets/TimelineWidget";
import { StatsGrid } from "../../components/dashboard/StatsGrid";
import { StatCard } from "../../components/dashboard/StatCard";
import ProjectSummaryWidget from "./widgets/ProjectSummaryWidget";

export default function DashboardPage() {
  const isLoading = false;

  return (
    <div className="flex h-full flex-col gap-4 no-scrollbar">
      {/* Top stats */}
      <StatsGrid>
        <StatCard
          label="Active Employees"
          value="124"
          helperText="+8 added this month"
          trendValue="+6.9%"
          trendDirection="up"
          isLoading={isLoading}
          icon={<Users size={18} />}
        />
        <StatCard
          label="Active Projects"
          value="18"
          helperText="3 in critical stage"
          trendValue="+2"
          trendDirection="up"
          isLoading={isLoading}
          icon={<FolderKanban size={18} />}
        />
        <StatCard
          label="On-time Tasks"
          value="92%"
          helperText="SLA: 90% target"
          trendValue="+3.1%"
          trendDirection="up"
          isLoading={isLoading}
          icon={<CheckCircle2 size={18} />}
        />
        <StatCard
          label="Today’s Attendance"
          value="110 / 124"
          helperText="Shift A • B • C"
          trendValue="-4 absentees"
          trendDirection="down"
          isLoading={isLoading}
          icon={<CalendarCheck2 size={18} />}
        />
      </StatsGrid>

      {/* Main content */}
      <section className="grid flex-1 gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-min">
        {/* Project Summary – takes full width on mobile, 2/3 on large screens */}
        <div className="md:col-span-2 lg:col-span-2">
          <ProjectSummaryWidget
            totalProjects={32}
            activeProjects={12}
            completedProjects={16}
            overdueProjects={4}
            completionRate={68}
            upcoming={[
              {
                id: "1",
                name: "HR Portal Revamp",
                dueLabel: "Today",
                status: "At Risk",
              },
              {
                id: "2",
                name: "Mobile App V2",
                dueLabel: "In 3 days",
                status: "On Track",
              },
              {
                id: "3",
                name: "Internal Analytics Dashboard",
                dueLabel: "Next week",
                status: "Delayed",
              },
            ]}
          />
        </div>

        {/* Timeline */}
        <div className="space-y-3 h-[320px] sm:h-auto overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-600">
          <TimelineWidget items={mockTimeline} />
        </div>

      </section>
    </div>
  );
}
