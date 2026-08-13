import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { FileText, Download } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { useDocuments } from "@/hooks/useDocuments";

const DOCUMENTS_HERO_BG =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=75";

export default function DocumentsPage() {
  const { data: documents = [], isLoading: docsLoading } = useDocuments();
  const t = usePageContent("about");

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* Hero */}
        <section className="relative pt-28 pb-16 px-6 overflow-hidden md:pt-44 md:pb-24">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${DOCUMENTS_HERO_BG})` }}
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
              {t.get("documents_eyebrow", "Company Documents")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight uppercase mb-6 text-white"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              {t.get("documents_title", "Documents & Policies")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-200 max-w-2xl leading-relaxed"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
            >
              {t.get("documents_subtitle", "Key documents and policies from Azhar Engineering (Pvt.) Ltd. Download them for more detail about how we operate.")}
            </motion.p>
          </div>
        </section>

        {/* Documents Grid */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto">
            {docsLoading ? (
              <div className="max-w-4xl mx-auto space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />
                ))}
              </div>
            ) : documents.length === 0 ? (
              <p className="text-center text-xs tracking-[0.25em] uppercase text-[hsl(220,12%,40%)] max-w-4xl mx-auto py-12">
                {t.get("documents_empty", "Documents will be published here soon.")}
              </p>
            ) : (
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
                {documents.map((doc, i) => (
                  <motion.a
                    key={doc.id}
                    href={doc.fileUrl}
                    download={doc.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="group flex items-start gap-4 border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,11%)] p-6 hover:border-[hsl(38,72%,52%)] hover:bg-[hsl(220,18%,12%)] transition-all duration-300"
                  >
                    <span
                      className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: "hsla(38,72%,52%,0.14)", color: "hsl(38,72%,58%)" }}
                    >
                      <FileText size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif font-bold text-base uppercase tracking-tight text-white group-hover:text-[hsl(38,72%,58%)] transition-colors mb-1.5">
                        {doc.title}
                      </span>
                      {doc.description && (
                        <span className="block text-xs text-gray-400 leading-relaxed mb-2">{doc.description}</span>
                      )}
                      <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: "hsl(38,72%,58%)" }}>
                        <Download size={11} className="transition-transform group-hover:translate-y-0.5" />
                        Download
                      </span>
                    </span>
                  </motion.a>
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
