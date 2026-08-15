import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "wouter";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Save } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

type Job = {
  id: number;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  type: string;
  description: string;
  requirements: string | null;
  published: boolean;
  sortOrder: number;
};

function useListJobs() {
  return useQuery<Job[]>({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/jobs`);
      return res.json();
    },
  });
}

export default function AdminJobsEdit() {
  const { id } = useParams();
  const isNew = !id;
  const jobId = id ? parseInt(id, 10) : null;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: allJobs = [] } = useListJobs();
  const existing = jobId ? allJobs.find((j) => j.id === jobId) : null;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
    published: true,
    sortOrder: 0,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || "",
        slug: existing.slug || "",
        department: existing.department || "",
        location: existing.location || "",
        type: existing.type || "Full-time",
        description: existing.description || "",
        requirements: existing.requirements || "",
        published: existing.published,
        sortOrder: existing.sortOrder || 0,
      });
    }
  }, [existing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    if (name === "title" && isNew) {
      setForm((prev) => ({
        ...prev,
        title: value,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? `${API}/api/admin/jobs` : `${API}/api/admin/jobs/${jobId}`;
    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      if (isNew) {
        setLocation("/admin/jobs");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-[hsl(220,15%,18%)]">
          <Link href="/admin/jobs" className="text-[hsl(220,12%,45%)] hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-0.5">
              {isNew ? "New Job" : "Edit Job"}
            </p>
            <h1 className="text-2xl font-serif font-bold uppercase tracking-tight">
              {isNew ? "Add Job Opening" : form.title || "Edit"}
            </h1>
          </div>
        </div>

        <form id="jobs-edit-form" onSubmit={handleSubmit} className="space-y-6 pb-24">
          {/* Title + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Job Title *</label>
              <input
                required
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Senior Architect"
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">URL Slug *</label>
              <input
                required
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="senior-architect"
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)] font-mono"
              />
            </div>
          </div>

          {/* Department + Location + Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Department</label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Engineering"
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Karachi"
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Employment Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Job Description *</label>
            <textarea
              required
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={8}
              placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
              className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors resize-none placeholder:text-[hsl(220,12%,30%)]"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Requirements</label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              rows={6}
              placeholder="List qualifications, skills, and experience required..."
              className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors resize-none placeholder:text-[hsl(220,12%,30%)]"
            />
          </div>

          {/* Sort Order + Published */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Sort Order</label>
              <input
                type="number"
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChange}
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors"
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={form.published}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[hsl(38,72%,52%)]"
                />
                <label htmlFor="published" className="text-xs tracking-[0.15em] uppercase text-[hsl(220,12%,55%)]">
                  Visible on public careers page
                </label>
              </div>
            </div>
          </div>
        </form>

        {createPortal(
          <div className="flex items-center gap-5 border-t border-[hsl(220,15%,18%)] fixed bottom-0 left-[224px] right-0 bg-[hsl(220,18%,9%)]/95 backdrop-blur-md px-8 py-4 z-50">
            <button
              type="submit"
              form="jobs-edit-form"
              className="inline-flex items-center gap-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-8 py-3 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors rounded-sm"
            >
              <Save size={13} />
              {isNew ? "Add Job" : "Save Changes"}
            </button>
            {saved && <span className="text-green-500 text-xs tracking-widest uppercase">Saved</span>}
          </div>,
          document.body
        )}
      </div>
    </AdminLayout>
  );
}
