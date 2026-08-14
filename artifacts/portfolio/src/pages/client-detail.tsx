import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { useParams, Link } from "wouter";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";

type Client = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
};

type Project = {
  id: number;
  title: string;
  slug: string;
  location: string | null;
  status: string | null;
  heroImage: string | null;
};

export default function ClientDetail() {
  const params = useParams();
  const slug = params.slug || "";
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "";
    setLoading(true);
    let clientData: Client | null = null;
    fetch(`${API}/api/clients/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(c => {
        clientData = c;
        setClient(c);
        return fetch(`${API}/api/projects`);
      })
      .then(r => r.json())
      .then(allProjects => {
        const matched = Array.isArray(allProjects)
          ? allProjects.filter((p: any) =>
              (p.clientId && clientData && p.clientId === clientData.id) ||
              (p.client?.toLowerCase() === clientData?.name?.toLowerCase() && p.published)
            )
          : [];
        setProjects(matched);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[hsl(220,15%,25%)] border-t-[hsl(38,72%,52%)] rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !client) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-foreground gap-4">
        <h1 className="text-2xl font-serif">Client not found</h1>
        <Link href="/clients" className="mt-4 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[hsl(38,72%,52%)] hover:text-[hsl(38,72%,62%)]">
          <ArrowLeft size={12} /> Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* Hero */}
        <section className="relative pt-28 pb-16 px-6 overflow-hidden md:pt-44 md:pb-24">
          <div className="absolute inset-0 bg-[hsl(220,18%,8%)]" />
          <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />
          <div className="relative max-w-screen-2xl mx-auto">
            <Link href="/clients" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[hsl(220,12%,55%)] hover:text-[hsl(38,72%,52%)] transition-colors mb-8">
              <ArrowLeft size={12} /> All Clients
            </Link>
            <div className="flex items-center gap-6 mb-6">
              {client.logoUrl ? (
                <img src={client.logoUrl} alt={client.name} className="h-16 w-auto object-contain" />
              ) : (
                <div className="w-16 h-16 border border-[hsl(220,15%,25%)] flex items-center justify-center">
                  <span className="text-2xl font-serif font-bold" style={{ color: "hsl(38,72%,52%)" }}>{client.name.charAt(0)}</span>
                </div>
              )}
              <div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-serif font-bold tracking-tight uppercase text-white">
                  {client.name}
                </motion.h1>
                {client.website && (
                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-[hsl(38,72%,52%)] hover:text-[hsl(38,72%,62%)] transition-colors mt-2">
                    <ExternalLink size={12} /> {client.website}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        {client.description && (
          <section className="py-16 px-6 border-b border-[hsl(220,15%,18%)]">
            <div className="max-w-screen-2xl mx-auto">
              <p className="text-base text-[hsl(220,12%,65%)] leading-relaxed max-w-3xl">{client.description}</p>
            </div>
          </section>
        )}

        {/* Projects */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight uppercase mb-10">
              Projects with {client.name}
            </h2>
            {projects.length === 0 ? (
              <p className="text-xs text-[hsl(220,12%,45%)] tracking-widest uppercase">No published projects found for this client.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, i) => (
                  <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                    <Link href={`/projects/${project.slug}`} className="block group">
                      <div className="aspect-[4/3] relative overflow-hidden bg-[hsl(220,18%,12%)] mb-4 border border-[hsl(220,15%,18%)] group-hover:border-[hsl(38,72%,52%)] transition-colors duration-300">
                        {project.heroImage && (
                          <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${project.heroImage})` }} />
                        )}
                        {project.status && (
                          <span className={`absolute top-3 right-3 text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 backdrop-blur-sm border ${project.status === "Completed" ? "bg-emerald-900/75 border-emerald-500/30 text-emerald-400" : project.status === "Upcoming" ? "bg-amber-900/75 border-amber-500/30 text-amber-400" : "bg-blue-900/75 border-blue-500/30 text-blue-400"}`}>
                            {project.status}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-serif font-bold tracking-tight uppercase group-hover:text-[hsl(38,72%,52%)] transition-colors">{project.title}</h3>
                      <p className="text-xs text-[hsl(220,12%,50%)] mt-1">{project.location}</p>
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
