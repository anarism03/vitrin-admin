import type { AuthUser, LoginResponse } from "../types/auth.type";

const AUTH_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  user: "user",
} as const;

export function readAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.user);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function readAccessToken() {
  return localStorage.getItem(AUTH_KEYS.accessToken);
}

export function readRefreshToken() {
  return localStorage.getItem(AUTH_KEYS.refreshToken);
}

export function saveAuthSession(payload: LoginResponse) {
  localStorage.setItem(AUTH_KEYS.accessToken, payload.accessToken);
  localStorage.setItem(AUTH_KEYS.refreshToken, payload.refreshToken);
  localStorage.setItem(AUTH_KEYS.user, JSON.stringify(payload.user));
}

export function saveAccessToken(accessToken: string) {
  localStorage.setItem(AUTH_KEYS.accessToken, accessToken);
}

export function saveRefreshToken(refreshToken: string) {
  localStorage.setItem(AUTH_KEYS.refreshToken, refreshToken);
}

export function saveAuthUser(user: AuthUser) {
  localStorage.setItem(AUTH_KEYS.user, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_KEYS.accessToken);
  localStorage.removeItem(AUTH_KEYS.refreshToken);
  localStorage.removeItem(AUTH_KEYS.user);
}

export function isAuthStorageKey(key: string | null) {
  return Object.values(AUTH_KEYS).includes(
    key as (typeof AUTH_KEYS)[keyof typeof AUTH_KEYS],
  );
}
