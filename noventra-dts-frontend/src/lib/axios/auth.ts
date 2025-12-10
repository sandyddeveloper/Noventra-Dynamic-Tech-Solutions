// src/lib/axios/auth.ts
// Token/email persistence helpers. Keep keys consistent across app.

const KEY_ACCESS = "noventra_access_token";
const KEY_REFRESH = "noventra_refresh_token";
const KEY_LAST_EMAIL = "noventra_last_email";
const KEY_LAST_ACTIVE = "noventra_last_active_at";

/**
 * setAccessToken(token, remember)
 * - remember=true -> localStorage
 * - remember=false -> sessionStorage
 */
export function setAccessToken(token: string, remember = true) {
  try {
    if (remember) {
      localStorage.setItem(KEY_ACCESS, token);
      sessionStorage.removeItem(KEY_ACCESS);
    } else {
      sessionStorage.setItem(KEY_ACCESS, token);
      localStorage.removeItem(KEY_ACCESS);
    }
  } catch {}
}

export function getAccessToken(): string | null {
  try {
    return sessionStorage.getItem(KEY_ACCESS) || localStorage.getItem(KEY_ACCESS);
  } catch {
    return null;
  }
}

export function setRefreshToken(token: string | undefined) {
  try {
    if (token == null) return;
    localStorage.setItem(KEY_REFRESH, token);
  } catch {}
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(KEY_REFRESH);
  } catch {
    return null;
  }
}

export function saveLastEmail(email: string) {
  try {
    localStorage.setItem(KEY_LAST_EMAIL, email);
  } catch {}
}

export function getLastEmail(): string | null {
  try {
    return localStorage.getItem(KEY_LAST_EMAIL);
  } catch {
    return null;
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem(KEY_ACCESS);
  } catch {}
  try {
    sessionStorage.removeItem(KEY_ACCESS);
  } catch {}
  try {
    localStorage.removeItem(KEY_REFRESH);
  } catch {}
}

export function setLastActiveNow() {
  try {
    localStorage.setItem(KEY_LAST_ACTIVE, Date.now().toString());
  } catch {}
}

export function getLastActive(): number | null {
  try {
    const v = localStorage.getItem(KEY_LAST_ACTIVE);
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export const STORAGE_KEYS = {
  ACCESS: KEY_ACCESS,
  REFRESH: KEY_REFRESH,
  LAST_EMAIL: KEY_LAST_EMAIL,
  LAST_ACTIVE: KEY_LAST_ACTIVE,
};
