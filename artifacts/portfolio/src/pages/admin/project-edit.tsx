import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetProject, useUpdateProject, useListCategories, useListProjects, getGetProjectQueryKey } from "@workspace/api-client-react";
import { Link, useLocation, useParams } from "wouter";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminProjectEdit() {
  const { id } = useParams();
  const projectId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Find project by iterating through all projects (useGetProject expects slug, but we only have ID here)
  // Or actually, wait, the API might not have a getProjectById endpoint, let's fetch all and filter or wait... 
  // Let's modify our approach. `useGetProject` requires slug. We shouldn't use ID in URL if we don't have getById.
  // BUT the route is `/admin/projects/:id/edit`.
  const { data: projects = [], isLoading: isLoadingProjects } = useListProjects();
  const project = projects.find(p => p.id === projectId);
  
  const { data: categories = [] } = useListCategories();
  const updateProject = useUpdateProject();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    location: "",
    client: "",
    sector: "",
    size: "",
    scope: "",
    status: "",
    longDescription: "",
    categoryId: "" as number | string,
    year: "",
    featured: false,
  });

  const [isSaved, setIsSaved] = useState(false);

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
        sector: fullProject.sector || "",
        size: fullProject.size || "",
        scope: fullProject.scope || "",
        status: fullProject.status || "",
        longDescription: fullProject.longDescription || "",
        categoryId: fullProject.categoryId || "",
        year: fullProject.year || "",
        featured: fullProject.featured ?? false,
      });
    }
  }, [fullProject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: name === "categoryId" ? (value === "" ? null : parseInt(value, 10)) : val
    }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject.mutate({
      id: projectId,
      data: {
        ...formData,
        categoryId: formData.categoryId ? Number(formData.categoryId) : undefined
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
        <div className="mb-12 border-b border-neutral-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif tracking-tighter uppercase mb-2">Edit Project</h1>
            <p className="text-neutral-500 tracking-widest text-sm uppercase">{fullProject.title}</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link href={`/admin/projects/${projectId}/images`} className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white">
              Manage Images
            </Link>
            <Link href="/admin/dashboard" className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white">
              Back to Dashboard
            </Link>
          </div>
        </div>

        <form id="project-edit-form" onSubmit={handleSubmit} className="space-y-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-sm font-serif tracking-widest uppercase border-b border-neutral-800 pb-2 text-neutral-400">Basic Info</h2>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Project Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-white focus:border-white transition-colors" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">URL Slug</label>
                <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-white focus:border-white transition-colors" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Category</label>
                <select name="categoryId" value={formData.categoryId || ""} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-white focus:border-white transition-colors appearance-none rounded-none">
                  <option value="">No Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Status</label>
                <input name="status" value={formData.status} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-white focus:border-white transition-colors" />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-sm font-serif tracking-widest uppercase border-b border-neutral-800 pb-2 text-neutral-400">Metadata</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Location</label>
                  <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-white focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Year</label>
                  <input name="year" value={formData.year} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-white focus:border-white transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Client</label>
                <input name="client" value={formData.client} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-white focus:border-white transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Sector</label>
                  <input name="sector" value={formData.sector} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-white focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Size</label>
                  <input name="size" value={formData.size} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-white focus:border-white transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Scope</label>
                <input name="scope" value={formData.scope} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-white focus:border-white transition-colors" />
              </div>
            </div>
          </div>

          {/* Featured toggle */}
          <div className="pt-4 flex items-center gap-3">
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

          <div className="space-y-6 pt-6">
            <h2 className="text-sm font-serif tracking-widest uppercase border-b border-neutral-800 pb-2 text-neutral-400">Narrative</h2>
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Long Description</label>
              <textarea 
                name="longDescription" 
                value={formData.longDescription} 
                onChange={handleChange} 
                rows={12}
                className="w-full bg-neutral-900 border border-neutral-800 px-4 py-4 text-white focus:border-white transition-colors resize-none font-light leading-relaxed" 
                placeholder="Enter project narrative..."
              />
            </div>
          </div>
        </form>

        {createPortal(
          <div className="fixed bottom-0 left-[224px] right-0 border-t border-neutral-800 flex items-center gap-6 bg-neutral-950/95 backdrop-blur-md px-8 py-4 z-50">
            <button
              type="submit"
              form="project-edit-form"
              disabled={updateProject.isPending}
              className="px-8 py-3 bg-white text-black font-serif tracking-widest uppercase hover:bg-neutral-200 transition-colors disabled:opacity-50"
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
