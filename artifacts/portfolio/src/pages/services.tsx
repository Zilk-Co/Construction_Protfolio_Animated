import { useListServices, useUpdatePageContent } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { EditEntityCard } from "@/components/EditEntityCard";
import { EditableText } from "@/components/EditableText";
import { useEditMode } from "@/components/EditModeProvider";
import { HeroImageEditor } from "@/components/HeroImageEditor";

const HERO_BG_FALLBACK =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80";

const fallbackImage = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600";

const METHOD_STEPS = [
  { key: 1, icon: "01" },
  { key: 2, icon: "02" },
  { key: 3, icon: "03" },
  { key: 4, icon: "04" },
];

export default function Services() {
  const { data: services = [], isLoading } = useListServices({ published: true });
  const t = usePageContent("services");
  const { editMode } = useEditMode();
  const updatePageContent = useUpdatePageContent();

  const savePageContent = async (key: string, value: string) => {
    await updatePageContent.mutateAsync({
      data: { updates: [{ page: "services", key, value }] },
    });
  };

  const servicesToShow = Array.isArray(services) ? services : [];

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* Hero Banner */}
        <section className="relative pt-28 pb-16 px-6 overflow-hidden md:pt-44 md:pb-24">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${t.get("hero_bg", HERO_BG_FALLBACK)})` }}
          />
          <HeroImageEditor
            value={t.get("hero_bg", HERO_BG_FALLBACK)}
            onSave={(url) => savePageContent("hero_bg", url)}
          />
          <div className="absolute inset-0 bg-black/72" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.8) 100%)" }} />
          <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />

          <div className="relative max-w-screen-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] tracking-[0.45em] uppercase font-semibold mb-5"
              style={{ color: "hsl(38,85%,68%)", textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}
            >
              {t.get("hero_eyebrow", "Core Expertise")}
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
                  value={t.get("hero_title", "Operational Services")}
                  onSave={(v) => savePageContent("hero_title", v)}
                  tag="span"
                />
              ) : (
                t.get("hero_title", "Operational Services")
              )}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-200 max-w-2xl leading-relaxed"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
            >
              {editMode ? (
                <EditableText
                  value={t.get("hero_subtitle", "A full spectrum of construction and engineering capabilities delivered end-to-end — from first concept to final handover — by one accountable team.")}
                  onSave={(v) => savePageContent("hero_subtitle", v)}
                  tag="span"
                />
              ) : (
                t.get("hero_subtitle", "A full spectrum of construction and engineering capabilities delivered end-to-end — from first concept to final handover — by one accountable team.")
              )}
            </motion.p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 px-6">
          <div className="max-w-screen-2xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] animate-pulse">
                    <div className="aspect-[16/10] bg-[hsl(220,15%,18%)]" />
                    <div className="p-5 space-y-2">
                      <div className="h-4 bg-[hsl(220,15%,20%)] w-3/4" />
                      <div className="h-3 bg-[hsl(220,15%,18%)] w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : servicesToShow.length === 0 ? (
              <div className="py-32 text-center">
                <p className="text-gray-500 text-sm tracking-widest uppercase">{t.get("empty_state", "No services listed yet")}</p>
                <p className="text-gray-600 text-xs mt-2">Add services from the admin panel</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesToShow.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    className="bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] hover:border-[hsl(38,72%,52%)] transition-all duration-300 group h-full focus:outline-none focus:ring-2 focus:ring-[hsl(38,72%,52%)] focus:ring-offset-2 focus:ring-offset-[hsl(220,18%,9%)]"
                  >
                    <EditEntityCard
                      entityId={item.id}
                      entityType="service"
                      entitySlug={item.slug}
                      entityName={item.name}
                    >
                    <Link href={`/services/${item.slug}`} className="block h-full w-full">
                      <div className="aspect-[16/10] overflow-hidden bg-[hsl(220,15%,16%)] relative">
                        <motion.img
                          src={item.imageUrl || fallbackImage}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.04 }}
                          transition={{ duration: 0.6 }}
                          onError={e => { (e.target as HTMLImageElement).src = fallbackImage; }}
                        />
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-serif font-bold text-lg uppercase tracking-tight mb-1 text-white group-hover:text-[hsl(38,72%,58%)] transition-colors">
                          {item.name}
                        </h3>

                        {item.description && (
                          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4">
                            {item.description}
                          </p>
                        )}

                        <span className="mt-auto inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-semibold text-[hsl(38,72%,58%)]">
                          {t.get("card_link_label", "Explore Capability")}
                          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                    </EditEntityCard>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Methodology */}
        <section className="px-6 py-20 border-t border-[hsl(220,15%,20%)]">
          <div className="max-w-screen-2xl mx-auto">
            <div className="max-w-2xl mb-14">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[11px] tracking-[0.45em] uppercase font-semibold mb-4"
                style={{ color: "hsl(38,72%,58%)" }}
              >
                {t.get("method_eyebrow", "How We Work")}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-serif font-bold tracking-tight uppercase text-white"
              >
                {t.get("method_title", "Systematic Engineering Excellence")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-gray-400 mt-4 leading-relaxed"
              >
                {t.get("method_subtitle", "Every engagement follows a disciplined four-phase process that keeps projects on schedule, on budget, and beyond expectation.")}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[hsl(220,15%,20%)] border border-[hsl(220,15%,20%)]">
              {METHOD_STEPS.map((step, i) => (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-[hsl(220,18%,11%)] p-8 group hover:bg-[hsl(220,18%,13%)] transition-colors"
                >
                  <p className="font-serif text-4xl font-bold text-[hsl(220,15%,26%)] group-hover:text-[hsl(38,72%,52%)] transition-colors mb-5">
                    {step.icon}
                  </p>
                  <h3 className="font-serif font-bold text-lg uppercase tracking-tight text-white mb-2">
                    {t.get(`method_${step.key}_title`, "")}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {t.get(`method_${step.key}_desc`, "")}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
