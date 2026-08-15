import { Router, Request, Response } from "express";
import { db, mediaTable } from "@workspace/db";
import { insertMediaSchema } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/admin/media", requireAdmin, async (_req: Request, res: Response) => {
  const items = await db.select().from(mediaTable).orderBy(desc(mediaTable.createdAt));
  res.json(items);
});

router.post("/admin/media", requireAdmin, async (req: Request, res: Response) => {
  const parsed = insertMediaSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
  const [item] = await db.insert(mediaTable).values(parsed.data).returning();
  res.status(201).json(item);
});

router.delete("/admin/media/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(mediaTable).where(eq(mediaTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "Media not found" }); return; }
  res.status(204).send();
});

export default router;
