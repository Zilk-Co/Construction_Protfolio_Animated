import { Link } from "wouter";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { useGetSettings } from "@workspace/api-client-react";

export function Footer() {
  const t = usePageContent("footer");
  const { data: settings } = useGetSettings();
  const phone = settings?.phone ?? "+92 123 123 3875";
  const email = settings?.email ?? "azhar@gmail.com";
  const address = settings?.address ?? "House 53, Street 12, Naval Colony, Sector 2, Baldia, Hub River Road, Karachi, Pakistan";
  return (
    <footer className="bg-[hsl(220,18%,7%)] border-t border-[hsl(220,15%,18%)] mt-24">
      <div className="max-w-screen-2xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <img
                src="/logo.png"
                alt="Azhar Engineering logo"
                className="h-12 w-auto object-contain mb-3"
              />
              <p className="text-xl font-serif font-bold tracking-tight uppercase text-foreground leading-none">
                Azhar Engineering
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
                { href: "/safety", label: "Safety" },
                { href: "/projects", label: "Projects" },
                { href: "/services", label: "Services" },
                { href: "/machinery", label: "Machinery" },
                { href: "/contact", label: "Contact" },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[hsl(220,12%,60%)] hover:text-[hsl(38,72%,52%)] transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[hsl(220,12%,45%)] mb-5 font-medium">
              {t.get("location_heading", "Location")}
            </h4>
            <div className="flex items-start gap-2 text-sm text-[hsl(220,12%,60%)]">
              <MapPin size={14} className="mt-0.5 shrink-0 text-[hsl(38,72%,52%)]" />
              <div>
                <p className="font-medium text-[hsl(220,12%,75%)]">{settings?.city ?? "Karachi"}</p>
                {address.split(",").map((line, i) => (
                  <p key={i}>{line.trim()}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[hsl(220,12%,45%)] mb-5 font-medium">
              {t.get("contact_heading", "Contact Us")}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 text-sm text-[hsl(220,12%,60%)] hover:text-[hsl(38,72%,52%)] transition-colors"
                >
                  <Phone size={13} className="shrink-0" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-sm text-[hsl(220,12%,60%)] hover:text-[hsl(38,72%,52%)] transition-colors"
                >
                  <Mail size={13} className="shrink-0" />
                  {email}
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase border border-[hsl(38,72%,52%)] text-[hsl(38,72%,52%)] px-4 py-2 hover:bg-[hsl(38,72%,52%)] hover:text-[hsl(220,18%,9%)] transition-all duration-200"
                >
                  {t.get("contact_cta_label", "Get in Touch")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[hsl(220,15%,18%)] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[hsl(220,12%,40%)] tracking-wider">
            © {new Date().getFullYear()} Azhar Engineering (Pvt.) Ltd. All rights reserved.
          </p>
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
