import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { FolderOpen, Settings2, LogOut, Home, SlidersHorizontal, Type, Plus, Cog, Layers, FileText, LayoutDashboard, Users, Shield, MessageSquare, Image, Star, Briefcase, BookOpen } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: me, isLoading } = useGetAdminMe();
  const logout = useAdminLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !me?.authenticated) {
      setLocation("/admin-panel");
    }
  }, [me, isLoading, setLocation]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => setLocation("/admin-panel"),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(220,18%,7%)" }}>
        <div className="w-8 h-8 border-2 border-[hsl(220,15%,25%)] border-t-[hsl(38,72%,52%)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!me?.authenticated) return null;

  const navSections = [
    {
      label: "Overview",
      items: [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "Portfolio",
      items: [
        { href: "/admin", label: "All Projects", icon: FolderOpen },
        { href: "/admin/projects/new", label: "Add Project", icon: Plus },
      ],
    },
    {
      label: "Services",
      items: [
        { href: "/admin/services", label: "All Services", icon: Layers },
      ],
    },
    {
      label: "Clients",
      items: [
        { href: "/admin/clients", label: "All Clients", icon: Users },
      ],
    },
    {
      label: "Media",
      items: [
        { href: "/admin/media", label: "Media Library", icon: Image },
      ],
    },
    {
      label: "Testimonials",
      items: [
        { href: "/admin/testimonials", label: "All Testimonials", icon: Star },
      ],
    },
    {
      label: "Careers",
      items: [
        { href: "/admin/jobs", label: "Job Openings", icon: Briefcase },
      ],
    },
    {
      label: "Blog",
      items: [
        { href: "/admin/blog", label: "All Posts", icon: BookOpen },
      ],
    },
    {
      label: "Communication",
      items: [
        { href: "/admin/messages", label: "Inbox", icon: MessageSquare },
      ],
    },
    {
      label: "Policies",
      items: [
        { href: "/admin/policies", label: "HSE Policies", icon: Shield },
      ],
    },
    {
      label: "Content",
      items: [
        { href: "/admin/page-content", label: "Page Text", icon: Type },
        { href: "/admin/settings", label: "Site Settings", icon: SlidersHorizontal },
        { href: "/admin/documents", label: "Documents", icon: FileText },
      ],
    },
  ];

  const isActive = (href: string) =>
    href === "/admin" ? location === "/admin" : location.startsWith(href);

  return (
    <div className="min-h-screen text-white flex" style={{ backgroundColor: "hsl(220,18%,9%)" }}>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-58 shrink-0 border-r border-[hsl(220,15%,16%)] flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ width: "224px", backgroundColor: "hsl(220,18%,7%)" }}>
        {/* Brand */}
        <div className="px-5 py-6 border-b border-[hsl(220,15%,16%)]">
          <p className="text-sm font-serif font-bold uppercase tracking-tight text-white leading-none">
            Azhar Engineering
          </p>
          <p className="text-[10px] tracking-[0.35em] uppercase mt-1 font-semibold" style={{ color: "hsl(38,85%,62%)" }}>
            Admin
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-6 overflow-y-auto">
          {navSections.map(section => (
            <div key={section.label} className="space-y-1">
              <p className="px-3 pb-2 text-[9px] tracking-[0.3em] uppercase text-[hsl(220,12%,40%)] font-semibold">
                {section.label}
              </p>
              {section.items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-150 rounded-sm ${
                    isActive(href)
                      ? "font-semibold"
                      : "text-[hsl(220,12%,50%)] hover:text-white hover:bg-[hsl(220,15%,14%)]"
                  }`}
                  style={isActive(href) ? { color: "hsl(38,72%,62%)", backgroundColor: "hsl(38,72%,52%,0.08)" } : {}}
                >
                  <Icon size={13} className={isActive(href) ? "" : ""} />
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-[hsl(220,15%,16%)] space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] uppercase text-[hsl(220,12%,50%)] hover:text-white hover:bg-[hsl(220,15%,14%)] transition-all rounded-sm"
          >
            <Home size={13} />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] uppercase text-[hsl(220,12%,50%)] hover:text-red-400 hover:bg-[hsl(220,15%,14%)] transition-all rounded-sm"
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-h-screen md:ml-[224px]">
        <div className="px-4 md:px-8 py-8 md:py-10 max-w-5xl overflow-x-auto">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden min-w-[44px] min-h-[44px] p-3 mb-4 text-[hsl(220,12%,50%)] hover:text-white transition-colors"
            aria-label="Open sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
