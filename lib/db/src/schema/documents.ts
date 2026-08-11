import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";

/**
 * Documents table — stores downloadable company documents (brochures,
 * certificates, policies, etc.) shown in the About page Documents section.
 * File contents are stored as base64 data URLs (same pattern as uploaded
 * images) so no object storage is required.
 */
export const documentsTable = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull().default("document"),
  fileType: text("file_type").notNull().default("application/pdf"),
  fileSize: integer("file_size").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type Document = typeof documentsTable.$inferSelect;
export type NewDocument = typeof documentsTable.$inferInsert;
