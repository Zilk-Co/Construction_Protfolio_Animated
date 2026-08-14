import { Router, Request, Response } from "express";
import { db, clientsTable } from "@workspace/db";
import { insertClientSchema } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/clients", async (_req: Request, res: Response) => {
  const clients = await db.select().from(clientsTable).orderBy(asc(clientsTable.sortOrder));
  res.json(clients);
});

router.get("/clients/:slug", async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const [client] = await db.select().from(clientsTable).where(eq(clientsTable.slug, slug));
  if (!client) { res.status(404).json({ error: "Client not found" }); return; }
  res.json(client);
});

router.post("/admin/clients", requireAdmin, async (req: Request, res: Response) => {
  const parsed = insertClientSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
  const [client] = await db.insert(clientsTable).values(parsed.data).returning();
  res.status(201).json(client);
});

router.put("/admin/clients/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = insertClientSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
  const [client] = await db.update(clientsTable).set(parsed.data).where(eq(clientsTable.id, id)).returning();
  if (!client) { res.status(404).json({ error: "Client not found" }); return; }
  res.json(client);
});

router.delete("/admin/clients/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(clientsTable).where(eq(clientsTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "Client not found" }); return; }
  res.status(204).send();
});

export default router;
