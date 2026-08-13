import { Router, type IRouter } from "express";
import { createHash, timingSafeEqual } from "node:crypto";
import { AdminLoginBody, ChangeAdminPasswordBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import {
  adminSession,
  isAdminSessionValid,
  sessionCookieOptions,
  clientIp,
} from "../middlewares/auth";

const router: IRouter = Router();

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME ?? "admin").trim();
let ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? "admin123098").trim();

const ONE_HOUR_MS = 60 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 8;

// Password version: incremented on every password change. Sessions from before
// the change are automatically invalidated.
let passwordVersion = 0;

// Brute-force lockout per IP
const loginAttempts = new Map<string, { attempts: number; lockedUntil: number | null }>();

function pruneLoginAttempts(now: number): void {
  if (loginAttempts.size < 10_000) return;
  for (const [ip, rec] of loginAttempts) {
    if (!rec.lockedUntil && rec.attempts < 10) loginAttempts.delete(ip);
    else if (rec.lockedUntil && rec.lockedUntil < now) loginAttempts.delete(ip);
  }
}

function getLockDuration(attempts: number): number {
  if (attempts >= 20) return 5 * 60 * 1000;
  if (attempts >= 10) return 60 * 1000;
  return 0;
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const ip = clientIp(req);
  const now = Date.now();
  pruneLoginAttempts(now);
  const record = loginAttempts.get(ip) ?? { attempts: 0, lockedUntil: null };

  if (record.lockedUntil && now < record.lockedUntil) {
    const secondsLeft = Math.ceil((record.lockedUntil - now) / 1000);
    res.status(429).json({ authenticated: false, rateLimited: true, secondsLeft });
    return;
  }

  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userMatches = safeEqual(parsed.data.username, ADMIN_USERNAME);
  const passMatches = safeEqual(parsed.data.password, ADMIN_PASSWORD);
  if (!userMatches || !passMatches) {
    logger.warn({ ip, attempts: record.attempts + 1 }, "admin login failed");

    const newAttempts = record.attempts + 1;
    const lockDuration = getLockDuration(newAttempts);
    loginAttempts.set(ip, {
      attempts: newAttempts,
      lockedUntil: lockDuration > 0 ? now + lockDuration : null,
    });
    res.status(401).json({ authenticated: false });
    return;
  }

  loginAttempts.delete(ip);

  req.session.regenerate((regErr) => {
    if (regErr) {
      logger.error({ err: regErr }, "admin session regenerate failed");
      res.status(500).json({ error: "Session start failed" });
      return;
    }
    const session = adminSession(req);
    session.adminAuthenticated = true;
    session.adminLoginAt = Date.now();
    session.passwordVersion = passwordVersion;
    if (req.session.cookie) {
      req.session.cookie.maxAge = undefined;
    }
    req.session.save((err) => {
      if (err) {
        logger.error({ err }, "admin session save failed");
        res.status(500).json({ error: "Session save failed" });
        return;
      }
      res.json({ authenticated: true, expiresInMs: ONE_HOUR_MS });
    });
  });
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  const session = adminSession(req);
  session.adminAuthenticated = false;
  session.adminLoginAt = undefined;
  req.session.destroy((err) => {
    if (err) {
      logger.error({ err }, "admin session destroy failed");
      res.status(500).json({ error: "Logout failed" });
      return;
    }
    res.clearCookie("connect.sid", sessionCookieOptions);
    res.json({ authenticated: false });
  });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const session = adminSession(req);
  if (!isAdminSessionValid(req)) {
    if (session.adminAuthenticated) {
      session.adminAuthenticated = false;
      session.adminLoginAt = undefined;
    }
    res.status(401).json({ authenticated: false });
    return;
  }
  // Check if password was changed after this session was created
  if (typeof session.passwordVersion === "number" && session.passwordVersion !== passwordVersion) {
    session.adminAuthenticated = false;
    session.adminLoginAt = undefined;
    res.status(401).json({ authenticated: false, reason: "Password changed" });
    return;
  }
  const remaining = ONE_HOUR_MS - (Date.now() - (session.adminLoginAt ?? Date.now()));
  res.json({ authenticated: true, expiresInMs: remaining });
});

router.put("/admin/password", async (req, res): Promise<void> => {
  if (!isAdminSessionValid(req)) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const parsed = ChangeAdminPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { currentPassword, newPassword } = parsed.data;
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    res.status(400).json({ error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
    return;
  }
  if (!safeEqual(currentPassword, ADMIN_PASSWORD)) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }
  ADMIN_PASSWORD = newPassword;
  passwordVersion++;
  res.json({ success: true });
});

export default router;
