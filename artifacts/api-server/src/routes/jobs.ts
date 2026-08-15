import { Router, Request, Response } from "express";
import { db, jobsTable } from "@workspace/db";
import { insertJobSchema } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAdmin, isAdminSessionValid } from "../middlewares/auth";

const router = Router();

router.get("/jobs", async (req: Request, res: Response) => {
  let published: boolean | undefined;
  if (!isAdminSessionValid(req)) {
    published = true;
  }
  const items = await db
    .select()
    .from(jobsTable)
    .where(published !== undefined ? eq(jobsTable.published, published) : undefined)
    .orderBy(asc(jobsTable.sortOrder));
  res.json(items);
});

router.get("/jobs/:slug", async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const [item] = await db.select().from(jobsTable).where(eq(jobsTable.slug, slug));
  if (!item) { res.status(404).json({ error: "Job not found" }); return; }
  res.json(item);
});

router.post("/admin/jobs", requireAdmin, async (req: Request, res: Response) => {
  const parsed = insertJobSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
  const [item] = await db.insert(jobsTable).values(parsed.data).returning();
  res.status(201).json(item);
});

router.put("/admin/jobs/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = insertJobSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
  const [item] = await db.update(jobsTable).set(parsed.data).where(eq(jobsTable.id, id)).returning();
  if (!item) { res.status(404).json({ error: "Job not found" }); return; }
  res.json(item);
});

router.delete("/admin/jobs/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(jobsTable).where(eq(jobsTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "Job not found" }); return; }
  res.status(204).send();
});

export default router;
