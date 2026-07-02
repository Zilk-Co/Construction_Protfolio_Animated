import type { Project, ProjectSummary, MachineryItem } from "@workspace/api-client-react";

const IMG = (id: string, w = 900) => `https://images.unsplash.com/${id}?w=${w}&q=75`;

export const FALLBACK_PROJECTS: ProjectSummary[] = [
  { id: 1, title: "Obsidian Cultural Centre", slug: "obsidian-cultural-centre", location: "Dubai, UAE", client: "Dubai Municipality", sector: "Cultural", status: "Completed", published: true, featured: true, categoryId: 4, year: "2023", categoryName: "Cultural", heroImage: IMG("photo-1470723710355-95304d8aece4") },
  { id: 2, title: "Meridian Tower", slug: "meridian-tower", location: "Shenzhen, China", client: "Meridian Group", sector: "Commercial", status: "Completed", published: true, featured: true, categoryId: 1, year: "2022", categoryName: "Commercial", heroImage: IMG("photo-1486325212027-8081e485255e") },
  { id: 3, title: "Heliodor Residences", slug: "heliodor-residences", location: "Monaco", client: "Heliodor Properties", sector: "Residential", status: "Completed", published: true, featured: true, categoryId: 2, year: "2023", categoryName: "Residential", heroImage: IMG("photo-1512917774080-9991f1c4c750") },
  { id: 4, title: "Civic Axis Masterplan", slug: "civic-axis-masterplan", location: "Riyadh", client: "Royal Commission for Riyadh City", sector: "Infrastructure", status: "In Progress", published: true, featured: true, categoryId: 5, year: "2024", categoryName: "Infrastructure", heroImage: IMG("photo-1477959858617-67f85cf4f1df") },
  { id: 5, title: "Quay District Towers", slug: "quay-district-towers", location: "Auckland", client: "Quay Development Ltd", sector: "Commercial", status: "Completed", published: true, featured: true, categoryId: 1, year: "2021", categoryName: "Commercial", heroImage: IMG("photo-1515263487990-61b07816b324") },
  { id: 6, title: "Solaris Industrial Complex", slug: "solaris-industrial-complex", location: "Jeddah", client: "Solaris Industries", sector: "Industrial", status: "Completed", published: true, featured: false, categoryId: 3, year: "2022", categoryName: "Industrial", heroImage: IMG("photo-1503387762-592deb58ef4e") },
  { id: 7, title: "Azure Heights", slug: "azure-heights", location: "Dubai Marina", client: "Azure Properties", sector: "Residential", status: "In Progress", published: true, featured: false, categoryId: 2, year: "2024", categoryName: "Residential", heroImage: IMG("photo-1545324418-cc1a3fa10c00") },
  { id: 8, title: "Verdant Civic Park", slug: "verdant-civic-park", location: "Islamabad", client: "Capital Development Authority", sector: "Public", status: "Completed", published: true, featured: false, categoryId: 5, year: "2020", categoryName: "Infrastructure", heroImage: IMG("photo-1448630360428-65456885c650") },
  { id: 9, title: "Atrium Business Hub", slug: "atrium-business-hub", location: "Karachi", client: "Atrium Holdings", sector: "Commercial", status: "Completed", published: true, featured: false, categoryId: 1, year: "2019", categoryName: "Commercial", heroImage: IMG("photo-1497366216548-37526070297c") },
];

const MACH_IMG = (id: string) => IMG(id, 600);

export const FALLBACK_MACHINERY: MachineryItem[] = [
  { id: 1, name: "Caterpillar 390F Excavator", slug: "caterpillar-390f-excavator", category: "Excavation", description: "90-ton class hydraulic excavator for deep foundation and bulk earthworks.", imageUrl: MACH_IMG("photo-1581094288338-2314dddb7ece"), year: "2021", condition: "Excellent", published: true, featured: true },
  { id: 2, name: "Liebherr LTM 1750 Crane", slug: "liebherr-ltm-1750-crane", category: "Lifting", description: "750-ton mobile crane for heavy lifts on high-rise and industrial projects.", imageUrl: MACH_IMG("photo-1567899378494-47b22a2ae96a"), year: "2020", condition: "Excellent", published: true, featured: true },
  { id: 3, name: "Komatsu D475A Bulldozer", slug: "komatsu-d475a-bulldozer", category: "Earthworks", description: "108-ton class bulldozer for site grading and large-scale earthmoving.", imageUrl: MACH_IMG("photo-1597844808175-c1c4e8c3a3e6"), year: "2019", condition: "Good", published: true, featured: true },
  { id: 4, name: "Volvo A40G Articulated Hauler", slug: "volvo-a40g-articulated-hauler", category: "Hauling", description: "45-ton off-road hauler built for soft ground and steep haul roads.", imageUrl: MACH_IMG("photo-1530824775361-c4cf2d5b6b3f"), year: "2022", condition: "Excellent", published: true, featured: true },
  { id: 5, name: "Putzmeister BSF 63-5.16H", slug: "putzmeister-bsf-63-concrete-pump", category: "Concrete", description: "63-meter boom concrete pump for high-volume pours on towers.", imageUrl: MACH_IMG("photo-1503387762-592deb58ef4e"), year: "2020", condition: "Good", published: true, featured: false },
  { id: 6, name: "Bauer BG 55 Piling Rig", slug: "bauer-bg-55-piling-rig", category: "Foundations", description: "Rotary piling rig for bored cast-in-situ piles up to 80m depth.", imageUrl: MACH_IMG("photo-1487958449943-2429e8be8625"), year: "2018", condition: "Good", published: true, featured: false },
  { id: 7, name: "JCB 540-180 Telehandler", slug: "jcb-540-180-telehandler", category: "Material Handling", description: "18-meter telehandler for elevated material placement.", imageUrl: MACH_IMG("photo-1581092580497-e0d23cbdf1dc"), year: "2022", condition: "Excellent", published: true, featured: false },
  { id: 8, name: "Hamm H13i Compactor", slug: "hamm-h13i-compactor", category: "Compaction", description: "14-ton soil compactor with vibration intelligence for roadbeds.", imageUrl: MACH_IMG("photo-1590736969955-71cc94901144"), year: "2021", condition: "Excellent", published: true, featured: false },
];

export function buildFallbackProject(slug: string): Project | null {
  const summary = FALLBACK_PROJECTS.find(p => p.slug === slug);
  if (!summary) return null;
  return {
    ...summary,
    size: undefined,
    scope: undefined,
    longDescription: `${summary.title} is a landmark ${(summary.sector || "architectural").toLowerCase()} project delivered for ${summary.client || "our client"} in ${summary.location || "the region"}. The project reflects our commitment to design excellence, technical rigour, and buildability — combining contextual sensitivity with the structural demands of a modern ${summary.sector || "built"} environment.\n\nDelivered under a design-build framework, the scheme integrates sustainable materials, efficient MEP systems, and a clear parti that responds to climate, culture, and end-user needs. The result is a high-performing asset that elevates the surrounding public realm and stands the test of time.`,
    images: [
      { id: 1, projectId: summary.id, imageUrl: summary.heroImage || IMG("photo-1486325212027-8081e485255e"), isHero: true, sortOrder: 0 },
      { id: 2, projectId: summary.id, imageUrl: IMG("photo-1497366216548-37526070297c"), isHero: false, sortOrder: 1 },
      { id: 3, projectId: summary.id, imageUrl: IMG("photo-1497366811353-6870744d04b2"), isHero: false, sortOrder: 2 },
      { id: 4, projectId: summary.id, imageUrl: IMG("photo-1503387762-592deb58ef4e"), isHero: false, sortOrder: 3 },
    ] as any,
  } as Project;
}

export function buildFallbackMachinery(slug: string): MachineryItem | null {
  return FALLBACK_MACHINERY.find(m => m.slug === slug) ?? null;
}
