// src/routes/routes.tsx
import type { RouteObject } from "react-router-dom";

// import ProtectedRoute from "./ProtectedRoute";

// AUTH
import { LoginPage } from "../pages/auth/LoginPage";

// LAYOUTS
import DashboardLayout from "../layouts/DashboardLayout";

// PAGES
import DashboardPage from "../pages/dashboard/DashboardPage";
import EmployeesPage from "../pages/employees/EmployeeList";
import Forbidden from "../pages/error/Forbidden";
import NotFound from "../pages/error/NotFound";
import ProjectsPage from "../pages/projects/Projects";
import AttendancePage from "../pages/attendance/Attendance";
import DepartmentsTeamsPage from "../pages/org/DepartmentsTeamsPage";
import UserManagementPage from "../pages/org/UserManagementPage";
import NotificationsPage from "../components/dashboard/notification/Notifications";
import EmployeeProfilePage from "../pages/employees/EmployeeProfilePage";
import ClientManagementPage from "../pages/clients/ClientManagementPage";
import ClientWorkspacePage from "../pages/clients/ClientWorkspacePage";
import SettingsPage from "../pages/settings/SettingsPage";
import LeaveManagementPage from "../pages/leave/LeaveManagementPage";
import ShiftPlannerPage from "../pages/shift/ShiftPlannerPage";
import HolidayCalendarPage from "../pages/holiday/HolidayCalendarPage";
import ProtectedRoute from "./ProtectedRoute";

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },

          {
            path: "employees",
            element: <EmployeesPage />,
          },
          {
            path: "projects",
            element: <ProjectsPage />,
          },
          {
            path: "attendance",
            element: <AttendancePage />,
          },
          {
            path: "org-structure",
            element: <DepartmentsTeamsPage />,
          },
          {
            path: "users",
            element: <UserManagementPage />,
          },
          {
            path: "profile/:employeeCode",
            element: <EmployeeProfilePage />,
          },
          {
            path: "notifications",
            element: <NotificationsPage />,
          },
          {
            path: "clients",
            element: <ClientManagementPage />,
          },
          {
            path: "clients/:clientId",
            element: <ClientWorkspacePage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
          {
            path: "/leave-management",
            element: <LeaveManagementPage />,
          },
          {
            path: "/shift-planner",
            element: <ShiftPlannerPage />,
          },
          {
            path: "/holiday-calendar",
            element: <HolidayCalendarPage />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
];
