import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { useGetSettings, useUpdatePageContent } from "@workspace/api-client-react";
import { usePageContent } from "@/hooks/usePageContent";
import { useDocuments } from "@/hooks/useDocuments";
import { FileText, Download } from "lucide-react";
import { EditableText } from "@/components/EditableText";
import { useEditMode } from "@/components/EditModeProvider";
import { HeroImageEditor } from "@/components/HeroImageEditor";

const DEFAULT_HERO_BG = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80";
const DEFAULT_JOURNEY_BG = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80";
const DEFAULT_CEO_IMAGE = "/ceo.jpg";

const VALUES = [1, 2, 3, 4];

export default function About() {
  const t = usePageContent("about");
  const { data: settings } = useGetSettings();
  const { data: documents = [], isLoading: docsLoading } = useDocuments();
  const { editMode } = useEditMode();
  const updatePageContent = useUpdatePageContent();

  const savePageContent = async (key: string, value: string) => {
    await updatePageContent.mutateAsync({
      data: { updates: [{ page: "about", key, value }] },
    });
  };

  const heroBg = t.get("hero_bg", DEFAULT_HERO_BG);
  const journeyBg = t.get("journey_bg", DEFAULT_JOURNEY_BG);
  const ceoImage = (settings?.ceoImage ?? "").trim() || DEFAULT_CEO_IMAGE;
  const ceoName = settings?.ceoName ?? "Azhar";
  const ceoTitle = settings?.ceoTitle ?? "Chief Executive Officer";
  const ceoQuote = settings?.ceoQuote ?? "Construction is more than assembling materials; it is the physical manifestation of vision, ambition, and progress. At Azhar Engineering (Pvt.) Ltd, we take immense pride in our role as nation-builders, delivering projects that serve as catalysts for economic and social development.";

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">

        {/* ═══════ HERO ═══════ */}
        <section className="relative pt-44 pb-28 px-6 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <HeroImageEditor
            value={heroBg}
            onSave={(url) => savePageContent("hero_bg", url)}
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.75) 100%)" }} />
          <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />

          <div className="relative max-w-screen-2xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] tracking-[0.45em] uppercase font-semibold mb-5"
              style={{ color: "hsl(38,85%,68%)", textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}
            >
              {t.get("hero_eyebrow", "About Us")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight uppercase mb-6 text-white"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              {editMode ? (
                <EditableText
                  value={t.get("hero_title", "Building Pakistan's")}
                  onSave={(v) => savePageContent("hero_title", v)}
                  tag="span"
                />
              ) : (
                t.get("hero_title", "Building Pakistan's")
              )}
              <br />
              <span style={{ color: "hsl(38,72%,52%)" }}>
                {editMode ? (
                  <EditableText
                    value={t.get("hero_title_accent", "Infrastructure")}
                    onSave={(v) => savePageContent("hero_title_accent", v)}
                    tag="span"
                  />
                ) : (
                  t.get("hero_title_accent", "Infrastructure")
                )}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
            >
              {editMode ? (
                <EditableText
                  value={t.get("hero_subtitle", "Azhar Engineering (Pvt.) Ltd is a leading construction and engineering firm dedicated to transforming the urban landscape with uncompromising quality and integrity.")}
                  onSave={(v) => savePageContent("hero_subtitle", v)}
                  tag="span"
                />
              ) : (
                t.get("hero_subtitle", "Azhar Engineering (Pvt.) Ltd is a leading construction and engineering firm dedicated to transforming the urban landscape with uncompromising quality and integrity.")
              )}
            </motion.p>
          </div>
        </section>

        {/* ═══════ BASIC LINE OF BUSINESS ═══════ */}
        <section className="py-24 px-6 bg-[hsl(220,18%,8%)]">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-14">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-[10px] tracking-[0.35em] uppercase mb-4"
                style={{ color: "hsl(38,85%,62%)" }}
              >
                {t.get("business_eyebrow", "Who We Are")}
              </motion.p>
              <div className="w-10 h-px mx-auto mb-8" style={{ backgroundColor: "hsl(38,72%,52%)" }} />
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-serif font-bold tracking-tight uppercase mb-8 text-white"
              >
                {t.get("business_title", "Basic Line of Business")}
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl mx-auto"
            >
              <p className="text-sm leading-relaxed text-gray-300 mb-6">
                {t.get("business_p1", "The principal line of business of the company shall be to lay out, construct, build, erect, demolish, alter, layout, re-model or do any other work in connection with any infrastructure including apartments, homes, plazas, multi-storied flats, business offices, shops, markets, warehouses, industrial and commercial buildings, roads, dams, bridges, spillways, highways, reservoirs, airports, seaports, parks, canals, irrigation improvements, amusement parks, convention centers, hi-technology industrial parks, and structures of all descriptions.")}
              </p>
              <p className="text-sm leading-relaxed text-gray-300 mb-6">
                {t.get("business_p2", "And to equip the same or any part thereof with all or any conveniences, drainage and sewerage facilities, water supply, electric and gas installations, structural or architectural work of any kind whatsoever.")}
              </p>
              <p className="text-sm leading-relaxed text-gray-300">
                {t.get("business_p3", "And for such purpose to prepare estimates, designs, plans, specifications subject to any permission required by law and approval from the competent authorities.")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════ JOURNEY ═══════ */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="aspect-[4/5] overflow-hidden border border-[hsl(220,15%,18%)]"
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${journeyBg})` }}
              />
            </motion.div>

            {/* Text */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[10px] tracking-[0.35em] uppercase mb-1"
                style={{ color: "hsl(38,85%,62%)" }}
              >
                {t.get("journey_eyebrow", "Construction Journey")}
              </motion.p>
              <div className="w-8 h-px bg-[hsl(38,72%,52%)] mb-6" />
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-serif font-bold tracking-tight uppercase mb-8 text-white"
              >
                {t.get("journey_title", "Our Journey of Excellence")}
              </motion.h2>
              <div className="space-y-5">
                {[1, 2, 3].map((n) => (
                  <motion.p
                    key={n}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + n * 0.1 }}
                    className="text-sm leading-relaxed text-gray-300"
                  >
                    {t.get(`journey_p${n}`, n === 1
                      ? "Established with a vision to revolutionize the construction industry in Pakistan, Azhar Engineering (Pvt.) Ltd has grown into a powerhouse of engineering capability and architectural execution."
                      : n === 2
                      ? "Our foundation is built on deep technical expertise and a relentless pursuit of perfection. From complex commercial high-rises to intricate civil infrastructure, we approach every project with the same level of dedication and meticulous planning."
                      : "We don't just build structures; we build relationships. Our long-standing partnerships with clients, architects, and subcontractors are a testament to our transparent processes and reliable delivery."
                    )}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ MISSION & VISION ═══════ */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-10">
              <p className="text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: "hsl(38,85%,62%)" }}>{t.get("mission_eyebrow", "Our Mission")}</p>
              <div className="w-8 h-px bg-[hsl(38,72%,52%)] mb-6" />
              <h3 className="text-2xl md:text-3xl font-serif font-bold uppercase tracking-tight mb-6 text-white">
                {editMode ? (
                  <EditableText
                    value={t.get("mission_title", "Delivering Excellence")}
                    onSave={(v) => savePageContent("mission_title", v)}
                    tag="span"
                  />
                ) : (
                  t.get("mission_title", "Delivering Excellence")
                )}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {editMode ? (
                  <EditableText
                    value={t.get("mission_body", "To deliver innovative, sustainable, and high-quality construction and engineering solutions that exceed client expectations while contributing to the development of Pakistan's infrastructure.")}
                    onSave={(v) => savePageContent("mission_body", v)}
                    tag="span"
                  />
                ) : (
                  t.get("mission_body", "To deliver innovative, sustainable, and high-quality construction and engineering solutions that exceed client expectations while contributing to the development of Pakistan's infrastructure.")
                )}
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-10">
              <p className="text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: "hsl(38,85%,62%)" }}>{t.get("vision_eyebrow", "Our Vision")}</p>
              <div className="w-8 h-px bg-[hsl(38,72%,52%)] mb-6" />
              <h3 className="text-2xl md:text-3xl font-serif font-bold uppercase tracking-tight mb-6 text-white">
                {editMode ? (
                  <EditableText
                    value={t.get("vision_title", "Shaping Tomorrow")}
                    onSave={(v) => savePageContent("vision_title", v)}
                    tag="span"
                  />
                ) : (
                  t.get("vision_title", "Shaping Tomorrow")
                )}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {editMode ? (
                  <EditableText
                    value={t.get("vision_body", "To be recognized as the leading construction and engineering firm in the region, known for our commitment to quality, safety, and sustainable practices that shape communities for generations.")}
                    onSave={(v) => savePageContent("vision_body", v)}
                    tag="span"
                  />
                ) : (
                  t.get("vision_body", "To be recognized as the leading construction and engineering firm in the region, known for our commitment to quality, safety, and sustainable practices that shape communities for generations.")
                )}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════ STATISTICS ═══════ */}
        <section className="py-24 px-6 bg-[hsl(220,18%,8%)]">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-16">
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: "hsl(38,85%,62%)" }}>
                {t.get("stats_eyebrow", "By The Numbers")}
              </motion.p>
              <div className="w-10 h-px mx-auto mb-8" style={{ backgroundColor: "hsl(38,72%,52%)" }} />
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-serif font-bold tracking-tight uppercase mb-4 text-white">
                {t.get("stats_title", "Company Statistics")}
              </motion.h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[hsl(220,15%,18%)] border border-[hsl(220,15%,18%)]">
              {[
                { key: "years", value: "20+", label: "Years Experience" },
                { key: "projects", value: "100+", label: "Projects Completed" },
                { key: "team", value: "50+", label: "Expert Team Members" },
                { key: "safety", value: "100%", label: "Safety Record" },
              ].map((stat, i) => (
                <motion.div key={stat.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="bg-[hsl(220,18%,10%)] p-8 md:p-10 text-center hover:bg-[hsl(220,18%,11%)] transition-colors duration-300">
                  <p className="text-4xl md:text-5xl font-serif font-bold" style={{ color: "hsl(38,72%,52%)" }}>{t.get(`stats_${stat.key}_value`, stat.value)}</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,50%)] mt-3">{t.get(`stats_${stat.key}_label`, stat.label)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ STRENGTHS ═══════ */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-16">
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: "hsl(38,85%,62%)" }}>
                {t.get("strengths_eyebrow", "Why Choose Us")}
              </motion.p>
              <div className="w-10 h-px mx-auto mb-8" style={{ backgroundColor: "hsl(38,72%,52%)" }} />
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-serif font-bold tracking-tight uppercase mb-4 text-white">
                {t.get("strengths_title", "Our Strengths")}
              </motion.h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: "expertise", num: "01", title: "Technical Expertise", desc: "Decades of experience in complex construction and engineering projects across multiple sectors." },
                { key: "quality", num: "02", title: "Quality Assurance", desc: "Rigorous quality control processes ensuring every project meets the highest international standards." },
                { key: "safety_str", num: "03", title: "Safety First", desc: "Zero-compromise approach to workplace safety with comprehensive HSE management systems." },
                { key: "sustainability", num: "04", title: "Sustainability", desc: "Commitment to environmentally responsible construction practices and sustainable development." },
                { key: "timely", num: "05", title: "Timely Delivery", desc: "Proven track record of completing projects on schedule without compromising quality." },
                { key: "client", num: "06", title: "Client Focus", desc: "Deep understanding of client needs with personalized service and transparent communication." },
              ].map((item, i) => (
                <motion.div key={item.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-8 hover:border-[hsl(38,72%,52%)/40%] transition-colors duration-300">
                  <span className="text-3xl font-serif font-bold" style={{ color: "hsl(38,72%,52%)" }}>{item.num}</span>
                  <h3 className="text-lg font-serif font-bold uppercase tracking-tight mt-4 mb-3 text-white">
                    {t.get(`strengths_${item.key}_title`, item.title)}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {t.get(`strengths_${item.key}_desc`, item.desc)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ CORE VALUES ═══════ */}
        <section className="py-24 px-6 bg-[hsl(220,18%,8%)]">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-16">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-[10px] tracking-[0.35em] uppercase mb-4"
                style={{ color: "hsl(38,85%,62%)" }}
              >
                {t.get("values_eyebrow_label", "Core Values")}
              </motion.p>
              <div className="w-10 h-px mx-auto mb-8" style={{ backgroundColor: "hsl(38,72%,52%)" }} />
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-serif font-bold tracking-tight uppercase mb-4 text-white"
              >
                {t.get("values_eyebrow", "Our Core Values")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-sm text-gray-400 max-w-xl mx-auto"
              >
                {t.get("values_subtitle", "The principles that guide every brick we lay and every design we draft.")}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((n) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: n * 0.08, duration: 0.6 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,11%)] p-8 hover:border-[hsl(38,72%,52%)/40%] transition-colors duration-300"
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center mb-6 text-sm font-bold"
                    style={{ backgroundColor: "hsl(38,72%,52%)", color: "hsl(220,18%,9%)" }}
                  >
                    {n}
                  </div>
                  <h3 className="font-serif font-bold text-lg uppercase tracking-tight mb-3 text-white">
                    {t.get(`values_${n}_title`, n === 1 ? "Integrity" : n === 2 ? "Excellence" : n === 3 ? "Safety" : "Innovation")}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {t.get(`values_${n}_desc`, n === 1
                      ? "Uncompromising honesty and transparency in all our dealings."
                      : n === 2
                      ? "A relentless pursuit of quality in every structural detail."
                      : n === 3
                      ? "Zero-compromise approach to the well-being of our workforce."
                      : "Embracing modern engineering solutions to solve complex challenges."
                    )}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ LEADERSHIP / CEO ═══════ */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[10px] tracking-[0.35em] uppercase mb-4 text-center"
              style={{ color: "hsl(38,85%,62%)" }}
            >
              {t.get("leadership_eyebrow", "Leadership")}
            </motion.p>
            <div className="w-12 h-px bg-[hsl(38,72%,52%)] mx-auto mb-12" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-8 md:p-12 max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 items-center">
                {/* CEO Image */}
                <div className="aspect-square overflow-hidden border border-[hsl(220,15%,20%)]">
                  <img
                    src={ceoImage}
                    alt={ceoName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_CEO_IMAGE;
                    }}
                  />
                </div>

                {/* CEO Info */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold uppercase tracking-tight mb-2 text-white">
                    {ceoName}
                  </h3>
                  <p className="text-[11px] tracking-[0.3em] uppercase font-semibold mb-6" style={{ color: "hsl(38,72%,52%)" }}>
                    {ceoTitle}
                  </p>
                  <p className="text-sm leading-relaxed text-gray-300 italic">
                    "{ceoQuote}"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════ DOCUMENTS ═══════ */}
        <section className="py-24 px-6 bg-[hsl(220,18%,8%)]">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-14">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-[10px] tracking-[0.35em] uppercase mb-4"
                style={{ color: "hsl(38,85%,62%)" }}
              >
                {t.get("documents_eyebrow", "Company Documents")}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-serif font-bold tracking-tight uppercase mb-4 text-white"
              >
                {t.get("documents_title", "Documents & Policies")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed"
              >
                {t.get("documents_subtitle", "Key documents and policies from Azhar Engineering (Pvt.) Ltd. Download them for more detail about how we operate.")}
              </motion.p>
            </div>

            {docsLoading ? (
              <div className="max-w-4xl mx-auto space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />
                ))}
              </div>
            ) : documents.length === 0 ? (
              <p className="text-center text-xs tracking-[0.25em] uppercase text-[hsl(220,12%,40%)] max-w-4xl mx-auto">
                {t.get("documents_empty", "Documents will be published here soon.")}
              </p>
            ) : (
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
                {documents.map((doc, i) => (
                  <motion.a
                    key={doc.id}
                    href={doc.fileUrl}
                    download={doc.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="group flex items-start gap-4 border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,11%)] p-6 hover:border-[hsl(38,72%,52%)] hover:bg-[hsl(220,18%,12%)] transition-all duration-300"
                  >
                    <span
                      className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: "hsla(38,72%,52%,0.14)", color: "hsl(38,72%,58%)" }}
                    >
                      <FileText size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif font-bold text-base uppercase tracking-tight text-white group-hover:text-[hsl(38,72%,58%)] transition-colors mb-1.5">
                        {doc.title}
                      </span>
                      {doc.description && (
                        <span className="block text-xs text-gray-400 leading-relaxed mb-2">{doc.description}</span>
                      )}
                      <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: "hsl(38,72%,58%)" }}>
                        <Download size={11} className="transition-transform group-hover:translate-y-0.5" />
                        Download
                      </span>
                    </span>
                  </motion.a>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
