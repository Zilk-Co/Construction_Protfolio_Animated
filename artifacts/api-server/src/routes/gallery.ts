import { Router, type IRouter } from "express";
import { db, projectsTable, projectImagesTable, servicesTable, machineryTable, settingsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

// Public assets in /public (served by Vite at root)
const PUBLIC_ASSETS = [
  "/arch-civic.png",
  "/arch-cultural.png",
  "/arch-interior.png",
  "/arch-pavilion.png",
  "/arch-tower.png",
  "/logo.png",
  "/ceo.jpg",
  "/favicon.png",
];

router.get("/gallery", async (_req, res): Promise<void> => {
  const urls = new Set<string>();

  // Public assets
  for (const url of PUBLIC_ASSETS) urls.add(url);

  // Projects (hero image)
  try {
    const projects = await db.select({ imageUrl: projectsTable.imageUrl }).from(projectsTable);
    for (const p of projects) if (p.imageUrl) urls.add(p.imageUrl);
  } catch { /* non-fatal */ }

  // Project images
  try {
    const imgs = await db.select({ imageUrl: projectImagesTable.imageUrl }).from(projectImagesTable);
    for (const i of imgs) if (i.imageUrl) urls.add(i.imageUrl);
  } catch { /* non-fatal */ }

  // Services (main + gallery)
  try {
    const svcs = await db.select({ imageUrl: servicesTable.imageUrl, galleryImages: servicesTable.galleryImages }).from(servicesTable);
    for (const s of svcs) {
      if (s.imageUrl) urls.add(s.imageUrl);
      if (s.galleryImages) {
        try {
          const arr = JSON.parse(s.galleryImages);
          if (Array.isArray(arr)) for (const g of arr) if (g) urls.add(g);
        } catch { /* ignore */ }
      }
    }
  } catch { /* non-fatal */ }

  // Machinery (main + gallery)
  try {
    const mach = await db.select({ imageUrl: machineryTable.imageUrl, galleryImages: machineryTable.galleryImages }).from(machineryTable);
    for (const m of mach) {
      if (m.imageUrl) urls.add(m.imageUrl);
      if (m.galleryImages) {
        try {
          const arr = JSON.parse(m.galleryImages);
          if (Array.isArray(arr)) for (const g of arr) if (g) urls.add(g);
        } catch { /* ignore */ }
      }
    }
  } catch { /* non-fatal */ }

  // Settings (CEO image)
  try {
    const rows = await db.select().from(settingsTable).where((r) => r.key === "ceoImage");
    for (const r of rows) if (r.value) urls.add(r.value);
  } catch { /* non-fatal */ }

  res.json({ images: Array.from(urls) });
});

export default router;
