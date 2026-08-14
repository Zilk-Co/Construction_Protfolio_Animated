import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { FAQSection } from "@/components/sections/FAQSection";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useGetSettings, useUpdatePageContent } from "@workspace/api-client-react";
import { usePageContent } from "@/hooks/usePageContent";
import { EditableText } from "@/components/EditableText";
import { useEditMode } from "@/components/EditModeProvider";
import { HeroImageEditor } from "@/components/HeroImageEditor";

const CONTACT_HERO_BG =
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=75";

const SOCIAL_SVG: Record<string, string> = {
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  instagram: "M16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4zm-4 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3.5-6a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z",
  twitter: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
  youtube: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z M9.75 15.02V8.48l5.75 3.27-5.75 3.27z",
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { data: settings } = useGetSettings();
  const t = usePageContent("contact");
  const { editMode } = useEditMode();
  const updatePageContent = useUpdatePageContent();

  const savePageContent = async (key: string, value: string) => {
    await updatePageContent.mutateAsync({
      data: { updates: [{ page: "contact", key, value }] },
    });
  };

  const phone = settings?.phone ?? "+92 334 2976686";
  const email = settings?.email ?? "azharkhaki2005@gmail.com";
  const address = settings?.address ?? "3rd Floor, Sultan Arcade, Lower Gizri, Karachi";
  const hours = settings?.hours ?? "Mon–Sat, 9:00 AM – 6:00 PM PKT";
  const subtitle = settings?.heroSubtitle ?? "We deliver landmark architectural and construction projects across the Middle East and South Asia. Tell us about your project and we will be in touch within 24 hours.";

  const socialLinks = [
    { key: "facebook", label: "Facebook", url: (settings as any)?.facebook },
    { key: "linkedin", label: "LinkedIn", url: (settings as any)?.linkedin },
    { key: "instagram", label: "Instagram", url: (settings as any)?.instagram },
    { key: "twitter", label: "Twitter", url: (settings as any)?.twitter },
    { key: "youtube", label: "YouTube", url: (settings as any)?.youtube },
  ].filter(s => s.url);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const API = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* Hero */}
        <section className="relative pt-44 pb-28 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${t.get("hero_bg", CONTACT_HERO_BG)})` }} />
          <HeroImageEditor
            value={t.get("hero_bg", CONTACT_HERO_BG)}
            onSave={(url) => savePageContent("hero_bg", url)}
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.75) 100%)" }} />
          <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />
          <div className="relative max-w-screen-2xl mx-auto">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.45em] uppercase font-semibold mb-5" style={{ color: "hsl(38,85%,68%)", textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}>
              {t.get("hero_eyebrow", "Get in Touch")}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight uppercase mb-6 text-white" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
              {editMode ? (
                <EditableText
                  value={t.get("hero_title", "Contact Us")}
                  onSave={(v) => savePageContent("hero_title", v)}
                  tag="span"
                />
              ) : (
                t.get("hero_title", "Contact Us")
              )}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-gray-200 max-w-2xl leading-relaxed" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}>
              {editMode ? (
                <EditableText
                  value={subtitle}
                  onSave={(v) => savePageContent("hero_subtitle", v)}
                  tag="span"
                />
              ) : (
                subtitle
              )}
            </motion.p>
          </div>
        </section>

        <div className="h-px bg-[hsl(220,15%,18%)]" />

        {/* Main Content */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: "hsl(38,85%,62%)" }}>{t.get("office_eyebrow", "Our Office")}</p>
                <div className="w-8 h-px bg-[hsl(38,72%,52%)] mb-6" />
                <div className="border-l-2 border-[hsl(38,72%,52%)] pl-5">
                  <p className="font-serif font-bold uppercase text-sm tracking-wide mb-3 text-white">{t.get("office_city", "Karachi")}</p>
                  <div className="flex items-start gap-2.5">
                    <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "hsl(38,72%,58%)" }} />
                    <p className="text-sm leading-relaxed text-gray-300">{address}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: "hsl(38,85%,62%)" }}>{t.get("direct_eyebrow", "Direct Contact")}</p>
                <div className="w-8 h-px bg-[hsl(38,72%,52%)] mb-6" />
                <ul className="space-y-4">
                  <li>
                    <a href={`tel:${phone}`} className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors group">
                      <span className="w-9 h-9 border border-[hsl(220,15%,28%)] flex items-center justify-center group-hover:border-[hsl(38,72%,52%)] transition-colors shrink-0">
                        <Phone size={13} style={{ color: "hsl(38,72%,58%)" }} />
                      </span>
                      {phone}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors group">
                      <span className="w-9 h-9 border border-[hsl(220,15%,28%)] flex items-center justify-center group-hover:border-[hsl(38,72%,52%)] transition-colors shrink-0">
                        <Mail size={13} style={{ color: "hsl(38,72%,58%)" }} />
                      </span>
                      {email}
                    </a>
                  </li>
                  <li>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="w-9 h-9 border border-[hsl(220,15%,28%)] flex items-center justify-center shrink-0">
                        <Clock size={13} style={{ color: "hsl(38,72%,58%)" }} />
                      </span>
                      {hours}
                    </div>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              {socialLinks.length > 0 && (
                <div>
                  <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: "hsl(38,85%,62%)" }}>{t.get("social_eyebrow", "Follow Us")}</p>
                  <div className="w-8 h-px bg-[hsl(38,72%,52%)] mb-6" />
                  <div className="flex gap-3">
                    {socialLinks.map(social => (
                      <a key={social.key} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-[hsl(220,15%,28%)] text-[hsl(220,12%,50%)] hover:border-[hsl(38,72%,52%)] hover:text-[hsl(38,72%,52%)] transition-colors" aria-label={social.label}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={SOCIAL_SVG[social.key] || ""} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: "hsl(38,85%,62%)" }}>{t.get("message_eyebrow", "Send a Message")}</p>
              <div className="w-8 h-px bg-[hsl(38,72%,52%)] mb-8" />
              {submitted ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-[hsl(38,72%,52%)] bg-[hsl(38,72%,52%)/8%] px-8 py-14 text-center">
                  <div className="w-12 h-12 border-2 border-[hsl(38,72%,52%)] mx-auto mb-4 flex items-center justify-center">
                    <span style={{ color: "hsl(38,72%,58%)" }} className="text-xl">✓</span>
                  </div>
                  <h3 className="font-serif text-xl uppercase tracking-tight mb-2 text-white">{t.get("message_success_title", "Message Received")}</h3>
                  <p className="text-sm text-gray-400">{t.get("message_success_body", "We will get back to you within 24 hours.")}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-2">Full Name *</label>
                      <input required name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,24%)] text-white px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-2">Email Address *</label>
                      <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,24%)] text-white px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-gray-600" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-2">Phone</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="+92 ..." className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,24%)] text-white px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-2">Enquiry Type</label>
                      <select name="subject" value={form.subject} onChange={handleChange} className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,24%)] text-white px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors appearance-none">
                        <option value="" className="bg-[hsl(220,18%,12%)]">Select enquiry type</option>
                        <option value="new-project" className="bg-[hsl(220,18%,12%)]">New Project</option>
                        <option value="civil" className="bg-[hsl(220,18%,12%)]">Civil Works</option>
                        <option value="general" className="bg-[hsl(220,18%,12%)]">General Enquiry</option>
                        <option value="partnership" className="bg-[hsl(220,18%,12%)]">Partnership</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-2">Message *</label>
                    <textarea required name="message" value={form.message} onChange={handleChange} rows={7} placeholder="Tell us about your project, timeline, and requirements..." className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,24%)] text-white px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors resize-none placeholder:text-gray-600" />
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={submitting} className="px-10 py-4 text-xs tracking-[0.25em] uppercase font-bold transition-colors disabled:opacity-50" style={{ backgroundColor: "hsl(38,72%,52%)", color: "hsl(220,18%,9%)" }}>
                      {submitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="py-12 px-6 bg-[hsl(220,18%,8%)]">
          <div className="max-w-screen-2xl mx-auto">
            <div className="w-[80%] mx-auto">
              <p className="text-[10px] tracking-[0.35em] uppercase mb-4 text-center" style={{ color: "hsl(38,85%,62%)" }}>{t.get("map_eyebrow", "Find Us")}</p>
              <div className="aspect-[16/9] border border-[hsl(220,15%,22%)] overflow-hidden">
                <iframe title="Karachi Office Location" src={(settings as any)?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14481.167963498!2d67.0457!3d24.8147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f7a8c4c2f8f%3A0x0!2sSultan+Arcade%2C+Lower+Gizri%2C+Karachi!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"} width="100%" height="100%" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
              <p className="text-[10px] text-gray-500 mt-2 text-center">{t.get("map_caption", "Sultan Arcade, Lower Gizri, Karachi")}</p>
            </div>
          </div>
        </section>

        <FAQSection />
        <Footer />
      </div>
    </PageTransition>
  );
}
