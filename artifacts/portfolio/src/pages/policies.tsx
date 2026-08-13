import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { usePageContent } from "@/hooks/usePageContent";
import { Shield } from "lucide-react";

const DEFAULT_POLICY_BG =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=75";

export default function Policies() {
  const t = usePageContent("safety");

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* Hero */}
        <section className="relative pt-28 pb-16 px-6 overflow-hidden md:pt-44 md:pb-24">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${DEFAULT_POLICY_BG})` }}
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
              {t.get("policy_eyebrow", "Health, Safety & Environment")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight uppercase mb-6 text-white"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              {t.get("policy_title", "Our HSE Policy")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-200 max-w-2xl leading-relaxed"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
            >
              {t.get("policy_p1", "At Azhar Engineering (Pvt.) Ltd, our HSE policy is the cornerstone of our operations. We believe that every accident is preventable and that a safe working environment is a fundamental right.")}
            </motion.p>
          </div>
        </section>

        {/* Policy Content */}
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
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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

        {/* Safety Pillars */}
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
              <div className="w-10 h-px mx-auto mb-8" style={{ backgroundColor: "hsl(38,72%,52%)" }} />
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-serif font-bold tracking-tight uppercase mb-4 text-white"
              >
                {t.get("pillars_title", "Safety Pillars")}
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "01", title: t.get("pillar1_title", "Risk Assessment"), desc: t.get("pillar1_desc", "Comprehensive hazard identification and risk mitigation before work begins.") },
                { icon: "02", title: t.get("pillar2_title", "Training"), desc: t.get("pillar2_desc", "Continuous safety training and certification for all site personnel.") },
                { icon: "03", title: t.get("pillar3_title", "Compliance"), desc: t.get("pillar3_desc", "Strict adherence to national and international safety standards.") },
                { icon: "04", title: t.get("pillar4_title", "Monitoring"), desc: t.get("pillar4_desc", "Real-time safety monitoring and proactive incident prevention.") },
              ].map((pillar, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,10%)] p-8 hover:border-[hsl(38,72%,52%)] transition-colors duration-300"
                >
                  <span className="text-4xl font-serif font-bold" style={{ color: "hsl(38,72%,52%)" }}>{pillar.icon}</span>
                  <h3 className="text-lg font-serif font-bold tracking-tight uppercase mt-4 mb-3 text-white">{pillar.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
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
              {t.get("cta_body", "For more information about our HSE policies and procedures, please contact our safety department.")}
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 text-xs tracking-[0.2em] uppercase font-bold transition-colors"
              style={{ backgroundColor: "hsl(38,72%,52%)", color: "hsl(220,18%,9%)" }}
            >
              {t.get("cta_button", "Get in Touch")}
            </a>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
}
