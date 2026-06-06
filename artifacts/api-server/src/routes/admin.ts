import { Router, type IRouter } from "express";
import { AdminLoginBody, ChangeAdminPasswordBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME ?? "admin").trim();
let ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? "admin123").trim();

const ONE_HOUR_MS = 60 * 60 * 1000;

// Rate limiting: track failed login attempts per IP
const loginAttempts = new Map<string, { attempts: number; lockedUntil: number | null }>();

function getLockDuration(attempts: number): number {
  if (attempts >= 20) return 5 * 60 * 1000;  // 5 min after 20+ attempts
  if (attempts >= 10) return 60 * 1000;        // 1 min after 10 attempts
  return 0;
}

type AdminSession = Record<string, unknown> & {
  adminAuthenticated?: boolean;
  adminLoginAt?: number;
};

function isSessionValid(session: AdminSession): boolean {
  if (!session.adminAuthenticated) return false;
  if (!session.adminLoginAt) return false;
  if (Date.now() - session.adminLoginAt > ONE_HOUR_MS) return false;
  return true;
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? req.socket?.remoteAddress ?? "unknown";
  const now = Date.now();
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

  if (parsed.data.username !== ADMIN_USERNAME || parsed.data.password !== ADMIN_PASSWORD) {
    logger.warn({ ip, attempts: record.attempts + 1, expectedUser: ADMIN_USERNAME, gotUser: parsed.data.username, passwordLen: parsed.data.password.length }, "admin login failed");

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
  const session = req.session as unknown as AdminSession;
  session.adminAuthenticated = true;
  session.adminLoginAt = Date.now();
  // Session cookie: dies on browser close. 1-hour server-side expiry enforced by isSessionValid().
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

router.post("/admin/logout", async (req, res): Promise<void> => {
  const session = req.session as unknown as AdminSession;
  session.adminAuthenticated = false;
  session.adminLoginAt = undefined;
  req.session.destroy((err) => {
    if (err) {
      logger.error({ err }, "admin session destroy failed");
      res.status(500).json({ error: "Logout failed" });
      return;
    }
    res.clearCookie("connect.sid");
    res.json({ authenticated: false });
  });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const session = req.session as unknown as AdminSession;
  if (!isSessionValid(session)) {
    if (session.adminAuthenticated) {
      session.adminAuthenticated = false;
      session.adminLoginAt = undefined;
    }
    res.status(401).json({ authenticated: false });
    return;
  }
  const remaining = ONE_HOUR_MS - (Date.now() - (session.adminLoginAt ?? Date.now()));
  res.json({ authenticated: true, expiresInMs: remaining });
});

router.put("/admin/password", async (req, res): Promise<void> => {
  const session = req.session as unknown as AdminSession;
  if (!isSessionValid(session)) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const parsed = ChangeAdminPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (parsed.data.currentPassword !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }
  ADMIN_PASSWORD = parsed.data.newPassword;
  res.json({ success: true });
});

export default router;
