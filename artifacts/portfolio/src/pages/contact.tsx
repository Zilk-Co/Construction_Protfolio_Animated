import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useGetSettings } from "@workspace/api-client-react";

const CONTACT_HERO_BG =
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=85";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const { data: settings } = useGetSettings();

  const phone = settings?.phone ?? "+92 21 3456 7890";
  const email = settings?.email ?? "info@zainmanzoor.co";
  const address = settings?.address ?? "House 53, Street 12, Naval Colony, Sector 2, Baldia, Hub River Road, Karachi, Pakistan";
  const hours = settings?.hours ?? "Mon–Sat, 9:00 AM – 6:00 PM PKT";
  const subtitle = settings?.heroSubtitle ?? "We deliver landmark architectural and construction projects across the Middle East and South Asia. Tell us about your project and we will be in touch within 24 hours.";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">

        {/* Hero with background image */}
        <section className="relative pt-44 pb-28 px-6 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${CONTACT_HERO_BG})` }}
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.75) 100%)" }} />

          <div className="relative max-w-screen-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] tracking-[0.45em] uppercase font-semibold mb-5"
              style={{ color: "hsl(38,85%,68%)", textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}
            >
              Get in Touch
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight uppercase mb-6 text-white"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              Contact Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-200 max-w-2xl leading-relaxed"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
            >
              {subtitle}
            </motion.p>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-[hsl(220,15%,18%)]" />

        {/* Main Content */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-12">

              {/* Office */}
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: "hsl(38,85%,62%)" }}>Our Office</p>
                <div className="w-8 h-px bg-[hsl(38,72%,52%)] mb-6" />
                <div className="border-l-2 border-[hsl(38,72%,52%)] pl-5">
                  <p className="font-serif font-bold uppercase text-sm tracking-wide mb-3 text-white">Karachi</p>
                  <div className="flex items-start gap-2.5">
                    <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "hsl(38,72%,58%)" }} />
                    <p className="text-sm leading-relaxed text-gray-300">{address}</p>
                  </div>
                </div>
              </div>

              {/* Direct Contact */}
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: "hsl(38,85%,62%)" }}>Direct Contact</p>
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

              {/* Map embed */}
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: "hsl(38,85%,62%)" }}>Find Us</p>
                <div className="w-8 h-px bg-[hsl(38,72%,52%)] mb-4" />
                <div className="aspect-[4/3] border border-[hsl(220,15%,22%)] overflow-hidden">
                  <iframe
                    title="Karachi Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14481.167963498!2d66.9940!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f7a8c4c2f8f%3A0x0!2sNaval+Colony%2C+Baldia%2C+Karachi!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-2">Hub River Road, Baldia, Naval Colony, Sector 2, Karachi</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: "hsl(38,85%,62%)" }}>Send a Message</p>
              <div className="w-8 h-px bg-[hsl(38,72%,52%)] mb-8" />
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-[hsl(38,72%,52%)] bg-[hsl(38,72%,52%)/8%] px-8 py-14 text-center"
                >
                  <div className="w-12 h-12 border-2 border-[hsl(38,72%,52%)] mx-auto mb-4 flex items-center justify-center">
                    <span style={{ color: "hsl(38,72%,58%)" }} className="text-xl">✓</span>
                  </div>
                  <h3 className="font-serif text-xl uppercase tracking-tight mb-2 text-white">Message Received</h3>
                  <p className="text-sm text-gray-400">We will get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        <option value="machinery" className="bg-[hsl(220,18%,12%)]">Machinery Hire</option>
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
                    <button type="submit" className="px-10 py-4 text-xs tracking-[0.25em] uppercase font-bold transition-colors" style={{ backgroundColor: "hsl(38,72%,52%)", color: "hsl(220,18%,9%)" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "hsl(38,72%,62%)")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "hsl(38,72%,52%)")}
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
