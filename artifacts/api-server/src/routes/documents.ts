import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, documentsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

const MAX_TITLE = 200;
const MAX_DESC = 1000;

function parseBody(body: unknown): {
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
} | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const title = typeof b.title === "string" ? b.title.trim().slice(0, MAX_TITLE) : "";
  const fileUrl = typeof b.fileUrl === "string" ? b.fileUrl.trim() : "";
  if (!title || !fileUrl) return null;
  return {
    title,
    description: typeof b.description === "string" ? b.description.trim().slice(0, MAX_DESC) : "",
    fileUrl,
    fileName: typeof b.fileName === "string" ? b.fileName.trim().slice(0, 255) : "document",
    fileType: typeof b.fileType === "string" ? b.fileType.trim().slice(0, 100) : "application/octet-stream",
    fileSize: Number.isFinite(Number(b.fileSize)) ? Math.max(0, Math.floor(Number(b.fileSize))) : 0,
  };
}

router.get("/documents", async (_req, res): Promise<void> => {
  try {
    const rows = await db
      .select()
      .from(documentsTable)
      .orderBy(asc(documentsTable.sortOrder), asc(documentsTable.id));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to load documents" });
  }
});

router.post("/admin/documents", requireAdmin, async (req, res): Promise<void> => {
  const data = parseBody(req.body);
  if (!data) {
    res.status(400).json({ error: "Title and file are required." });
    return;
  }
  const [row] = await db.insert(documentsTable).values(data).returning();
  res.status(201).json(row);
});

router.put("/admin/documents/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid document id" });
    return;
  }
  const data = parseBody(req.body);
  if (!data) {
    res.status(400).json({ error: "Title and file are required." });
    return;
  }
  const [row] = await db.update(documentsTable).set(data).where(eq(documentsTable.id, id)).returning();
  if (!row) {
    res.status(404).json({ error: "Document not found" });
    return;
  }
  res.json(row);
});

router.delete("/admin/documents/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid document id" });
    return;
  }
  await db.delete(documentsTable).where(eq(documentsTable.id, id));
  res.sendStatus(204);
});

export default router;
