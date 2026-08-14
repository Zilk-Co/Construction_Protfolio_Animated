import { Router, type IRouter } from "express";
import { eq, and, desc, sql } from "drizzle-orm";
import { db, projectsTable, categoriesTable, projectImagesTable, clientsTable } from "@workspace/db";
import { requireAdmin, isAdminSessionValid } from "../middlewares/auth";
import {
  ListProjectsQueryParams,
  CreateProjectBody,
  GetProjectParams,
  UpdateProjectParams,
  UpdateProjectBody,
  DeleteProjectParams,
  ToggleProjectPublishParams,
  ToggleProjectPublishBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function buildProjectSummary(row: {
  id: number;
  title: string;
  slug: string;
  location: string | null;
  client: string | null;
  clientId: number | null;
  clientName: string | null;
  sector: string | null;
  status: string;
  published: boolean;
  featured: boolean;
  categoryId: number | null;
  year: string | null;
  categoryName: string | null;
  heroImage: string | null;
}) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    location: row.location,
    client: row.client,
    clientId: row.clientId,
    clientName: row.clientName,
    sector: row.sector,
    status: row.status,
    published: row.published,
    featured: row.featured,
    categoryId: row.categoryId,
    year: row.year,
    categoryName: row.categoryName,
    heroImage: row.heroImage,
  };
}

router.get("/projects/featured", async (_req, res): Promise<void> => {
  const heroImageSq = db
    .select({ projectId: projectImagesTable.projectId, imageUrl: projectImagesTable.imageUrl })
    .from(projectImagesTable)
    .where(eq(projectImagesTable.isHero, true))
    .as("hero_images");

  const rows = await db
    .select({
      id: projectsTable.id,
      title: projectsTable.title,
      slug: projectsTable.slug,
      location: projectsTable.location,
      client: projectsTable.client,
      clientId: projectsTable.clientId,
      clientName: clientsTable.name,
      sector: projectsTable.sector,
      status: projectsTable.status,
      published: projectsTable.published,
      featured: projectsTable.featured,
      categoryId: projectsTable.categoryId,
      year: projectsTable.year,
      categoryName: categoriesTable.name,
      heroImage: heroImageSq.imageUrl,
    })
    .from(projectsTable)
    .leftJoin(categoriesTable, eq(projectsTable.categoryId, categoriesTable.id))
    .leftJoin(clientsTable, eq(projectsTable.clientId, clientsTable.id))
    .leftJoin(heroImageSq, eq(heroImageSq.projectId, projectsTable.id))
    .where(and(eq(projectsTable.published, true), eq(projectsTable.featured, true)))
    .orderBy(desc(projectsTable.createdAt))
    .limit(8);

  if (rows.length === 0) {
    const fallbackSq = db
      .select({ projectId: projectImagesTable.projectId, imageUrl: projectImagesTable.imageUrl })
      .from(projectImagesTable)
      .where(eq(projectImagesTable.isHero, true))
      .as("hero_images_fb");
    const fallback = await db
      .select({
        id: projectsTable.id,
        title: projectsTable.title,
        slug: projectsTable.slug,
        location: projectsTable.location,
        client: projectsTable.client,
        clientId: projectsTable.clientId,
        clientName: clientsTable.name,
        sector: projectsTable.sector,
        status: projectsTable.status,
        published: projectsTable.published,
        featured: projectsTable.featured,
      categoryId: projectsTable.categoryId,
      year: projectsTable.year,
      categoryName: categoriesTable.name,
        heroImage: fallbackSq.imageUrl,
      })
      .from(projectsTable)
      .leftJoin(categoriesTable, eq(projectsTable.categoryId, categoriesTable.id))
      .leftJoin(clientsTable, eq(projectsTable.clientId, clientsTable.id))
      .leftJoin(fallbackSq, eq(fallbackSq.projectId, projectsTable.id))
      .where(eq(projectsTable.published, true))
      .orderBy(desc(projectsTable.createdAt))
      .limit(8);
    res.json(fallback.map(buildProjectSummary));
    return;
  }
  res.json(rows.map(buildProjectSummary));
});

router.get("/projects", async (req, res): Promise<void> => {
  const qp = ListProjectsQueryParams.safeParse(req.query);
  if (!qp.success) {
    res.status(400).json({ error: qp.error.message });
    return;
  }

  const heroImageSq = db
    .select({ projectId: projectImagesTable.projectId, imageUrl: projectImagesTable.imageUrl })
    .from(projectImagesTable)
    .where(eq(projectImagesTable.isHero, true))
    .as("hero_images");

  const conditions = [];
  let published = qp.data.published;
  // Unpublished/draft rows are only visible to authenticated admins.
  if (published === undefined && !isAdminSessionValid(req)) {
    published = true;
  }
  if (published !== undefined) {
    conditions.push(eq(projectsTable.published, published));
  }
  if (qp.data.category_id !== undefined) {
    conditions.push(eq(projectsTable.categoryId, qp.data.category_id));
  }

  const rows = await db
    .select({
      id: projectsTable.id,
      title: projectsTable.title,
      slug: projectsTable.slug,
      location: projectsTable.location,
      client: projectsTable.client,
      clientId: projectsTable.clientId,
      clientName: clientsTable.name,
      sector: projectsTable.sector,
      status: projectsTable.status,
      published: projectsTable.published,
      featured: projectsTable.featured,
      categoryId: projectsTable.categoryId,
      year: projectsTable.year,
      categoryName: categoriesTable.name,
      heroImage: heroImageSq.imageUrl,
    })
    .from(projectsTable)
    .leftJoin(categoriesTable, eq(projectsTable.categoryId, categoriesTable.id))
    .leftJoin(clientsTable, eq(projectsTable.clientId, clientsTable.id))
    .leftJoin(heroImageSq, eq(heroImageSq.projectId, projectsTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(projectsTable.createdAt));

  res.json(rows.map(buildProjectSummary));
});

router.post("/projects", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db.insert(projectsTable).values(parsed.data).returning();
  const full = await getFullProject(project.id);
  res.status(201).json(full);
});

router.get("/projects/:slug", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const params = GetProjectParams.safeParse({ slug: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.slug, params.data.slug));

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const full = await getFullProject(project.id);
  res.json(full);
});

router.put("/projects/:id/update", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateProjectParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [updated] = await db
    .update(projectsTable)
    .set(parsed.data)
    .where(eq(projectsTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  const full = await getFullProject(updated.id);
  res.json(full);
});

router.patch("/projects/:id/publish", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ToggleProjectPublishParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = ToggleProjectPublishBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [updated] = await db
    .update(projectsTable)
    .set({ published: parsed.data.published })
    .where(eq(projectsTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  const full = await getFullProject(updated.id);
  res.json(full);
});

router.delete("/projects/:id/delete", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteProjectParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(projectsTable).where(eq(projectsTable.id, params.data.id));
  res.sendStatus(204);
});

async function getFullProject(id: number) {
  const [project] = await db
    .select({
      id: projectsTable.id,
      title: projectsTable.title,
      slug: projectsTable.slug,
      location: projectsTable.location,
      client: projectsTable.client,
      clientId: projectsTable.clientId,
      clientName: clientsTable.name,
      sector: projectsTable.sector,
      size: projectsTable.size,
      scope: projectsTable.scope,
      status: projectsTable.status,
      published: projectsTable.published,
      featured: projectsTable.featured,
      longDescription: projectsTable.longDescription,
      categoryId: projectsTable.categoryId,
      serviceId: projectsTable.serviceId,
      year: projectsTable.year,
      categoryName: categoriesTable.name,
    })
    .from(projectsTable)
    .leftJoin(categoriesTable, eq(projectsTable.categoryId, categoriesTable.id))
    .leftJoin(clientsTable, eq(projectsTable.clientId, clientsTable.id))
    .where(eq(projectsTable.id, id));

  if (!project) return null;

  const images = await db
    .select()
    .from(projectImagesTable)
    .where(eq(projectImagesTable.projectId, id))
    .orderBy(projectImagesTable.sortOrder);

  const heroImage = images.find((img) => img.isHero)?.imageUrl ?? images[0]?.imageUrl ?? null;

  return {
    ...project,
    heroImage,
    images,
  };
}

export default router;
