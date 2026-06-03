const PROXY_API_URL = "/intern-api/api";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() || PROXY_API_URL;

const isHttpsPage = () =>
  typeof window !== "undefined" && window.location.protocol === "https:";

const isInsecureRemoteApi = (url: string) => /^http:\/\//i.test(url);

export const API_URL =
  isHttpsPage() && isInsecureRemoteApi(configuredApiUrl)
    ? PROXY_API_URL
    : configuredApiUrl;

