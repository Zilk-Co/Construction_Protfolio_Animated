import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db/schema";

const router: IRouter = Router();

const DEFAULT_SETTINGS: Record<string, string> = {
  phone: "+92 21 3456 7890",
  email: "info@zainmanzoor.co",
  address: "House 53, Street 12, Naval Colony, Sector 2, Baldia, Hub River Road, Karachi, Pakistan",
  city: "Karachi",
  hours: "Mon–Sat, 9:00 AM – 6:00 PM PKT",
  heroSubtitle: "We deliver landmark architectural and construction projects across the Middle East and South Asia. Tell us about your project and we will be in touch within 24 hours.",
};

router.get("/settings", async (req, res): Promise<void> => {
  try {
    const rows = await db.select().from(settingsTable);
    const result: Record<string, string> = { ...DEFAULT_SETTINGS };
    for (const row of rows) {
      result[row.key] = row.value;
    }
    res.json(result);
  } catch {
    res.json(DEFAULT_SETTINGS);
  }
});

router.put("/admin/settings", async (req, res): Promise<void> => {
  if (!(req.session as Record<string, unknown>).adminAuthenticated) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const body = req.body as Record<string, string>;
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      await db
        .insert(settingsTable)
        .values({ key, value })
        .onConflictDoUpdate({ target: settingsTable.key, set: { value } });
    }
  }
  const rows = await db.select().from(settingsTable);
  const result: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    result[row.key] = row.value;
  }
  res.json(result);
});

export default router;
