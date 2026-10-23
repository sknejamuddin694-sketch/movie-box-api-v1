import http from "node:http";
import { Readable } from "node:stream";
import worker from "./src/index.js";

const port = Number(process.env.PORT || 8787);
const server = http.createServer(async (req, res) => {
  try {
    const host = req.headers.host || `127.0.0.1:${port}`;
    const url = new URL(req.url || "/", `http://${host}`);
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) headers.set(key, value.join(", "));
      else if (value != null) headers.set(key, value);
    }
    const request = new Request(url, { method: req.method, headers });
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
});
server.listen(port, "0.0.0.0", () => console.log(`MovieBox Worker adapter listening on 0.0.0.0:${port}`));
