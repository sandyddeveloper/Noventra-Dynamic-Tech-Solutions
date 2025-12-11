// src/api/api.ts
import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

// in-memory access token (kept in JS memory for safety)
let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
  console.debug("[AUTH] setAccessToken -> present?", !!token);

  // Fallback: set axios default header for immediate subsequent requests
  try {
    if (token) {
      // default header is helpful for requests made immediately after login
      api.defaults.headers.common = api.defaults.headers.common || {};
      (api.defaults.headers.common as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    } else {
      if (api.defaults?.headers?.common) delete (api.defaults.headers.common as any).Authorization;
    }
  } catch (e) {
    // ignore in weird runtime environments
  }
};


// Use VITE_API_BASE_URL in .env to point to Django backend during dev.
// If not present, fallback to http://localhost:8000 so cookies set by backend are sent.
const BASE = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000";

// create axios instance
const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Debug: show base URL at runtime
console.info("[API] base URL:", BASE);

// -------------------- Request interceptor (debug) --------------------
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers) config.headers = {} as InternalAxiosRequestConfig["headers"];

    // DEBUG: log outgoing request details
    try {
      const method = (config.method || "GET").toUpperCase();
      // compute pretty URL
      const url = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
      console.debug("[API -> Request]", method, url, "withCredentials=", (config.withCredentials ?? api.defaults.withCredentials));
      console.debug("[API -> Request] accessToken present?", !!accessToken);
    } catch (e) {
      /* ignore debug errors */
    }

    if (accessToken) {
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// -------------------- Refresh token rotation logic --------------------
let isRefreshing = false;
let refreshWaitQueue: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  refreshWaitQueue.forEach((cb) => {
    try { cb(token); } catch { /* ignore */ }
  });
  refreshWaitQueue = [];
};

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    // Wait for the current refresh to finish
    return new Promise((resolve) => {
      refreshWaitQueue.push(resolve);
    });
  }

  // QUICK CHECK: don't call refresh endpoint if browser clearly has no refresh cookie.
  // This avoids unnecessary network calls and a 401 noise when anonymous.
  try {
    const hasRefreshCookie = typeof document !== "undefined" && document.cookie.split(";").some(c => c.trim().startsWith("refresh_token="));
    if (!hasRefreshCookie) {
      console.debug("[AUTH] refreshAccessToken skipped — no refresh_token cookie present");
      processQueue(null);
      return null;
    }
  } catch (e) {
    // document.cookie access can fail in some environments; if so, proceed and attempt refresh.
  }

  isRefreshing = true;
  console.debug("[AUTH] refreshAccessToken() starting");
  try {
    const res = await api.post(
      "/api/auth/token/refresh/",
      {},
      {
        withCredentials: true,
        headers: {
          // backend optionally requires this header; harmless if not required
          "X-CSRF-REFRESH": "1",
        },
      }
    );

    const newAccess = res.data?.access as string | undefined;
    console.debug("[AUTH] refreshAccessToken() response status:", res.status, "access present?", !!newAccess);
    if (newAccess) {
      setAccessToken(newAccess);
    }
    processQueue(newAccess ?? null);
    return newAccess ?? null;
  } catch (err) {
    // err may be axios error — log useful info but remain quiet about expected 401
    if ((err as AxiosError).isAxiosError) {
      const aerr = err as AxiosError;
      if (aerr.response?.status === 401) {
        console.debug("[AUTH] refreshAccessToken() returned 401 — no valid refresh (treated as anonymous)");
      } else {
        console.warn("[AUTH] refreshAccessToken() failed (axios):", aerr.response?.data ?? aerr.message);
      }
    } else {
      console.warn("[AUTH] refreshAccessToken() failed (non-axios):", err);
    }
    setAccessToken(null);
    processQueue(null);
    return null;
  } finally {
    isRefreshing = false;
    console.debug("[AUTH] refreshAccessToken() finished");
  }
}

// -------------------- Response interceptor (retry on 401, debug) --------------------
api.interceptors.response.use(
  (resp) => resp,
  async (error: AxiosError) => {
    // ensure error.config exists
    const originalRequest = (error.config as InternalAxiosRequestConfig & { _retry?: boolean }) || ({} as any);

    console.warn("[API -> Response error]", error.response?.status, error.config?.url);
    if (error.response) {
      console.warn("[API -> Response error] data:", error.response.data);
      console.warn("[API -> Response error] headers:", error.response.headers);
    }

    // Only attempt refresh once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If the failing request is the refresh endpoint itself, don't try to rotate again.
      const url = String(originalRequest.url || "");
      if (url.includes("/api/auth/token/refresh/")) {
        console.debug("[API] 401 from refresh endpoint — not attempting refresh again.");
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      console.debug("[API] Received 401, attempting token refresh...");
      const newToken = await refreshAccessToken();
      if (newToken) {
        if (!originalRequest.headers) originalRequest.headers = {} as InternalAxiosRequestConfig["headers"];
        (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
        try {
          console.debug("[API] Retrying original request with new access token:", originalRequest.url);
          return api.request(originalRequest);
        } catch (innerErr) {
          console.error("[API] Retry failed:", innerErr);
          return Promise.reject(innerErr);
        }
      } else {
        console.debug("[API] Token refresh failed — not retrying.");
      }
    }

    return Promise.reject(error);
  }
);

// -------------------- Export default axios instance --------------------
export default api;

// -------------------- Convenience wrapper functions --------------------
export async function registerUser(data: { email: string; full_name?: string; password: string; }) {
  return api.post("/api/auth/register/", data);
}

export async function verifyEmail(token: string) {
  return api.post("/api/auth/verify-email/", { token });
}

export async function loginUser(data: { email: string; password: string; device?: string; }) {
  // login returns both access token and sets httponly refresh cookie
  const res = await api.post("/api/auth/login/", data);
  console.info("[AUTH] login response:", res.status, res.data);
  const access = res.data?.access;
  if (access) {
    setAccessToken(access);
    // diagnostic logging
    console.info("[AUTH] access token saved (in-memory). first 24 chars:", access.slice(0, 24) + "...");
    console.debug("[AUTH] axios default Authorization header:", api.defaults.headers.common?.Authorization);
  } else {
    console.warn("[AUTH] login did not return access token in body");
  }
  return res;
}

export async function refreshTokenRotate() {
  const res = await api.post("/api/auth/token/refresh/", {}, { withCredentials: true, headers: { "X-CSRF-REFRESH": "1" } });
  console.debug("[AUTH] refreshTokenRotate response:", res.status, res.data);
  const newAccess = res.data?.access as string | undefined;
  if (newAccess) setAccessToken(newAccess);
  return newAccess ?? null;
}

export async function logoutUser() {
  const res = await api.post("/api/auth/logout/");
  setAccessToken(null);
  return res;
}

export async function requestPasswordReset(email: string) {
  return api.post("/api/auth/password/reset/request/", { email });
}

export async function confirmPasswordReset(payload: { token: string; password: string }) {
  return api.post("/api/auth/password/reset/confirm/", payload);
}

export async function getSessions() {
  console.debug("[API] getSessions() called");
  return api.get("/api/auth/sessions/");
}

// add to src/api/api.ts (or same API wrapper file)
export async function getUser(userId?: string) {
  if (userId) {
    // fetch specific user by id
    return api.get(`/api/auth/users/${userId}/`);
  }
  // fetch current authenticated user
  return api.get("/api/auth/me/");
}
