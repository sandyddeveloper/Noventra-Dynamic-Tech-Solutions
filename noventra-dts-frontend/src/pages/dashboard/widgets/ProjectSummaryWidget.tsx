// src/components/dashboard/widgets/ProjectSummaryWidget.tsx
import React from "react";
import {
    FolderKanban,
    PlayCircle,
    CheckCircle2,
    AlertTriangle,
    Clock,
} from "lucide-react";
import type { ProjectSummaryWidgetProps } from "../../../types/projectsummary.types";



const ProjectSummaryWidget: React.FC<ProjectSummaryWidgetProps> = ({
    totalProjects,
    activeProjects,
    completedProjects,
    overdueProjects,
    completionRate,
    upcoming = [],
}) => {
    const safeRate = Math.max(0, Math.min(100, completionRate));

    return (
        <div className="w-full">
            <div className="bg-slate-900/85 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm p-4 sm:p-5 space-y-4 sm:space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50">
                            Project Summary
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Overview of all ongoing projects
                        </p>
                    </div>
                    <button
                        className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
                        onClick={() => console.log("Navigate to projects page")}
                    >
                        View All
                    </button>
                </div>

                {/* Top Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {/* Total */}
                    <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-neutral-800/70 p-3">
                        <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40">
                            <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                                Total
                            </span>
                            <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50">
                                {totalProjects}
                            </span>
                        </div>
                    </div>

                    {/* Active */}
                    <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-neutral-800/70 p-3">
                        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40">
                            <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                                Active
                            </span>
                            <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50">
                                {activeProjects}
                            </span>
                        </div>
                    </div>

                    {/* Completed */}
                    <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-neutral-800/70 p-3">
                        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                                Completed
                            </span>
                            <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50">
                                {completedProjects}
                            </span>
                        </div>
                    </div>

                    {/* Overdue */}
                    <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-neutral-800/70 p-3">
                        <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/40">
                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                                Overdue
                            </span>
                            <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50">
                                {overdueProjects}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress + Upcoming */}
                <div className="flex flex-col md:flex-row gap-4 sm:gap-5">
                    {/* Completion Rate */}
                    <div className="md:w-1/2 space-y-3">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-gray-800 dark:text-gray-100">
                                Overall completion
                            </span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {safeRate}%
                            </span>
                        </div>
                        <div className="w-full h-2.5 sm:h-3 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all"
                                style={{ width: `${safeRate}%` }}
                            />
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                            Based on completed vs total projects.
                        </p>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="md:w-1/2 space-y-2">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium text-gray-800 dark:text-gray-100">
                                Upcoming deadlines
                            </span>
                        </div>

                        {upcoming.length === 0 ? (
                            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2">
                                No upcoming deadlines in the next few days.
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {upcoming.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/80 dark:bg-neutral-900/70 px-3 py-2.5"
                                    >
                                        <div className="flex-1">
                                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-50 truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                                                Due: {item.dueLabel}
                                            </p>
                                        </div>
                                        {item.status && (
                                            <span
                                                className={`text-[10px] sm:text-[11px] px-2 py-1 rounded-full font-medium whitespace-nowrap
                          ${item.status === "On Track"
                                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                                        : item.status === "At Risk"
                                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                                                    }
                        `}
                                            >
                                                {item.status}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectSummaryWidget;
