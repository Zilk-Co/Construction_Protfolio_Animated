import { useParams, Link } from "wouter";
import { useGetServices } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FolderOpen, X, ChevronLeft, ChevronRight } from "lucide-react";
import { buildFallbackService } from "@/lib/fallbackData";
import { useState } from "react";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: apiItem, isLoading } = useGetServices(slug || "");
  const item = apiItem?.name ? apiItem : buildFallbackService(slug || "");

  const gallery: string[] = (() => {
    if (!item?.galleryImages) return [];
    try { return JSON.parse(item.galleryImages); } catch { return []; }
  })();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex(i => i !== null ? (i - 1 + gallery.length) % gallery.length : null);
  const next = () => setLightboxIndex(i => i !== null ? (i + 1) % gallery.length : null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-800 border-t-[hsl(38,72%,52%)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-neutral-500 text-sm tracking-widest uppercase">Service not found</p>
        <Link href="/services" className="text-xs tracking-widest uppercase text-[hsl(38,72%,52%)] hover:text-white transition-colors">
          ← Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[hsl(220,18%,12%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,18%,9%)] via-[hsl(220,18%,9%)]/80 to-[hsl(220,18%,9%)]/30" />

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-neutral-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={12} />
              Services
            </Link>
            {typeof item.projectCount === "number" && (
              <p
                className="text-[hsl(38,72%,52%)] text-xs tracking-[0.35em] uppercase mb-3"
                style={{ textShadow: "0 1px 12px rgba(0,0,0,0.95)" }}
              >
                {item.projectCount} {item.projectCount === 1 ? "Project" : "Projects"}
              </p>
            )}
            <h1
              className="text-4xl md:text-6xl font-serif font-bold tracking-tight uppercase text-white leading-none"
              style={{ textShadow: "0 4px 24px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" }}
            >
              {item.name}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left: Description */}
          <div className="lg:col-span-2 space-y-10">
            {item.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <p className="text-xl text-neutral-300 leading-relaxed font-light">{item.description}</p>
              </motion.div>
            )}

            {item.longDescription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="h-px bg-[hsl(220,15%,20%)] mb-8" />
                <p className="text-neutral-400 leading-loose font-light whitespace-pre-line">{item.longDescription}</p>
              </motion.div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <div className="h-px bg-[hsl(220,15%,20%)] mb-8" />
                <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-500 mb-6">Gallery</p>
                <div className="grid grid-cols-2 gap-3">
                  {gallery.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => openLightbox(i)}
                      className="aspect-video overflow-hidden bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] hover:border-[hsl(38,72%,52%)] transition-colors group cursor-zoom-in relative block w-full"
                      data-testid={`gallery-image-${i}`}
                    >
                      <img
                        src={url}
                        alt={`${item.name} ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="text-white text-[10px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to view
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="border border-[hsl(220,15%,20%)] p-6 space-y-5">
              <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-2">Overview</p>

              <div className="flex items-start gap-3">
                <FolderOpen size={13} className="text-neutral-500 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] tracking-[0.25em] uppercase text-neutral-600 mb-0.5">Projects Delivered</p>
                  {item.projects && item.projects.length > 0 ? (
                    <ul className="space-y-2.5 mt-1">
                      {item.projects.map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/projects/${p.slug}`}
                            className="group block border-l-2 border-transparent hover:border-[hsl(38,72%,52%)] pl-3 -ml-1 transition-colors"
                          >
                            <p className="text-sm text-neutral-200 group-hover:text-[hsl(38,72%,58%)] transition-colors leading-snug">
                              {p.title}
                            </p>
                            <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mt-0.5">
                              {[p.location, p.sector, p.year].filter(Boolean).join(" · ") || "View project"}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-neutral-200">
                      {typeof item.projectCount === "number" && item.projectCount > 0
                        ? `${item.projectCount} ${item.projectCount === 1 ? "Project" : "Projects"}`
                        : "No projects published yet"}
                    </p>
                  )}
                </div>
              </div>

              <Link
                href="/projects"
                className="block w-full text-center py-3 border border-[hsl(220,15%,22%)] text-neutral-500 text-xs tracking-[0.25em] uppercase hover:border-[hsl(38,72%,52%)] hover:text-[hsl(38,72%,58%)] transition-all duration-300"
              >
                View All Portfolio
              </Link>
            </div>

            <Link
              href="/contact"
              className="block w-full text-center py-4 border border-[hsl(38,72%,52%)] text-[hsl(38,72%,52%)] text-xs tracking-[0.25em] uppercase hover:bg-[hsl(38,72%,52%)] hover:text-[hsl(220,18%,9%)] transition-all duration-300"
            >
              Discuss This Service
            </Link>

            <Link
              href="/services"
              className="block w-full text-center py-3 border border-[hsl(220,15%,22%)] text-neutral-500 text-xs tracking-[0.25em] uppercase hover:border-neutral-600 hover:text-neutral-300 transition-all duration-300"
            >
              ← All Services
            </Link>
          </motion.div>
        </div>
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
              aria-label="Close"
            >
              <X size={28} />
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 text-white/60 hover:text-white transition-colors z-10 p-3"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={36} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); next(); }}
                  className="absolute right-4 text-white/60 hover:text-white transition-colors z-10 p-3"
                  aria-label="Next image"
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
              src={gallery[lightboxIndex]}
              alt={`${item.name} — view ${lightboxIndex + 1}`}
              className="max-w-[90vw] max-h-[88vh] object-contain"
              onClick={e => e.stopPropagation()}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase">
              {lightboxIndex + 1} / {gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
