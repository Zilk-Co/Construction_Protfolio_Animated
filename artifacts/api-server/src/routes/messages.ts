import { Router, Request, Response } from "express";
import { db, messagesTable } from "@workspace/db";
import { insertMessageSchema } from "@workspace/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { sendContactNotification } from "../lib/mailer";

const router = Router();

router.post("/messages", async (req: Request, res: Response) => {
  const parsed = insertMessageSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
  const [message] = await db.insert(messagesTable).values(parsed.data).returning();
  sendContactNotification(parsed.data).catch(() => {});
  res.status(201).json({ id: message.id, success: true });
});

router.get("/admin/messages", requireAdmin, async (_req: Request, res: Response) => {
  const messages = await db.select().from(messagesTable).orderBy(desc(messagesTable.createdAt));
  res.json(messages);
});

router.get("/admin/messages/stats", requireAdmin, async (_req: Request, res: Response) => {
  const [total] = await db.select({ value: count() }).from(messagesTable);
  const [unread] = await db.select({ value: count() }).from(messagesTable).where(eq(messagesTable.read, false));
  res.json({ total: total.value, unread: unread.value });
});

router.put("/admin/messages/:id/read", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [message] = await db.update(messagesTable).set({ read: true }).where(eq(messagesTable.id, id)).returning();
  if (!message) { res.status(404).json({ error: "Message not found" }); return; }
  res.json(message);
});

router.delete("/admin/messages/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(messagesTable).where(eq(messagesTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "Message not found" }); return; }
  res.status(204).send();
});

export default router;
