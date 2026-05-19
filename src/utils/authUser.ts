import type { AuthUser } from "../types/auth.type";

export function getUserDisplayName(user: AuthUser | null) {
  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || user?.name || user?.fullName || user?.email || "İstifadəçi";
}

export function getUserInitial(user: AuthUser | null) {
  return getUserDisplayName(user).charAt(0).toUpperCase();
}
