// src/config/sidebar.config.ts
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Clock,
  CalendarCheck2,
  Layers,
  Building2,
  UserCog,
  Settings,
  Bell,
  CreditCard,
  LogOut,
  UserCheck2Icon,
} from "lucide-react";

export type UserRole =
  | "super_admin"
  | "hr"
  | "team_lead"
  | "employee"
  | "client";

export interface SidebarItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: UserRole[]; // which roles can see this
}

export const sidebarLinks: SidebarItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: ["super_admin", "hr", "team_lead", "employee", "client"],
  },
  {
    label: "Employees",
    path: "/employees",
    icon: Users,
    roles: ["super_admin", "hr", "team_lead"],
  },
  {
    label: "Projects",
    path: "/projects",
    icon: Briefcase,
    roles: ["super_admin", "team_lead", "employee"],
  },
  {
    label: "Attendance",
    path: "/attendance",
    icon: Layers,
    roles: ["super_admin", "hr", "employee"],
  },
  {
    label: "Departments & Teams",
    path: "/org-structure",
    icon: Building2,
    roles: ["super_admin", "hr"],
  },
  {
    label: "Clients & Management",
    path: "/clients",
    icon: CreditCard,
    roles: ["super_admin", "team_lead"],
  },
  {
    label: "User Management",
    path: "/users",
    icon: UserCog,
    roles: ["super_admin"],
  },
  {
    label: "Shift Management",
    path: "/shift-planner",
    icon: UserCheck2Icon,
    roles: ["super_admin"],
  },
  {
    label: "Leave Management",
    path: "/leave-management",
    icon: Clock,
    roles: ["super_admin"],
  },
  {
    label: "Calander",
    path: "/holiday-calendar",
    icon: CalendarCheck2,
    roles: ["super_admin"],
  },
];

export const sidebarBottomLinks: SidebarItem[] = [
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
    roles: ["super_admin", "hr", "team_lead", "employee", "client"],
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["super_admin", "hr", "team_lead"],
  },
  {
    label: "Logout",
    path: "/logout",
    icon: LogOut,
    roles: ["super_admin", "hr", "team_lead", "employee", "client"],
  },
];
