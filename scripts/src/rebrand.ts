/**
 * One-off data migration for the rebrand:
 *
 *   Zain Manzoor & Co.  ->  Azhar Engineering (Pvt.) Ltd
 *
 * Applies an idempotent string replace across every text column that can hold
 * brand content, and backfills any missing default site settings. Safe to run
 * more than once (replaces are idempotent; missing keys are only inserted).
 *
 * Usage:
 *   DATABASE_URL="postgres://..." pnpm --filter @workspace/scripts run db:rebrand
 */
import {
  db,
  pool,
  pageContentTable,
  settingsTable,
  servicesTable,
  projectsTable,
  projectImagesTable,
  machineryTable,
  categoriesTable,
  documentsTable,
} from "@workspace/db";
import { sql, type Column, type SQL } from "drizzle-orm";

const REBRANDS: ReadonlyArray<[string, string]> = [
  ["Zain Manzoor & Co", "Azhar Engineering (Pvt.) Ltd"],
  ["Zain Manzoor Co.", "Azhar Engineering"],
  ["zainmanzoor.co", "azhar@gmail.com"],
  ["info@zainmanzoor.co", "azhar@gmail.com"],
  ["+92 21 3456 7890", "+92 123 123 3875"],
];

// Keep in sync with DEFAULT_SETTINGS in artifacts/api-server/src/routes/settings.ts
const DEFAULT_SETTINGS: Record<string, string> = {
  phone: "+92 123 123 3875",
  email: "azhar@gmail.com",
  address: "House 53, Street 12, Naval Colony, Sector 2, Baldia, Hub River Road, Karachi, Pakistan",
  city: "Karachi",
  hours: "Mon–Sat, 9:00 AM – 6:00 PM PKT",
  heroSubtitle:
    "We deliver landmark architectural and construction projects across the Middle East and South Asia. Tell us about your project and we will be in touch within 24 hours.",
  ceoName: "Azhar",
  ceoTitle: "Chief Executive Officer",
  ceoQuote:
    "Construction is more than assembling materials; it is the physical manifestation of vision, ambition, and progress. At Azhar Engineering (Pvt.) Ltd, we take immense pride in our role as nation-builders, delivering projects that serve as catalysts for economic and social development.",
  ceoImage: "/ceo.jpg",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14481.167963498!2d66.9940!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f7a8c4c2f8f%3A0x0!2sNaval+Colony%2C+Baldia%2C+Karachi!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s",
};

async function rebrandColumn(table: string, col: Column, extraSet?: SQL): Promise<number> {
  let updated = 0;
  for (const [from, to] of REBRANDS) {
    const result = await db.execute(
      sql`UPDATE ${sql.identifier(table)} SET ${sql.identifier(col.name)} = replace(${col}, ${from}, ${to})${extraSet ? sql`, ${extraSet}` : sql``} WHERE ${col} ILIKE ${`%${from}%`}`,
    );
    updated += Number(result.rowCount ?? 0);
  }
  return updated;
}

async function main(): Promise<void> {
  console.log("Starting rebrand…");

  let total = 0;
  const jobs: ReadonlyArray<{ table: string; columns: ReadonlyArray<Column> }> = [
    { table: "page_content", columns: [pageContentTable.value] },
    { table: "settings", columns: [settingsTable.value] },
    { table: "services", columns: [servicesTable.description, servicesTable.longDescription, servicesTable.name, servicesTable.slug] },
    { table: "projects", columns: [projectsTable.title, projectsTable.location, projectsTable.client, projectsTable.sector, projectsTable.scope, projectsTable.longDescription, projectsTable.slug] },
    { table: "project_images", columns: [projectImagesTable.imageUrl] },
    { table: "machinery", columns: [machineryTable.name, machineryTable.description, machineryTable.longDescription, machineryTable.category, machineryTable.slug] },
    { table: "categories", columns: [categoriesTable.name] },
    { table: "documents", columns: [documentsTable.title, documentsTable.description, documentsTable.fileName] },
  ];

  for (const job of jobs) {
    for (const col of job.columns) {
      try {
        const extraSet =
          job.table === "page_content" ? sql`updated_at = now()` : undefined;
        const n = await rebrandColumn(job.table, col, extraSet);
        if (n > 0) console.log(`  ${job.table}.${col.name}: ${n} row(s) updated`);
        total += n;
      } catch (err) {
        console.warn(`  SKIPPED ${job.table}.${col.name}: ${(err as Error).message}`);
      }
    }
  }

  // Backfill missing default settings (never overwrites existing values)
  const existing = await db.select({ key: settingsTable.key }).from(settingsTable);
  const have = new Set(existing.map((r) => r.key));
  let inserted = 0;
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    if (have.has(key)) continue;
    await db.insert(settingsTable).values({ key, value });
    inserted += 1;
    console.log(`  settings.${key}: inserted default`);
  }

  console.log(`Done. ${total} row(s) rebranded, ${inserted} settings backfilled.`);
  await pool.end();
}

main().catch(async (err) => {
  console.error("Rebrand failed:", err);
  await pool.end().catch(() => undefined);
  process.exit(1);
});
