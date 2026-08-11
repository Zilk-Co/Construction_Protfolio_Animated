import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, projectImagesTable, projectsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";
import {
  ListProjectImagesParams,
  AddProjectImageParams,
  AddProjectImageBody,
  UpdateProjectImageParams,
  UpdateProjectImageBody,
  DeleteProjectImageParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/projects/:id/images", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ListProjectImagesParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const images = await db
    .select()
    .from(projectImagesTable)
    .where(eq(projectImagesTable.projectId, params.data.id))
    .orderBy(projectImagesTable.sortOrder);
  res.json(images);
});

router.post("/projects/:id/images", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = AddProjectImageParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = AddProjectImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [project] = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.id, params.data.id));
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  // If this is set as hero, unset all others first
  if (parsed.data.isHero) {
    await db
      .update(projectImagesTable)
      .set({ isHero: false })
      .where(eq(projectImagesTable.projectId, params.data.id));
  }

  const [image] = await db
    .insert(projectImagesTable)
    .values({
      projectId: params.data.id,
      imageUrl: parsed.data.imageUrl,
      isHero: parsed.data.isHero ?? false,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();
  res.status(201).json(image);
});

router.put("/projects/:id/images/:imageId", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const rawImageId = Array.isArray(req.params.imageId) ? req.params.imageId[0] : req.params.imageId;
  const params = UpdateProjectImageParams.safeParse({
    id: parseInt(rawId, 10),
    imageId: parseInt(rawImageId, 10),
  });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProjectImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // If setting as hero, unset all others first
  if (parsed.data.isHero === true) {
    await db
      .update(projectImagesTable)
      .set({ isHero: false })
      .where(eq(projectImagesTable.projectId, params.data.id));
  }

  const [image] = await db
    .update(projectImagesTable)
    .set(parsed.data)
    .where(
      and(
        eq(projectImagesTable.id, params.data.imageId),
        eq(projectImagesTable.projectId, params.data.id)
      )
    )
    .returning();

  if (!image) {
    res.status(404).json({ error: "Image not found" });
    return;
  }
  res.json(image);
});

router.delete("/projects/:id/images/:imageId", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const rawImageId = Array.isArray(req.params.imageId) ? req.params.imageId[0] : req.params.imageId;
  const params = DeleteProjectImageParams.safeParse({
    id: parseInt(rawId, 10),
    imageId: parseInt(rawImageId, 10),
  });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db
    .delete(projectImagesTable)
    .where(
      and(
        eq(projectImagesTable.id, params.data.imageId),
        eq(projectImagesTable.projectId, params.data.id)
      )
    );
  res.sendStatus(204);
});

export default router;
