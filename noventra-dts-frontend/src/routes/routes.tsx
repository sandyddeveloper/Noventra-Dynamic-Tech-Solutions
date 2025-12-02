// src/routes/routes.tsx
import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

// AUTH
import { LoginPage } from "../pages/auth/LoginPage";

// LAYOUTS
import DashboardLayout from "../layouts/DashboardLayout";

// PAGES
import DashboardPage from "../pages/dashboard/DashboardPage";
import EmployeesPage from "../pages/employees/EmployeeList";
import Forbidden from "../pages/error/Forbidden";
import NotFound from "../pages/error/NotFound";

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },

  // 👇 PROTECTED SECTION
  {
    element: <ProtectedRoute />, // WRAP EVERYTHING BEHIND AUTH
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
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
];
