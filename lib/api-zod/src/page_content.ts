import { z } from "zod";

export const PageContentItem = z.object({
  page: z.string().min(1).max(64),
  key: z.string().min(1).max(128),
  category: z.string().min(1).max(64),
  label: z.string().min(1).max(256),
  value: z.string(),
  type: z.enum(["text", "textarea", "richtext"]),
  sortOrder: z.number().int(),
  updatedAt: z.string().optional(),
});
export type PageContentItem = z.infer<typeof PageContentItem>;

export const PageContentPage = z.object({
  page: z.string(),
  category: z.string(),
  label: z.string(),
  items: z.array(PageContentItem),
});
export type PageContentPage = z.infer<typeof PageContentPage>;

export const PageContentResponse = z.object({
  pages: z.array(PageContentPage),
});
export type PageContentResponse = z.infer<typeof PageContentResponse>;

export const UpdatePageContentBody = z.object({
  updates: z.array(
    z.object({
      page: z.string().min(1).max(64),
      key: z.string().min(1).max(128),
      value: z.string(),
    }),
  ),
});
export type UpdatePageContentBody = z.infer<typeof UpdatePageContentBody>;

export const UpdatePageContentResponse = z.object({
  success: z.boolean(),
  updatedCount: z.number().int(),
});
export type UpdatePageContentResponse = z.infer<typeof UpdatePageContentResponse>;
