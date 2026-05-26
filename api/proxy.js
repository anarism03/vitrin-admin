const BACKEND_URL = "http://161.97.154.119/intern-api/api";

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
  "content-encoding",
  "content-length",
  "transfer-encoding",
]);

const readRequestBody = async (req) => {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
};

export default async function handler(req, res) {
  try {
    const incomingUrl = new URL(req.url || "/", "https://vitrin-admin.vercel.app");
    const path = incomingUrl.searchParams.get("path") || "";
    incomingUrl.searchParams.delete("path");

    const backendUrl = new URL(`${BACKEND_URL.replace(/\/$/, "")}/${path}`);
    backendUrl.search = incomingUrl.searchParams.toString();

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (!blockedRequestHeaders.has(key.toLowerCase()) && value) {
        headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
    }

    const hasBody = !["GET", "HEAD"].includes(req.method || "GET");
    const backendResponse = await fetch(backendUrl, {
      method: req.method,
      headers,
      body: hasBody ? await readRequestBody(req) : undefined,
    });

    res.statusCode = backendResponse.status;
    backendResponse.headers.forEach((value, key) => {
      if (!blockedResponseHeaders.has(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    const responseBody = Buffer.from(await backendResponse.arrayBuffer());
    res.end(responseBody);
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
