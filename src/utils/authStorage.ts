import type { AuthSession, AuthTokens, AuthUser } from "../types/auth.type";

const KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  userEmail: "userEmail",
  authUser: "authUser",
} as const;

const readUser = (): AuthUser | null => {
  const value = localStorage.getItem(KEYS.authUser);
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    localStorage.removeItem(KEYS.authUser);
    return null;
  }
};

export const getAuthTokens = (): AuthTokens | null => {
  const accessToken = localStorage.getItem(KEYS.accessToken);
  const refreshToken = localStorage.getItem(KEYS.refreshToken);

  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
};

export const getStoredAuthSession = (): AuthSession | null => {
  const tokens = getAuthTokens();
  if (!tokens) return null;

  return {
    ...tokens,
    user: readUser(),
    userEmail: localStorage.getItem(KEYS.userEmail) || "",
  };
};

export const saveAuthTokens = (tokens: AuthTokens) => {
  localStorage.setItem(KEYS.accessToken, tokens.accessToken);
  localStorage.setItem(KEYS.refreshToken, tokens.refreshToken);
};

export const saveAuthSession = (session: AuthSession) => {
  saveAuthTokens(session);
  localStorage.setItem(KEYS.userEmail, session.userEmail);

  if (session.user) {
    saveAuthUser(session.user);
  } else {
    localStorage.removeItem(KEYS.authUser);
  }
};

export const saveAuthUser = (user: AuthUser) => {
  localStorage.setItem(KEYS.authUser, JSON.stringify(user));
};

export const clearAuthStorage = () => {
  localStorage.removeItem(KEYS.accessToken);
  localStorage.removeItem(KEYS.refreshToken);
  localStorage.removeItem(KEYS.userEmail);
  localStorage.removeItem(KEYS.authUser);
};
