import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@workspace/db";
import { pageContentTable } from "@workspace/db/schema";
import { UpdatePageContentBody, type PageContentItem, type PageContentPage, type PageContentResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

/**
 * Seed/canonical content catalogue.
 * Adding a new field here is a no-op for the DB until an admin saves it
 * (the API returns the seed defaults for keys that have no row yet).
 */
export const PAGE_CONTENT_SEED: Array<{
  page: string;
  key: string;
  category: string;
  label: string;
  value: string;
  type: "text" | "textarea" | "richtext";
  sortOrder: number;
}> = [
  // ── Home ───────────────────────────────────────────────
  { page: "home", key: "intro_eyebrow", category: "Intro Strip", label: "Intro Eyebrow", value: "Azhar Engineering", type: "text", sortOrder: 0 },
  { page: "home", key: "intro_title", category: "Intro Strip", label: "Intro Title", value: "Architecture & Construction", type: "text", sortOrder: 1 },
  { page: "home", key: "intro_body", category: "Intro Strip", label: "Intro Body", value: "A multi-disciplinary practice delivering landmark architectural and construction projects across the Middle East and South Asia since 2005.", type: "textarea", sortOrder: 2 },
  { page: "home", key: "intro_cta_label", category: "Intro Strip", label: "Intro CTA Label", value: "View All Projects", type: "text", sortOrder: 3 },
  { page: "home", key: "selected_works_title", category: "Selected Works", label: "Section Title", value: "Selected Works", type: "text", sortOrder: 0 },
  { page: "home", key: "selected_works_all_label", category: "Selected Works", label: "All Projects Link", value: "All Projects", type: "text", sortOrder: 1 },
  { page: "home", key: "machinery_eyebrow", category: "Machinery", label: "Section Eyebrow", value: "Equipment & Fleet", type: "text", sortOrder: 0 },
  { page: "home", key: "machinery_title", category: "Machinery", label: "Section Title", value: "Our Machinery", type: "text", sortOrder: 1 },
  { page: "home", key: "machinery_all_label", category: "Machinery", label: "All Equipment Link", value: "All Equipment", type: "text", sortOrder: 2 },
  { page: "home", key: "services_eyebrow", category: "Services", label: "Section Eyebrow", value: "What We Do", type: "text", sortOrder: 0 },
  { page: "home", key: "services_title", category: "Services", label: "Section Title", value: "Our Services", type: "text", sortOrder: 1 },
  { page: "home", key: "services_all_label", category: "Services", label: "All Services Link", value: "View All Services", type: "text", sortOrder: 2 },
  { page: "home", key: "services_card_label", category: "Services", label: "Explore Link Label", value: "Explore Capability", type: "text", sortOrder: 3 },
  { page: "home", key: "cta_title", category: "CTA", label: "CTA Title", value: "Have a project in mind?", type: "text", sortOrder: 0 },
  { page: "home", key: "cta_body", category: "CTA", label: "CTA Body", value: "Let us bring your vision to life.", type: "text", sortOrder: 1 },
  { page: "home", key: "cta_button_label", category: "CTA", label: "CTA Button", value: "Start a Conversation", type: "text", sortOrder: 2 },

  // ── Projects ───────────────────────────────────────────
  { page: "projects", key: "hero_eyebrow", category: "Hero", label: "Hero Eyebrow", value: "Portfolio", type: "text", sortOrder: 0 },
  { page: "projects", key: "hero_title", category: "Hero", label: "Hero Title", value: "All Projects", type: "text", sortOrder: 1 },
  { page: "projects", key: "hero_subtitle", category: "Hero", label: "Hero Subtitle", value: "Over two decades of landmark architectural and construction projects across Pakistan, the Middle East, and beyond.", type: "textarea", sortOrder: 2 },
  { page: "projects", key: "filter_all_label", category: "Filters", label: "All Types Button", value: "All Types", type: "text", sortOrder: 0 },
  { page: "projects", key: "empty_state", category: "Empty State", label: "No Results Message", value: "No projects match this filter", type: "text", sortOrder: 0 },
  { page: "projects", key: "count_label_singular", category: "Count", label: "Count Label (1)", value: "project", type: "text", sortOrder: 0 },
  { page: "projects", key: "count_label_plural", category: "Count", label: "Count Label (n)", value: "projects", type: "text", sortOrder: 1 },

  // ── Machinery ──────────────────────────────────────────
  { page: "machinery", key: "hero_eyebrow", category: "Hero", label: "Hero Eyebrow", value: "Equipment & Fleet", type: "text", sortOrder: 0 },
  { page: "machinery", key: "hero_title", category: "Hero", label: "Hero Title", value: "Machinery", type: "text", sortOrder: 1 },
  { page: "machinery", key: "hero_subtitle", category: "Hero", label: "Hero Subtitle", value: "Our fleet of specialised construction equipment supports projects across the region, from excavation and piling to concrete works and heavy lifting.", type: "textarea", sortOrder: 2 },
  { page: "machinery", key: "filter_all_label", category: "Filters", label: "All Equipment Button", value: "All Equipment", type: "text", sortOrder: 0 },
  { page: "machinery", key: "empty_state", category: "Empty State", label: "No Results Message", value: "No machinery match this filter", type: "text", sortOrder: 0 },

  // ── Services ───────────────────────────────────────────
  { page: "services", key: "hero_eyebrow", category: "Hero", label: "Hero Eyebrow", value: "Core Expertise", type: "text", sortOrder: 0 },
  { page: "services", key: "hero_title", category: "Hero", label: "Hero Title", value: "Operational Services", type: "text", sortOrder: 1 },
  { page: "services", key: "hero_subtitle", category: "Hero", label: "Hero Subtitle", value: "A full spectrum of construction and engineering capabilities delivered end-to-end — from first concept to final handover — by one accountable team.", type: "textarea", sortOrder: 2 },
  { page: "services", key: "hero_bg", category: "Hero", label: "Hero Background Image URL", value: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80", type: "text", sortOrder: 3 },
  { page: "services", key: "card_link_label", category: "Cards", label: "Explore Link Label", value: "Explore Capability", type: "text", sortOrder: 0 },
  { page: "services", key: "count_label_singular", category: "Cards", label: "Count Label (1)", value: "project", type: "text", sortOrder: 1 },
  { page: "services", key: "count_label_plural", category: "Cards", label: "Count Label (n)", value: "projects", type: "text", sortOrder: 2 },
  { page: "services", key: "empty_state", category: "Empty State", label: "No Results Message", value: "No services listed yet", type: "text", sortOrder: 0 },
  { page: "services", key: "method_eyebrow", category: "Methodology", label: "Methodology Eyebrow", value: "How We Work", type: "text", sortOrder: 0 },
  { page: "services", key: "method_title", category: "Methodology", label: "Methodology Title", value: "Systematic Engineering Excellence", type: "text", sortOrder: 1 },
  { page: "services", key: "method_subtitle", category: "Methodology", label: "Methodology Subtitle", value: "Every engagement follows a disciplined four-phase process that keeps projects on schedule, on budget, and beyond expectation.", type: "text", sortOrder: 2 },
  { page: "services", key: "method_1_title", category: "Methodology", label: "Step 1 Title", value: "Strategy", type: "text", sortOrder: 3 },
  { page: "services", key: "method_1_desc", category: "Methodology", label: "Step 1 Description", value: "We align scope, budget, and timelines with your objectives before a single drawing is produced.", type: "textarea", sortOrder: 4 },
  { page: "services", key: "method_2_title", category: "Methodology", label: "Step 2 Title", value: "Design", type: "text", sortOrder: 5 },
  { page: "services", key: "method_2_desc", category: "Methodology", label: "Step 2 Description", value: "Engineers and architects translate strategy into detailed, buildable plans and specifications.", type: "textarea", sortOrder: 6 },
  { page: "services", key: "method_3_title", category: "Methodology", label: "Step 3 Title", value: "Execution", type: "text", sortOrder: 7 },
  { page: "services", key: "method_3_desc", category: "Methodology", label: "Step 3 Description", value: "Our teams and fleet mobilise to deliver on site with rigorous quality and safety standards.", type: "textarea", sortOrder: 8 },
  { page: "services", key: "method_4_title", category: "Methodology", label: "Step 4 Title", value: "Quality", type: "text", sortOrder: 9 },
  { page: "services", key: "method_4_desc", category: "Methodology", label: "Step 4 Description", value: "Independent inspections and commissioning verify every milestone before handover.", type: "textarea", sortOrder: 10 },

  // ── Contact ────────────────────────────────────────────
  { page: "contact", key: "hero_eyebrow", category: "Hero", label: "Hero Eyebrow", value: "Get in Touch", type: "text", sortOrder: 0 },
  { page: "contact", key: "hero_title", category: "Hero", label: "Hero Title", value: "Contact Us", type: "text", sortOrder: 1 },
  { page: "contact", key: "hero_subtitle", category: "Hero", label: "Hero Subtitle", value: "We deliver landmark architectural and construction projects across the Middle East and South Asia. Tell us about your project and we will be in touch within 24 hours.", type: "textarea", sortOrder: 2 },
  { page: "contact", key: "office_eyebrow", category: "Office", label: "Office Eyebrow", value: "Our Office", type: "text", sortOrder: 0 },
  { page: "contact", key: "office_city", category: "Office", label: "Office City", value: "Karachi", type: "text", sortOrder: 1 },
  { page: "contact", key: "direct_eyebrow", category: "Direct Contact", label: "Direct Contact Eyebrow", value: "Direct Contact", type: "text", sortOrder: 0 },
  { page: "contact", key: "message_eyebrow", category: "Form", label: "Form Eyebrow", value: "Send a Message", type: "text", sortOrder: 0 },
  { page: "contact", key: "message_success_title", category: "Form", label: "Success Title", value: "Message Received", type: "text", sortOrder: 1 },
  { page: "contact", key: "message_success_body", category: "Form", label: "Success Body", value: "We will get back to you within 24 hours.", type: "text", sortOrder: 2 },
  { page: "contact", key: "map_eyebrow", category: "Map", label: "Map Eyebrow", value: "Find Us", type: "text", sortOrder: 0 },
  { page: "contact", key: "map_caption", category: "Map", label: "Map Caption", value: "Hub River Road, Baldia, Naval Colony, Sector 2, Karachi", type: "text", sortOrder: 1 },

  // ── About ──────────────────────────────────────────────
  { page: "about", key: "hero_eyebrow", category: "Hero", label: "Hero Eyebrow", value: "About Us", type: "text", sortOrder: 0 },
  { page: "about", key: "hero_title", category: "Hero", label: "Hero Title", value: "Building Pakistan's", type: "text", sortOrder: 1 },
  { page: "about", key: "hero_title_accent", category: "Hero", label: "Hero Accent Word", value: "Infrastructure", type: "text", sortOrder: 2 },
  { page: "about", key: "hero_subtitle", category: "Hero", label: "Hero Subtitle", value: "Azhar Engineering (Pvt.) Ltd is a leading construction and engineering firm dedicated to transforming the urban landscape with uncompromising quality and integrity.", type: "textarea", sortOrder: 3 },
  { page: "about", key: "hero_bg", category: "Hero", label: "Hero Background Image URL", value: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80", type: "text", sortOrder: 4 },
  { page: "about", key: "journey_eyebrow", category: "Journey", label: "Journey Eyebrow", value: "Construction Journey", type: "text", sortOrder: 0 },
  { page: "about", key: "journey_title", category: "Journey", label: "Journey Title", value: "Our Journey of Excellence", type: "text", sortOrder: 1 },
  { page: "about", key: "journey_p1", category: "Journey", label: "Journey Paragraph 1", value: "Established with a vision to revolutionize the construction industry in Pakistan, Azhar Engineering (Pvt.) Ltd has grown into a powerhouse of engineering capability and architectural execution.", type: "textarea", sortOrder: 2 },
  { page: "about", key: "journey_p2", category: "Journey", label: "Journey Paragraph 2", value: "Our foundation is built on deep technical expertise and a relentless pursuit of perfection. From complex commercial high-rises to intricate civil infrastructure, we approach every project with the same level of dedication and meticulous planning.", type: "textarea", sortOrder: 3 },
  { page: "about", key: "journey_p3", category: "Journey", label: "Journey Paragraph 3", value: "We don't just build structures; we build relationships. Our long-standing partnerships with clients, architects, and subcontractors are a testament to our transparent processes and reliable delivery.", type: "textarea", sortOrder: 4 },
  { page: "about", key: "journey_bg", category: "Journey", label: "Journey Background Image URL", value: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80", type: "text", sortOrder: 5 },
  { page: "about", key: "values_eyebrow", category: "Core Values", label: "Values Eyebrow", value: "Our Core Values", type: "text", sortOrder: 0 },
  { page: "about", key: "values_subtitle", category: "Core Values", label: "Values Subtitle", value: "The principles that guide every brick we lay and every design we draft.", type: "text", sortOrder: 1 },
  { page: "about", key: "values_1_title", category: "Core Values", label: "Value 1 Title", value: "Integrity", type: "text", sortOrder: 2 },
  { page: "about", key: "values_1_desc", category: "Core Values", label: "Value 1 Description", value: "Uncompromising honesty and transparency in all our dealings.", type: "text", sortOrder: 3 },
  { page: "about", key: "values_2_title", category: "Core Values", label: "Value 2 Title", value: "Excellence", type: "text", sortOrder: 4 },
  { page: "about", key: "values_2_desc", category: "Core Values", label: "Value 2 Description", value: "A relentless pursuit of quality in every structural detail.", type: "text", sortOrder: 5 },
  { page: "about", key: "values_3_title", category: "Core Values", label: "Value 3 Title", value: "Safety", type: "text", sortOrder: 6 },
  { page: "about", key: "values_3_desc", category: "Core Values", label: "Value 3 Description", value: "Zero-compromise approach to the well-being of our workforce.", type: "text", sortOrder: 7 },
  { page: "about", key: "values_4_title", category: "Core Values", label: "Value 4 Title", value: "Innovation", type: "text", sortOrder: 8 },
  { page: "about", key: "values_4_desc", category: "Core Values", label: "Value 4 Description", value: "Embracing modern engineering solutions to solve complex challenges.", type: "text", sortOrder: 9 },
  { page: "about", key: "leadership_eyebrow", category: "Leadership", label: "Leadership Eyebrow", value: "Leadership", type: "text", sortOrder: 0 },
  { page: "about", key: "documents_eyebrow", category: "Documents", label: "Documents Eyebrow", value: "Company Documents", type: "text", sortOrder: 0 },
  { page: "about", key: "documents_title", category: "Documents", label: "Documents Title", value: "Documents & Policies", type: "text", sortOrder: 1 },
  { page: "about", key: "documents_subtitle", category: "Documents", label: "Documents Subtitle", value: "Key documents and policies from Azhar Engineering (Pvt.) Ltd. Download them for more detail about how we operate.", type: "textarea", sortOrder: 2 },

  // ── Safety ─────────────────────────────────────────────
  { page: "safety", key: "hero_eyebrow", category: "Hero", label: "Hero Eyebrow", value: "Commitment", type: "text", sortOrder: 0 },
  { page: "safety", key: "hero_title", category: "Hero", label: "Hero Title", value: "Safety & Care", type: "text", sortOrder: 1 },
  { page: "safety", key: "hero_subtitle", category: "Hero", label: "Hero Subtitle", value: "Zero compromises. We build with a profound responsibility toward our workforce, the environment, and the communities we serve.", type: "textarea", sortOrder: 2 },
  { page: "safety", key: "hero_bg", category: "Hero", label: "Hero Background Image URL", value: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80", type: "text", sortOrder: 3 },
  { page: "safety", key: "policy_eyebrow", category: "HSE Policy", label: "Policy Eyebrow", value: "Health, Safety & Environment", type: "text", sortOrder: 0 },
  { page: "safety", key: "policy_title", category: "HSE Policy", label: "Policy Title", value: "Our HSE Policy", type: "text", sortOrder: 1 },
  { page: "safety", key: "policy_p1", category: "HSE Policy", label: "Policy Paragraph 1", value: "At Azhar Engineering (Pvt.) Ltd, our HSE policy is the cornerstone of our operations. We believe that every accident is preventable and that a safe working environment is a fundamental right. Our comprehensive HSE framework ensures that environmental protection, occupational health, and safety are integrated into all phases of our construction and engineering projects.", type: "textarea", sortOrder: 2 },
  { page: "safety", key: "policy_p2", category: "HSE Policy", label: "Policy Paragraph 2", value: "We mandate strict compliance with both national regulations and international best practices. Regular audits, continuous monitoring, and proactive risk mitigation strategies form the basis of our commitment to zero-harm operations across all project sites.", type: "textarea", sortOrder: 3 },
  { page: "safety", key: "policy_bg", category: "HSE Policy", label: "Policy Image URL", value: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1200&q=80", type: "text", sortOrder: 4 },
  { page: "safety", key: "pillars_eyebrow", category: "Safety Framework", label: "Framework Eyebrow", value: "How We Protect", type: "text", sortOrder: 0 },
  { page: "safety", key: "pillars_title", category: "Safety Framework", label: "Framework Title", value: "Our Safety Framework", type: "text", sortOrder: 1 },
  { page: "safety", key: "pillars_subtitle", category: "Safety Framework", label: "Framework Subtitle", value: "Nine disciplines, one promise — that every person on our sites goes home safe, every single day.", type: "text", sortOrder: 2 },
  { page: "safety", key: "pillar_1_title", category: "Pillar 1", label: "Pillar Title", value: "Worker Welfare & Training", type: "text", sortOrder: 0 },
  { page: "safety", key: "pillar_1_desc", category: "Pillar 1", label: "Pillar Description", value: "Our workforce is our most valuable asset. We are deeply committed to the physical and mental well-being of every individual on our sites. We provide extensive, mandatory safety inductions and continuous skill development programs tailored to specific roles and hazards.\n\nBeyond training, we ensure that our workers have access to clean drinking water, shaded rest areas, and proper sanitation facilities. We foster a culture where workers are empowered to report unsafe conditions without hesitation, knowing their welfare is our top priority.", type: "textarea", sortOrder: 1 },
  { page: "safety", key: "pillar_2_title", category: "Pillar 2", label: "Pillar Title", value: "Site Safety Protocols", type: "text", sortOrder: 0 },
  { page: "safety", key: "pillar_2_desc", category: "Pillar 2", label: "Pillar Description", value: "Every site operates under a documented safety protocol that governs daily activity — from controlled access and visitor inductions to toolbox talks held before every shift. We enforce a strict no-work-without-permit regime for high-risk tasks such as hot works, confined space entry, and lifting.\n\nSite managers conduct daily walk-throughs, and any deviation from protocol is halted, logged, and corrected before work resumes. By embedding safety into the rhythm of every working day, we keep incidents near zero across all our projects.", type: "textarea", sortOrder: 1 },
  { page: "safety", key: "pillar_3_title", category: "Pillar 3", label: "Pillar Title", value: "Personal Protective Equipment (PPE)", type: "text", sortOrder: 0 },
  { page: "safety", key: "pillar_3_desc", category: "Pillar 3", label: "Pillar Description", value: "We issue full, certified PPE to every worker and visitor — hard hats, safety boots, high-visibility vests, gloves, and eye protection — tailored to the specific risks of each task. Additional equipment such as harnesses, welding masks, and respiratory protection is provided where the job demands it.\n\nPPE is inspected regularly and replaced at the first sign of wear, because we never allow a single individual on site to work without adequate protection.", type: "textarea", sortOrder: 1 },
  { page: "safety", key: "pillar_4_title", category: "Pillar 4", label: "Pillar Title", value: "Risk Assessment & Hazard Management", type: "text", sortOrder: 0 },
  { page: "safety", key: "pillar_4_desc", category: "Pillar 4", label: "Pillar Description", value: "Before any activity begins, our HSE team carries out a detailed risk assessment covering every task, tool, and environmental condition. Hazards are identified, rated, and controlled through the hierarchy of controls — elimination, substitution, engineering controls, and administrative measures.\n\nMethod statements are reviewed with the crew on site, and dynamic risk assessments respond to changing conditions such as weather, night work, and live services. This structured approach means hazards are managed before they ever become incidents.", type: "textarea", sortOrder: 1 },
  { page: "safety", key: "pillar_5_title", category: "Pillar 5", label: "Pillar Title", value: "Equipment & Machinery Safety", type: "text", sortOrder: 0 },
  { page: "safety", key: "pillar_5_desc", category: "Pillar 5", label: "Pillar Description", value: "Our fleet of construction machinery is maintained to OEM standards under a strict preventive maintenance schedule. Only trained, certified operators are allowed to run plant, and every machine undergoes a daily pre-use inspection.\n\nWe enforce exclusion zones around operating equipment, use banksmen and signalers for lifting operations, and keep machinery tracking and maintenance records on file for audit. Safe plant is productive plant — and it protects everyone who works near it.", type: "textarea", sortOrder: 1 },
  { page: "safety", key: "pillar_6_title", category: "Pillar 6", label: "Pillar Title", value: "Quality Assurance & Quality Control", type: "text", sortOrder: 0 },
  { page: "safety", key: "pillar_6_desc", category: "Pillar 6", label: "Pillar Description", value: "Safety and quality are two sides of the same discipline. Our QA/QC team inspects materials, workmanship, and installations against approved specifications at every milestone. Correctly built work is inherently safer work — it reduces rework, hot work, and the risk of structural failure.\n\nInspections are documented, defects are rectified under controlled conditions, and lessons learned feed back into our standards and training.", type: "textarea", sortOrder: 1 },
  { page: "safety", key: "pillar_7_title", category: "Pillar 7", label: "Pillar Title", value: "Environmental Care & Sustainability", type: "text", sortOrder: 0 },
  { page: "safety", key: "pillar_7_desc", category: "Pillar 7", label: "Pillar Description", value: "We minimise the footprint of every project through dust suppression, waste segregation, and responsible disposal of hazardous materials. Sediment and erosion controls protect local waterways, and noise monitoring keeps our operations within community limits.\n\nWherever possible we reuse materials, specify low-impact alternatives, and protect existing vegetation. Protecting the environment is not an afterthought — it is engineered into how we plan and execute work.", type: "textarea", sortOrder: 1 },
  { page: "safety", key: "pillar_8_title", category: "Pillar 8", label: "Pillar Title", value: "Emergency Response & Preparedness", type: "text", sortOrder: 0 },
  { page: "safety", key: "pillar_8_desc", category: "Pillar 8", label: "Pillar Description", value: "Every site has a tested emergency response plan covering fire, medical emergencies, structural incidents, and severe weather. First-aiders and trained rescue teams are present on every shift, emergency equipment is positioned and checked weekly, and evacuation drills are conducted at regular intervals.\n\nEmergency contacts and assembly points are clearly signposted, and every worker knows their role in an incident. When seconds matter, preparation is what saves lives.", type: "textarea", sortOrder: 1 },
  { page: "safety", key: "pillar_9_title", category: "Pillar 9", label: "Pillar Title", value: "Community Engagement & Care", type: "text", sortOrder: 0 },
  { page: "safety", key: "pillar_9_desc", category: "Pillar 9", label: "Pillar Description", value: "We build in the heart of communities, and we take that privilege seriously. Neighbours are informed of site activities, deliveries, and any work that may affect them — with reasonable steps taken to minimise disruption from noise, dust, and traffic.\n\nWe maintain safe public routes around our sites and listen to community feedback through open lines of communication. Our projects aim to leave surrounding neighbourhoods safer and better than we found them.", type: "textarea", sortOrder: 1 },
  { page: "safety", key: "sustainability_eyebrow", category: "Sustainability", label: "Sustainability Eyebrow", value: "Green Commitment", type: "text", sortOrder: 0 },
  { page: "safety", key: "sustainability_title", category: "Sustainability", label: "Sustainability Title", value: "Our Sustainability Promise", type: "text", sortOrder: 1 },
  { page: "safety", key: "sustainability_subtitle", category: "Sustainability", label: "Sustainability Subtitle", value: "Building responsibly for today and for generations to come — reducing our footprint on every project.", type: "textarea", sortOrder: 2 },
  { page: "safety", key: "sustainability_bg", category: "Sustainability", label: "Sustainability Background Image URL", value: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200&q=80", type: "text", sortOrder: 3 },
  { page: "safety", key: "sustainability_1", category: "Sustainability Points", label: "Point 1", value: "Low-impact construction — dust suppression, waste segregation, and responsible disposal of hazardous materials on every site.", type: "textarea", sortOrder: 0 },
  { page: "safety", key: "sustainability_2", category: "Sustainability Points", label: "Point 2", value: "Energy-efficient practices — minimising fuel use, optimising logistics, and using modern, efficient plant.", type: "textarea", sortOrder: 1 },
  { page: "safety", key: "sustainability_3", category: "Sustainability Points", label: "Point 3", value: "Water and ecosystem protection — sediment controls, protection of local waterways, and preservation of existing vegetation.", type: "textarea", sortOrder: 2 },
  { page: "safety", key: "sustainability_4", category: "Sustainability Points", label: "Point 4", value: "Material responsibility — reusing materials where possible and specifying low-impact, durable alternatives.", type: "textarea", sortOrder: 3 },
  { page: "safety", key: "sustainability_5", category: "Sustainability Points", label: "Point 5", value: "Community wellbeing — noise monitoring, minimising disruption, and safe public routes around all our sites.", type: "textarea", sortOrder: 4 },
  { page: "safety", key: "sustainability_6", category: "Sustainability Points", label: "Point 6", value: "Transparent reporting — we track and review our environmental performance on every project.", type: "textarea", sortOrder: 5 },
  { page: "safety", key: "cta_title", category: "CTA", label: "CTA Title", value: "Have questions about our practices?", type: "text", sortOrder: 0 },
  { page: "safety", key: "cta_body", category: "CTA", label: "CTA Body", value: "We are transparent about our safety records and protocols. Reach out to our HSE department for more detailed information.", type: "text", sortOrder: 1 },
  { page: "safety", key: "cta_button_label", category: "CTA", label: "CTA Button", value: "Contact Us", type: "text", sortOrder: 2 },

  // ── Footer ─────────────────────────────────────────────
  { page: "footer", key: "tagline", category: "Brand", label: "Brand Tagline", value: "Architecture and construction excellence since 2005.", type: "textarea", sortOrder: 0 },
  { page: "footer", key: "nav_heading", category: "Navigation", label: "Nav Heading", value: "Navigation", type: "text", sortOrder: 0 },
  { page: "footer", key: "location_heading", category: "Location", label: "Location Heading", value: "Location", type: "text", sortOrder: 0 },
  { page: "footer", key: "contact_heading", category: "Contact", label: "Contact Heading", value: "Contact Us", type: "text", sortOrder: 0 },
  { page: "footer", key: "contact_cta_label", category: "Contact", label: "Contact Button", value: "Get in Touch", type: "text", sortOrder: 1 },
  { page: "footer", key: "footer_tag_left", category: "Bottom Bar", label: "Bottom Bar — Left Tag", value: "Architecture & Construction", type: "text", sortOrder: 0 },
  { page: "footer", key: "footer_tag_right", category: "Bottom Bar", label: "Bottom Bar — Right Tag", value: "Karachi, Pakistan", type: "text", sortOrder: 1 },
  { page: "footer", key: "footer_credit", category: "Bottom Bar", label: "Bottom Bar — Credit Line", value: "Website by Zilk Co", type: "text", sortOrder: 2 },
];

async function loadContent(): Promise<PageContentResponse> {
  const rows = await db.select().from(pageContentTable).catch(() => []);
  const overrides = new Map<string, { value: string; updatedAt?: string }>();
  for (const r of rows) {
    overrides.set(`${r.page}::${r.key}`, { value: r.value, updatedAt: r.updatedAt?.toISOString() });
  }

  const grouped = new Map<string, PageContentPage>();
  for (const seed of PAGE_CONTENT_SEED) {
    if (!grouped.has(seed.page)) {
      grouped.set(seed.page, { page: seed.page, category: "", label: "", items: [] });
    }
    const override = overrides.get(`${seed.page}::${seed.key}`);
    const item: PageContentItem = {
      page: seed.page,
      key: seed.key,
      category: seed.category,
      label: seed.label,
      value: override?.value ?? seed.value,
      type: seed.type,
      sortOrder: seed.sortOrder,
      ...(override?.updatedAt ? { updatedAt: override.updatedAt } : {}),
    };
    grouped.get(seed.page)!.items.push(item);
  }

  // Order items within each page by sortOrder then label
  for (const page of grouped.values()) {
    page.items.sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
    const first = page.items[0];
    page.category = first ? first.category : "";
    page.label = page.page.charAt(0).toUpperCase() + page.page.slice(1);
  }

  return { pages: Array.from(grouped.values()) };
}

router.get("/page-content", async (_req, res): Promise<void> => {
  try {
    const data = await loadContent();
    res.json(data);
  } catch (err) {
    logger.error({ err }, "page-content GET failed");
    // Fall back to seed-only response so the site never breaks
    const grouped = new Map<string, PageContentPage>();
    for (const seed of PAGE_CONTENT_SEED) {
      if (!grouped.has(seed.page)) {
        grouped.set(seed.page, { page: seed.page, category: "", label: "", items: [] });
      }
      grouped.get(seed.page)!.items.push({
        page: seed.page,
        key: seed.key,
        category: seed.category,
        label: seed.label,
        value: seed.value,
        type: seed.type,
        sortOrder: seed.sortOrder,
      });
    }
    for (const page of grouped.values()) {
      page.items.sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
      const first = page.items[0];
      page.category = first ? first.category : "";
      page.label = page.page.charAt(0).toUpperCase() + page.page.slice(1);
    }
    res.json({ pages: Array.from(grouped.values()) });
  }
});

router.put("/admin/page-content", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdatePageContentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let updated = 0;
  for (const u of parsed.data.updates) {
    const seed = PAGE_CONTENT_SEED.find((s) => s.page === u.page && s.key === u.key);
    if (!seed) {
      logger.warn({ page: u.page, key: u.key }, "rejected page-content update for unknown key");
      continue;
    }
    await db
      .insert(pageContentTable)
      .values({
        page: u.page,
        key: u.key,
        value: u.value,
        label: seed.label,
        category: seed.category,
        type: seed.type,
        sortOrder: String(seed.sortOrder),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [pageContentTable.page, pageContentTable.key],
        set: { value: u.value, updatedAt: new Date() },
      });
    updated += 1;
  }

  res.json({ success: true, updatedCount: updated });
});

export default router;
