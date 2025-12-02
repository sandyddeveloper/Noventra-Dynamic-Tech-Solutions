import type { RouteObject } from 'react-router-dom'

// AUTH
import { LoginPage } from '../pages/auth/LoginPage'

// LAYOUTS
import DashboardLayout from '../layouts/DashboardLayout'

// PAGES
import DashboardPage from '../pages/dashboard/DashboardPage'
import EmployeesPage from '../pages/employees/EmployeeList'
import Forbidden from '../pages/error/Forbidden'
import NotFound from '../pages/error/NotFound'

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },

      // 👇 ADDED EMPLOYEE LIST PAGE
      {
        path: 'employees',
        element: <EmployeesPage />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  },
]
