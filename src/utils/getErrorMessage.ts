import axios from "axios";

type ErrorResponse = {
  message?: string | string[];
  error?: string;
};

export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ErrorResponse | undefined;

    if (Array.isArray(data?.message)) {
      return data.message.join(", ");
    }

    return data?.message || data?.error || fallback || err.message;
  }

  if (err instanceof Error) {
    return err.message || fallback;
  }

  return fallback;
}

export function isEmailNotVerifiedError(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false;

  const status = err.response?.status;
  if (![400, 401, 403].includes(status || 0)) return false;

  const message = getErrorMessage(err, "").toLowerCase();

  return [
    "not verified",
    "unverified",
    "verify email",
    "email verification",
    "təsdiq",
    "təsdiqlənməyib",
  ].some((part) => message.includes(part));
}

export function unwrap<T = any>(responseData: any): T {
  return responseData?.data ?? responseData;
}

export function extractUser(responseData: any): any {
  const inner = unwrap<any>(responseData);

  if (!inner) return null;
  if (inner.user && typeof inner.user === "object") return inner.user;
  if (inner.id !== undefined || inner.email || inner.firstName) return inner;

  return null;
}
