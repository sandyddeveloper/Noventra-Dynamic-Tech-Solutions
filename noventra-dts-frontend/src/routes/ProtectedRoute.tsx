import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../lib/axios/auth";

type Props = {
  allowedRoles?: string[];
  timeoutMinutes?: number;
};

export default function ProtectedRoute({
  allowedRoles,
}: Props) {
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading, refreshUser } =
    useAuth();

  const [checking, setChecking] = useState(true);


  // --------------------------
  //  MAIN EFFECT
  // --------------------------
  useEffect(() => {
    let cancel = false;

    async function run() {
      // Wait for AuthProvider to finish loading
      if (authLoading) return;

      // Try silent refresh only if not authenticated
      if (!isAuthenticated) {
        try {
          await authApi.refresh();
          await refreshUser();
        } catch {
          if (!cancel) setChecking(false);
          return;
        }
      }

      // Passed all checks
      if (!cancel) setChecking(false);
    }

    run();
    return () => {
      cancel = true;
    };
  }, [isAuthenticated, authLoading, refreshUser]);

  // --------------------------
  //  LOADING SCREEN
  // --------------------------
  if (checking || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="px-5 py-4 bg-black/30 rounded-xl border border-white/10 shadow-xl">
          <div className="flex items-center space-x-2 font-mono text-sm text-green-400">
            <span className="opacity-80 ">Checking session…</span>
            <span className="w-1 h-4 bg-green-500 "></span>
          </div>
        </div>
      </div>

    );
  }

  // --------------------------
  //  FAILED → redirect to login
  // --------------------------
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // --------------------------
  //  ROLE CHECK
  // --------------------------
  if (allowedRoles?.length) {
    const role = user?.role ?? "";
    const ok = allowedRoles.map(r => r.toUpperCase()).includes(role.toUpperCase());
    if (!ok) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  // --------------------------
  //  SUCCESS → render page!
  // --------------------------
  return <Outlet />;
}
