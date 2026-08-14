import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "How do I get a quote for my construction project?",
    a: "Visit our Contact page and fill out the enquiry form, or call us directly at +92 334 2976686. We typically respond within 24 hours with an initial assessment and next steps.",
  },
  {
    q: "What types of construction projects do you handle?",
    a: "We work across commercial, residential, industrial, and infrastructure projects — from new builds and renovations to specialist civil works. Our team manages everything from concept through handover.",
  },
  {
    q: "What areas do you operate in?",
    a: "Our primary operations are in Karachi and across Pakistan. We have also delivered projects in the Middle East and can mobilise to other regions on request.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes. Azhar Engineering (Pvt.) Ltd is a fully licensed and insured contractor. We carry comprehensive general liability, workers' compensation, and professional indemnity coverage.",
  },
  {
    q: "How long does a typical project take?",
    a: "Timelines vary by scope. A standard residential build takes 6–12 months; commercial and industrial projects can run 12–36 months. We provide a detailed programme during the proposal stage.",
  },
  {
    q: "Do you handle permits and regulatory approvals?",
    a: "Yes. We manage all necessary permits, environmental clearances, and regulatory approvals as part of our end-to-end project management service.",
  },
  {
    q: "What is your payment structure?",
    a: "We typically work on milestone-based payments aligned to the project programme. A detailed payment schedule is agreed before work begins, with no hidden costs.",
  },
  {
    q: "Can I download company documents from the website?",
    a: "Yes. Visit the About page and scroll to the Documents section to download our company profile, HSE policy, and other key documents.",
  },
  {
    q: "How can I view your past projects?",
    a: "Head to the Projects page to browse our portfolio by category, sector, or status. Each project includes photos, details, and key facts.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] tracking-[0.45em] uppercase text-[hsl(38,72%,52%)] mb-3 font-semibold">
          Frequently Asked Questions
        </p>
        <div className="w-10 h-px bg-[hsl(38,72%,52%)] mb-8" />
        <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-tight mb-12 text-foreground">
          Common Questions
        </h2>

        <div className="space-y-0 border-t border-[hsl(220,15%,18%)]">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border-b border-[hsl(220,15%,18%)]">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left group"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-[hsl(38,72%,52%)] transition-colors">
                  {item.q}
                </span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-[hsl(220,12%,45%)] transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-[hsl(220,12%,55%)] leading-relaxed pb-5">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
