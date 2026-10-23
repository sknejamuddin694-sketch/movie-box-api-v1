import { Readable } from "node:stream";
import worker from "../src/index.js";

export default async function handler(req, res) {
  try {
    const incoming = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
    const pathname = incoming.pathname.replace(/^\/api(?=\/|$)/, "") || "/";
    const target = new URL(pathname + incoming.search, incoming.origin);
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) headers.set(key, value.join(", "));
      else if (value != null) headers.set(key, value);
    }

    const hasBody = !["GET", "HEAD"].includes(req.method || "GET");
    const request = new Request(target, {
      method: req.method,
      headers,
      body: hasBody ? req : undefined,
      ...(hasBody ? { duplex: "half" } : {}),
    });
    const response = await worker.fetch(request);
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (!response.body) return res.end();
    Readable.fromWeb(response.body).pipe(res);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error?.message || "Internal error" }));
  }
}
