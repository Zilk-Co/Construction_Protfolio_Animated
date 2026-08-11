import { Router, type IRouter } from "express";
import { eq, sql, desc } from "drizzle-orm";
import { db, servicesTable, projectsTable, categoriesTable, projectImagesTable } from "@workspace/db";
import { requireAdmin, isAdminSessionValid } from "../middlewares/auth";
import {
  ListServicesQueryParams,
  CreateServicesBody,
  GetServicesParams,
  UpdateServicesParams,
  UpdateServicesBody,
  ToggleServicesPublishParams,
  ToggleServicesPublishBody,
  DeleteServicesParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/services", async (req, res): Promise<void> => {
  const qp = ListServicesQueryParams.safeParse(req.query);
  if (!qp.success) {
    res.status(400).json({ error: qp.error.message });
    return;
  }
  let published = qp.data.published;
  if (published === undefined && !isAdminSessionValid(req)) {
    published = true;
  }
  const rows = await db
    .select({
      id: servicesTable.id,
      name: servicesTable.name,
      slug: servicesTable.slug,
      description: servicesTable.description,
      longDescription: servicesTable.longDescription,
      imageUrl: servicesTable.imageUrl,
      galleryImages: servicesTable.galleryImages,
      published: servicesTable.published,
      featured: servicesTable.featured,
      projectCount: sql<number>`count(${projectsTable.id})::int`,
    })
    .from(servicesTable)
    .leftJoin(projectsTable, eq(projectsTable.serviceId, servicesTable.id))
    .where(published !== undefined ? eq(servicesTable.published, published) : undefined)
    .groupBy(servicesTable.id)
    .orderBy(servicesTable.name);

  res.json(rows);
});

router.post("/services", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateServicesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(servicesTable).values(parsed.data).returning();
  res.status(201).json({ ...item });
});

router.get("/services/:slug", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const params = GetServicesParams.safeParse({ slug: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.select().from(servicesTable).where(eq(servicesTable.slug, params.data.slug));
  if (!item) {
    res.status(404).json({ error: "Service not found" });
    return;
  }

  const heroImageSq = db
    .select({ projectId: projectImagesTable.projectId, imageUrl: projectImagesTable.imageUrl })
    .from(projectImagesTable)
    .where(eq(projectImagesTable.isHero, true))
    .as("hero_images");

  const projectRows = await db
    .select({
      id: projectsTable.id,
      title: projectsTable.title,
      slug: projectsTable.slug,
      location: projectsTable.location,
      client: projectsTable.client,
      sector: projectsTable.sector,
      status: projectsTable.status,
      published: projectsTable.published,
      featured: projectsTable.featured,
      categoryId: projectsTable.categoryId,
      serviceId: projectsTable.serviceId,
      year: projectsTable.year,
      categoryName: categoriesTable.name,
      heroImage: heroImageSq.imageUrl,
    })
    .from(projectsTable)
    .leftJoin(categoriesTable, eq(projectsTable.categoryId, categoriesTable.id))
    .leftJoin(heroImageSq, eq(heroImageSq.projectId, projectsTable.id))
    .where(eq(projectsTable.serviceId, item.id))
    .orderBy(desc(projectsTable.createdAt));

  const projectCount = projectRows.length;
  const projects = projectRows
    .filter((p) => p.published)
    .map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      location: row.location,
      client: row.client,
      sector: row.sector,
      status: row.status,
      published: row.published,
      featured: row.featured,
      categoryId: row.categoryId,
      serviceId: row.serviceId,
      year: row.year,
      categoryName: row.categoryName,
      heroImage: row.heroImage,
    }));

  res.json({ ...item, projectCount, projects });
});

router.put("/services/:id/update", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateServicesParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateServicesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.update(servicesTable).set(parsed.data).where(eq(servicesTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(item);
});

router.patch("/services/:id/publish", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ToggleServicesPublishParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = ToggleServicesPublishBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.update(servicesTable).set({ published: parsed.data.published }).where(eq(servicesTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(item);
});

router.delete("/services/:id/delete", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteServicesParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(servicesTable).where(eq(servicesTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
