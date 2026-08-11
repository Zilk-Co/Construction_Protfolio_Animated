import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight,
  Plus,
  Users,
  ClipboardCheck,
  HardHat,
  ShieldAlert,
  Cog,
  BadgeCheck,
  Leaf,
  Siren,
  HeartHandshake,
} from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";

const DEFAULT_HERO_BG = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80";
const DEFAULT_POLICY_BG = "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1200&q=80";

const PILLARS = [
  { icon: Users },
  { icon: ClipboardCheck },
  { icon: HardHat },
  { icon: ShieldAlert },
  { icon: Cog },
  { icon: BadgeCheck },
  { icon: Leaf },
  { icon: Siren },
  { icon: HeartHandshake },
];

export default function Safety() {
  const t = usePageContent("safety");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">

        {/* ═══════ HERO ═══════ */}
        <section className="relative pt-44 pb-28 px-6 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${t.get("hero_bg", DEFAULT_HERO_BG)})` }}
          />
          <div className="absolute inset-0 bg-black/72" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.78) 100%)" }} />

          <div className="relative max-w-screen-2xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] tracking-[0.45em] uppercase font-semibold mb-5"
              style={{ color: "hsl(38,85%,68%)", textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}
            >
              {t.get("hero_eyebrow", "Commitment")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight uppercase mb-6 text-white"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              {t.get("hero_title", "Safety & Care")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
            >
              {t.get("hero_subtitle", "Zero compromises. We build with a profound responsibility toward our workforce, the environment, and the communities we serve.")}
            </motion.p>
          </div>
        </section>

        {/* ═══════ HSE POLICY ═══════ */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="aspect-[4/5] overflow-hidden border border-[hsl(220,15%,18%)]"
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${t.get("policy_bg", DEFAULT_POLICY_BG)})` }}
              />
            </motion.div>

            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[10px] tracking-[0.35em] uppercase mb-1"
                style={{ color: "hsl(38,85%,62%)" }}
              >
                {t.get("policy_eyebrow", "Health, Safety & Environment")}
              </motion.p>
              <div className="w-8 h-px bg-[hsl(38,72%,52%)] mb-6" />
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-serif font-bold tracking-tight uppercase mb-8 text-white"
              >
                {t.get("policy_title", "Our HSE Policy")}
              </motion.h2>
              <div className="space-y-5">
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="text-sm leading-relaxed text-gray-300"
                >
                  {t.get("policy_p1", "At Azhar Engineering (Pvt.) Ltd, our HSE policy is the cornerstone of our operations. We believe that every accident is preventable and that a safe working environment is a fundamental right. Our comprehensive HSE framework ensures that environmental protection, occupational health, and safety are integrated into all phases of our construction and engineering projects.")}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                  className="text-sm leading-relaxed text-gray-300"
                >
                  {t.get("policy_p2", "We mandate strict compliance with both national regulations and international best practices. Regular audits, continuous monitoring, and proactive risk mitigation strategies form the basis of our commitment to zero-harm operations across all project sites.")}
                </motion.p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ SAFETY PILLARS / ACCORDION ═══════ */}
        <section className="py-24 px-6 bg-[hsl(220,18%,8%)]">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-16">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-[10px] tracking-[0.35em] uppercase mb-4"
                style={{ color: "hsl(38,85%,62%)" }}
              >
                {t.get("pillars_eyebrow", "How We Protect")}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-serif font-bold tracking-tight uppercase mb-4 text-white"
              >
                {t.get("pillars_title", "Our Safety Framework")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-sm text-gray-400 max-w-xl mx-auto"
              >
                {t.get("pillars_subtitle", "Nine disciplines, one promise — that every person on our sites goes home safe, every single day.")}
              </motion.p>
            </div>

            <div className="max-w-4xl mx-auto border border-[hsl(220,15%,18%)] divide-y divide-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)]">
              {PILLARS.map((pillar, i) => {
                const n = i + 1;
                const Icon = pillar.icon;
                const isOpen = openIndex === i;
                return (
                  <div key={n}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`pillar-panel-${n}`}
                      className={`w-full flex items-center gap-5 px-6 md:px-10 py-6 text-left transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[hsl(38,72%,52%)] ${
                        isOpen ? "bg-[hsl(220,18%,12%)]" : "hover:bg-[hsl(220,18%,12%)]"
                      }`}
                    >
                      <span className="font-serif text-2xl font-bold text-[hsl(220,15%,28%)] group-hover:text-[hsl(38,72%,52%)] transition-colors shrink-0 w-10">
                        {String(n).padStart(2, "0")}
                      </span>
                      <Icon size={18} className={`shrink-0 transition-colors ${isOpen ? "text-[hsl(38,72%,52%)]" : "text-[hsl(220,12%,45%)] group-hover:text-[hsl(38,72%,58%)]"}`} />
                      <span className={`flex-1 font-serif font-bold text-base md:text-lg uppercase tracking-tight transition-colors ${isOpen ? "text-[hsl(38,72%,58%)]" : "text-white group-hover:text-[hsl(38,72%,58%)]"}`}>
                        {t.get(`pillar_${n}_title`, "")}
                      </span>
                      <Plus size={18} className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45 text-[hsl(38,72%,52%)]" : "text-[hsl(220,12%,45%)] group-hover:text-white"}`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`pillar-panel-${n}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 md:px-10 pl-[5.25rem] md:pl-[6.75rem] pb-8 pr-16">
                            <p className="text-sm text-gray-400 leading-relaxed">
                              {t.get(`pillar_${n}_desc`, "")}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════ SUSTAINABILITY ═══════ */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="aspect-[4/5] overflow-hidden border border-[hsl(220,15%,18%)] order-1 lg:order-none"
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${t.get("sustainability_bg", "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200&q=80")})` }}
                />
              </motion.div>

              {/* Text + points */}
              <div className="order-2 lg:order-none">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-[10px] tracking-[0.35em] uppercase mb-1"
                  style={{ color: "hsl(38,85%,62%)" }}
                >
                  {t.get("sustainability_eyebrow", "Green Commitment")}
                </motion.p>
                <div className="w-8 h-px bg-[hsl(38,72%,52%)] mb-6" />
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-4xl font-serif font-bold tracking-tight uppercase mb-5 text-white"
                >
                  {t.get("sustainability_title", "Our Sustainability Promise")}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="text-sm leading-relaxed text-gray-300 mb-8"
                >
                  {t.get("sustainability_subtitle", "Building responsibly for today and for generations to come — reducing our footprint on every project.")}
                </motion.p>

                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((n) => {
                    const point = t.get(`sustainability_${n}`, "");
                    if (!point) return null;
                    return (
                      <motion.div
                        key={n}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + n * 0.06 }}
                        className="flex items-start gap-4 border-l-2 border-[hsl(38,72%,52%)/40%] bg-[hsl(220,18%,11%)] px-5 py-4"
                      >
                        <span className="shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-full" style={{ backgroundColor: "hsla(38,72%,52%,0.14)", color: "hsl(38,72%,58%)" }}>
                          <Leaf size={14} />
                        </span>
                        <p className="text-sm text-gray-300 leading-relaxed">{point}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ CTA ═══════ */}
        <section className="py-20 px-6 bg-[hsl(220,18%,11%)] border-y border-[hsl(220,15%,18%)]">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-serif font-bold uppercase tracking-tight mb-2">
                {t.get("cta_title", "Have questions about our practices?")}
              </h2>
              <p className="text-sm text-[hsl(220,12%,55%)]">
                {t.get("cta_body", "We are transparent about our safety records and protocols. Reach out to our HSE department for more detailed information.")}
              </p>
            </div>
            <Link href="/contact" className="shrink-0 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-10 py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors inline-flex items-center gap-3">
              {t.get("cta_button_label", "Contact Us")} <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
