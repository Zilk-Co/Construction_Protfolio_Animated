import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";

const CONTACT_HERO_BG =
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=85";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">

        {/* Hero with background image */}
        <section className="relative pt-40 pb-24 px-6 border-b border-[hsl(220,15%,18%)] overflow-hidden">
          {/* BG image layer */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${CONTACT_HERO_BG})` }}
          />
          <div className="absolute inset-0 bg-[hsl(220,18%,9%)/80%] backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,18%,9%)/60%] via-transparent to-[hsl(220,18%,9%)/90%]" />

          <div className="relative max-w-screen-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] tracking-[0.4em] uppercase text-[hsl(38,72%,52%)] mb-4"
            >
              Get in Touch
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight uppercase mb-6"
            >
              Contact Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[hsl(220,12%,70%)] max-w-2xl"
            >
              We work with clients across the Middle East and South Asia. Tell us about your project and we will be in touch within 24 hours.
            </motion.p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-24 px-6">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-[10px] tracking-[0.3em] uppercase text-[hsl(220,12%,45%)] mb-6">
                  Our Offices
                </h2>
                <div className="space-y-8">
                  <div className="border-l-2 border-[hsl(38,72%,52%)] pl-5">
                    <p className="font-serif font-bold uppercase text-sm tracking-wide mb-2">Dubai</p>
                    <div className="flex items-start gap-2 text-sm text-[hsl(220,12%,60%)]">
                      <MapPin size={13} className="mt-0.5 shrink-0 text-[hsl(38,72%,52%)]" />
                      <p>Business Bay, Tower 12<br />Dubai, UAE 00000</p>
                    </div>
                  </div>
                  <div className="border-l-2 border-[hsl(220,15%,25%)] pl-5">
                    <p className="font-serif font-bold uppercase text-sm tracking-wide mb-2">Karachi</p>
                    <div className="flex items-start gap-2 text-sm text-[hsl(220,12%,60%)]">
                      <MapPin size={13} className="mt-0.5 shrink-0 text-[hsl(220,12%,45%)]" />
                      <p>3rd Floor, Tech Park<br />Karachi, Pakistan</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[10px] tracking-[0.3em] uppercase text-[hsl(220,12%,45%)] mb-6">
                  Direct Contact
                </h2>
                <ul className="space-y-4">
                  <li>
                    <a href="tel:+97100000000" className="flex items-center gap-3 text-sm text-[hsl(220,12%,65%)] hover:text-[hsl(38,72%,52%)] transition-colors group">
                      <span className="w-8 h-8 border border-[hsl(220,15%,22%)] flex items-center justify-center group-hover:border-[hsl(38,72%,52%)] transition-colors">
                        <Phone size={13} />
                      </span>
                      +971 (0) 00 000 0000
                    </a>
                  </li>
                  <li>
                    <a href="mailto:info@zainmanzoor.co" className="flex items-center gap-3 text-sm text-[hsl(220,12%,65%)] hover:text-[hsl(38,72%,52%)] transition-colors group">
                      <span className="w-8 h-8 border border-[hsl(220,15%,22%)] flex items-center justify-center group-hover:border-[hsl(38,72%,52%)] transition-colors">
                        <Mail size={13} />
                      </span>
                      info@zainmanzoor.co
                    </a>
                  </li>
                  <li>
                    <div className="flex items-center gap-3 text-sm text-[hsl(220,12%,65%)]">
                      <span className="w-8 h-8 border border-[hsl(220,15%,22%)] flex items-center justify-center">
                        <Clock size={13} />
                      </span>
                      Sun–Thu, 9:00 AM – 6:00 PM GST
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-[hsl(220,12%,45%)] mb-6">
                Send a Message
              </h2>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-[hsl(38,72%,52%)/30%] bg-[hsl(38,72%,52%)/5%] px-8 py-12 text-center"
                >
                  <div className="w-12 h-12 border-2 border-[hsl(38,72%,52%)] mx-auto mb-4 flex items-center justify-center">
                    <span className="text-[hsl(38,72%,52%)] text-xl">✓</span>
                  </div>
                  <h3 className="font-serif text-xl uppercase tracking-tight mb-2">Message Received</h3>
                  <p className="text-sm text-[hsl(220,12%,60%)]">We will get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Full Name *</label>
                      <input required name="name" value={form.name} onChange={handleChange} placeholder="Your full name" data-testid="input-name" className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)]" />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Email Address *</label>
                      <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" data-testid="input-email" className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Phone</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="+971 ..." data-testid="input-phone" className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)]" />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Subject</label>
                      <select name="subject" value={form.subject} onChange={handleChange} data-testid="select-subject" className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors appearance-none">
                        <option value="">Select enquiry type</option>
                        <option value="new-project">New Project</option>
                        <option value="civil">Civil Works</option>
                        <option value="machinery">Machinery Hire</option>
                        <option value="general">General Enquiry</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Message *</label>
                    <textarea required name="message" value={form.message} onChange={handleChange} rows={7} placeholder="Tell us about your project, timeline, and requirements..." data-testid="textarea-message" className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors resize-none placeholder:text-[hsl(220,12%,35%)]" />
                  </div>
                  <div className="pt-2">
                    <button type="submit" data-testid="button-submit" className="px-10 py-4 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] text-xs tracking-[0.25em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors">
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
