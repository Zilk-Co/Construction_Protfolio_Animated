import { useGetProject, getGetProjectQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectDetail() {
  const params = useParams();
  const slug = params.slug || "";

  const { data: project, isLoading } = useGetProject(slug, {
    query: { enabled: !!slug, queryKey: getGetProjectQueryKey(slug) }
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[hsl(220,15%,25%)] border-t-[hsl(38,72%,52%)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        <h1 className="text-2xl font-serif">Project not found</h1>
      </div>
    );
  }

  const metadata = [
    { label: "Location", value: project.location },
    { label: "Client", value: project.client },
    { label: "Sector", value: project.sector },
    { label: "Size", value: project.size },
    { label: "Scope", value: project.scope },
    { label: "Status", value: project.status },
    { label: "Year", value: project.year },
  ].filter(m => m.value);

  const fallbackImage = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600";
  const sortedImages = (project.images || []).slice().sort((a, b) => a.sortOrder - b.sortOrder);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex(i => i !== null ? (i - 1 + sortedImages.length) % sortedImages.length : null);
  const next = () => setLightboxIndex(i => i !== null ? (i + 1) % sortedImages.length : null);

  return (
    <PageTransition>
      <div className="bg-background min-h-screen text-foreground">
        {/* Section A: Hero */}
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${project.heroImage || fallbackImage})`,
              y,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,18%,7%)] via-[hsl(220,18%,9%)/30%] to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 max-w-screen-2xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {project.categoryName && (
                <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(38,72%,52%)] mb-4">
                  {project.categoryName}
                </p>
              )}
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold tracking-tight uppercase leading-none">
                {project.title}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Section B: Fact Sheet + Narrative */}
        <section className="py-24 px-6 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-[hsl(220,15%,18%)] pb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="lg:col-span-4"
            >
              <h3 className="text-[10px] tracking-[0.35em] uppercase text-[hsl(220,12%,45%)] mb-6">
                Fact Sheet
              </h3>
              <div className="border border-[hsl(220,15%,18%)]">
                {metadata.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-stretch ${i < metadata.length - 1 ? "border-b border-[hsl(220,15%,18%)]" : ""}`}
                  >
                    <div className="w-2/5 px-4 py-4 bg-[hsl(220,18%,11%)] border-r border-[hsl(220,15%,18%)] flex items-center">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,50%)] font-medium">
                        {item.label}
                      </span>
                    </div>
                    <div className="w-3/5 px-4 py-4 flex items-center">
                      <span className="text-sm font-serif font-medium text-foreground">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-7 lg:col-start-6"
            >
              <h3 className="text-[10px] tracking-[0.35em] uppercase text-[hsl(220,12%,45%)] mb-6">
                Project Narrative
              </h3>
              <div>
                {project.longDescription ? (
                  project.longDescription.split("\n\n").map((para, i) => (
                    <p key={i} className="text-base leading-[1.85] text-[hsl(220,12%,70%)] font-light mb-6 last:mb-0">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-base leading-relaxed text-[hsl(220,12%,60%)] font-light">
                    Project documentation and narrative forthcoming.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section C: Clickable Image Gallery */}
        {sortedImages.length > 0 && (
          <section className="pb-24 px-6 max-w-screen-2xl mx-auto">
            <h3 className="text-[10px] tracking-[0.35em] uppercase text-[hsl(220,12%,45%)] mb-10">
              Photography
            </h3>
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {sortedImages.map((img, i) => (
                <motion.button
                  key={img.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08, duration: 0.7 }}
                  onClick={() => openLightbox(i)}
                  className="break-inside-avoid overflow-hidden bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] hover:border-[hsl(38,72%,52%)/50%] transition-colors duration-300 w-full text-left group cursor-zoom-in"
                >
                  <img
                    src={img.imageUrl}
                    alt={`${project.title} — view ${i + 1}`}
                    className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out block"
                    loading="lazy"
                  />
                </motion.button>
              ))}
            </div>
          </section>
        )}

        <Footer />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            >
              <X size={28} />
            </button>

            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 text-white/60 hover:text-white transition-colors z-10 p-3"
                >
                  <ChevronLeft size={36} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); next(); }}
                  className="absolute right-4 text-white/60 hover:text-white transition-colors z-10 p-3"
                >
                  <ChevronRight size={36} />
                </button>
              </>
            )}

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              src={sortedImages[lightboxIndex]?.imageUrl}
              alt={`${project.title} — view ${lightboxIndex + 1}`}
              className="max-w-[90vw] max-h-[88vh] object-contain"
              onClick={e => e.stopPropagation()}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase">
              {lightboxIndex + 1} / {sortedImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
