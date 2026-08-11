import type { Request, Response, NextFunction } from "express";

export const ADMIN_SESSION_MS = 60 * 60 * 1000;

export type AdminSession = Record<string, unknown> & {
  adminAuthenticated?: boolean;
  adminLoginAt?: number;
};

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export function adminSession(req: Request): AdminSession {
  return req.session as unknown as AdminSession;
}

export function isAdminSessionValid(req: Request): boolean {
  const s = adminSession(req);
  return Boolean(
    s.adminAuthenticated &&
      typeof s.adminLoginAt === "number" &&
      Date.now() - s.adminLoginAt <= ADMIN_SESSION_MS,
  );
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
