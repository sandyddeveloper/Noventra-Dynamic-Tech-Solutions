// src/hooks/useAuth.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import authApi from "../lib/axios/auth";
import { setAccessToken } from "../lib/axios/api";
import axios from "axios";

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, device?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Refresh user profile from server (calls /api/auth/me/)
  // RETURNS boolean: true if user loaded, false otherwise.
  const refreshUser = useCallback(async (): Promise<boolean> => {
    try {
      console.debug("[AUTH] refreshUser -> calling /me");
      const res = await authApi.me();
      if (res && res.data) {
        console.debug("[AUTH] /me success:", res.data);
        setUser(res.data as AuthUser);
        return true;
      } else {
        console.debug("[AUTH] /me returned no data");
        setUser(null);
        return false;
      }
    } catch (err) {
      console.warn("[AUTH] refreshUser failed:", err);
      setUser(null);
      return false;
    }
  }, []);

  /**
   * Startup flow:
   * - Try to rotate refresh cookie -> get an access token (authApi.refresh()).
   * - If that succeeds: setAccessToken and call refreshUser() to populate profile.
   * - Don't call /sessions/ on startup (it requires being authenticated and causes spurious 401s).
   */
  const attemptCookieRefreshAndPopulate = useCallback(async (): Promise<void> => {
    try {
      console.debug("[AUTH] attemptCookieRefreshAndPopulate starting - attempting cookie-based refresh");

      // If there's no visible refresh cookie, avoid the network call (quiet).
      try {
        const hasRefreshCookie = typeof document !== "undefined" && document.cookie.split(";").some(c => c.trim().startsWith("refresh_token="));
        if (!hasRefreshCookie) {
          console.debug("[AUTH] No refresh_token cookie present at startup — skipping refresh.");
          setUser(null);
          return;
        }
      } catch (e) {
        // if reading document.cookie fails, we'll still attempt the refresh below
      }

      try {
        const newAccess = await authApi.refresh();
        if (newAccess) {
          console.debug("[AUTH] refresh() returned access token (rotated). populating user.");
          setAccessToken(newAccess);
          await refreshUser();
          return;
        } else {
          console.debug("[AUTH] refresh() returned no access token");
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          // expected when no valid refresh cookie; treat as anonymous quietly
          console.debug("[AUTH] startup refresh returned 401 — no valid refresh cookie (normal)");
        } else if (axios.isAxiosError(err)) {
          console.debug("[AUTH] refresh() call failed (axios):", err.response?.status ?? err.message);
        } else {
          console.debug("[AUTH] refresh() call failed (non-axios):", err);
        }
      }

      // No valid refresh cookie or rotation failed — treat as no session.
      console.debug("[AUTH] No active session at startup (no valid refresh)");
      setUser(null);
    } catch (err) {
      console.error("[AUTH] attemptCookieRefreshAndPopulate top-level error:", err);
    }
  }, [refreshUser]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        console.debug("[AUTH] AuthProvider mounting -> attempting cookie-refresh flow");
        await attemptCookieRefreshAndPopulate();
      } finally {
        if (mounted) {
          setLoading(false);
          console.debug("[AUTH] AuthProvider initialization complete. loading=false");
        }
      }
    })();
    return () => { mounted = false; };
  }, [attemptCookieRefreshAndPopulate]);

  const login = useCallback(async (email: string, password: string, device?: string): Promise<boolean> => {
    try {
      console.debug("[AUTH] login() calling authApi.login");
      const res = await authApi.login({ email, password, device });
      console.debug("[AUTH] login() response:", res.status, res.data);

      const access = res.data?.access as string | undefined;
      const userData = res.data?.user as AuthUser | undefined;

      if (access) {
        console.debug("[AUTH] login() got access token -> saving in-memory");
        setAccessToken(access);
      } else {
        console.debug("[AUTH] login() had no access token in body");
      }

      if (userData) {
        console.debug("[AUTH] login() got user payload -> setting user");
        setUser(userData);
        return true;
      }

      // fallback: try to fetch user profile (may require access token present)
      try {
        console.debug("[AUTH] login() fallback -> calling refreshUser()");
        const ok = await refreshUser();
        return ok;
      } catch (err) {
        console.warn("[AUTH] login fallback refreshUser failed:", err);
        return false;
      }
    } catch (err) {
      // friendly axios-safe logging
      if (axios.isAxiosError(err)) {
        console.warn("[AUTH] login() failed (axios):", err.response?.data ?? err.message);
      } else {
        console.warn("[AUTH] login() failed (non-axios):", err);
      }
      return false;
    }
  }, [refreshUser]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      console.debug("[AUTH] logout() calling authApi.logout");
      await authApi.logout();
    } catch (err) {
      console.warn("[AUTH] logout() network error:", err);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user, loading, login, logout, refreshUser, isAuthenticated: !!user,
  }), [user, loading, login, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
