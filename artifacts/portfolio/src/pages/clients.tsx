import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { usePageContent } from "@/hooks/usePageContent";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

const CLIENTS_HERO_BG = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=75";

type Client = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  sortOrder: number;
  published: boolean;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const t = usePageContent("clients");

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "";
    fetch(`${API}/api/clients`)
      .then(r => r.json())
      .then(data => { setClients(Array.isArray(data) ? data.filter((c: Client) => c.published) : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* Hero */}
        <section className="relative pt-28 pb-16 px-6 overflow-hidden md:pt-44 md:pb-24">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${CLIENTS_HERO_BG})` }} />
          <div className="absolute inset-0 bg-black/72" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.8) 100%)" }} />
          <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />
          <div className="relative max-w-screen-2xl mx-auto">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.45em] uppercase font-semibold mb-5" style={{ color: "hsl(38,85%,68%)", textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}>
              {t.get("clients_eyebrow", "Our Partners")}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight uppercase mb-6 text-white" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
              {t.get("clients_title", "Our Clients")}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-gray-200 max-w-2xl leading-relaxed" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}>
              {t.get("clients_subtitle", "We are proud to work with leading organizations across construction, infrastructure, and development.")}
            </motion.p>
          </div>
        </section>

        {/* Client Grid */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />)}
              </div>
            ) : clients.length === 0 ? (
              <p className="text-center text-xs tracking-[0.25em] uppercase text-[hsl(220,12%,40%)] py-16">{t.get("clients_empty", "No clients yet.")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client, i) => (
                  <motion.div key={client.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}>
                    <Link href={`/clients/${client.slug}`} className="block border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-8 hover:border-[hsl(38,72%,52%)] transition-all duration-300 group h-full">
                      <div className="flex items-start justify-between mb-4">
                        {client.logoUrl ? (
                          <img src={client.logoUrl} alt={client.name} className="h-14 w-auto object-contain" />
                        ) : (
                          <div className="w-14 h-14 border border-[hsl(220,15%,25%)] flex items-center justify-center">
                            <span className="text-xl font-serif font-bold" style={{ color: "hsl(38,72%,52%)" }}>{client.name.charAt(0)}</span>
                          </div>
                        )}
                        {client.website && (
                          <a href={client.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-[hsl(220,12%,40%)] hover:text-[hsl(38,72%,52%)] transition-colors">
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                      <h3 className="text-lg font-serif font-bold uppercase tracking-tight mb-2 group-hover:text-[hsl(38,72%,52%)] transition-colors">{client.name}</h3>
                      {client.description && <p className="text-xs text-[hsl(220,12%,50%)] leading-relaxed line-clamp-3">{client.description}</p>}
                      {client.website && <p className="text-[10px] text-[hsl(220,12%,40%)] mt-3 truncate">{client.website}</p>}
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
