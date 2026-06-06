import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useListProjects,
  useDeleteProject,
  useToggleProjectPublish,
  useUpdateProject,
  getListProjectsQueryKey,
} from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Image as ImageIcon, Trash2, Globe, EyeOff, Star, Search, Filter } from "lucide-react";
import { useMemo, useState } from "react";

type StatusFilter = "all" | "published" | "draft" | "featured";

export default function AdminDashboard() {
  const { data: projects = [], isLoading } = useListProjects();
  const togglePublish = useToggleProjectPublish();
  const deleteProject = useDeleteProject();
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const updateProject = useUpdateProject();

  const handleToggle = (id: number, published: boolean) => {
    togglePublish.mutate(
      { id, data: { published } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() }) }
    );
  };

  const handleFeature = (project: typeof projects[number]) => {
    updateProject.mutate(
      { id: project.id, data: { title: project.title, slug: project.slug, status: project.status, featured: !project.featured } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() }) }
    );
  };

  const handleDelete = (id: number) => {
    deleteProject.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
          setConfirmDelete(null);
        },
      }
    );
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter(p => {
      if (statusFilter === "published" && !p.published) return false;
      if (statusFilter === "draft" && p.published) return false;
      if (statusFilter === "featured" && !p.featured) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.slug ?? "").toLowerCase().includes(q) ||
        (p.location ?? "").toLowerCase().includes(q) ||
        (p.sector ?? "").toLowerCase().includes(q)
      );
    });
  }, [projects, search, statusFilter]);

  const published = projects.filter(p => p.published).length;
  const featured = projects.filter(p => p.featured).length;

  const filterChips: { value: StatusFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: projects.length },
    { value: "published", label: "Live", count: published },
    { value: "draft", label: "Draft", count: projects.length - published },
    { value: "featured", label: "Featured", count: featured },
  ];

  return (
    <AdminLayout>
      {/* Page header */}
      <div className="flex justify-between items-end mb-8 pb-6 border-b border-[hsl(220,15%,18%)]">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-1">Portfolio</p>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">All Projects</h1>
          <p className="text-xs text-[hsl(220,12%,50%)] mt-2">
            Create, edit, and publish the projects shown on the public site.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors"
        >
          <Plus size={13} />
          New Project
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Projects", value: projects.length },
          { label: "Published", value: published },
          { label: "Drafts", value: projects.length - published },
          { label: "Featured on Home", value: featured },
        ].map(stat => (
          <div key={stat.label} className="bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] px-5 py-4">
            <p className="text-2xl font-serif font-bold">{stat.value}</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,12%,40%)]" />
          <input
            type="text"
            placeholder="Search by title, slug, location, or sector…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-[hsl(220,12%,35%)] focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] p-1">
          <Filter size={12} className="text-[hsl(220,12%,40%)] mx-2" />
          {filterChips.map(chip => (
            <button
              key={chip.value}
              onClick={() => setStatusFilter(chip.value)}
              className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-colors ${
                statusFilter === chip.value
                  ? "bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] font-semibold"
                  : "text-[hsl(220,12%,55%)] hover:text-white"
              }`}
            >
              {chip.label}
              <span className={`ml-1.5 ${statusFilter === chip.value ? "text-[hsl(220,18%,9%)]" : "text-[hsl(220,12%,35%)]"}`}>
                {chip.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Project Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-16 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="border border-[hsl(220,15%,18%)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[hsl(220,18%,11%)] border-b border-[hsl(220,15%,18%)]">
                {["Project", "Location", "Sector", "Status", "Home", "Visibility", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[9px] tracking-[0.25em] uppercase text-[hsl(220,12%,40%)] font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((project, i) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-[hsl(220,15%,16%)] hover:bg-[hsl(220,18%,11%)] transition-colors"
                  data-testid={`row-project-${project.id}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-serif font-bold text-sm">{project.title}</p>
                    <p className="text-[10px] text-[hsl(220,12%,40%)] mt-0.5">/{project.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[hsl(220,12%,55%)]">{project.location || "—"}</td>
                  <td className="px-4 py-3 text-xs text-[hsl(220,12%,55%)]">{project.sector || "—"}</td>
                  <td className="px-4 py-3 text-xs text-[hsl(220,12%,55%)]">{project.status}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleFeature(project)}
                      disabled={updateProject.isPending}
                      title={project.featured ? "Remove from home page" : "Show on home page"}
                      className="transition-colors"
                      data-testid={`button-feature-${project.id}`}
                    >
                      <Star
                        size={14}
                        className={project.featured ? "text-[hsl(38,72%,52%)]" : "text-[hsl(220,12%,30%)] hover:text-[hsl(220,12%,55%)]"}
                        fill={project.featured ? "currentColor" : "none"}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(project.id, !project.published)}
                      disabled={togglePublish.isPending}
                      className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 tracking-[0.15em] uppercase border transition-all ${
                        project.published
                          ? "border-green-800 text-green-500 hover:bg-green-900/20"
                          : "border-[hsl(220,15%,25%)] text-[hsl(220,12%,45%)] hover:border-[hsl(38,72%,52%/50%)] hover:text-[hsl(38,72%,52%)]"
                      }`}
                      data-testid={`button-toggle-${project.id}`}
                    >
                      {project.published ? <Globe size={9} /> : <EyeOff size={9} />}
                      {project.published ? "Live" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/admin/projects/${project.id}/images`}
                        className="text-[hsl(220,12%,45%)] hover:text-foreground transition-colors"
                        title="Manage Images"
                        data-testid={`link-images-${project.id}`}
                      >
                        <ImageIcon size={13} />
                      </Link>
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="text-[hsl(220,12%,45%)] hover:text-[hsl(38,72%,52%)] transition-colors"
                        title="Edit"
                        data-testid={`link-edit-${project.id}`}
                      >
                        <Pencil size={13} />
                      </Link>
                      {confirmDelete === project.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="text-[9px] text-red-400 uppercase tracking-widest hover:text-red-300"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-[9px] text-[hsl(220,12%,40%)] uppercase tracking-widest hover:text-foreground"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(project.id)}
                          className="text-[hsl(220,12%,35%)] hover:text-red-400 transition-colors"
                          title="Delete"
                          data-testid={`button-delete-${project.id}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && projects.length > 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[hsl(220,12%,40%)] text-xs tracking-widest uppercase">
                    No projects match your search
                  </td>
                </tr>
              )}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[hsl(220,12%,40%)] text-xs tracking-widest uppercase">
                    No projects yet — create your first
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
