import http from "node:http";

const BACKEND_HOST = "161.97.154.119";
const BACKEND_PREFIXES = {
  api: "/intern-api/api",
  uploads: "/intern-api/uploads",
};

const API_ALLOWLIST = [
  {
    methods: ["POST"],
    pattern: /^auth\/(register|verify-email|resend-verification-code|login|logout|refresh)$/,
  },
  { methods: ["GET"], pattern: /^auth\/profile$/ },
  { methods: ["GET"], pattern: /^dashboard\/stats$/ },
  { methods: ["GET", "POST"], pattern: /^products$/ },
  { methods: ["GET", "PATCH", "DELETE"], pattern: /^products\/[^/]+$/ },
  { methods: ["GET"], pattern: /^categories\/options$/ },
  { methods: ["GET", "POST"], pattern: /^categories$/ },
  { methods: ["GET", "PATCH", "DELETE"], pattern: /^categories\/[^/]+$/ },
  { methods: ["POST"], pattern: /^uploads\/product-images$/ },
];

const UPLOADS_ALLOWLIST = [
  { methods: ["GET", "HEAD"], pattern: /^products\/[A-Za-z0-9._/-]+$/ },
];

export const config = {
  api: {
    bodyParser: false,
  },
};

const blockedRequestHeaders = new Set([
  "host",
  "connection",
  "content-length",
]);

const blockedResponseHeaders = new Set([
  "connection",
  "content-length",
  "transfer-encoding",
]);

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.end(JSON.stringify(payload));
};

const normalizeMethod = (method) => (method || "GET").toUpperCase();

const isSafePath = (path) =>
  Boolean(path) && !path.includes("..") && !path.startsWith("/");

const isAllowedByRules = (rules, method, path) =>
  rules.some(
    (rule) => rule.methods.includes(method) && rule.pattern.test(path),
  );

const isAllowedRequest = (target, method, path) => {
  if (method === "OPTIONS") return true;
  if (!isSafePath(path)) return false;

  if (target === "uploads") {
    return isAllowedByRules(UPLOADS_ALLOWLIST, method, path);
  }

  if (target === "api") {
    return isAllowedByRules(API_ALLOWLIST, method, path);
  }

  return false;
};

const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

export default async function handler(req, res) {
  try {
    const incomingUrl = new URL(req.url || "/", "https://vitrin-admin.vercel.app");
    const target = incomingUrl.searchParams.get("target") || "api";
    const path = incomingUrl.searchParams.get("path") || "";
    const method = normalizeMethod(req.method);
    const backendPrefix = BACKEND_PREFIXES[target] || BACKEND_PREFIXES.api;

    if (method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (!isAllowedRequest(target, method, path)) {
      sendJson(res, 404, { message: "Proxy route is not allowed" });
      return;
    }

    incomingUrl.searchParams.delete("target");
    incomingUrl.searchParams.delete("path");

    const body = ["GET", "HEAD"].includes(method)
      ? null
      : await readRequestBody(req);

    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (!blockedRequestHeaders.has(key.toLowerCase()) && value) {
        headers[key] = Array.isArray(value) ? value.join(", ") : value;
      }
    }

    if (body) {
      headers["content-length"] = String(body.length);
    }

    const backendPath = `${backendPrefix}/${path}${incomingUrl.search}`;

    const backendResponse = await new Promise((resolve, reject) => {
      const proxyReq = http.request(
        {
          hostname: BACKEND_HOST,
          port: 80,
          path: backendPath,
          method,
          headers,
        },
        (proxyRes) => {
          const chunks = [];

          proxyRes.on("data", (chunk) => chunks.push(chunk));
          proxyRes.on("end", () => {
            resolve({
              statusCode: proxyRes.statusCode || 500,
              headers: proxyRes.headers,
              body: Buffer.concat(chunks),
            });
          });
        },
      );

      proxyReq.on("error", reject);
      proxyReq.setTimeout(20000, () => {
        proxyReq.destroy(new Error("Backend request timed out"));
      });

      if (body) proxyReq.write(body);
      proxyReq.end();
    });

    res.statusCode = backendResponse.statusCode;
    for (const [key, value] of Object.entries(backendResponse.headers)) {
      if (!blockedResponseHeaders.has(key.toLowerCase()) && value) {
        res.setHeader(key, value);
      }
    }
    res.end(backendResponse.body);
  } catch (error) {
    sendJson(res, 502, {
      message: "Proxy request failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
