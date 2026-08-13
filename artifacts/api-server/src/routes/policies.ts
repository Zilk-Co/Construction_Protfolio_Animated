import { Router, Request, Response } from "express";
import { db, policiesTable } from "@workspace/db";
import { insertPolicySchema } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/api/policies", async (req: Request, res: Response) => {
  const { category } = req.query;
  let query = db.select().from(policiesTable).orderBy(asc(policiesTable.sortOrder));
  if (category) {
    const policies = await db.select().from(policiesTable).where(eq(policiesTable.category, category as string)).orderBy(asc(policiesTable.sortOrder));
    res.json(policies);
    return;
  }
  const policies = await query;
  res.json(policies);
});

router.get("/api/policies/:slug", async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const [policy] = await db.select().from(policiesTable).where(eq(policiesTable.slug, slug));
  if (!policy) { res.status(404).json({ error: "Policy not found" }); return; }
  res.json(policy);
});

router.post("/api/admin/policies", requireAdmin, async (req: Request, res: Response) => {
  const parsed = insertPolicySchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data", details: parsed.error.issues }); return; }
  const [policy] = await db.insert(policiesTable).values(parsed.data).returning();
  res.status(201).json(policy);
});

router.put("/api/admin/policies/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = insertPolicySchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data", details: parsed.error.issues }); return; }
  const [policy] = await db.update(policiesTable).set(parsed.data).where(eq(policiesTable.id, id)).returning();
  if (!policy) { res.status(404).json({ error: "Policy not found" }); return; }
  res.json(policy);
});

router.delete("/api/admin/policies/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(policiesTable).where(eq(policiesTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "Policy not found" }); return; }
  res.status(204).send();
});

export default router;
