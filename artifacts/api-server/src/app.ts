import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import multer from "multer";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.set("trust proxy", 1);

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
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for memory storage (for base64 conversion)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

app.use(
  session({
    secret: (process.env as any).SESSION_SECRET ?? "arch-portfolio-secret-dev",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: (process.env as any).NODE_ENV === "production",
      sameSite: (process.env as any).NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }),
);

app.use("/api", router);

// Image upload endpoint
app.post("/api/upload", upload.single('image'), (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert buffer to base64
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    res.json({ imageUrl: base64 });
  } catch (error) {
    res.status(500).json({ error: "Failed to process image" });
  }
});

export default app;
