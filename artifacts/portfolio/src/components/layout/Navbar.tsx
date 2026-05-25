import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/machinery", label: "Machinery" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[hsl(220,18%,9%)] border-b border-[hsl(220,15%,20%)] py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-6 flex justify-between items-center">
          {/* Brand */}
          <Link
            href="/"
            className="flex flex-col relative z-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-xl font-serif font-bold tracking-tight uppercase text-foreground leading-none">
              Zain Manzoor
            </span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] font-sans font-medium leading-tight mt-0.5">
              Co.
            </span>
          </Link>

          {/* Desktop Nav */}
          <div
            className={`hidden md:flex items-center gap-1 transition-all duration-500 ${
              !scrolled
                ? "bg-black/40 backdrop-blur-md border border-white/15 rounded-full px-3 py-2 shadow-lg shadow-black/30"
                : ""
            }`}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs tracking-[0.2em] uppercase font-medium transition-all duration-200 group px-4 py-1.5 rounded-full ${
                  isActive(link.href)
                    ? !scrolled
                      ? "bg-[hsl(38,72%,52%)/25%] text-[hsl(38,72%,80%)]"
                      : "text-[hsl(38,72%,52%)]"
                    : !scrolled
                      ? "text-white hover:bg-white/10 hover:text-[hsl(38,72%,75%)]"
                      : "text-[hsl(220,12%,65%)] hover:text-foreground"
                }`}
              >
                {link.label}
                {scrolled && (
                  <span
                    className={`absolute -bottom-1 left-4 right-4 h-px bg-[hsl(38,72%,52%)] transition-all duration-300 ${
                      isActive(link.href) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative z-50 p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 bg-[hsl(220,18%,7%)] flex flex-col items-center justify-center gap-10 md:hidden"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-3xl font-serif font-bold tracking-tight uppercase ${
                    isActive(link.href)
                      ? "text-[hsl(38,72%,52%)]"
                      : "text-[hsl(220,12%,60%)] hover:text-foreground"
                  } transition-colors`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
