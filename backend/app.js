import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sendJson } from "./http/json.js";
import { routeRequest } from "./routes/router.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "../public");
const HAS_STATIC = fs.existsSync(PUBLIC_DIR);

const MIME = {
  ".html": "text/html",
  ".js":   "application/javascript",
  ".css":  "text/css",
  ".json": "application/json",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".woff2":"font/woff2",
  ".woff": "font/woff",
  ".ttf":  "font/ttf",
};

function serveStatic(req, res) {
  const urlPath = new URL(req.url, "http://localhost").pathname;

  // Never serve static for /api/* routes
  if (urlPath.startsWith("/api/")) return false;

  if (!HAS_STATIC) return false;

  const ext = path.extname(urlPath);
  const filePath = path.join(PUBLIC_DIR, urlPath);

  // If file exists, serve it
  if (ext && fs.existsSync(filePath)) {
    const mime = MIME[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": mime });
    fs.createReadStream(filePath).pipe(res);
    return true;
  }

  // SPA fallback: serve index.html for any non-file route
  const indexPath = path.join(PUBLIC_DIR, "index.html");
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(indexPath).pipe(res);
    return true;
  }

  return false;
}

export function createApp() {
  return http.createServer(async (req, res) => {
    // Add CORS headers
    const origin = process.env.CORS_ORIGIN || "*";
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,x-company-id,x-user-id,x-user-name,x-user-role,x-pc-number");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Try to serve static files first
    if (serveStatic(req, res)) return;

    // Otherwise route to API
    try {
      const result = await routeRequest(req);
      sendJson(res, result.status, result.body);
    } catch (error) {
      sendJson(res, error.statusCode || 500, {
        error: error.message || "Server error"
      });
    }
  });
}
