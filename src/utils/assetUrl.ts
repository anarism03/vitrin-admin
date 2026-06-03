import { API_URL } from "../services/apiUrl";

const getApiOrigin = () => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return "";
  }
};

export function resolveAssetUrl(url?: string | null) {
  if (!url) return "";

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const origin = getApiOrigin();
  if (!origin) return url;

  return new URL(url, origin).toString();
}
