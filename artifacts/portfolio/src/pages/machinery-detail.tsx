import { useParams, Link } from "wouter";
import { useGetMachinery } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowLeft, Wrench, Calendar, Tag, Star } from "lucide-react";
import { buildFallbackMachinery } from "@/lib/fallbackData";

export default function MachineryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: apiItem, isLoading } = useGetMachinery(slug || "");
  const item =
    apiItem?.name ? apiItem : buildFallbackMachinery(slug || "");

  const gallery: string[] = (() => {
    if (!item?.galleryImages) return [];
    try { return JSON.parse(item.galleryImages); } catch { return []; }
  })();

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
        <p className="text-neutral-500 text-sm tracking-widest uppercase">Equipment not found</p>
        <Link href="/machinery" className="text-xs tracking-widest uppercase text-[hsl(38,72%,52%)] hover:text-white transition-colors">
          ← Back to Machinery
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
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,18%,9%)] via-[hsl(220,18%,9%)]/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link
              href="/machinery"
              className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-neutral-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={12} />
              Machinery
            </Link>
            {item.category && (
              <p className="text-[hsl(38,72%,52%)] text-xs tracking-[0.35em] uppercase mb-3">{item.category}</p>
            )}
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight uppercase text-white leading-none">
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
                className="prose prose-invert prose-neutral max-w-none"
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
                    <div key={i} className="aspect-video overflow-hidden bg-[hsl(220,18%,12%)]">
                      <img
                        src={url}
                        alt={`${item.name} ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Specs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="border border-[hsl(220,15%,20%)] p-6 space-y-5">
              <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-2">Specifications</p>

              {item.category && (
                <div className="flex items-start gap-3">
                  <Tag size={13} className="text-neutral-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] tracking-[0.25em] uppercase text-neutral-600 mb-0.5">Category</p>
                    <p className="text-sm text-neutral-200">{item.category}</p>
                  </div>
                </div>
              )}

              {item.year && (
                <div className="flex items-start gap-3">
                  <Calendar size={13} className="text-neutral-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] tracking-[0.25em] uppercase text-neutral-600 mb-0.5">Year</p>
                    <p className="text-sm text-neutral-200">{item.year}</p>
                  </div>
                </div>
              )}

              {item.condition && (
                <div className="flex items-start gap-3">
                  <Wrench size={13} className="text-neutral-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] tracking-[0.25em] uppercase text-neutral-600 mb-0.5">Condition</p>
                    <p className="text-sm text-neutral-200">{item.condition}</p>
                  </div>
                </div>
              )}

              {item.featured && (
                <div className="flex items-center gap-2 pt-2 border-t border-[hsl(220,15%,18%)]">
                  <Star size={11} className="text-[hsl(38,72%,52%)]" fill="currentColor" />
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(38,72%,52%)]">Featured Equipment</p>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="block w-full text-center py-4 border border-[hsl(38,72%,52%)] text-[hsl(38,72%,52%)] text-xs tracking-[0.25em] uppercase hover:bg-[hsl(38,72%,52%)] hover:text-[hsl(220,18%,9%)] transition-all duration-300"
            >
              Enquire About This Equipment
            </Link>

            <Link
              href="/machinery"
              className="block w-full text-center py-3 border border-[hsl(220,15%,22%)] text-neutral-500 text-xs tracking-[0.25em] uppercase hover:border-neutral-600 hover:text-neutral-300 transition-all duration-300"
            >
              ← All Machinery
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
