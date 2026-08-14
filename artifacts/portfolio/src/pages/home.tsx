import { useListFeaturedProjects, useListServices } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { EditableText } from "@/components/EditableText";
import { useEditMode } from "@/components/EditModeProvider";
import { useUpdatePageContent } from "@workspace/api-client-react";

const SERVICES_FALLBACK = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600";

type Client = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
};

export default function Home() {
  const { data: featuredProjects = [], isLoading } = useListFeaturedProjects();
  const { data: services = [] } = useListServices({ published: true });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const loadedImagesRef = useRef<Record<number, boolean>>({});
  const [, forceRender] = useState(0);
  const t = usePageContent("home");
  const { editMode } = useEditMode();
  const updatePageContent = useUpdatePageContent();

  const displayProjects = Array.isArray(featuredProjects) ? featuredProjects.slice(0, 3) : [];

  useEffect(() => {
    if (displayProjects.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % displayProjects.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [displayProjects.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const enterPanel = useCallback((index: number) => {
    if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    setHoveredIndex(index);
  }, []);

  const leavePanel = useCallback(() => {
    if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = window.setTimeout(() => setHoveredIndex(null), 180);
  }, []);

  useEffect(() => {
    displayProjects.forEach((project: any, i: number) => {
      if (loadedImagesRef.current[i]) return;
      const img = new Image();
      img.onload = () => {
        loadedImagesRef.current[i] = true;
        forceRender(n => n + 1);
      };
      img.src = project.heroImage;
    });
  }, [displayProjects]);

  const featuredServices = Array.isArray(services) ? services : [];

  const savePageContent = async (key: string, value: string) => {
    await updatePageContent.mutateAsync({
      data: { updates: [{ page: "home", key, value }] },
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* ═══════ MOBILE: Auto-cycling carousel ═══════ */}
        <section className="h-screen w-full relative md:hidden">
          <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[hsl(220,15%,25%)] border-t-[hsl(38,72%,52%)] rounded-full animate-spin" />
            </div>
          ) : displayProjects.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center bg-[hsl(220,18%,8%)]">
              <div className="text-center">
                <p className="text-gray-500 text-sm tracking-widest uppercase mb-2">No Projects Yet</p>
                <p className="text-gray-600 text-xs">Add projects in the admin dashboard</p>
              </div>
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-20">
                        <p className="text-[11px] tracking-[0.3em] uppercase text-[hsl(38,72%,65%)] mb-2 font-semibold" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
                          {project.location || "Global"}
                        </p>
                        <h2 className="text-3xl font-serif font-bold tracking-tight uppercase leading-tight mb-3" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.85)" }}>
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
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
                {displayProjects.map((_: any, i: number) => (
                  <button key={i} onClick={() => goToSlide(i)} aria-label={`Go to slide ${i + 1}`} className={`transition-all duration-300 rounded-full ${i === currentSlide ? "w-6 h-2 bg-[hsl(38,72%,52%)]" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`} />
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
                <div key={currentSlide} className="h-full bg-[hsl(38,72%,52%)]" style={{ animation: "progressSlide 3s linear forwards" }} />
              </div>
              <style>{`@keyframes progressSlide { from { width: 0%; } to { width: 100%; } }`}</style>
            </>
          )}
        </section>

        {/* ═══════ DESKTOP: Accordion strip ═══════ */}
        <section className="hidden md:flex h-screen w-full overflow-hidden relative">
          <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />
          {isLoading ? (
            <div className="w-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[hsl(220,15%,25%)] border-t-[hsl(38,72%,52%)] rounded-full animate-spin" />
            </div>
          ) : displayProjects.length === 0 ? (
            <div className="w-full flex items-center justify-center bg-[hsl(220,18%,8%)]">
              <div className="text-center">
                <p className="text-gray-500 text-sm tracking-widest uppercase mb-2">No Projects Yet</p>
                <p className="text-gray-600 text-xs">Add projects in the admin dashboard</p>
              </div>
            </div>
          ) : (
            <>
              {displayProjects.map((project: any, i: number) => {
                const isHovered = hoveredIndex === i;
                const flexValue = hoveredIndex === null ? 1 : isHovered ? 4 : 0.4;
                const imageLoaded = !!loadedImagesRef.current[i];
                return (
                  <motion.div key={project.id} className="relative h-full group cursor-pointer overflow-hidden border-r border-white/10 last:border-r-0" animate={{ flex: flexValue }} transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }} onMouseEnter={() => enterPanel(i)} onMouseLeave={leavePanel}>
                    <Link href={`/projects/${project.slug}`} className="block w-full h-full relative">
                      {imageLoaded && (
                        <motion.div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${project.heroImage})` }} initial={{ opacity: 0 }} animate={{ opacity: 1, scale: isHovered ? 1.06 : 1 }} transition={{ opacity: { duration: 0.5 }, scale: { duration: 1.4, ease: "easeOut" } }} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-700" />
                      <div className={`absolute inset-0 bg-black/30 transition-opacity duration-700 ${isHovered ? "opacity-0" : "opacity-100"}`} />
                      {/* Hero identity overlay — always visible */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
                        <motion.div animate={{ opacity: 1, y: isHovered ? 0 : 5 }} transition={{ duration: 0.4 }}>
                          <motion.p animate={{ opacity: isHovered ? 1 : 0.82 }} className="text-[11px] tracking-[0.3em] uppercase text-[hsl(38,72%,65%)] mb-2 whitespace-nowrap overflow-hidden text-ellipsis font-semibold" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
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
              })}
              {/* Company identity overlay — always visible on desktop */}
              <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-center items-center">
                <div className="text-center px-8">
                  <img src="/logo.png" alt="Azhar Engineering" className="h-14 md:h-18 w-auto object-contain mb-4 mx-auto" style={{ filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.8))" }} />
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight uppercase text-white mb-4" style={{ textShadow: "0 4px 30px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.9)" }}>
                    {editMode ? (
                      <EditableText
                        value={t.get("hero_headline", "Architecture & Construction")}
                        onSave={(v) => savePageContent("hero_headline", v)}
                        tag="span"
                        className="inline"
                      />
                    ) : (
                      t.get("hero_headline", "Architecture & Construction")
                    )}
                  </h1>
                  <p className="text-sm md:text-base text-gray-200 max-w-xl mx-auto mb-8 leading-relaxed" style={{ textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}>
                    {t.get("hero_description", "Delivering landmark architectural and construction projects across Pakistan and the Middle East since 2005.")}
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Link href="/contact" className="pointer-events-auto bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-8 py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors inline-flex items-center gap-3" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
                      {t.get("hero_cta", "Get a Quote")} <ArrowRight size={13} />
                    </Link>
                    <Link href="/projects" className="pointer-events-auto border border-white/30 text-white px-8 py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-white/10 transition-colors" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
                      {t.get("hero_cta_secondary", "View Projects")}
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* ═══════ Mobile Hero Identity (below carousel on mobile) ═══════ */}
        <section className="md:hidden px-6 py-12 border-b border-[hsl(220,15%,18%)]">
          <div className="max-w-screen-2xl mx-auto text-center">
            <img src="/logo.png" alt="Azhar Engineering" className="h-12 w-auto object-contain mb-4 mx-auto" />
            <h1 className="text-3xl font-serif font-bold tracking-tight uppercase mb-3">
              {editMode ? (
                <EditableText
                  value={t.get("hero_headline", "Architecture & Construction")}
                  onSave={(v) => savePageContent("hero_headline", v)}
                  tag="span"
                  className="inline"
                />
              ) : (
                t.get("hero_headline", "Architecture & Construction")
              )}
            </h1>
            <p className="text-sm text-[hsl(220,12%,55%)] max-w-md mx-auto leading-relaxed mb-6">
              {editMode ? (
                <EditableText
                  value={t.get("hero_description", "Delivering landmark architectural and construction projects across Pakistan and the Middle East since 2005.")}
                  onSave={(v) => savePageContent("hero_description", v)}
                  tag="span"
                  className="inline"
                />
              ) : (
                t.get("hero_description", "Delivering landmark architectural and construction projects across Pakistan and the Middle East since 2005.")
              )}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/contact" className="bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors inline-flex items-center gap-2">
                {t.get("hero_cta", "Get a Quote")} <ArrowRight size={12} />
              </Link>
              <Link href="/projects" className="border border-[hsl(220,15%,25%)] text-white px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold hover:border-[hsl(38,72%,52%)] transition-colors">
                {t.get("hero_cta_secondary", "View Projects")}
              </Link>
            </div>
          </div>
        </section>

        {/* About Preview */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(38,72%,52%)] mb-3">
                {t.get("about_eyebrow", "About Us")}
              </p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight mb-6">
                {t.get("about_title", "Building Pakistan's")}
                <span className="block" style={{ color: "hsl(38,72%,52%)" }}>{t.get("about_title_accent", "Infrastructure")}</span>
              </h2>
              <p className="text-sm text-[hsl(220,12%,55%)] leading-relaxed mb-8">
                {t.get("about_body", "Azhar Engineering (Pvt.) Ltd is a leading construction and engineering firm dedicated to transforming the urban landscape with uncompromising quality and integrity.")}
              </p>
              <Link href="/about" className="inline-flex items-center gap-3 border border-[hsl(38,72%,52%)] text-[hsl(38,72%,52%)] px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[hsl(38,72%,52%)] hover:text-[hsl(220,18%,9%)] transition-all duration-200">
                {t.get("about_cta", "Learn More About Us")} <ArrowRight size={13} />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="grid grid-cols-2 gap-4">
              <div className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-6 text-center">
                <p className="text-3xl md:text-4xl font-serif font-bold" style={{ color: "hsl(38,72%,52%)" }}>20+</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,50%)] mt-2">Years Experience</p>
              </div>
              <div className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-6 text-center">
                <p className="text-3xl md:text-4xl font-serif font-bold" style={{ color: "hsl(38,72%,52%)" }}>100+</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,50%)] mt-2">Projects Delivered</p>
              </div>
              <div className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-6 text-center">
                <p className="text-3xl md:text-4xl font-serif font-bold" style={{ color: "hsl(38,72%,52%)" }}>50+</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,50%)] mt-2">Expert Team</p>
              </div>
              <div className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-6 text-center">
                <p className="text-3xl md:text-4xl font-serif font-bold" style={{ color: "hsl(38,72%,52%)" }}>100%</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,50%)] mt-2">Safety Record</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Selected Works — EXACTLY 3 */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex justify-between items-end mb-14">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-serif font-bold tracking-tight uppercase">
                {t.get("selected_works_title", "Selected Works")}
              </motion.h2>
              <Link href="/projects" className="text-xs tracking-[0.2em] uppercase text-[hsl(220,12%,55%)] hover:text-[hsl(38,72%,52%)] transition-colors hidden md:flex items-center gap-2">
                {t.get("selected_works_all_label", "View All Projects")} <ArrowRight size={11} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14">
              {displayProjects.map((project: any, i: number) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.65 }} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
                  <Link href={`/projects/${project.slug}`} className="block group">
                    <div className="aspect-[4/3] relative overflow-hidden bg-[hsl(220,18%,12%)] mb-5 border border-[hsl(220,15%,18%)] group-hover:border-[hsl(38,72%,52%)/40%] transition-colors duration-300">
                      <motion.div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${project.heroImage})` }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "100px" }} whileHover={{ scale: 1.05 }} transition={{ opacity: { duration: 0.4 }, scale: { duration: 0.7, ease: [0.33, 1, 0.68, 1] } }} />
                      {project.status && (
                        <span className={`absolute top-3 right-3 text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 backdrop-blur-sm border ${project.status === "Completed" ? "bg-emerald-900/75 border-emerald-500/30 text-emerald-400" : project.status === "Incoming" ? "bg-amber-900/75 border-amber-500/30 text-amber-400" : "bg-blue-900/75 border-blue-500/30 text-blue-400"}`}>
                          {project.status}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,18%,9%)/60] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold tracking-tight uppercase mb-1 group-hover:text-[hsl(38,72%,52%)] transition-colors duration-200">{project.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-[hsl(220,12%,50%)]">
                        {project.client && <span>{project.client}</span>}
                        {project.location && <span>· {project.location}</span>}
                      </div>
                      {project.status && (
                        <p className="text-[10px] tracking-[0.15em] uppercase text-[hsl(220,12%,40%)] mt-1">{project.status}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 flex justify-center md:hidden">
              <Link href="/projects" className="inline-flex items-center gap-3 border border-[hsl(38,72%,52%)] text-[hsl(38,72%,52%)] px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[hsl(38,72%,52%)] hover:text-[hsl(220,18%,9%)] transition-all duration-200">
                {t.get("selected_works_all_label", "View All Projects")} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 px-6 bg-[hsl(220,18%,10%)]/70 border-b border-[hsl(220,15%,18%)] backdrop-blur-sm">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex justify-between items-end mb-14">
              <div>
                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[10px] tracking-[0.4em] uppercase text-[hsl(38,72%,52%)] mb-3">
                  {t.get("services_eyebrow", "What We Do")}
                </motion.p>
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-serif font-bold uppercase">
                  {t.get("services_title", "Our Services")}
                </motion.h2>
              </div>
              <Link href="/services" className="text-xs tracking-[0.2em] uppercase text-[hsl(220,12%,55%)] hover:text-[hsl(38,72%,52%)] transition-colors hidden md:flex items-center gap-2">
                {t.get("services_all_label", "View All Services")} <ArrowRight size={11} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((item: any, i: number) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}>
                  <Link href={`/services/${item.slug}`} className="block bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,18%)] hover:border-[hsl(38,72%,52%)] transition-all duration-300 group">
                    <div className="aspect-[16/10] overflow-hidden relative bg-[hsl(220,15%,16%)]">
                      <img src={item.imageUrl || SERVICES_FALLBACK} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" onError={e => { (e.target as HTMLImageElement).src = SERVICES_FALLBACK; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,18%,9%)]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    </div>
                    <div className="p-5 flex flex-col min-h-[10rem]">
                      <h3 className="font-serif font-bold text-base uppercase tracking-tight mb-2 group-hover:text-[hsl(38,72%,52%)] transition-colors">{item.name}</h3>
                      {item.description && <p className="text-xs text-[hsl(220,12%,50%)] leading-relaxed line-clamp-2 mb-4">{item.description}</p>}
                      <span className="mt-auto inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase font-semibold text-[hsl(38,72%,58%)]">
                        {t.get("services_card_label", "Explore Capability")}
                        <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 flex justify-center md:hidden">
              <Link href="/services" className="inline-flex items-center gap-3 border border-[hsl(38,72%,52%)] text-[hsl(38,72%,52%)] px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[hsl(38,72%,52%)] hover:text-[hsl(220,18%,9%)] transition-all duration-200">
                {t.get("services_all_label", "View All Services")} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* Clients Section */}
        <ClientsSection />

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

/* Clients sub-component — fetches from /api/clients */
function ClientsSection() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "";
    fetch(`${API}/api/clients`)
      .then(r => r.json())
      .then(data => { setClients(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || clients.length === 0) return null;

  return (
    <section className="py-24 px-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-14">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[10px] tracking-[0.4em] uppercase text-[hsl(38,72%,52%)] mb-3">
            Our Clients
          </motion.p>
          <div className="w-10 h-px mx-auto mb-8" style={{ backgroundColor: "hsl(38,72%,52%)" }} />
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-serif font-bold tracking-tight uppercase">
            Trusted Partners
          </motion.h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clients.map((client, i) => (
            <motion.div key={client.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}>
              <Link href={`/clients/${client.slug}`} className="block border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-6 hover:border-[hsl(38,72%,52%)] transition-all duration-300 group text-center">
                {client.logoUrl ? (
                  <img src={client.logoUrl} alt={client.name} className="h-12 w-auto object-contain mx-auto mb-3" />
                ) : (
                  <div className="w-12 h-12 mx-auto mb-3 border border-[hsl(220,15%,25%)] flex items-center justify-center">
                    <span className="text-lg font-serif font-bold" style={{ color: "hsl(38,72%,52%)" }}>{client.name.charAt(0)}</span>
                  </div>
                )}
                <p className="text-sm font-serif font-bold uppercase tracking-tight group-hover:text-[hsl(38,72%,52%)] transition-colors">{client.name}</p>
                {client.description && <p className="text-[10px] text-[hsl(220,12%,45%)] mt-1 line-clamp-2">{client.description}</p>}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
