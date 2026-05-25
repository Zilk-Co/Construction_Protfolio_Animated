import { useListProjects, useListCategories } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { SlidersHorizontal, Calendar } from "lucide-react";

const DATE_RANGES = [
  { label: "All Years", value: "all" },
  { label: "Before 2010", value: "pre2010" },
  { label: "2010 – 2015", value: "2010-2015" },
  { label: "2015 – 2020", value: "2015-2020" },
  { label: "After 2020", value: "post2020" },
];

function matchesDateRange(year: string | null | undefined, range: string) {
  if (range === "all" || !year) return range === "all";
  const y = parseInt(year, 10);
  if (isNaN(y)) return false;
  if (range === "pre2010") return y < 2010;
  if (range === "2010-2015") return y >= 2010 && y <= 2015;
  if (range === "2015-2020") return y > 2015 && y <= 2020;
  if (range === "post2020") return y > 2020;
  return true;
}

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState("all");

  const { data: categories = [] } = useListCategories();
  const { data: projects = [], isLoading } = useListProjects({ published: true });

  const filteredProjects = projects.filter(p => {
    const catOk = selectedCategory === null || p.categoryId === selectedCategory;
    const dateOk = matchesDateRange(p.year, selectedRange);
    return catOk && dateOk;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <div className="px-6 max-w-screen-2xl mx-auto">
          {/* Header */}
          <header className="mb-16 mt-6">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tracking-[0.4em] uppercase text-[hsl(38,72%,52%)] mb-3">
              Portfolio
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-serif font-bold tracking-tight uppercase mb-10">
              All Projects
            </motion.h1>

            {/* Category filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap items-center gap-2 border-t border-[hsl(220,15%,18%)] pt-4 pb-3"
            >
              <SlidersHorizontal size={12} className="text-[hsl(220,12%,45%)] mr-2 shrink-0" />
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-all ${selectedCategory === null ? "bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] font-bold" : "border border-[hsl(220,15%,22%)] text-[hsl(220,12%,55%)] hover:border-[hsl(38,72%,52%)/50%] hover:text-foreground"}`}
              >
                All Types
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-all ${selectedCategory === cat.id ? "bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] font-bold" : "border border-[hsl(220,15%,22%)] text-[hsl(220,12%,55%)] hover:border-[hsl(38,72%,52%)/50%] hover:text-foreground"}`}
                >
                  {cat.name}
                </button>
              ))}
            </motion.div>

            {/* Date range filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-2 border-b border-[hsl(220,15%,18%)] pb-4"
            >
              <Calendar size={12} className="text-[hsl(220,12%,45%)] mr-2 shrink-0" />
              {DATE_RANGES.map(r => (
                <button
                  key={r.value}
                  onClick={() => setSelectedRange(r.value)}
                  className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-all ${selectedRange === r.value ? "bg-[hsl(220,15%,22%)] text-foreground font-bold border border-[hsl(220,15%,30%)]" : "border border-transparent text-[hsl(220,12%,45%)] hover:text-foreground"}`}
                >
                  {r.label}
                </button>
              ))}
              <span className="ml-auto text-xs text-[hsl(220,12%,40%)]">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
              </span>
            </motion.div>
          </header>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[hsl(220,18%,12%)] mb-4" />
                  <div className="h-4 bg-[hsl(220,15%,15%)] w-2/3 mb-2" />
                  <div className="h-3 bg-[hsl(220,15%,13%)] w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 pb-24">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  data-testid={`card-project-${project.id}`}
                >
                  <Link href={`/projects/${project.slug}`} className="block group">
                    <div className="aspect-[4/3] relative overflow-hidden bg-[hsl(220,18%,12%)] mb-5 border border-[hsl(220,15%,18%)] group-hover:border-[hsl(38,72%,52%)/40%] transition-colors duration-300">
                      {project.heroImage ? (
                        <motion.div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${project.heroImage})` }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-br from-[hsl(220,18%,14%)] to-[hsl(220,18%,9%)]">
                          <span className="text-sm font-serif uppercase text-[hsl(220,12%,40%)]">{project.title}</span>
                        </div>
                      )}
                      {project.categoryName && (
                        <span className="absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase bg-[hsl(220,18%,9%)/80%] text-[hsl(38,72%,52%)] px-2.5 py-1 backdrop-blur-sm">
                          {project.categoryName}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-serif font-bold tracking-tight uppercase mb-1 group-hover:text-[hsl(38,72%,52%)] transition-colors duration-200">
                          {project.title}
                        </h3>
                        <p className="text-xs text-[hsl(220,12%,50%)]">{project.location}</p>
                      </div>
                      <p className="text-xs text-[hsl(220,12%,40%)]">{project.year || "Ongoing"}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {filteredProjects.length === 0 && (
                <div className="col-span-full py-24 text-center">
                  <p className="text-[hsl(220,12%,45%)] text-sm tracking-widest uppercase">No projects match this filter</p>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
}
