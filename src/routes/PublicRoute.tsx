import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}
