import { config } from "dotenv";
import { db } from "./src/index";
import { categoriesTable, projectsTable, machineryTable, projectImagesTable } from "./src/schema";
import { eq } from "drizzle-orm";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

// Load .env from the root directory
config({ path: resolve(__dirname, "../../.env") });

async function seed() {
  console.log("Seeding database...");
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");

  // Clear existing data
  await db.delete(projectImagesTable);
  await db.delete(projectsTable);
  await db.delete(machineryTable);
  await db.delete(categoriesTable);

  // Insert categories
  const categories = await db.insert(categoriesTable).values([
    { name: "Commercial", slug: "commercial" },
    { name: "Residential", slug: "residential" },
    { name: "Industrial", slug: "industrial" },
    { name: "Cultural", slug: "cultural" },
    { name: "Infrastructure", slug: "infrastructure" },
  ]).returning();

  console.log("Inserted categories:", categories.length);

  // Insert projects
  const projects = await db.insert(projectsTable).values([
    {
      title: "Obsidian Cultural Centre",
      slug: "obsidian-cultural-centre",
      location: "Dubai, UAE",
      client: "Dubai Municipality",
      sector: "Cultural",
      status: "Completed",
      published: true,
      featured: true,
      categoryId: categories[3].id,
      year: "2023",
      description: "A state-of-the-art cultural center featuring exhibition spaces, auditoriums, and community facilities.",
      longDescription: "The Obsidian Cultural Centre represents a new paradigm in cultural architecture. The building features a striking facade inspired by geological formations, housing multiple exhibition halls, a 500-seat auditorium, and dedicated spaces for community engagement. The design emphasizes natural light and sustainable materials throughout.",
    },
    {
      title: "Meridian Tower",
      slug: "meridian-tower",
      location: "Shenzhen, China",
      client: "Meridian Group",
      sector: "Commercial",
      status: "Completed",
      published: true,
      featured: true,
      categoryId: categories[0].id,
      year: "2022",
      description: "45-story mixed-use tower with office spaces, retail, and luxury apartments.",
      longDescription: "Meridian Tower stands as a landmark in Shenzhen's financial district. The 45-story tower integrates premium office spaces, high-end retail, and luxury residential units. The facade features dynamic shading systems that respond to solar conditions, reducing energy consumption while creating a distinctive visual identity.",
    },
    {
      title: "Heliodor Residences",
      slug: "heliodor-residences",
      location: "Monaco",
      client: "Heliodor Properties",
      sector: "Residential",
      status: "Completed",
      published: true,
      featured: true,
      categoryId: categories[1].id,
      year: "2023",
      description: "Luxury waterfront residential complex with panoramic views of the Mediterranean.",
      longDescription: "Heliodor Residences offers an exclusive living experience on Monaco's waterfront. The complex comprises 120 luxury units, each featuring floor-to-ceiling windows and private terraces. Amenities include a private marina, spa facilities, and landscaped gardens that extend to the water's edge.",
    },
    {
      title: "Civic Axis Masterplan",
      slug: "civic-axis-masterplan",
      location: "Riyadh",
      client: "Royal Commission for Riyadh City",
      sector: "Infrastructure",
      status: "In Progress",
      published: true,
      featured: true,
      categoryId: categories[4].id,
      year: "2024",
      description: "Comprehensive urban development project including government buildings, parks, and public spaces.",
      longDescription: "The Civic Axis Masterplan transforms Riyadh's urban core with a series of interconnected government buildings, public parks, and cultural spaces. The project emphasizes sustainable urban design, with extensive green corridors and pedestrian-friendly pathways connecting key civic institutions.",
    },
    {
      title: "Quay District Towers",
      slug: "quay-district-towers",
      location: "Auckland",
      client: "Quay Development Ltd",
      sector: "Commercial",
      status: "Completed",
      published: true,
      featured: true,
      categoryId: categories[0].id,
      year: "2021",
      description: "Twin office towers with retail podium and waterfront promenade.",
      longDescription: "The Quay District Towers redefine Auckland's waterfront with two iconic office towers rising above a vibrant retail podium. The development includes a public promenade along the water's edge, creating a new destination for both workers and visitors. The towers feature advanced environmental systems and flexible floor plates.",
    },
    {
      title: "Solaris Industrial Complex",
      slug: "solaris-industrial-complex",
      location: "Jeddah",
      client: "Solaris Industries",
      sector: "Industrial",
      status: "Completed",
      published: true,
      featured: false,
      categoryId: categories[2].id,
      year: "2022",
      description: "Modern industrial facility with advanced manufacturing capabilities.",
      longDescription: "Solaris Industrial Complex represents the future of manufacturing in the region. The facility incorporates automated production lines, renewable energy systems, and advanced logistics infrastructure. The design prioritizes worker safety and operational efficiency while minimizing environmental impact.",
    },
    {
      title: "Azure Heights",
      slug: "azure-heights",
      location: "Dubai Marina",
      client: "Azure Properties",
      sector: "Residential",
      status: "In Progress",
      published: true,
      featured: false,
      categoryId: categories[1].id,
      year: "2024",
      description: "Premium residential tower with smart home technology and resort-style amenities.",
      longDescription: "Azure Heights brings luxury living to Dubai Marina with 200 residential units featuring cutting-edge smart home technology. Residents enjoy access to infinity pools, fitness centers, and private beach access. The tower's design maximizes views of the marina and skyline.",
    },
  ]).returning();

  console.log("Inserted projects:", projects.length);

  // Insert project images
  const projectImages = [
    { projectId: projects[0].id, imageUrl: "https://images.unsplash.com/photo-1470723710355-95304d8aece4?w=1600", isHero: true, sortOrder: 1 },
    { projectId: projects[1].id, imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600", isHero: true, sortOrder: 1 },
    { projectId: projects[2].id, imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600", isHero: true, sortOrder: 1 },
    { projectId: projects[3].id, imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600", isHero: true, sortOrder: 1 },
    { projectId: projects[4].id, imageUrl: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1600", isHero: true, sortOrder: 1 },
    { projectId: projects[5].id, imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600", isHero: true, sortOrder: 1 },
    { projectId: projects[6].id, imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600", isHero: true, sortOrder: 1 },
  ];

  await db.insert(projectImagesTable).values(projectImages);
  console.log("Inserted project images:", projectImages.length);

  // Insert machinery
  const machinery = await db.insert(machineryTable).values([
    {
      name: "Caterpillar 320GC Excavator",
      slug: "caterpillar-320gc-excavator",
      category: "Excavators",
      description: "Reliable and fuel-efficient excavator for general construction and excavation work.",
      longDescription: "The Caterpillar 320GC Excavator offers excellent performance and fuel efficiency for general construction applications. With a powerful engine and advanced hydraulic system, it delivers productivity while minimizing operating costs. The spacious cab provides operator comfort and excellent visibility.",
      imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
      ]),
      year: "2021",
      condition: "Excellent",
      published: true,
      featured: true,
    },
    {
      name: "JCB 3CX Backhoe Loader",
      slug: "jcb-3cx-backhoe-loader",
      category: "Loaders",
      description: "Versatile backhoe loader ideal for construction, landscaping, and utility work.",
      longDescription: "The JCB 3CX Backhoe Loader is renowned for its versatility and performance. Equipped with a powerful engine and advanced transmission, it handles a wide range of tasks from excavation to loading. The ergonomic design ensures operator comfort during long work hours.",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
      ]),
      year: "2022",
      condition: "Good",
      published: true,
      featured: true,
    },
    {
      name: "Komatsu D155AX-6 Dozer",
      slug: "komatsu-d155ax-6-dozer",
      category: "Dozers",
      description: "Heavy-duty bulldozer for earthmoving and construction projects.",
      longDescription: "The Komatsu D155AX-6 Dozer delivers exceptional power and efficiency for large-scale earthmoving projects. Featuring advanced blade control technology and a comfortable operator station, it maximizes productivity while minimizing fatigue. The machine is designed for durability in demanding work environments.",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
      ]),
      year: "2020",
      condition: "Excellent",
      published: true,
      featured: true,
    },
    {
      name: "Liebherr LTM 1120-4.1 Mobile Crane",
      slug: "liebherr-ltm-1120-4-1-mobile-crane",
      category: "Cranes",
      description: "High-capacity mobile crane for lifting and construction operations.",
      longDescription: "The Liebherr LTM 1120-4.1 Mobile Crane offers exceptional lifting capacity and reach for complex construction projects. With its telescopic boom and advanced safety systems, it handles demanding lifting operations with precision. The crane's compact design allows operation in confined spaces.",
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
      ]),
      year: "2023",
      condition: "Excellent",
      published: true,
      featured: true,
    },
    {
      name: "Volvo A40G Articulated Hauler",
      slug: "volvo-a40g-articulated-hauler",
      category: "Haulers",
      description: "Robust articulated hauler for mining and heavy construction applications.",
      longDescription: "The Volvo A40G Articulated Hauler is built for the toughest hauling applications. With its powerful engine and advanced transmission, it delivers high productivity in mining and large construction projects. The hauler features excellent stability and operator comfort for demanding work conditions.",
      imageUrl: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=800",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=800",
      ]),
      year: "2022",
      condition: "Good",
      published: true,
      featured: false,
    },
    {
      name: "Hitachi ZW220-6 Wheel Loader",
      slug: "hitachi-zw220-6-wheel-loader",
      category: "Loaders",
      description: "Efficient wheel loader for material handling and construction sites.",
      longDescription: "The Hitachi ZW220-6 Wheel Loader combines power and efficiency for material handling operations. With its advanced hydraulic system and comfortable cab, it delivers high productivity while ensuring operator safety. The loader is ideal for construction sites, quarries, and material handling facilities.",
      imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
      ]),
      year: "2021",
      condition: "Excellent",
      published: true,
      featured: false,
    },
  ]).returning();

  console.log("Inserted machinery:", machinery.length);

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
