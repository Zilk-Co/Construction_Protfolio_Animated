import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, machineryTable } from "@workspace/db";
import {
  ListMachineryQueryParams,
  CreateMachineryBody,
  GetMachineryParams,
  UpdateMachineryParams,
  UpdateMachineryBody,
  ToggleMachineryPublishParams,
  ToggleMachineryPublishBody,
  DeleteMachineryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/machinery", async (req, res): Promise<void> => {
  const qp = ListMachineryQueryParams.safeParse(req.query);
  if (!qp.success) {
    res.status(400).json({ error: qp.error.message });
    return;
  }
  const rows = await db
    .select()
    .from(machineryTable)
    .where(qp.data.published !== undefined ? eq(machineryTable.published, qp.data.published) : undefined)
    .orderBy(machineryTable.name);

  res.json(rows.map(r => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    category: r.category,
    description: r.description,
    longDescription: r.longDescription,
    imageUrl: r.imageUrl,
    year: r.year,
    condition: r.condition,
    published: r.published,
  })));
});

router.post("/machinery", async (req, res): Promise<void> => {
  const parsed = CreateMachineryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(machineryTable).values(parsed.data).returning();
  res.status(201).json({ ...item, imageUrl: item.imageUrl });
});

router.get("/machinery/:slug", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const params = GetMachineryParams.safeParse({ slug: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.select().from(machineryTable).where(eq(machineryTable.slug, params.data.slug));
  if (!item) {
    res.status(404).json({ error: "Machinery not found" });
    return;
  }
  res.json({ ...item });
});

router.put("/machinery/:id/update", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateMachineryParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateMachineryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.update(machineryTable).set(parsed.data).where(eq(machineryTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Machinery not found" });
    return;
  }
  res.json({ ...item, imageUrl: item.imageUrl });
});

router.patch("/machinery/:id/publish", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ToggleMachineryPublishParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = ToggleMachineryPublishBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.update(machineryTable).set({ published: parsed.data.published }).where(eq(machineryTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Machinery not found" });
    return;
  }
  res.json({ ...item, imageUrl: item.imageUrl });
});

router.delete("/machinery/:id/delete", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteMachineryParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(machineryTable).where(eq(machineryTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
