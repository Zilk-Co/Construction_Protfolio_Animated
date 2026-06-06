import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@workspace/db";
import { pageContentTable } from "@workspace/db/schema";
import { UpdatePageContentBody, type PageContentItem, type PageContentPage, type PageContentResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/**
 * Seed/canonical content catalogue.
 * Adding a new field here is a no-op for the DB until an admin saves it
 * (the API returns the seed defaults for keys that have no row yet).
 */
export const PAGE_CONTENT_SEED: Array<{
  page: string;
  key: string;
  category: string;
  label: string;
  value: string;
  type: "text" | "textarea" | "richtext";
  sortOrder: number;
}> = [
  // ── Home ───────────────────────────────────────────────
  { page: "home", key: "intro_eyebrow", category: "Intro Strip", label: "Intro Eyebrow", value: "Zain Manzoor Co.", type: "text", sortOrder: 0 },
  { page: "home", key: "intro_title", category: "Intro Strip", label: "Intro Title", value: "Architecture & Construction", type: "text", sortOrder: 1 },
  { page: "home", key: "intro_body", category: "Intro Strip", label: "Intro Body", value: "A multi-disciplinary practice delivering landmark architectural and construction projects across the Middle East and South Asia since 2005.", type: "textarea", sortOrder: 2 },
  { page: "home", key: "intro_cta_label", category: "Intro Strip", label: "Intro CTA Label", value: "View All Projects", type: "text", sortOrder: 3 },
  { page: "home", key: "selected_works_title", category: "Selected Works", label: "Section Title", value: "Selected Works", type: "text", sortOrder: 0 },
  { page: "home", key: "selected_works_all_label", category: "Selected Works", label: "All Projects Link", value: "All Projects", type: "text", sortOrder: 1 },
  { page: "home", key: "machinery_eyebrow", category: "Machinery", label: "Section Eyebrow", value: "Equipment & Fleet", type: "text", sortOrder: 0 },
  { page: "home", key: "machinery_title", category: "Machinery", label: "Section Title", value: "Our Machinery", type: "text", sortOrder: 1 },
  { page: "home", key: "machinery_all_label", category: "Machinery", label: "All Equipment Link", value: "All Equipment", type: "text", sortOrder: 2 },
  { page: "home", key: "cta_title", category: "CTA", label: "CTA Title", value: "Have a project in mind?", type: "text", sortOrder: 0 },
  { page: "home", key: "cta_body", category: "CTA", label: "CTA Body", value: "Let us bring your vision to life.", type: "text", sortOrder: 1 },
  { page: "home", key: "cta_button_label", category: "CTA", label: "CTA Button", value: "Start a Conversation", type: "text", sortOrder: 2 },

  // ── Projects ───────────────────────────────────────────
  { page: "projects", key: "hero_eyebrow", category: "Hero", label: "Hero Eyebrow", value: "Portfolio", type: "text", sortOrder: 0 },
  { page: "projects", key: "hero_title", category: "Hero", label: "Hero Title", value: "All Projects", type: "text", sortOrder: 1 },
  { page: "projects", key: "hero_subtitle", category: "Hero", label: "Hero Subtitle", value: "Over two decades of landmark architectural and construction projects across Pakistan, the Middle East, and beyond.", type: "textarea", sortOrder: 2 },
  { page: "projects", key: "filter_all_label", category: "Filters", label: "All Types Button", value: "All Types", type: "text", sortOrder: 0 },
  { page: "projects", key: "empty_state", category: "Empty State", label: "No Results Message", value: "No projects match this filter", type: "text", sortOrder: 0 },
  { page: "projects", key: "count_label_singular", category: "Count", label: "Count Label (1)", value: "project", type: "text", sortOrder: 0 },
  { page: "projects", key: "count_label_plural", category: "Count", label: "Count Label (n)", value: "projects", type: "text", sortOrder: 1 },

  // ── Machinery ──────────────────────────────────────────
  { page: "machinery", key: "hero_eyebrow", category: "Hero", label: "Hero Eyebrow", value: "Equipment & Fleet", type: "text", sortOrder: 0 },
  { page: "machinery", key: "hero_title", category: "Hero", label: "Hero Title", value: "Machinery", type: "text", sortOrder: 1 },
  { page: "machinery", key: "hero_subtitle", category: "Hero", label: "Hero Subtitle", value: "Our fleet of specialised construction equipment supports projects across the region, from excavation and piling to concrete works and heavy lifting.", type: "textarea", sortOrder: 2 },
  { page: "machinery", key: "filter_all_label", category: "Filters", label: "All Equipment Button", value: "All Equipment", type: "text", sortOrder: 0 },
  { page: "machinery", key: "empty_state", category: "Empty State", label: "No Results Message", value: "No machinery match this filter", type: "text", sortOrder: 0 },

  // ── Contact ────────────────────────────────────────────
  { page: "contact", key: "hero_eyebrow", category: "Hero", label: "Hero Eyebrow", value: "Get in Touch", type: "text", sortOrder: 0 },
  { page: "contact", key: "hero_title", category: "Hero", label: "Hero Title", value: "Contact Us", type: "text", sortOrder: 1 },
  { page: "contact", key: "hero_subtitle", category: "Hero", label: "Hero Subtitle", value: "We deliver landmark architectural and construction projects across the Middle East and South Asia. Tell us about your project and we will be in touch within 24 hours.", type: "textarea", sortOrder: 2 },
  { page: "contact", key: "office_eyebrow", category: "Office", label: "Office Eyebrow", value: "Our Office", type: "text", sortOrder: 0 },
  { page: "contact", key: "office_city", category: "Office", label: "Office City", value: "Karachi", type: "text", sortOrder: 1 },
  { page: "contact", key: "direct_eyebrow", category: "Direct Contact", label: "Direct Contact Eyebrow", value: "Direct Contact", type: "text", sortOrder: 0 },
  { page: "contact", key: "message_eyebrow", category: "Form", label: "Form Eyebrow", value: "Send a Message", type: "text", sortOrder: 0 },
  { page: "contact", key: "message_success_title", category: "Form", label: "Success Title", value: "Message Received", type: "text", sortOrder: 1 },
  { page: "contact", key: "message_success_body", category: "Form", label: "Success Body", value: "We will get back to you within 24 hours.", type: "text", sortOrder: 2 },
  { page: "contact", key: "map_eyebrow", category: "Map", label: "Map Eyebrow", value: "Find Us", type: "text", sortOrder: 0 },
  { page: "contact", key: "map_caption", category: "Map", label: "Map Caption", value: "Hub River Road, Baldia, Naval Colony, Sector 2, Karachi", type: "text", sortOrder: 1 },

  // ── Footer ─────────────────────────────────────────────
  { page: "footer", key: "tagline", category: "Brand", label: "Brand Tagline", value: "Architecture and construction excellence since 2005.", type: "textarea", sortOrder: 0 },
  { page: "footer", key: "nav_heading", category: "Navigation", label: "Nav Heading", value: "Navigation", type: "text", sortOrder: 0 },
  { page: "footer", key: "location_heading", category: "Location", label: "Location Heading", value: "Location", type: "text", sortOrder: 0 },
  { page: "footer", key: "contact_heading", category: "Contact", label: "Contact Heading", value: "Contact Us", type: "text", sortOrder: 0 },
  { page: "footer", key: "contact_cta_label", category: "Contact", label: "Contact Button", value: "Get in Touch", type: "text", sortOrder: 1 },
  { page: "footer", key: "footer_tag_left", category: "Bottom Bar", label: "Bottom Bar — Left Tag", value: "Architecture & Construction", type: "text", sortOrder: 0 },
  { page: "footer", key: "footer_tag_right", category: "Bottom Bar", label: "Bottom Bar — Right Tag", value: "Karachi, Pakistan", type: "text", sortOrder: 1 },
];

async function loadContent(): Promise<PageContentResponse> {
  const rows = await db.select().from(pageContentTable).catch(() => []);
  const overrides = new Map<string, { value: string; updatedAt?: string }>();
  for (const r of rows) {
    overrides.set(`${r.page}::${r.key}`, { value: r.value, updatedAt: r.updatedAt?.toISOString() });
  }

  const grouped = new Map<string, PageContentPage>();
  for (const seed of PAGE_CONTENT_SEED) {
    if (!grouped.has(seed.page)) {
      grouped.set(seed.page, { page: seed.page, category: "", label: "", items: [] });
    }
    const override = overrides.get(`${seed.page}::${seed.key}`);
    const item: PageContentItem = {
      page: seed.page,
      key: seed.key,
      category: seed.category,
      label: seed.label,
      value: override?.value ?? seed.value,
      type: seed.type,
      sortOrder: seed.sortOrder,
      ...(override?.updatedAt ? { updatedAt: override.updatedAt } : {}),
    };
    grouped.get(seed.page)!.items.push(item);
  }

  // Order items within each page by sortOrder then label
  for (const page of grouped.values()) {
    page.items.sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
    const first = page.items[0];
    page.category = first ? first.category : "";
    page.label = page.page.charAt(0).toUpperCase() + page.page.slice(1);
  }

  return { pages: Array.from(grouped.values()) };
}

router.get("/page-content", async (_req, res): Promise<void> => {
  try {
    const data = await loadContent();
    res.json(data);
  } catch (err) {
    logger.error({ err }, "page-content GET failed");
    // Fall back to seed-only response so the site never breaks
    const grouped = new Map<string, PageContentPage>();
    for (const seed of PAGE_CONTENT_SEED) {
      if (!grouped.has(seed.page)) {
        grouped.set(seed.page, { page: seed.page, category: "", label: "", items: [] });
      }
      grouped.get(seed.page)!.items.push({
        page: seed.page,
        key: seed.key,
        category: seed.category,
        label: seed.label,
        value: seed.value,
        type: seed.type,
        sortOrder: seed.sortOrder,
      });
    }
    for (const page of grouped.values()) {
      page.items.sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
      const first = page.items[0];
      page.category = first ? first.category : "";
      page.label = page.page.charAt(0).toUpperCase() + page.page.slice(1);
    }
    res.json({ pages: Array.from(grouped.values()) });
  }
});

router.put("/admin/page-content", async (req, res): Promise<void> => {
  const session = req.session as unknown as Record<string, unknown> & { adminAuthenticated?: boolean; adminLoginAt?: number };
  if (!session.adminAuthenticated || !session.adminLoginAt || Date.now() - session.adminLoginAt > 60 * 60 * 1000) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = UpdatePageContentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Whitelist: only allow updates for known (page, key) pairs from the seed
  const allowedKeys = new Set(PAGE_CONTENT_SEED.map((s) => `${s.page}::${s.key}`));

  let updated = 0;
  for (const u of parsed.data.updates) {
    if (!allowedKeys.has(`${u.page}::${u.key}`)) {
      logger.warn({ page: u.page, key: u.key }, "rejected page-content update for unknown key");
      continue;
    }
    await db
      .insert(pageContentTable)
      .values({ page: u.page, key: u.key, value: u.value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [pageContentTable.page, pageContentTable.key],
        set: { value: u.value, updatedAt: new Date() },
      });
    updated += 1;
  }

  res.json({ success: true, updatedCount: updated });
});

export default router;
