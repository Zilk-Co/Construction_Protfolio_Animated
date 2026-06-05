# Deployment Guide

GitHub: https://github.com/mustafazoro1/new_animated_zain

## Architecture
- **Frontend** (Vite + React) → **Vercel** — root: `artifacts/portfolio`
- **Backend**  (Express + Drizzle) → **Railway** — root: `artifacts/api-server`
- **Database** → **Neon PostgreSQL** (already provisioned)

---

## 1. Database (Neon) — shared

Set these env vars in **both** Vercel and Railway projects:

| Variable        | Value                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------- |
| `DATABASE_URL`  | `postgresql://neondb_owner:npg_YDm2KId5lqOe@ep-still-hill-aob7qrjb-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |

Push the schema once (locally):
```bash
$env:DATABASE_URL="<paste-above>"
pnpm --filter @workspace/db run push
```

---

## 2. Backend → Railway

1. Go to https://railway.com/new → **Deploy from GitHub repo** → pick `mustafazoro1/new_animated_zain`.
2. **Settings → Service:**
   - **Root Directory:** leave empty (monorepo root)
   - **Build Command:** `pnpm install --frozen-lockfile && pnpm --filter @workspace/api-server run build`
   - **Start Command:** `cd artifacts/api-server && node --enable-source-maps ./dist/index.mjs`
3. **Variables:**
   - `PORT` = `5000`  *(Railway injects `$PORT` automatically; the app reads it)*
   - `DATABASE_URL` = *(see table above)*
   - `SESSION_SECRET` = *(any long random string)*
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = *(a strong password)*
   - `NODE_ENV` = `production`
4. **Healthcheck:** `/api/healthz` (already configured in `railway.json`).
5. After deploy, copy the public URL, e.g. `https://api-server-production-xxxx.up.railway.app`.

---

## 3. Frontend → Vercel

1. Go to https://vercel.com/new → **Import** `mustafazoro1/new_animated_zain`.
2. **Project Settings:**
   - **Root Directory:** `artifacts/portfolio`
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm install --frozen-lockfile && pnpm --filter @workspace/portfolio run build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install --frozen-lockfile`
3. **Environment Variables:**
   - `VITE_API_BASE_URL` = *(your Railway API URL from step 2, **no trailing slash**, e.g. `https://api-server-production-xxxx.up.railway.app`)*
4. Deploy. The SPA rewrites (`vercel.json`) send all routes to `index.html`.

---

## 4. CORS / Cookies

The API uses `cors({ origin: true, credentials: true })`, so any Vercel domain is allowed automatically.

For the admin session cookie to work cross-site, the browser must accept `SameSite=None; Secure` cookies. If you see the admin login succeed but `/api/admin/me` returning 401, add a cookie config that sets `sameSite: "none"` when `NODE_ENV === "production"` (already true via `secure: true` in production). Update `artifacts/api-server/src/app.ts` if needed:

```ts
cookie: {
  secure: true,
  sameSite: "none",   // <-- add this for production
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 7,
},
```

---

## 5. Local dev (this machine)

```bash
$env:DATABASE_URL="postgresql://neondb_owner:npg_YDm2KId5lqOe@ep-still-hill-aob7qrjb-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
$env:PORT="5000"; $env:SESSION_SECRET="dev"; $env:ADMIN_USERNAME="admin"; $env:ADMIN_PASSWORD="admin123"; $env:NODE_ENV="development"
pnpm --filter @workspace/api-server run dev   # terminal 1

$env:PORT="5173"; $env:BASE_PATH="/"
pnpm --filter @workspace/portfolio run dev   # terminal 2
```

- Frontend: http://localhost:5173  (Vite proxies `/api` → `http://localhost:5000`)
- Admin:    http://localhost:5173/admin-panel  — login `admin / admin123`
- Health:   http://localhost:5000/api/healthz
