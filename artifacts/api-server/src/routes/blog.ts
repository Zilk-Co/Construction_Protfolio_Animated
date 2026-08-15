import { Router, Request, Response } from "express";
import { db, blogTable } from "@workspace/db";
import { insertBlogSchema } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAdmin, isAdminSessionValid } from "../middlewares/auth";

const router = Router();

router.get("/blog", async (req: Request, res: Response) => {
  const conditions = [];
  let published = req.query.published !== undefined ? req.query.published === "true" : undefined;

  if (published === undefined && !isAdminSessionValid(req)) {
    published = true;
  }
  if (published !== undefined) {
    conditions.push(eq(blogTable.published, published));
  }

  const posts = await db
    .select()
    .from(blogTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(blogTable.sortOrder), desc(blogTable.createdAt));

  res.json(posts);
});

router.get("/blog/:slug", async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const [post] = await db.select().from(blogTable).where(eq(blogTable.slug, slug));
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(post);
});

router.get("/admin/blog", requireAdmin, async (_req: Request, res: Response) => {
  const posts = await db
    .select()
    .from(blogTable)
    .orderBy(desc(blogTable.sortOrder), desc(blogTable.createdAt));
  res.json(posts);
});

router.post("/admin/blog", requireAdmin, async (req: Request, res: Response) => {
  const parsed = insertBlogSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.message });
    return;
  }
  const [post] = await db.insert(blogTable).values(parsed.data).returning();
  res.status(201).json(post);
});

router.put("/admin/blog/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = insertBlogSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.message });
    return;
  }
  const [updated] = await db.update(blogTable).set(parsed.data).where(eq(blogTable.id, id)).returning();
  if (!updated) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(updated);
});

router.delete("/admin/blog/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(blogTable).where(eq(blogTable.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.status(204).send();
});

export default router;
