// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";

const TIMEOUT_MINUTES = 20;
const STORAGE_LAST_ACTIVE = "lastActiveAt";
const STORAGE_LOGIN = "lastLoginEmail";
const ADMIN_EMAIL = "superadmin@noventra.com";

export default function ProtectedRoute() {
  const location = useLocation();

  const lastLoginEmail = localStorage.getItem(STORAGE_LOGIN);

  const isAuthenticated =
    lastLoginEmail && lastLoginEmail.trim() === ADMIN_EMAIL;

  // check idle timeout
  const lastActiveRaw = localStorage.getItem(STORAGE_LAST_ACTIVE);
  if (lastActiveRaw) {
    const lastActive = Number(lastActiveRaw);
    const diffMs = Date.now() - lastActive;
    const expired = diffMs > TIMEOUT_MINUTES * 60 * 1000;

    if (expired) {
      localStorage.removeItem(STORAGE_LOGIN);
      localStorage.removeItem(STORAGE_LAST_ACTIVE);
      return (
        <Navigate to="/login" replace state={{ from: location.pathname }} />
      );
    }
  }

  return isAuthenticated ? <Outlet /> : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}
