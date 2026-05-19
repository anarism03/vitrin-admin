import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser, LoginResponse } from "../types/auth.type";
import {
  clearAuthSession,
  isAuthStorageKey,
  readAccessToken,
  readAuthUser,
  saveAuthSession,
  saveAuthUser,
} from "./authStorage";

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loginWithTokens: (payload: LoginResponse) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => readAuthUser());
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    readAccessToken(),
  );

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (!isAuthStorageKey(event.key)) return;

      setAccessToken(readAccessToken());
      setUserState(readAuthUser());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const loginWithTokens = useCallback((payload: LoginResponse) => {
    saveAuthSession(payload);
    setAccessToken(payload.accessToken);
    setUserState(payload.user);
  }, []);

  const setUser = useCallback((nextUser: AuthUser | null) => {
    if (nextUser) {
      saveAuthUser(nextUser);
    } else {
      localStorage.removeItem("user");
    }

    setUserState(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setAccessToken(null);
    setUserState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken),
      loginWithTokens,
      logout,
      setUser,
    }),
    [accessToken, loginWithTokens, logout, setUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}
