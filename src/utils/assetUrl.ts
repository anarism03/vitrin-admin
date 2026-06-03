import { API_URL } from "../services/apiUrl";

const INTERN_API_PREFIX = "/intern-api";
const DEFAULT_BACKEND_ORIGIN = "http://161.97.154.119";

const getBackendAssetOrigin = () => {
  const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() || "";

  try {
    return configuredApiUrl ? new URL(configuredApiUrl).origin : DEFAULT_BACKEND_ORIGIN;
  } catch {
    return DEFAULT_BACKEND_ORIGIN;
  }
};

const getApiOrigin = () => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return "";
  }
};

export const normalizeAssetPath = (url: string) => {
  if (url.startsWith("/")) {
    return url.startsWith("/uploads/")
      ? `${INTERN_API_PREFIX}${url}`
      : url;
  }

  if (url.startsWith("intern-api/")) {
    return `/${url}`;
  }

  if (url.startsWith("uploads/")) {
    return `${INTERN_API_PREFIX}/${url}`;
  }

  return url;
};

export function getUploadedAssetPath(url?: string | null) {
  if (!url) return "";

  if (/^https?:\/\//i.test(url)) {
    try {
      const parsedUrl = new URL(url);
      return normalizeAssetPath(
        `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`,
      );
    } catch {
      return url;
    }
  }

  return normalizeAssetPath(url);
}

export function getUploadedAssetUrl(url?: string | null) {
  const assetPath = getUploadedAssetPath(url);
  if (!assetPath) return "";

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return new URL(assetPath, getBackendAssetOrigin()).toString();
}

export function resolveAssetUrl(url?: string | null) {
  if (!url) return "";

  if (/^https?:\/\//i.test(url)) {
    if (window.location.protocol === "https:" && /^http:\/\//i.test(url)) {
      const parsedUrl = new URL(url);
      return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    }

    return url;
  }

  const assetPath = normalizeAssetPath(url);
  const origin = getApiOrigin();
  if (!origin) return assetPath;

  return new URL(assetPath, origin).toString();
}
