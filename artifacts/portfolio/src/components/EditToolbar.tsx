import { useLocation } from "wouter";
import { useEditMode } from "./EditModeProvider";
import { useGetAdminMe } from "@workspace/api-client-react";
import { Pencil, Plus, LayoutDashboard } from "lucide-react";

export function EditToolbar() {
  const { editMode } = useEditMode();
  const { data: me } = useGetAdminMe();
  const [, setLocation] = useLocation();

  if (!editMode || !me?.authenticated) return null;

  const links = [
    { label: "New Project", path: "/admin/projects/new" },
    { label: "New Service", path: "/admin/services/new" },
    { label: "New Client", path: "/admin/clients" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[hsl(220,18%,9%)]/95 backdrop-blur-md border-b border-[hsl(38,72%,52%)]/30 px-6 py-2 mt-16">
      <div className="max-w-screen-2xl mx-auto flex items-center gap-6">
        <div className="flex items-center gap-2 text-[hsl(38,72%,52%)]">
          <Pencil size={12} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold">
            Edit Mode Active
          </span>
        </div>

        <div className="h-4 w-px bg-[hsl(220,15%,20%)]" />

        <div className="flex items-center gap-4 overflow-x-auto">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => setLocation(link.path)}
              className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-[hsl(220,12%,55%)] hover:text-[hsl(38,72%,52%)] transition-colors"
            >
              <Plus size={10} />
              {link.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-[hsl(220,15%,20%)]" />

        <button
          onClick={() => setLocation("/admin")}
          className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-[hsl(220,12%,55%)] hover:text-[hsl(38,72%,52%)] transition-colors"
        >
          <LayoutDashboard size={10} />
          Admin Panel
        </button>
      </div>
    </div>
  );
}
