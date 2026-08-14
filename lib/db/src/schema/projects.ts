import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";
import { servicesTable } from "./services";
import { clientsTable } from "./clients";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categoriesTable.id, { onDelete: "set null" }),
  serviceId: integer("service_id").references(() => servicesTable.id, { onDelete: "set null" }),
  clientId: integer("client_id").references(() => clientsTable.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  location: text("location"),
  client: text("client"),
  sector: text("sector"),
  size: text("size"),
  scope: text("scope"),
  status: text("status").notNull().default("In Progress"),
  year: text("year"),
  longDescription: text("long_description"),
  published: boolean("published").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
