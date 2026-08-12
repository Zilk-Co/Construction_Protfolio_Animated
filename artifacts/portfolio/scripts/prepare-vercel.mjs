import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const vercelPath = path.resolve(__dirname, "..", "vercel.json");
// The Render backend is the default proxy target when VITE_API_BASE_URL is not
// set, so Vercel builds get a working /api rewrite even without dashboard env.
const DEFAULT_API_BASE_URL = "https://construction-portfolio-api.onrender.com";
const apiBaseUrl =
  process.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "") ?? DEFAULT_API_BASE_URL;

const config = JSON.parse(fs.readFileSync(vercelPath, "utf8"));

const rewrites = [];

if (apiBaseUrl) {
  rewrites.push({
    source: "/api/:path*",
    destination: `${apiBaseUrl}/api/:path*`,
  });
  console.log(`[prepare-vercel] Proxying /api/* -> ${apiBaseUrl}/api/*`);
} else {
  console.warn(
    "[prepare-vercel] VITE_API_BASE_URL is not set — /api requests will not reach the backend.",
  );
}

rewrites.push({
  source: "/(.*)",
  destination: "/index.html",
});

config.rewrites = rewrites;
fs.writeFileSync(vercelPath, `${JSON.stringify(config, null, 2)}\n`);
