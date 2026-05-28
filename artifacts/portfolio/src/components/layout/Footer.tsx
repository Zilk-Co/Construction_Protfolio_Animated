import { Link } from "wouter";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[hsl(220,18%,7%)] border-t border-[hsl(220,15%,18%)] mt-24">
      <div className="max-w-screen-2xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <p className="text-xl font-serif font-bold tracking-tight uppercase text-foreground leading-none">
                Zain Manzoor
              </p>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] font-medium mt-0.5">
                Co.
              </p>
            </div>
            <p className="text-sm text-[hsl(220,12%,55%)] leading-relaxed max-w-[200px]">
              Architecture and construction excellence since 2005.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[hsl(220,12%,45%)] mb-5 font-medium">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/projects", label: "Projects" },
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
              Location
            </h4>
            <div className="flex items-start gap-2 text-sm text-[hsl(220,12%,60%)]">
              <MapPin size={14} className="mt-0.5 shrink-0 text-[hsl(38,72%,52%)]" />
              <div>
                <p className="font-medium text-[hsl(220,12%,75%)]">Karachi</p>
                <p>House 53, Street 12</p>
                <p>Naval Colony, Sector 2</p>
                <p>Baldia, Hub River Road</p>
                <p>Karachi, Pakistan</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[hsl(220,12%,45%)] mb-5 font-medium">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+922134567890"
                  className="flex items-center gap-2 text-sm text-[hsl(220,12%,60%)] hover:text-[hsl(38,72%,52%)] transition-colors"
                >
                  <Phone size={13} className="shrink-0" />
                  +92 21 3456 7890
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@zainmanzoor.co"
                  className="flex items-center gap-2 text-sm text-[hsl(220,12%,60%)] hover:text-[hsl(38,72%,52%)] transition-colors"
                >
                  <Mail size={13} className="shrink-0" />
                  info@zainmanzoor.co
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase border border-[hsl(38,72%,52%)] text-[hsl(38,72%,52%)] px-4 py-2 hover:bg-[hsl(38,72%,52%)] hover:text-[hsl(220,18%,9%)] transition-all duration-200"
                >
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[hsl(220,15%,18%)] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[hsl(220,12%,40%)] tracking-wider">
            © {new Date().getFullYear()} Zain Manzoor Co. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-[hsl(220,12%,40%)]">Architecture &amp; Construction</span>
            <span className="text-xs text-[hsl(220,12%,40%)]">Karachi, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
