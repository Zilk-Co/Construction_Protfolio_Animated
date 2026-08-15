import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import multer from "multer";
import router from "./routes";
import { logger } from "./lib/logger";
import { requireAdmin, sessionCookieOptions } from "./middlewares/auth";

const app: Express = express();

// ─── Fail-fast configuration ────────────────────────────────────────────────
// Never run in production with a known/default secret or an empty admin
// password. Refuse to boot instead of silently using an insecure default.
if (process.env.NODE_ENV === "production") {
  const missing: string[] = [];
  if (!process.env.SESSION_SECRET) missing.push("SESSION_SECRET");
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.trim().length < 8) {
    missing.push("ADMIN_PASSWORD (min 8 chars)");
  }
  if (missing.length > 0) {
    throw new Error(
      `Refusing to start in production — missing/weak env vars: ${missing.join(", ")}. ` +
        "Set strong values for SESSION_SECRET and ADMIN_PASSWORD.",
    );
  }
}

// Trust the first hop only when running behind a real ingress (Railway edge in
// production). In local dev we trust nothing, so X-Forwarded-For can't be
// spoofed to bypass login rate limiting.
app.set(
  "trust proxy",
  process.env.NODE_ENV === "production" ? Number(process.env.TRUST_PROXY ?? 1) : 0,
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// ─── CORS: allowlist only ───────────────────────────────────────────────────
// The production topology proxies /api through Vercel (same-origin), so the
// API never needs to reflect arbitrary origins. Credentials are only sent to
// origins we explicitly trust (configured via ALLOWED_ORIGINS, plus Vercel /
// Railway / Render preview domains and local dev).
const configuredOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true; // non-browser / same-origin proxied requests
  if (configuredOrigins.includes(origin)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    return (
      host.endsWith(".vercel.app") ||
      host.endsWith(".railway.app") ||
      host.endsWith(".onrender.com")
    );
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin ?? undefined) ? (origin ?? false) : false);
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ─── Multer (memory storage → base64 data URLs) ─────────────────────────────
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_BYTES,
    files: 1,
    fields: 10,
    parts: 20,
  },
});

function sniffImageMime(buf: Buffer): string | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (
    buf.length >= 8 &&
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "image/png";
  }
  if (buf.length >= 4 && buf.subarray(0, 4).toString("latin1") === "GIF8") return "image/gif";
  if (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString("latin1") === "RIFF" &&
    buf.subarray(8, 12).toString("latin1") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

const DOCUMENT_SIGNATURES: Record<string, (buf: Buffer) => boolean> = {
  "application/pdf": (b) => b.length >= 4 && b.subarray(0, 4).toString("latin1") === "%PDF",
  "application/msword": (b) => b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])),
  "application/vnd.ms-excel": (b) => b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])),
  "application/vnd.ms-powerpoint": (b) => b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])),
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (b) => b.length >= 4 && b.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04])),
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (b) => b.length >= 4 && b.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04])),
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": (b) => b.length >= 4 && b.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04])),
  "text/plain": () => true,
};

const PgSession = ConnectPgSimple(session);

const pgSessionStore = process.env.DATABASE_URL
  ? new PgSession({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    })
  : undefined;

app.use(
  session({
    store: pgSessionStore,
    secret: process.env.SESSION_SECRET ?? "arch-portfolio-secret-dev",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      ...sessionCookieOptions,
      // Session cookie (dies on browser close). The 1-hour idle timeout is
      // enforced server-side in routes/admin.ts via adminLoginAt.
      maxAge: undefined,
    },
  }),
);

app.use("/api", router);

// Image upload endpoint (admin only, MIME-validated)
app.post("/api/upload", requireAdmin, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.has(req.file.mimetype)) {
      res.status(400).json({ error: "Only JPEG, PNG, GIF or WebP images are allowed." });
      return;
    }
    const sniffed = sniffImageMime(req.file.buffer);
    if (!sniffed || sniffed !== req.file.mimetype) {
      res.status(400).json({ error: "File content does not match the declared image type." });
      return;
    }
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    res.json({ imageUrl: base64 });
  } catch {
    res.status(500).json({ error: "Failed to process image" });
  }
});

// Document upload endpoint (admin only, MIME + signature validated)
app.post("/api/upload/document", requireAdmin, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const declared = req.file.mimetype || "application/octet-stream";
    const signatureCheck = DOCUMENT_SIGNATURES[declared];
    if (!signatureCheck || !signatureCheck(req.file.buffer)) {
      res.status(400).json({ error: "Unsupported document type. Use PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX or TXT." });
      return;
    }
    const base64 = `data:${declared};base64,${req.file.buffer.toString("base64")}`;
    res.json({
      fileUrl: base64,
      fileName: req.file.originalname || "document",
      fileType: declared,
      fileSize: req.file.size,
    });
  } catch {
    res.status(500).json({ error: "Failed to process document" });
  }
});

// ─── Security headers (helmet) ──────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
        "img-src": ["'self'", "data:", "blob:", "https:"],
        "connect-src": ["'self'"],
        "frame-src": ["'self'", "https://www.google.com", "https://maps.google.com"],
        "object-src": ["'none'"],
        "base-uri": ["'self'"],
        "frame-ancestors": ["'none'"],
        "form-action": ["'self'", "mailto:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// ─── JSON error handler ─────────────────────────────────────────────────────
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: `Upload error: ${err.message}` });
    return;
  }
  if (err && typeof err === "object" && "type" in err && err.type === "entity.too.large") {
    res.status(413).json({ error: "Request body too large." });
    return;
  }
  logger.error({ err }, "unhandled request error");
  res.status(500).json({ error: "Internal server error" });
});

export default app;
