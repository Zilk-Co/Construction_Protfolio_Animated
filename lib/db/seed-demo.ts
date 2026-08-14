import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
config({ path: resolve(__dirname, "../../.env") });

const { db, pool } = await import("./src/index");
const { categoriesTable, projectsTable, projectImagesTable, clientsTable } = await import("./src/schema");
const { eq } = await import("drizzle-orm");

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function resetSequence(table: string, idColumn: string) {
  const result = await pool.query(`SELECT COALESCE(MAX(${idColumn}), 0) + 1 AS next_id FROM "${table}"`);
  const nextId = result.rows[0].next_id;
  await pool.query(`SELECT setval(pg_get_serial_sequence('${table}', '${idColumn}'), ${nextId})`);
}

async function upsertCategory(name: string) {
  const slug = slugify(name);
  const existing = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, slug)).limit(1);
  if (existing.length > 0) return existing[0];
  const [row] = await db.insert(categoriesTable).values({ name, slug }).returning();
  return row;
}

async function upsertClient(data: { name: string; description?: string; website?: string; logoUrl?: string; sortOrder?: number }) {
  const slug = slugify(data.name);
  const existing = await db.select().from(clientsTable).where(eq(clientsTable.slug, slug)).limit(1);
  if (existing.length > 0) return existing[0];
  const [row] = await db.insert(clientsTable).values({ ...data, slug, published: true }).returning();
  return row;
}

async function upsertProject(data: { title: string; location?: string; client?: string; sector?: string; status?: string; published?: boolean; featured?: boolean; categoryId?: number; year?: string; size?: string; scope?: string; longDescription?: string }) {
  const slug = slugify(data.title);
  const existing = await db.select().from(projectsTable).where(eq(projectsTable.slug, slug)).limit(1);
  if (existing.length > 0) return existing[0];
  const [row] = await db.insert(projectsTable).values({ ...data, slug }).returning();
  return row;
}

async function addHeroImage(projectId: number, imageUrl: string) {
  const existing = await db.select().from(projectImagesTable).where(eq(projectImagesTable.projectId, projectId)).limit(1);
  if (existing.length > 0) return;
  await db.insert(projectImagesTable).values({ projectId, imageUrl, isHero: true, sortOrder: 1 });
}

async function seed() {
  console.log("Seeding demo data...");

  // Reset sequences to avoid duplicate key errors
  await resetSequence("categories", "id");
  await resetSequence("projects", "id");
  await resetSequence("project_images", "id");
  await resetSequence("clients", "id");
  console.log("Sequences reset");

  const commercial = await upsertCategory("Commercial");
  const residential = await upsertCategory("Residential");
  const industrial = await upsertCategory("Industrial");
  const infrastructure = await upsertCategory("Infrastructure");
  const healthcare = await upsertCategory("Healthcare");
  const education = await upsertCategory("Education");
  console.log("Categories ready");

  const clients = await Promise.all([
    upsertClient({ name: "Saudi Binladin Group", description: "One of the largest construction companies in the Middle East, delivering landmark projects across the region.", website: "https://www.sbg.com.sa", sortOrder: 1 }),
    upsertClient({ name: "Emaar Properties", description: "A global leader in real estate development, known for iconic projects like the Burj Khalifa and Dubai Mall.", website: "https://www.emaar.com", sortOrder: 2 }),
    upsertClient({ name: "Nakheel Properties", description: "A master developer responsible for some of Dubai's most iconic waterfront and mixed-use developments.", website: "https://www.nakheel.com", sortOrder: 3 }),
    upsertClient({ name: "AECOM", description: "A global infrastructure consulting firm delivering professional services across the project lifecycle.", website: "https://www.aecom.com", sortOrder: 4 }),
    upsertClient({ name: "Saudi Aramco", description: "The world's largest integrated energy and chemicals company, developing critical infrastructure across the Kingdom.", website: "https://www.aramco.com", sortOrder: 5 }),
    upsertClient({ name: "Qatar Foundation", description: "A national foundation focused on education, research, and community development in Qatar.", website: "https://www.qf.org.qa", sortOrder: 6 }),
  ]);
  console.log("Clients ready:", clients.length);

  const projects = await Promise.all([
    upsertProject({ title: "King Abdullah Financial District Tower", location: "Riyadh, Saudi Arabia", client: "Saudi Binladin Group", sector: "Commercial", status: "Completed", published: true, featured: true, categoryId: commercial.id, year: "2023", size: "85,000 sqm", scope: "Full Design & Supervision", longDescription: "A premium Grade-A office tower in the heart of KAFD, featuring a crystalline facade that responds to the desert climate. The 52-storey tower includes flexible floor plates, sky lobbies, and integrated smart building systems." }),
    upsertProject({ title: "Dubai Creek Harbour Residences", location: "Dubai, UAE", client: "Emaar Properties", sector: "Residential", status: "Completed", published: true, featured: true, categoryId: residential.id, year: "2022", size: "120,000 sqm", scope: "Masterplan & Detailed Design", longDescription: "An ultra-luxury waterfront residential complex comprising 450 units across four towers. Each residence offers panoramic views of Dubai Creek and the skyline." }),
    upsertProject({ title: "Palm Jumeirah Beach Villas", location: "Dubai, UAE", client: "Nakheel Properties", sector: "Residential", status: "Completed", published: true, featured: true, categoryId: residential.id, year: "2021", size: "65,000 sqm", scope: "Architecture & Interior Design", longDescription: "A collection of 80 premium beachfront villas on the iconic Palm Jumeirah. Each villa features private beach access, infinity pools, and smart home integration." }),
    upsertProject({ title: "Jeddah Corniche Mixed-Use Development", location: "Jeddah, Saudi Arabia", client: "Saudi Binladin Group", sector: "Commercial", status: "In Progress", published: true, featured: true, categoryId: commercial.id, year: "2024", size: "200,000 sqm", scope: "Full Design & Construction Management", longDescription: "A landmark mixed-use development along the Jeddah Corniche featuring three office towers, a luxury hotel, retail podium, and public waterfront park." }),
    upsertProject({ title: "Doha Education City Campus", location: "Doha, Qatar", client: "Qatar Foundation", sector: "Education", status: "Completed", published: true, featured: true, categoryId: education.id, year: "2022", size: "95,000 sqm", scope: "Campus Masterplan & Building Design", longDescription: "A new university campus within Education City, housing faculties of engineering, sciences, and the arts." }),
    upsertProject({ title: "Aramco Research & Development Center", location: "Dhahran, Saudi Arabia", client: "Saudi Aramco", sector: "Industrial", status: "Completed", published: true, featured: false, categoryId: industrial.id, year: "2023", size: "45,000 sqm", scope: "Laboratory & Office Design", longDescription: "A state-of-the-art research facility designed to foster collaboration between scientists and engineers." }),
    upsertProject({ title: "Riyadh Metro Station", location: "Riyadh, Saudi Arabia", client: "Royal Commission for Riyadh City", sector: "Infrastructure", status: "In Progress", published: true, featured: true, categoryId: infrastructure.id, year: "2024", size: "35,000 sqm", scope: "Station Architecture & Urban Design", longDescription: "A network of 12 metro stations designed to become landmark destinations within the city." }),
    upsertProject({ title: "Al Khobar Medical Complex", location: "Al Khobar, Saudi Arabia", client: "Saudi Aramco", sector: "Healthcare", status: "Upcoming", published: true, featured: false, categoryId: healthcare.id, year: "2025", size: "55,000 sqm", scope: "Healthcare Planning & Design", longDescription: "A comprehensive medical complex featuring a 200-bed hospital, specialty clinics, and wellness center." }),
  ]);
  console.log("Projects ready:", projects.length);

  const heroImages = [
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600",
    "https://images.unsplash.com/photo-1562788869-4ed32648eb72?w=1600",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600",
    "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1600",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600",
  ];
  for (let i = 0; i < projects.length; i++) {
    await addHeroImage(projects[i].id, heroImages[i % heroImages.length]);
  }
  console.log("Demo data seeded successfully!");
}

seed().catch((err) => { console.error("Seed failed:", err); process.exit(1); });
