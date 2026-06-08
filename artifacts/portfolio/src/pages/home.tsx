import { useListFeaturedProjects, useListMachinery } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Settings2 } from "lucide-react";
import { FALLBACK_MACHINERY } from "@/lib/fallbackData";
import { usePageContent } from "@/hooks/usePageContent";

const MACHINERY_FALLBACK = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800";

export default function Home() {
  const { data: featuredProjects = [], isLoading } = useListFeaturedProjects();
  const { data: machinery = [] } = useListMachinery({ published: true });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = usePageContent("home");

  const displayProjects =
    Array.isArray(featuredProjects) && featuredProjects.length > 0
      ? featuredProjects.slice(0, 5)
      : [
          { id: 1, title: "Obsidian Cultural Centre", slug: "obsidian-cultural-centre", location: "Dubai, UAE", heroImage: "https://images.unsplash.com/photo-1470723710355-95304d8aece4?w=1600" },
          { id: 2, title: "Meridian Tower", slug: "meridian-tower", location: "Shenzhen, China", heroImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600" },
          { id: 3, title: "Heliodor Residences", slug: "heliodor-residences", location: "Monaco", heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600" },
          { id: 4, title: "Civic Axis", slug: "civic-axis-masterplan", location: "Riyadh", heroImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600" },
          { id: 5, title: "Quay District", slug: "quay-district-towers", location: "Auckland", heroImage: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1600" },
        ] as any[];

  // Mobile: auto-advance carousel every 3s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % displayProjects.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [displayProjects.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const featuredMachinery = Array.isArray(machinery) && machinery.length > 0 ? machinery.slice(0, 4) : FALLBACK_MACHINERY.slice(0, 4);

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* ═══════ MOBILE: Auto-cycling carousel ═══════ */}
        <section className="h-screen w-full relative md:hidden">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[hsl(220,15%,25%)] border-t-[hsl(38,72%,52%)] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {displayProjects.map((project: any, i: number) => {
                const isActive = i === currentSlide;
                return (
                  <div
                    key={project.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                  >
                    <Link href={`/projects/${project.slug}`} className="block w-full h-full relative">
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${project.heroImage})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-20">
                        <p
                          className="text-[11px] tracking-[0.3em] uppercase text-[hsl(38,72%,65%)] mb-2 font-semibold"
                          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)" }}
                        >
                          {project.location || "Global"}
                        </p>
                        <h2
                          className="text-3xl font-serif font-bold tracking-tight uppercase leading-tight mb-3"
                          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" }}
                        >
                          {project.title}
                        </h2>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] tracking-[0.25em] uppercase text-[hsl(38,72%,52%)]">View Project</span>
                          <ArrowRight size={11} className="text-[hsl(38,72%,52%)]" />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}

              {/* Dot indicators */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
                {displayProjects.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      i === currentSlide
                        ? "w-6 h-2 bg-[hsl(38,72%,52%)]"
                        : "w-2 h-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
                <div
                  key={currentSlide}
                  className="h-full bg-[hsl(38,72%,52%)]"
                  style={{ animation: "progressSlide 3s linear forwards" }}
                />
              </div>

              <style>{`
                @keyframes progressSlide {
                  from { width: 0%; }
                  to { width: 100%; }
                }
              `}</style>
            </>
          )}
        </section>

        {/* ═══════ DESKTOP: Accordion strip (unchanged) ═══════ */}
        <section className="hidden md:flex h-screen w-full overflow-hidden">
          {isLoading ? (
            <div className="w-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[hsl(220,15%,25%)] border-t-[hsl(38,72%,52%)] rounded-full animate-spin" />
            </div>
          ) : (
            displayProjects.map((project: any, i: number) => {
              const isHovered = hoveredIndex === i;
              const flexValue = hoveredIndex === null ? 1 : isHovered ? 4 : 0.4;

              return (
                <motion.div
                  key={project.id}
                  className="relative h-full group cursor-pointer overflow-hidden border-r border-white/10 last:border-r-0"
                  animate={{ flex: flexValue }}
                  transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Link href={`/projects/${project.slug}`} className="block w-full h-full relative">
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${project.heroImage})` }}
                      animate={{ scale: isHovered ? 1.06 : 1 }}
                      transition={{ duration: 1.4, ease: "easeOut" }}
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-700" />
                     <div className={`absolute inset-0 bg-black/30 transition-opacity duration-700 ${isHovered ? "opacity-0" : "opacity-100"}`} />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                      <motion.div animate={{ opacity: 1, y: isHovered ? 0 : 5 }} transition={{ duration: 0.4 }}>
                        <motion.p animate={{ opacity: isHovered ? 1 : 0.82 }} className="text-[11px] tracking-[0.3em] uppercase text-[hsl(38,72%,65%)] mb-2 whitespace-nowrap overflow-hidden text-ellipsis font-semibold" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)" }}>
                          {project.location || "Global"}
                        </motion.p>
                        <motion.h2 animate={{ opacity: isHovered || hoveredIndex === null ? 1 : 0.3 }} className="text-xl md:text-2xl lg:text-4xl font-serif font-bold tracking-tight uppercase leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                          {project.title}
                        </motion.h2>
                        <motion.div animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }} transition={{ duration: 0.35, delay: 0.1 }} className="flex items-center gap-2 mt-3">
                          <span className="text-[10px] tracking-[0.25em] uppercase text-[hsl(38,72%,52%)]">View Project</span>
                          <ArrowRight size={11} className="text-[hsl(38,72%,52%)]" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </section>

        {/* Intro strip */}
        <section className="border-b border-[hsl(220,15%,18%)] px-6 py-12">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(38,72%,52%)] mb-2">{t.get("intro_eyebrow", "Zain Manzoor Co.")}</p>
              <h2 className="text-2xl md:text-4xl font-serif font-bold uppercase tracking-tight">{t.get("intro_title", "Architecture & Construction")}</h2>
            </div>
            <p className="text-sm text-[hsl(220,12%,55%)] max-w-md leading-relaxed">
              {t.get("intro_body", "A multi-disciplinary practice delivering landmark architectural and construction projects across the Middle East and South Asia since 2005.")}
            </p>
            <Link href="/projects" className="shrink-0 inline-flex items-center gap-3 border border-[hsl(38,72%,52%)] text-[hsl(38,72%,52%)] px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[hsl(38,72%,52%)] hover:text-[hsl(220,18%,9%)] transition-all duration-200">
              {t.get("intro_cta_label", "View All Projects")} <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* Selected Works Grid */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex justify-between items-end mb-14">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-serif font-bold tracking-tight uppercase">
                {t.get("selected_works_title", "Selected Works")}
              </motion.h2>
              <Link href="/projects" className="text-xs tracking-[0.2em] uppercase text-[hsl(220,12%,55%)] hover:text-[hsl(38,72%,52%)] transition-colors hidden md:flex items-center gap-2">
                {t.get("selected_works_all_label", "All Projects")} <ArrowRight size={11} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {displayProjects.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.65 }} whileHover={{ y: -8, transition: { duration: 0.2 } }} className="transition-transform duration-200">
                  <Link href={`/projects/${project.slug}`} className="block group">
                    <div className="aspect-[4/3] relative overflow-hidden bg-[hsl(220,18%,12%)] mb-5 border border-[hsl(220,15%,18%)] group-hover:border-[hsl(38,72%,52%)/40%] transition-colors duration-300 shadow-lg group-hover:shadow-[hsl(38,72%,52%)/20%]">
                      <motion.div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${project.heroImage})` }} whileHover={{ scale: 1.05 }} transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,18%,9%)/60%] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-serif font-bold tracking-tight uppercase mb-1 group-hover:text-[hsl(38,72%,52%)] transition-colors duration-200">{project.title}</h3>
                        <p className="text-xs text-[hsl(220,12%,50%)]">{project.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[hsl(220,12%,45%)] uppercase tracking-wider">{project.sector}</p>
                        <p className="text-xs text-[hsl(220,12%,40%)] mt-0.5">{project.year}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Machinery Section */}
        <section className="py-24 px-6 bg-[hsl(220,18%,10%)]/70 border-y border-[hsl(220,15%,18%)] backdrop-blur-sm">
            <div className="max-w-screen-2xl mx-auto">
              <div className="flex justify-between items-end mb-14">
                <div>
                  <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[10px] tracking-[0.4em] uppercase text-[hsl(38,72%,52%)] mb-3">
                    {t.get("machinery_eyebrow", "Equipment & Fleet")}
                  </motion.p>
                  <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-serif font-bold uppercase">
                    {t.get("machinery_title", "Our Machinery")}
                  </motion.h2>
                </div>
                <Link href="/machinery" className="text-xs tracking-[0.2em] uppercase text-[hsl(220,12%,55%)] hover:text-[hsl(38,72%,52%)] transition-colors hidden md:flex items-center gap-2">
                  {t.get("machinery_all_label", "All Equipment")} <ArrowRight size={11} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredMachinery.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                  >
                    <Link href={`/machinery/${item.slug}`} className="block bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,18%)] hover:border-[hsl(38,72%,52%)] transition-all duration-300 group">
                      <div className="aspect-[4/3] overflow-hidden relative bg-[hsl(220,15%,16%)]">
                        <img
                          src={item.imageUrl || MACHINERY_FALLBACK}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                          onError={e => { (e.target as HTMLImageElement).src = MACHINERY_FALLBACK; }}
                        />
                        {item.category && (
                          <span className="absolute top-2 left-2 text-[9px] tracking-[0.2em] uppercase bg-[hsl(220,18%,9%)]/80 text-[hsl(38,72%,52%)] px-2 py-0.5 backdrop-blur-sm">
                            {item.category}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,18%,9%)]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif font-bold text-sm uppercase tracking-tight mb-1 group-hover:text-[hsl(38,72%,52%)] transition-colors">{item.name}</h3>
                        <div className="flex gap-3 text-[10px] text-[hsl(220,12%,45%)] mb-2">
                          {item.year && <span>{item.year}</span>}
                          {item.condition && <><span>·</span><span>{item.condition}</span></>}
                        </div>
                        {item.description && (
                          <p className="text-xs text-[hsl(220,12%,50%)] leading-relaxed line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 flex justify-center md:hidden">
                <Link href="/machinery" className="inline-flex items-center gap-3 border border-[hsl(38,72%,52%)] text-[hsl(38,72%,52%)] px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[hsl(38,72%,52%)] hover:text-[hsl(220,18%,9%)] transition-all duration-200">
                  {t.get("machinery_all_label", "All Equipment")} <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </section>

        {/* CTA strip */}
        <section className="py-20 px-6 bg-[hsl(220,18%,11%)] border-y border-[hsl(220,15%,18%)]">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-serif font-bold uppercase tracking-tight mb-2">{t.get("cta_title", "Have a project in mind?")}</h2>
              <p className="text-sm text-[hsl(220,12%,55%)]">{t.get("cta_body", "Let us bring your vision to life.")}</p>
            </div>
            <Link href="/contact" className="shrink-0 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-10 py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors inline-flex items-center gap-3">
              {t.get("cta_button_label", "Start a Conversation")} <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
