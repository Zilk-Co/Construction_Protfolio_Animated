import { Router, Request, Response } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { insertTestimonialSchema } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAdmin, isAdminSessionValid } from "../middlewares/auth";

const router = Router();

router.get("/testimonials", async (req: Request, res: Response) => {
  let published: boolean | undefined;
  if (!isAdminSessionValid(req)) {
    published = true;
  }
  const items = await db
    .select()
    .from(testimonialsTable)
    .where(published !== undefined ? eq(testimonialsTable.published, published) : undefined)
    .orderBy(asc(testimonialsTable.sortOrder));
  res.json(items);
});

router.post("/admin/testimonials", requireAdmin, async (req: Request, res: Response) => {
  const parsed = insertTestimonialSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
  const [item] = await db.insert(testimonialsTable).values(parsed.data).returning();
  res.status(201).json(item);
});

router.put("/admin/testimonials/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = insertTestimonialSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
  const [item] = await db.update(testimonialsTable).set(parsed.data).where(eq(testimonialsTable.id, id)).returning();
  if (!item) { res.status(404).json({ error: "Testimonial not found" }); return; }
  res.json(item);
});

router.delete("/admin/testimonials/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "Testimonial not found" }); return; }
  res.status(204).send();
});

export default router;
