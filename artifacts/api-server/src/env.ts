import { config } from "dotenv";
import path from "node:path";

// Load the repo-root .env (local development only). Resolved relative to this
// file so it works whether run via tsx (src/) or the esbuild bundle (dist/):
// both sit three levels below the repo root (repo/artifacts/api-server/{src|dist}).
// Existing process env vars always win, so platform-injected secrets in
// production are never overridden by a stray .env file.
config({ path: path.resolve(import.meta.dirname, "../../../.env") });
