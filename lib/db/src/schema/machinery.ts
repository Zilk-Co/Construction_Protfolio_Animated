import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const machineryTable = pgTable("machinery", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category"),
  description: text("description"),
  longDescription: text("long_description"),
  imageUrl: text("image_url"),
  year: text("year"),
  condition: text("condition"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertMachinerySchema = createInsertSchema(machineryTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMachinery = z.infer<typeof insertMachinerySchema>;
export type Machinery = typeof machineryTable.$inferSelect;
