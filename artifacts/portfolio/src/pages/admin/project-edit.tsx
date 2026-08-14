import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetProject, useUpdateProject, useListCategories, useListServices, useListProjects, getGetProjectQueryKey } from "@workspace/api-client-react";
import { Link, useLocation, useParams } from "wouter";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";

const API = import.meta.env.VITE_API_URL || "";

type Client = {
  id: number;
  name: string;
  slug: string;
};

export default function AdminProjectEdit() {
  const { id } = useParams();
  const projectId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [clients, setClients] = useState<Client[]>([]);

  // Find project by iterating through all projects (useGetProject expects slug, but we only have ID here)
  // Or actually, wait, the API might not have a getProjectById endpoint, let's fetch all and filter or wait... 
  // Let's modify our approach. `useGetProject` requires slug. We shouldn't use ID in URL if we don't have getById.
  // BUT the route is `/admin/projects/:id/edit`.
  const { data: projects = [], isLoading: isLoadingProjects } = useListProjects();
  const project = projects.find(p => p.id === projectId);
  
  const { data: categories = [] } = useListCategories();
  const { data: services = [] } = useListServices();
  const updateProject = useUpdateProject();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    location: "",
    client: "",
    clientId: "" as number | string,
    sector: "",
    size: "",
    scope: "",
    status: "",
    longDescription: "",
    categoryId: "" as number | string,
    serviceId: "" as number | string,
    year: "",
    featured: false,
    published: true,
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/clients`)
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (project) {
      // Need full project data? `listProjects` returns `ProjectSummary`. We might be missing `longDescription`.
      // Let's fetch full project via slug.
    }
  }, [project]);

  // Full fetch using slug
  const { data: fullProject, isLoading: isLoadingFull } = useGetProject(project?.slug || "", {
    query: { enabled: !!project?.slug, queryKey: getGetProjectQueryKey(project?.slug || "") }
  });

  useEffect(() => {
    if (fullProject) {
      setFormData({
        title: fullProject.title || "",
        slug: fullProject.slug || "",
        location: fullProject.location || "",
        client: fullProject.client || "",
        clientId: fullProject.clientId || "",
        sector: fullProject.sector || "",
        size: fullProject.size || "",
        scope: fullProject.scope || "",
        status: fullProject.status || "",
        longDescription: fullProject.longDescription || "",
        categoryId: fullProject.categoryId || "",
        serviceId: fullProject.serviceId || "",
        year: fullProject.year || "",
        featured: fullProject.featured ?? false,
        published: fullProject.published ?? true,
      });
    }
  }, [fullProject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => {
      const updates: Record<string, any> = {
        [name]: name === "categoryId" || name === "serviceId" || name === "clientId" 
          ? (value === "" ? null : parseInt(value, 10)) 
          : val
      };
      
      // When client is selected, auto-fill clientName
      if (name === 'clientId') {
        if (value) {
          const selectedClient = clients.find(c => c.id === parseInt(value, 10));
          if (selectedClient) {
            updates.client = selectedClient.name;
          }
        } else {
          updates.client = "";
        }
      }
      
      return { ...prev, ...updates };
    });
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject.mutate({
      id: projectId,
      data: {
        ...formData,
        clientId: formData.clientId ? Number(formData.clientId) : null,
        categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
        serviceId: formData.serviceId ? Number(formData.serviceId) : undefined
      } as any
    }, {
      onSuccess: () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(formData.slug) });
      }
    });
  };

  if (isLoadingProjects || isLoadingFull) {
    return (
      <AdminLayout>
        <div className="animate-pulse">Loading...</div>
      </AdminLayout>
    );
  }

  if (!fullProject) {
    return <AdminLayout>Project not found.</AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 border-b border-[hsl(220,15%,18%)] pb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-1">Portfolio</p>
            <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">Edit Project</h1>
            <p className="text-xs text-[hsl(220,12%,50%)] mt-2">{fullProject.title}</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link href={`/admin/projects/${projectId}/images`} className="text-xs uppercase tracking-[0.15em] text-[hsl(220,12%,45%)] hover:text-[hsl(38,72%,52%)] transition-colors">
              Manage Images
            </Link>
            <Link href="/admin" className="text-xs uppercase tracking-[0.15em] text-[hsl(220,12%,45%)] hover:text-white transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </div>

        <form id="project-edit-form" onSubmit={handleSubmit} className="space-y-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-sm font-serif tracking-widest uppercase border-b border-[hsl(220,15%,18%)] pb-2 text-[hsl(220,12%,45%)]">Basic Info</h2>
              
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Project Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors" />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">URL Slug</label>
                <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors font-mono" />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Category</label>
                <select name="categoryId" value={formData.categoryId || ""} onChange={handleChange} className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors appearance-none">
                  <option value="">No Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Service</label>
                <select name="serviceId" value={formData.serviceId || ""} onChange={handleChange} className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors appearance-none">
                  <option value="">No Service</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors appearance-none">
                  <option value="Working">Working</option>
                  <option value="Completed">Completed</option>
                  <option value="Incoming">Incoming</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-sm font-serif tracking-widest uppercase border-b border-[hsl(220,15%,18%)] pb-2 text-[hsl(220,12%,45%)]">Metadata</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Location</label>
                  <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Year</label>
                  <input name="year" value={formData.year} onChange={handleChange} className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Client</label>
                <select
                  name="clientId"
                  value={formData.clientId || ""}
                  onChange={handleChange}
                  className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors appearance-none"
                >
                  <option value="">No Client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Sector</label>
                  <input name="sector" value={formData.sector} onChange={handleChange} className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Size</label>
                  <input name="size" value={formData.size} onChange={handleChange} className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Scope</label>
                <input name="scope" value={formData.scope} onChange={handleChange} className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors" />
              </div>
            </div>
          </div>

          {/* Published + Featured toggles */}
          <div className="pt-4 flex items-center gap-8">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-4 h-4 accent-[hsl(38,72%,52%)]"
              />
              <label htmlFor="published" className="text-xs tracking-[0.15em] uppercase text-[hsl(220,12%,55%)]">
                Visible on public site
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 accent-[hsl(38,72%,52%)]"
              />
              <label htmlFor="featured" className="text-xs tracking-[0.15em] uppercase text-[hsl(220,12%,55%)]">
                Show on home page (Selected Works)
              </label>
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <h2 className="text-sm font-serif tracking-widest uppercase border-b border-[hsl(220,15%,18%)] pb-2 text-[hsl(220,12%,45%)]">Narrative</h2>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Long Description</label>
              <textarea 
                name="longDescription" 
                value={formData.longDescription} 
                onChange={handleChange} 
                rows={12}
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-4 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors resize-none font-light leading-relaxed placeholder:text-[hsl(220,12%,30%)]" 
                placeholder="Enter project narrative..."
              />
            </div>
          </div>
        </form>

        {createPortal(
          <div className="fixed bottom-0 left-[224px] right-0 border-t border-[hsl(220,15%,18%)] flex items-center gap-6 bg-[hsl(220,18%,9%)]/95 backdrop-blur-md px-8 py-4 z-50">
            <button
              type="submit"
              form="project-edit-form"
              disabled={updateProject.isPending}
              className="px-8 py-3 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] font-bold tracking-[0.2em] uppercase text-xs hover:bg-[hsl(38,72%,60%)] transition-colors disabled:opacity-50 rounded-sm"
            >
              {updateProject.isPending ? "Saving..." : "Save Changes"}
            </button>
            {isSaved && <span className="text-green-500 text-xs tracking-widest uppercase">Changes saved</span>}
          </div>,
          document.body
        )}
      </div>
    </AdminLayout>
  );
}
