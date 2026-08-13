import { Link } from "wouter";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { useGetSettings, useListServices } from "@workspace/api-client-react";

const SOCIAL_SVG: Record<string, string> = {
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  instagram: "M16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4zm-4 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3.5-6a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z",
  twitter: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
  youtube: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z M9.75 15.02V8.48l5.75 3.27-5.75 3.27z",
};

export function Footer() {
  const t = usePageContent("footer");
  const { data: settings } = useGetSettings();
  const { data: services = [] } = useListServices({ published: true });
  const phone = settings?.phone ?? "+92 334 2976686";
  const email = settings?.email ?? "azharkhaki2005@gmail.com";
  const address = settings?.address ?? "3rd Floor, Sultan Arcade, Lower Gizri, Karachi";
  const companyName = (settings as any)?.companyName ?? "Azhar Engineering";
  const copyright = (settings as any)?.copyright ?? `© ${new Date().getFullYear()} ${companyName} (Pvt.) Ltd. All rights reserved.`;

  const socialLinks = [
    { key: "facebook", label: "Facebook", url: (settings as any)?.facebook },
    { key: "linkedin", label: "LinkedIn", url: (settings as any)?.linkedin },
    { key: "instagram", label: "Instagram", url: (settings as any)?.instagram },
    { key: "twitter", label: "Twitter", url: (settings as any)?.twitter },
    { key: "youtube", label: "YouTube", url: (settings as any)?.youtube },
  ].filter(s => s.url);

  return (
    <footer className="bg-[hsl(220,18%,7%)] border-t border-[hsl(220,15%,18%)] mt-24">
      <div className="max-w-screen-2xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <img src="/logo.png" alt={`${companyName} logo`} className="h-12 w-auto object-contain mb-3" />
              <p className="text-xl font-serif font-bold tracking-tight uppercase text-foreground leading-none">
                {companyName}
              </p>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] font-medium mt-0.5">
                Pvt. Ltd.
              </p>
            </div>
            <p className="text-sm text-[hsl(220,12%,55%)] leading-relaxed max-w-[200px]">
              {t.get("tagline", "Architecture and construction excellence since 2005.")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[hsl(220,12%,45%)] mb-5 font-medium">
              {t.get("nav_heading", "Navigation")}
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/projects", label: "Projects" },
                { href: "/services", label: "Services" },
                { href: "/machinery", label: "Machinery" },
                { href: "/clients", label: "Clients" },
                { href: "/safety", label: "Safety" },
                { href: "/documents", label: "Documents" },
                { href: "/policies", label: "Policies" },
                { href: "/contact", label: "Contact" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[hsl(220,12%,60%)] hover:text-[hsl(38,72%,52%)] transition-colors flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[hsl(220,12%,45%)] mb-5 font-medium">
              {t.get("services_heading", "Our Services")}
            </h4>
            {Array.isArray(services) && services.length > 0 ? (
              <ul className="space-y-3">
                {services.map((s: any) => (
                  <li key={s.id}>
                    <Link href={`/services/${s.slug}`} className="text-sm text-[hsl(220,12%,60%)] hover:text-[hsl(38,72%,52%)] transition-colors flex items-center gap-1 group">
                      {s.name}
                      <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[hsl(220,12%,40%)]">Services coming soon</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[hsl(220,12%,45%)] mb-5 font-medium">
              {t.get("contact_heading", "Contact Us")}
            </h4>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-[hsl(220,12%,60%)] hover:text-[hsl(38,72%,52%)] transition-colors">
                  <Phone size={13} className="shrink-0" />
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-[hsl(220,12%,60%)] hover:text-[hsl(38,72%,52%)] transition-colors">
                  <Mail size={13} className="shrink-0" />
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-[hsl(220,12%,60%)]">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[hsl(38,72%,52%)]" />
                <span>{address}</span>
              </li>
              <li className="pt-2">
                <Link href="/contact" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase border border-[hsl(38,72%,52%)] text-[hsl(38,72%,52%)] px-4 py-2 hover:bg-[hsl(38,72%,52%)] hover:text-[hsl(220,18%,9%)] transition-all duration-200">
                  {t.get("contact_cta_label", "Get in Touch")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social + Bottom bar */}
        <div className="border-t border-[hsl(220,15%,18%)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[hsl(220,12%,40%)] tracking-wider">
            {copyright}
          </p>
          {socialLinks.length > 0 && (
            <div className="flex gap-4 items-center">
              {socialLinks.map(social => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center border border-[hsl(220,15%,22%)] text-[hsl(220,12%,50%)] hover:border-[hsl(38,72%,52%)] hover:text-[hsl(38,72%,52%)] transition-colors"
                  aria-label={social.label}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={SOCIAL_SVG[social.key] || ""} />
                  </svg>
                </a>
              ))}
            </div>
          )}
          <div className="flex gap-6 items-center">
            <span className="text-xs text-[hsl(220,12%,40%)]">{t.get("footer_tag_left", "Architecture & Construction")}</span>
            <span className="text-xs text-[hsl(220,12%,40%)]">{t.get("footer_tag_right", "Karachi, Pakistan")}</span>
          </div>
          <p className="text-xs tracking-wider" style={{ color: "hsl(220,12%,45%)" }}>
            {t.get("footer_credit", "Website by Zilk Co")}
          </p>
        </div>
      </div>
    </footer>
  );
}
