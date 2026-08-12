# Deployment Guide

GitHub: https://github.com/Zilk-Co/Construction_Protfolio_Animated

## Architecture
- **Frontend** (Vite + React) → **Vercel** — root: `artifacts/portfolio`
- **Backend**  (Express + Drizzle) → **Render** — root: `artifacts/api-server`
- **Database** → **Neon PostgreSQL** (already provisioned)

---

## 1. Database (Neon) — shared

Set these env vars in **both** Vercel and Render projects (fill in your real
Neon connection string — never commit it; copy the format from `.env.example`):

| Variable        | Value                 |
| --------------- | --------------------- |
| `DATABASE_URL`  | `postgresql://user:password@host/db?sslmode=require` |

Push the schema once (locally, from the repo root):
```bash
$env:DATABASE_URL="<your-neon-connection-string>"
pnpm --filter @workspace/db run push
```

Local `.env` (gitignored) is auto-loaded by the API server via
`artifacts/api-server/src/env.ts`, so local start scripts don't need to
hardcode credentials.

---

## 2. Backend → Render

Blueprint: `render.yaml` (one-click render.com deploy; also documented below).

1. Go to https://render.com → **New → Web Service → connect GitHub repo** → pick `Zilk-Co/Construction_Protfolio_Animated`.
2. **Settings:**
   - **Build Command:** `pnpm install --frozen-lockfile`
   - **Start Command:** `cd artifacts/api-server && npx tsx src/index.ts`
   - **Healthcheck:** `/api/healthz`
3. **Environment Variables:**
   - `NODE_ENV` = `production` *(required for secure admin session cookies)*
   - `DATABASE_URL` = *(see section 1)*
   - `SESSION_SECRET` = *(long random string — the server refuses to boot in production without it)*
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = *(a strong password, min 8 chars, no spaces — the server refuses to boot with a weak one; Render's `generateValue` can auto-create one, or set it explicitly, e.g. `admin123098`)*
4. After deploy, copy the public URL, e.g. `https://construction-portfolio-api.onrender.com`.

> Note: `render.yaml` uses `generateValue: true` for `ADMIN_PASSWORD`, so on the
> first deploy Render picks a random one. To use a fixed password, edit it in the
> Render dashboard **Environment** tab — the dashboard value wins over the blueprint.

---

## 3. Frontend → Vercel

1. Go to https://vercel.com/new → **Import** `Zilk-Co/Construction_Protfolio_Animated`.
2. **Project Settings:**
   - **Root Directory:** `artifacts/portfolio`
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm install --frozen-lockfile && pnpm --filter @workspace/portfolio run build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install --frozen-lockfile`
3. **Environment Variables:**
   - `VITE_API_BASE_URL` = *(your Render API URL from step 2, **no trailing slash**, e.g. `https://construction-portfolio-api.onrender.com`)*
   - The build script uses this value to proxy `/api/*` on Vercel to Render (same-origin), so admin cookies work without cross-site issues. If it's unset, the build falls back to the default `https://construction-portfolio-api.onrender.com`.
4. Deploy. After changing `VITE_API_BASE_URL`, **redeploy** — Vite bakes env vars at build time.

---

## 4. CORS / Cookies

The API uses a strict CORS allowlist (`ALLOWED_ORIGINS` plus Vercel / Railway /
Render preview domains and localhost). The frontend is deployed behind Vercel
rewrites that proxy `/api/*` to Render (`vercel.json` + `prepare-vercel.mjs`),
so all requests are effectively same-origin.

The admin session cookie is `HttpOnly; SameSite=Lax; Secure` in production
(`sessionCookieOptions` in `artifacts/api-server/src/middlewares/auth.ts`).
Because `/api` is proxied same-origin, the cookie flows correctly without
needing `SameSite=None`.

---

## 5. Local dev (this machine)

Create a `.env` at the repo root (copy `.env.example`, fill real values). The
API server loads it automatically, so no env vars need to be exported by hand:

```bash
# terminal 1 — backend (reads root .env)
pnpm --filter @workspace/api-server run dev

# terminal 2 — frontend (Vite proxies /api -> http://localhost:5000)
pnpm --filter @workspace/portfolio run dev
```

- Frontend: http://localhost:5173
- Admin:    http://localhost:5173/admin-panel
- Health:   http://localhost:5000/api/healthz

### Rebranding existing DB content (one-off)

If a database still contains the old brand string, run the idempotent migration:

```bash
$env:DATABASE_URL="<your-neon-connection-string>"
pnpm --filter @workspace/scripts run db:rebrand
```
