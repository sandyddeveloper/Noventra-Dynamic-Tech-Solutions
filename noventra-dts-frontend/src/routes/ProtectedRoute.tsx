// src/routes/ProtectedRoute.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

type Props = {
  /** optional list of allowed roles, e.g. ["SUPER_ADMIN","HR"] */
  allowedRoles?: string[];
  /** idle timeout in minutes (defaults to 20) */
  timeoutMinutes?: number;
};

const STORAGE_LAST_ACTIVE = "noventra_last_active_at";
const STORAGE_ACCESS_TOKEN = "noventra_access_token";
const STORAGE_REFRESH_TOKEN = "noventra_refresh_token";
const STORAGE_LAST_EMAIL = "noventra_last_email";

/**
 * ProtectedRoute
 *
 * Wrap routes with <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />} />
 *
 * Behavior:
 * - If missing tokens or not authenticated -> redirects to /login
 * - If role not allowed -> redirects to /login (change to /forbidden if desired)
 * - Tracks user activity and enforces an idle timeout (logout on expiry)
 * - Listens to localStorage changes to sync logout across tabs
 */
export default function ProtectedRoute({
  allowedRoles,
  timeoutMinutes = 20,
}: Props) {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthContext();
  const [checking, setChecking] = useState(true);
  const activityRef = useRef<number | null>(null);
  const timeoutMs = useRef(timeoutMinutes * 60 * 1000).current;

  // Lightweight debug toggle via localStorage
  const debugEnabled = (() => {
    try {
      return localStorage.getItem("noventra_debug") === "1";
    } catch {
      return false;
    }
  })();

  const dbg = (...args: any[]) => {
    if (!debugEnabled) return;
    // make logs non-blocking and safe
    try {
      // eslint-disable-next-line no-console
      console.log("[ProtectedRoute]", ...args);
    } catch { }
  };

  const updateLastActive = useCallback(() => {
    try {
      const now = Date.now();
      localStorage.setItem(STORAGE_LAST_ACTIVE, now.toString());
      activityRef.current = now;
      dbg("updated last active", now);
    } catch (e) {
      dbg("updateLastActive failed", e);
    }
  }, []);

  // Helper: check presence of required localStorage keys
  const requiredLocalStorageKeysPresent = useCallback(() => {
    try {
      const access = localStorage.getItem(STORAGE_ACCESS_TOKEN);
      const refresh = localStorage.getItem(STORAGE_REFRESH_TOKEN);
      const lastEmail = localStorage.getItem(STORAGE_LAST_EMAIL);
      dbg("token presence", { access: !!access, refresh: !!refresh, lastEmail: !!lastEmail });
      return !!access && !!refresh && !!lastEmail;
    } catch (e) {
      dbg("requiredLocalStorageKeysPresent error", e);
      return false;
    }
  }, []);

  // attach activity listeners once when mounted
  useEffect(() => {
    // update last active immediately on mount
    updateLastActive();

    const onActivity = () => updateLastActive();
    const opts: AddEventListenerOptions = { passive: true };

    window.addEventListener("mousemove", onActivity, opts);
    window.addEventListener("mousedown", onActivity, opts);
    window.addEventListener("keydown", onActivity, opts);
    window.addEventListener("touchstart", onActivity, opts);
    window.addEventListener("scroll", onActivity, opts);

    return () => {
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("mousedown", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("touchstart", onActivity);
      window.removeEventListener("scroll", onActivity);
    };
  }, [updateLastActive]);

  // Listen for storage events so removing tokens in another tab logs the user out here
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (
        e.key === STORAGE_ACCESS_TOKEN ||
        e.key === STORAGE_REFRESH_TOKEN ||
        e.key === STORAGE_LAST_EMAIL
      ) {
        // If either token/email was removed or set to falsy, perform logout
        const present = requiredLocalStorageKeysPresent();
        dbg("storage event for tokens/email", { key: e.key, newValue: e.newValue, present });
        if (!present) {
          // fire-and-forget logout; it's important this doesn't block UI
          logout().catch(() => { });
        }
      }

      if (e.key === STORAGE_LAST_ACTIVE) {
        // update local ref for last active so other checks use latest value
        try {
          activityRef.current = e.newValue ? Number(e.newValue) : null;
        } catch { }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [logout, requiredLocalStorageKeysPresent]);

  // check authentication + idle timeout at mount and when dependencies change
  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        dbg("running ProtectedRoute checks", { isAuthenticated, roleName: user?.roleName, timeoutMinutes });

        // 1) quick check: required localStorage keys must be present
        if (!requiredLocalStorageKeysPresent()) {
          dbg("required keys missing -> logout");
          await logout();
          if (mounted) setChecking(false);
          return;
        }

        // 2) idle timeout check using localStorage
        let lastActiveRaw: string | null = null;
        try {
          lastActiveRaw = localStorage.getItem(STORAGE_LAST_ACTIVE);
        } catch {
          lastActiveRaw = null;
        }

        if (lastActiveRaw) {
          const lastActive = Number(lastActiveRaw) || 0;
          const delta = Date.now() - lastActive;
          dbg("idle check", { lastActive, delta, timeoutMs });
          if (delta > timeoutMs) {
            dbg("idle timeout expired -> logout");
            await logout();
            if (mounted) setChecking(false);
            return;
          }
        } else {
          // no last active — set it
          dbg("no lastActive found, initializing");
          updateLastActive();
        }

        // 3) Auth context check
        if (!isAuthenticated) {
          dbg("not authenticated according to AuthContext -> finishing checks");
          if (mounted) setChecking(false);
          return;
        }

        // 4) Role-based check
        if (allowedRoles && allowedRoles.length > 0) {
          const role = user?.roleName ?? "";
          const hasRole = allowedRoles.some(
            (r) => r.toUpperCase() === role.toUpperCase()
          );
          dbg("role check", { allowedRoles, role, hasRole });
          if (!hasRole) {
            // unauthorized for this route - log out (or redirect to /forbidden)
            dbg("user lacks required role -> logout");
            await logout();
            if (mounted) setChecking(false);
            return;
          }
        }

        // everything ok
        if (mounted) {
          dbg("ProtectedRoute checks passed");
          setChecking(false);
        }
      } catch (err) {
        dbg("ProtectedRoute check error", err);
        if (mounted) setChecking(false);
      }
    };

    check();

    return () => {
      mounted = false;
    };
    // We purposely don't include `logout` in deps to avoid re-registering; it's assumed stable from context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.roleName, timeoutMinutes, requiredLocalStorageKeysPresent]);

  // While checking, avoid flashing - you can return a spinner
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-slate-400">Checking session…</div>
      </div>
    );
  }

  // if not authenticated redirect to login and preserve from
  if (!isAuthenticated) {
    dbg("redirecting to /login (not authenticated)");
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // if allowedRoles provided and user role doesn't match, redirect as unauthorized
  if (allowedRoles && allowedRoles.length > 0) {
    const role = user?.roleName ?? "";
    const hasRole = allowedRoles.some((r) => r.toUpperCase() === role.toUpperCase());
    if (!hasRole) {
      dbg("redirecting to /login (role mismatch)", { role, allowedRoles });
      // you could redirect to /forbidden page — for now redirect to login
      return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
  }

  // All checks passed — render child routes
  return <Outlet />;
}
