import { useListProjects } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { Building2 } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { useMemo } from "react";

const CLIENTS_HERO_BG =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=75";

export default function Clients() {
  const { data: projects = [], isLoading } = useListProjects({ published: true });
  const t = usePageContent("clients");

  const clients = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    const map = new Map<string, { name: string; projects: typeof projects }>();
    for (const p of projects) {
      const name = (p.client || "").trim();
      if (!name) continue;
      const existing = map.get(name);
      if (existing) {
        existing.projects.push(p);
      } else {
        map.set(name, { name, projects: [p] });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [projects]);

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* Hero */}
        <section className="relative pt-28 pb-16 px-6 overflow-hidden md:pt-44 md:pb-24">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${CLIENTS_HERO_BG})` }}
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
              {t.get("hero_eyebrow", "Our Clients")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight uppercase mb-6 text-white"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              {t.get("hero_title", "Clients & Partners")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-200 max-w-2xl leading-relaxed"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
            >
              {t.get("hero_subtitle", "We build lasting relationships with clients who trust us to deliver landmark projects on time and to the highest standards.")}
            </motion.p>
          </div>
        </section>

        {/* Client Grid */}
        <div className="px-6 max-w-screen-2xl mx-auto py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-40 bg-[hsl(220,18%,12%)] mb-4" />
                  <div className="h-4 bg-[hsl(220,15%,15%)] w-2/3 mb-2" />
                  <div className="h-3 bg-[hsl(220,15%,13%)] w-1/3" />
                </div>
              ))}
            </div>
          ) : clients.length === 0 ? (
            <div className="py-24 text-center">
              <Building2 size={40} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-500 text-sm tracking-widest uppercase mb-2">No Clients Yet</p>
              <p className="text-gray-600 text-xs">Add client names to your projects in the admin dashboard</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {clients.map((client, i) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="border border-[hsl(220,15%,20%)] bg-[hsl(220,18%,10%)] p-6 hover:border-[hsl(38,72%,52%)] transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full" style={{ backgroundColor: "hsla(38,72%,52%,0.14)", color: "hsl(38,72%,58%)" }}>
                        <Building2 size={18} />
                      </span>
                      <h3 className="text-base font-serif font-bold tracking-tight uppercase text-white">{client.name}</h3>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">
                      {client.projects.length} {client.projects.length === 1 ? "project" : "projects"}
                    </p>
                    <div className="space-y-2">
                      {client.projects.slice(0, 3).map(p => (
                        <Link key={p.id} href={`/projects/${p.slug}`} className="flex items-center justify-between text-xs text-gray-500 hover:text-[hsl(38,72%,52%)] transition-colors group">
                          <span className="truncate">{p.title}</span>
                          <span className="text-[10px] shrink-0 ml-2">{p.year || ""}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
}
