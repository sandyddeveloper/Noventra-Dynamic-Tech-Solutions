// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
    const location = useLocation();

    // Check auth based on localStorage value
    const lastLoginEmail = localStorage.getItem("lastLoginEmail");

    const isAuthenticated =
        lastLoginEmail && lastLoginEmail.trim() === "superadmin@noventra.com";

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/login" replace state={{ from: location.pathname }} />
    );
}
