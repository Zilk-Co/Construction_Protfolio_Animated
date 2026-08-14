import type { Request, Response, NextFunction } from "express";
import { createHash } from "node:crypto";

export const ADMIN_SESSION_MS = 60 * 60 * 1000;

export type AdminSession = Record<string, unknown> & {
  adminAuthenticated?: boolean;
  adminLoginAt?: number;
  passwordVersion?: number;
  deviceFingerprint?: string;
};

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export function adminSession(req: Request): AdminSession {
  return req.session as unknown as AdminSession;
}

/**
 * Compute a device fingerprint from the request's User-Agent and IP.
 * This binds the session to the originating browser/device context.
 * A copied session cookie from another device will have a different
 * fingerprint and will be rejected.
 */
export function computeDeviceFingerprint(req: Request): string {
  const ua = req.headers["user-agent"] ?? "";
  const ip = clientIp(req);
  return createHash("sha256").update(`${ua}|${ip}`).digest("hex").slice(0, 32);
}

export function isAdminSessionValid(req: Request): boolean {
  const s = adminSession(req);
  if (
    !s.adminAuthenticated ||
    typeof s.adminLoginAt !== "number" ||
    Date.now() - s.adminLoginAt > ADMIN_SESSION_MS
  ) {
    return false;
  }
  // Device binding: if a fingerprint is stored, it must match the current request
  if (typeof s.deviceFingerprint === "string") {
    const currentFingerprint = computeDeviceFingerprint(req);
    if (s.deviceFingerprint !== currentFingerprint) {
      return false;
    }
  }
  return true;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!isAdminSessionValid(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export function clientIp(req: Request): string {
  return String(req.ip ?? req.socket?.remoteAddress ?? "unknown");
}
