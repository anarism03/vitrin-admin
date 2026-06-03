import http from "node:http";

const BACKEND_HOST = "161.97.154.119";
const BACKEND_PREFIXES = {
  api: "/intern-api/api",
  uploads: "/intern-api/uploads",
};

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
    const backendPrefix = BACKEND_PREFIXES[target] || BACKEND_PREFIXES.api;

    incomingUrl.searchParams.delete("target");
    incomingUrl.searchParams.delete("path");

    const body = ["GET", "HEAD"].includes(req.method || "GET")
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
          method: req.method,
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
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    res.end(
      JSON.stringify({
        message: "Proxy request failed",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }
}
