import { pgTable, text, timestamp, primaryKey, index } from "drizzle-orm/pg-core";

/**
 * Page content table — stores editable text snippets used across the site.
 * Each row is identified by (page, key) and belongs to a category (e.g.
 * "Hero", "Intro", "CTA") so the admin editor can group them.
 */
export const pageContentTable = pgTable(
  "page_content",
  {
    page: text("page").notNull(),
    key: text("key").notNull(),
    category: text("category").notNull().default("General"),
    label: text("label").notNull(),
    value: text("value").notNull().default(""),
    type: text("type").notNull().default("text"),
    sortOrder: text("sort_order").notNull().default("0"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.page, table.key] }),
    pageIdx: index("page_content_page_idx").on(table.page),
  }),
);

export type PageContent = typeof pageContentTable.$inferSelect;
export type NewPageContent = typeof pageContentTable.$inferInsert;
