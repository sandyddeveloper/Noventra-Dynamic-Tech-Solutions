// src/hooks/useAuth.ts
import { useCallback, useMemo } from "react";
import { useAuthContext } from "../context/AuthContext";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
  saveLastEmail,
  getLastEmail,
} from "../lib/axios/auth";
import api from "../lib/axios/api";

export type LoginPayload = {
  email: string;
  password: string;
  remember?: boolean;
  deviceInfo?: string;
  ipAddress?: string;
};

export type AuthResponseBody = {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
  refreshToken?: string;
  user?: Record<string, any>;
};

export function useAuth() {
  // prefer context implementation when available
  try {
    const ctx = useAuthContext();
    return {
      login: ctx.login,
      logout: ctx.logout,
      refresh: ctx.refresh,
      loading: ctx.loading,
      isAuthenticated: ctx.isAuthenticated,
      getLastEmail: () => getLastEmail(),
    };
  } catch {
    // fallback direct implementation for non-React contexts
    const login = useCallback(async (payload: LoginPayload): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await api.post<AuthResponseBody>("/api/auth/login", {
          email: payload.email,
          password: payload.password,
          deviceInfo: payload.deviceInfo,
          ipAddress: payload.ipAddress,
        });
        const data = res.data;
        if (!data?.accessToken) return { ok: false, error: "No access token returned from server" };
        setAccessToken(data.accessToken, payload.remember ?? true);
        if (data.refreshToken) setRefreshToken(data.refreshToken);
        if (payload.remember) {
          try {
            saveLastEmail(payload.email);
          } catch { }
        }
        return { ok: true };
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || "Login failed";
        return { ok: false, error: String(msg) };
      }
    }, []);

    const refresh = useCallback(async (): Promise<boolean> => {
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return false;
        const resp = await api.post<AuthResponseBody>("/api/auth/refresh", { refreshToken });
        if (resp?.data?.accessToken) {
          setAccessToken(resp.data.accessToken, true);
          if (resp.data.refreshToken) setRefreshToken(resp.data.refreshToken);
          return true;
        }
        return false;
      } catch {
        clearTokens();
        return false;
      }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
      try {
        const refreshToken = getRefreshToken();
        const access = getAccessToken();
        await api.post("/api/auth/logout", {}, { params: refreshToken ? { refreshToken } : undefined, headers: access ? { Authorization: `Bearer ${access}` } : undefined }).catch(() => { });
      } finally {
        clearTokens();
      }
    }, []);

    const isAuthenticated = useMemo(() => !!getAccessToken(), []);

    return {
      login,
      logout,
      refresh,
      loading: false,
      isAuthenticated,
      getLastEmail: () => getLastEmail(),
    };
  }
}
