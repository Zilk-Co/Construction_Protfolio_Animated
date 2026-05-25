import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { LayoutDashboard, FolderOpen, Settings2, LogOut, Home, SlidersHorizontal } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: me, isLoading } = useGetAdminMe();
  const logout = useAdminLogout();

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

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/projects/new", label: "New Project", icon: FolderOpen },
    { href: "/admin/machinery", label: "Machinery", icon: Settings2 },
    { href: "/admin/settings", label: "Site Settings", icon: SlidersHorizontal },
  ];

  const isActive = (href: string) =>
    href === "/admin" ? location === "/admin" : location.startsWith(href);

  return (
    <div className="min-h-screen text-white flex" style={{ backgroundColor: "hsl(220,18%,9%)" }}>
      {/* Sidebar */}
      <aside className="w-58 shrink-0 border-r border-[hsl(220,15%,16%)] flex flex-col fixed inset-y-0 left-0 z-30" style={{ width: "224px", backgroundColor: "hsl(220,18%,7%)" }}>
        {/* Brand */}
        <div className="px-5 py-6 border-b border-[hsl(220,15%,16%)]">
          <p className="text-sm font-serif font-bold uppercase tracking-tight text-white leading-none">
            Zain Manzoor
          </p>
          <p className="text-[10px] tracking-[0.35em] uppercase mt-1 font-semibold" style={{ color: "hsl(38,85%,62%)" }}>
            Co. — Admin
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-150 ${
                isActive(href)
                  ? "border-l-2 font-semibold"
                  : "text-gray-500 hover:text-white hover:bg-[hsl(220,15%,14%)] border-l-2 border-transparent"
              }`}
              style={isActive(href) ? { color: "hsl(38,72%,62%)", backgroundColor: "hsl(38,72%,52%,0.1)", borderLeftColor: "hsl(38,72%,52%)" } : {}}
            >
              <Icon size={13} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-[hsl(220,15%,16%)] space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] uppercase text-gray-500 hover:text-white hover:bg-[hsl(220,15%,14%)] transition-all"
          >
            <Home size={13} />
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] uppercase text-gray-500 hover:text-red-400 hover:bg-[hsl(220,15%,14%)] transition-all"
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-h-screen" style={{ marginLeft: "224px" }}>
        <div className="px-8 py-10 max-w-5xl">
          {children}
        </div>
      </div>
    </div>
  );
}
