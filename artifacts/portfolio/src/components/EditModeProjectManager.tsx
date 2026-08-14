import { useState } from "react";
import { useEditMode } from "./EditModeProvider";
import { useListProjects, useDeleteProject, useCreateProject, useUpdateProject, getListProjectsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronUp } from "lucide-react";

export function EditModeProjectManager() {
  const { editMode } = useEditMode();
  const { data: projects = [] } = useListProjects();
  const deleteProject = useDeleteProject();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", location: "", client: "", sector: "", status: "In Progress" });

  if (!editMode) return null;

  const handleDelete = (id: number) => {
    deleteProject.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        setConfirmDelete(null);
      },
    });
  };

  const handleCreate = () => {
    if (!form.title || !form.slug) return;
    createProject.mutate(
      { data: { ...form, published: false, featured: false } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
          setForm({ title: "", slug: "", location: "", client: "", sector: "", status: "In Progress" });
          setShowNewForm(false);
        },
      }
    );
  };

  return (
    <div className="fixed bottom-20 right-6 z-30 w-80">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 bg-[hsl(220,18%,7%)]/95 backdrop-blur-md border border-[hsl(38,72%,52%)] text-[hsl(38,72%,52%)] px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[hsl(38,72%,52%)] hover:text-[hsl(220,18%,7%)] transition-all duration-200 shadow-lg shadow-black/40 w-full"
      >
        <Plus size={12} />
        Manage Projects ({projects.length})
        {expanded ? <ChevronDown size={12} className="ml-auto" /> : <ChevronUp size={12} className="ml-auto" />}
      </button>

      {expanded && (
        <div className="mt-1 bg-[hsl(220,18%,7%)]/95 backdrop-blur-md border border-[hsl(220,15%,18%)] shadow-2xl shadow-black/60 max-h-[60vh] overflow-y-auto">
          {/* New Project Button */}
          <div className="p-3 border-b border-[hsl(220,15%,16%)]">
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[hsl(38,72%,52%)] hover:text-white transition-colors w-full"
            >
              <Plus size={11} />
              {showNewForm ? "Cancel" : "Add New Project"}
            </button>

            {showNewForm && (
              <div className="mt-3 space-y-2">
                <input
                  placeholder="Project Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })}
                  className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]"
                />
                <input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]"
                />
                <input
                  placeholder="Client"
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]"
                />
                <div className="flex gap-2">
                  <select
                    value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value })}
                    className="flex-1 bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]"
                  >
                    <option value="">Sector</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                  </select>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="flex-1 bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>
                <button
                  onClick={handleCreate}
                  disabled={!form.title || !form.slug || createProject.isPending}
                  className="w-full bg-[hsl(38,72%,52%)] text-[hsl(220,18%,7%)] py-1.5 text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors disabled:opacity-40"
                >
                  {createProject.isPending ? "Creating..." : "Create Project"}
                </button>
              </div>
            )}
          </div>

          {/* Project List */}
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-2 px-3 py-2.5 border-b border-[hsl(220,15%,12%)] hover:bg-[hsl(220,18%,11%)] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-serif font-bold truncate text-white">
                  {editingId === project.id ? (
                    <input
                      defaultValue={project.title}
                      autoFocus
                      className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(38,72%,52%)] px-2 py-0.5 text-xs text-white focus:outline-none"
                      onBlur={(e) => {
                        if (e.target.value !== project.title) {
                          updateProject.mutate(
                            { id: project.id, data: { title: e.target.value, slug: project.slug, status: project.status } },
                            { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() }); setEditingId(null); } }
                          );
                        } else {
                          setEditingId(null);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setEditingId(null);
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                      }}
                    />
                  ) : (
                    project.title
                  )}
                </p>
                <p className="text-[9px] text-[hsl(220,12%,40%)] mt-0.5">
                  {project.location || "No location"} · {project.status}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setEditingId(project.id)}
                  className="text-[hsl(220,12%,40%)] hover:text-[hsl(38,72%,52%)] transition-colors"
                  title="Edit"
                >
                  <Pencil size={11} />
                </button>
                {confirmDelete === project.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-[9px] text-red-400 uppercase tracking-widest hover:text-red-300"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="text-[9px] text-[hsl(220,12%,40%)] uppercase tracking-widest hover:text-white"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(project.id)}
                    className="text-[hsl(220,12%,30%)] hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
