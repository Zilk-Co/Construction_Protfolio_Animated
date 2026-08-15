import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { usePageContent } from "@/hooks/usePageContent";
import { Shield, Download } from "lucide-react";
import { useEffect, useState } from "react";

const DEFAULT_POLICY_BG = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=75";

type Policy = {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string | null;
  fileUrl: string | null;
  published: boolean;
};

const CATEGORY_ICONS: Record<string, string> = {
  HSE: "🛡️",
  Quality: "✅",
  Environmental: "🌿",
  Safety: "⚠️",
  HR: "👥",
  "Code of Conduct": "📋",
  Sustainability: "♻️",
  Integrity: "🤝",
  Other: "📄",
};

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const t = usePageContent("safety");

  useEffect(() => {
    document.title = "Our Policies — Azhar Engineering";
  }, []);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "";
    fetch(`${API}/api/policies`)
      .then(r => r.json())
      .then(data => { setPolicies(Array.isArray(data) ? data.filter((p: Policy) => p.published) : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = policies.reduce<Record<string, Policy[]>>((acc, p) => {
    const cat = p.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* Hero */}
        <section className="relative pt-28 pb-16 px-6 overflow-hidden md:pt-44 md:pb-24">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${DEFAULT_POLICY_BG})` }} />
          <div className="absolute inset-0 bg-black/72" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.8) 100%)" }} />
          <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />
          <div className="relative max-w-screen-2xl mx-auto">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.45em] uppercase font-semibold mb-5" style={{ color: "hsl(38,85%,68%)", textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}>
              {t.get("policy_eyebrow", "Health, Safety & Environment")}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight uppercase mb-6 text-white" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
              {t.get("policy_title", "Our Policies")}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-gray-200 max-w-2xl leading-relaxed" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}>
              {t.get("policy_p1", "At Azhar Engineering (Pvt.) Ltd, our policies are the cornerstone of our operations. We believe in transparency, safety, and excellence in everything we do.")}
            </motion.p>
          </div>
        </section>

        {/* Policies by Category */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto">
            {loading ? (
              <div className="space-y-8">
                {[1,2,3].map(i => <div key={i} className="h-40 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />)}
              </div>
            ) : policies.length === 0 ? (
              <p className="text-center text-xs tracking-[0.25em] uppercase text-[hsl(220,12%,40%)] py-16">Policies will be published here soon.</p>
            ) : (
              <div className="space-y-16">
                {Object.entries(grouped).map(([category, items]) => (
                  <motion.div key={category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <div className="flex items-center gap-4 mb-8">
                      <span className="text-2xl">{CATEGORY_ICONS[category] || "📄"}</span>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight uppercase">{category}</h2>
                        <div className="w-8 h-px bg-[hsl(38,72%,52%)] mt-2" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      {items.map(policy => (
                        <div key={policy.id} className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-6 hover:border-[hsl(38,72%,52%/0.4)] transition-colors duration-300">
                          <h3 className="text-lg font-serif font-bold uppercase tracking-tight mb-3 text-white">{policy.title}</h3>
                          {policy.content && <p className="text-sm text-gray-400 leading-relaxed mb-4">{policy.content}</p>}
                          {policy.fileUrl && (
                            <a href={policy.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: "hsl(38,72%,58%)" }}>
                              <Download size={11} /> Download PDF
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto text-center">
            <Shield size={36} className="mx-auto mb-6" style={{ color: "hsl(38,72%,52%)" }} />
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight uppercase mb-4 text-white">
              {t.get("cta_title", "Safety First, Always")}
            </h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
              {t.get("cta_body", "For more information about our policies, please contact us.")}
            </p>
            <a href="/contact" className="inline-block px-8 py-3 text-xs tracking-[0.2em] uppercase font-bold transition-colors" style={{ backgroundColor: "hsl(38,72%,52%)", color: "hsl(220,18%,9%)" }}>
              {t.get("cta_button", "Get in Touch")}
            </a>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
}
