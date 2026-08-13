import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db/schema";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

const MAP_EMBED_DEFAULT =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14481.167963498!2d67.0457!3d24.8147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f7a8c4c2f8f%3A0x0!2sSultan+Arcade%2C+Lower+Gizri%2C+Karachi!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s";

export const DEFAULT_SETTINGS: Record<string, string> = {
  phone: "+92 334 2976686",
  email: "azharkhaki2005@gmail.com",
  address: "3rd Floor, Sultan Arcade, Lower Gizri, Karachi",
  city: "Karachi",
  hours: "Mon–Sat, 9:00 AM – 6:00 PM PKT",
  heroSubtitle: "We deliver landmark architectural and construction projects across Pakistan and beyond. Tell us about your project and we will be in touch within 24 hours.",
  ceoName: "Azhar",
  ceoTitle: "Chief Executive Officer",
  ceoQuote: "Construction is more than assembling materials; it is the physical manifestation of vision, ambition, and progress. At Azhar Engineering (Pvt.) Ltd, we take immense pride in our role as nation-builders, delivering projects that serve as catalysts for economic and social development.",
  ceoImage: "/ceo.jpg",
  mapEmbedUrl: MAP_EMBED_DEFAULT,
  companyName: "Azhar Engineering",
  copyright: "",
  facebook: "",
  linkedin: "",
  instagram: "",
  twitter: "",
  youtube: "",
};

const MAX_VALUE_LENGTH = 20_000;

async function mergeSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(settingsTable);
  const result: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

router.get("/settings", async (_req, res): Promise<void> => {
  try {
    res.json(await mergeSettings());
  } catch {
    res.json({ ...DEFAULT_SETTINGS });
  }
});

router.put("/admin/settings", requireAdmin, async (req, res): Promise<void> => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const updates: Array<{ key: string; value: string }> = [];
  for (const [key, raw] of Object.entries(body)) {
    if (!(key in DEFAULT_SETTINGS)) {
      continue; // whitelist only — block arbitrary key creation
    }
    const value = typeof raw === "string" ? raw : String(raw ?? "");
    if (value.length > MAX_VALUE_LENGTH) {
      res.status(400).json({ error: `Setting "${key}" is too long.` });
      return;
    }
    updates.push({ key, value });
  }
  for (const u of updates) {
    await db
      .insert(settingsTable)
      .values(u)
      .onConflictDoUpdate({ target: settingsTable.key, set: { value: u.value } });
  }
  res.json(await mergeSettings());
});

export default router;
