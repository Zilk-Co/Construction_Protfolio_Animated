import { useListMachinery } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { Settings2 } from "lucide-react";
import { FALLBACK_MACHINERY } from "@/lib/fallbackData";

const MACHINERY_HERO_BG =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=85";

const fallbackImage = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800";

export default function Machinery() {
  const { data: machinery = [], isLoading } = useListMachinery({ published: true });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const machineryToShow = Array.isArray(machinery) && machinery.length > 0 ? machinery : FALLBACK_MACHINERY;

  const categories = Array.isArray(machineryToShow) ? Array.from(new Set(machineryToShow.map(m => m.category).filter(Boolean) as string[])) : [];
  const filtered = Array.isArray(machineryToShow) ? (selectedCategory ? machineryToShow.filter(m => m.category === selectedCategory) : machineryToShow) : [];

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">

         {/* Hero Banner */}
         <section className="relative pt-28 pb-16 px-6 overflow-hidden md:pt-44 md:pb-24">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${MACHINERY_HERO_BG})` }}
          />
          <div className="absolute inset-0 bg-black/72" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.8) 100%)" }} />

          <div className="relative max-w-screen-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] tracking-[0.45em] uppercase font-semibold mb-5"
              style={{ color: "hsl(38,85%,68%)", textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}
            >
              Equipment & Fleet
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight uppercase mb-6 text-white"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              Machinery
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-200 max-w-2xl leading-relaxed"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
            >
              Our fleet of specialised construction equipment supports projects across the region, from excavation and piling to concrete works and heavy lifting.
            </motion.p>
          </div>
        </section>

        {/* Category Filter */}
        {categories.length > 0 && (
          <section className="px-6 py-5 border-b border-[hsl(220,15%,20%)] sticky top-[65px] bg-[hsl(220,18%,9%)] z-20">
            <div className="max-w-screen-2xl mx-auto flex flex-wrap gap-6 items-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-xs tracking-[0.2em] uppercase transition-all ${
                  selectedCategory === null
                    ? "font-semibold"
                    : "text-gray-500 hover:text-white"
                }`}
                style={selectedCategory === null ? { color: "hsl(38,72%,58%)" } : {}}
              >
                All Equipment
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs tracking-[0.2em] uppercase transition-all ${
                    selectedCategory === cat
                      ? "font-semibold"
                      : "text-gray-500 hover:text-white"
                  }`}
                  style={selectedCategory === cat ? { color: "hsl(38,72%,58%)" } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Grid */}
        <section className="py-16 px-6">
          <div className="max-w-screen-2xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] animate-pulse">
                    <div className="aspect-[16/10] bg-[hsl(220,15%,18%)]" />
                    <div className="p-5 space-y-2">
                      <div className="h-4 bg-[hsl(220,15%,20%)] w-3/4" />
                      <div className="h-3 bg-[hsl(220,15%,18%)] w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-32 text-center">
                <Settings2 size={40} className="mx-auto text-gray-700 mb-4" />
                <p className="text-gray-500 text-sm tracking-widest uppercase">No machinery listed yet</p>
                <p className="text-gray-600 text-xs mt-2">Add equipment from the admin panel</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((item, i) => (
                   <motion.div
                     key={item.id}
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.08, duration: 0.6 }}
                     className="block bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] hover:border-[hsl(38,72%,52%)] transition-all duration-300 group h-full focus:outline-none focus:ring-2 focus:ring-[hsl(38,72%,52%)] focus:ring-offset-2 focus:ring-offset-[hsl(220,18%,9%)]"
                   >
                     <Link
                       href={`/machinery/${item.slug}`}
                       className="block h-full w-full"
                     >
                    <div className="aspect-[16/10] overflow-hidden bg-[hsl(220,15%,16%)] relative">
                      <motion.img
                        src={item.imageUrl || fallbackImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.6 }}
                        onError={e => { (e.target as HTMLImageElement).src = fallbackImage; }}
                      />
                      {item.category && (
                        <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase bg-black/80 px-2.5 py-1 backdrop-blur-sm" style={{ color: "hsl(38,72%,62%)" }}>
                          {item.category}
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-serif font-bold text-lg uppercase tracking-tight mb-1 text-white group-hover:text-[hsl(38,72%,58%)] transition-colors">
                        {item.name}
                      </h3>

                      <div className="flex gap-4 text-xs text-gray-500 mt-1 mb-3">
                        {item.year && <span>{item.year}</span>}
                        {item.condition && (
                          <>
                            <span className="text-gray-700">·</span>
                            <span className={`${item.condition === "Excellent" ? "text-green-400" : item.condition === "Good" ? "text-blue-400" : "text-gray-400"}`}>
                              {item.condition}
                            </span>
                          </>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}
                     </div>
                   </Link>
                 </motion.div>
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
