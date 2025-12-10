// src/lib/axios/api.ts
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { getAccessToken, getRefreshToken, clearTokens } from "./auth";

const baseURL = (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:8080/ndts";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach Authorization header
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {

  
  try {
    const token = getAccessToken();
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)["Authorization"] = token ? `Bearer ${token}` : "";
  } catch {
    // ignore
  }
  return config;
});

// Simple refresh-on-401 flow (best-effort)
let isRefreshing = false;
let pendingRequests: Array<(token?: string) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err?.config;
    if (!originalReq) return Promise.reject(err);

    if (err?.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        return Promise.reject(err);
      }

      if (isRefreshing) {
        // queue requests while refreshing
        return new Promise((resolve, reject) => {
          pendingRequests.push((token?: string) => {
            if (!token) return reject(err);
            (originalReq.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
            resolve(axios(originalReq));
          });
        });
      }

      isRefreshing = true;
      try {
        const resp = await axios.post(
          `${baseURL}/api/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccess = resp?.data?.accessToken;
        const newRefresh = resp?.data?.refreshToken;
        if (!newAccess) throw new Error("Refresh failed");

        // write into sessionStorage (remember semantics unknown here; UI controls remember on login)
        sessionStorage.setItem("noventra_access_token", newAccess);
        if (newRefresh) localStorage.setItem("noventra_refresh_token", newRefresh);

        // drain queue
        pendingRequests.forEach((cb) => cb(newAccess));
        pendingRequests = [];

        (originalReq.headers as Record<string, string>)["Authorization"] = `Bearer ${newAccess}`;
        return axios(originalReq);
      } catch (e) {
        pendingRequests.forEach((cb) => cb(undefined));
        pendingRequests = [];
        clearTokens();
        return Promise.reject(e || err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
