import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useListMachinery,
  useCreateMachinery,
  useUpdateMachinery,
  getListMachineryQueryKey,
} from "@workspace/api-client-react";
import { Link, useLocation, useParams } from "wouter";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

const CATEGORIES = ["Heavy Lifting", "Earthmoving", "Concrete Works", "Piling", "Transport", "Other"];
const CONDITIONS = ["Excellent", "Good", "Fair"];

export default function AdminMachineryEdit() {
  const { id } = useParams();
  const isNew = !id;
  const machineryId = id ? parseInt(id, 10) : null;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: allMachinery = [] } = useListMachinery();
  const existing = machineryId ? allMachinery.find(m => m.id === machineryId) : null;

  const createMachinery = useCreateMachinery();
  const updateMachinery = useUpdateMachinery();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    description: "",
    longDescription: "",
    imageUrl: "",
    galleryImages: "",
    year: "",
    condition: "",
    published: true,
    featured: false,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (existing) {
      let galleryStr = "";
      try {
        const parsed = existing.galleryImages ? JSON.parse(existing.galleryImages as string) : [];
        galleryStr = Array.isArray(parsed) ? parsed.join("\n") : "";
      } catch { galleryStr = ""; }
      setForm({
        name: existing.name || "",
        slug: existing.slug || "",
        category: existing.category || "",
        description: existing.description || "",
        longDescription: (existing as any).longDescription || "",
        imageUrl: existing.imageUrl || "",
        galleryImages: galleryStr,
        year: existing.year || "",
        condition: existing.condition || "",
        published: existing.published,
        featured: existing.featured ?? false,
      });
    }
  }, [existing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    if (name === "name" && isNew) {
      setForm(prev => ({
        ...prev,
        name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: val }));
    }
  };

  const buildPayload = () => {
    const galleryArr = form.galleryImages
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean);
    return { ...form, galleryImages: galleryArr.length ? JSON.stringify(galleryArr) : "" };
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setForm(prev => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNew) {
      createMachinery.mutate(
        { data: buildPayload() },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListMachineryQueryKey() });
            setLocation("/admin/machinery");
          },
        }
      );
    } else if (machineryId) {
      updateMachinery.mutate(
        { id: machineryId, data: buildPayload() },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListMachineryQueryKey() });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          },
        }
      );
    }
  };

  const isPending = createMachinery.isPending || updateMachinery.isPending;

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-[hsl(220,15%,18%)]">
          <Link href="/admin/machinery" className="text-[hsl(220,12%,45%)] hover:text-foreground transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-0.5">
              {isNew ? "New Equipment" : "Edit Equipment"}
            </p>
            <h1 className="text-2xl font-serif font-bold uppercase tracking-tight">
              {isNew ? "Add Equipment" : form.name || "Edit"}
            </h1>
          </div>
        </div>

        <form id="machinery-edit-form" onSubmit={handleSubmit} className="space-y-6 pb-24">
          {/* Name + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">
                Equipment Name *
              </label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tower Crane TC-6518"
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">
                URL Slug *
              </label>
              <input
                required
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="tower-crane-tc-6518"
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)] font-mono"
              />
            </div>
          </div>

          {/* Category + Condition + Year */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors appearance-none"
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Condition</label>
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors appearance-none"
              >
                <option value="">Select condition</option>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Year</label>
              <input
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="2022"
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)]"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Main Image</label>
            <div className="space-y-3">
              <div className="flex gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] border-dashed px-4 py-3 text-sm cursor-pointer hover:border-[hsl(38,72%,52%)] transition-colors">
                  <Upload size={16} />
                  <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                {form.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, imageUrl: "" }))}
                    className="px-3 py-3 border border-[hsl(220,15%,20%)] hover:border-red-500 text-[hsl(220,12%,45%)] hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {form.imageUrl && (
                <div className="aspect-video w-full max-w-md overflow-hidden border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,11%)]">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
              <div>
                <label className="block text-[9px] tracking-[0.2em] uppercase text-[hsl(220,12%,35%)] mb-1">Or paste image URL</label>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-2 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)]"
                />
              </div>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Short Description <span className="text-[hsl(220,12%,35%)] normal-case tracking-normal">(shown on cards)</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief summary — capacity, type, key specs..."
              className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors resize-none placeholder:text-[hsl(220,12%,30%)]"
            />
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Full Description <span className="text-[hsl(220,12%,35%)] normal-case tracking-normal">(detailed narrative)</span></label>
            <textarea
              name="longDescription"
              value={form.longDescription}
              onChange={handleChange}
              rows={7}
              placeholder="Detailed specifications, operational history, use cases, maintenance notes..."
              className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors resize-none placeholder:text-[hsl(220,12%,30%)]"
            />
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">
              Gallery Images <span className="text-[hsl(220,12%,35%)] normal-case tracking-normal">(one URL per line)</span>
            </label>
            <textarea
              name="galleryImages"
              value={form.galleryImages}
              onChange={handleChange}
              rows={5}
              placeholder={"https://example.com/img1.jpg\nhttps://example.com/img2.jpg"}
              className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors resize-none placeholder:text-[hsl(220,12%,30%)] font-mono"
            />
            {form.galleryImages.split("\n").filter(Boolean).length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {form.galleryImages.split("\n").filter(s => s.trim()).map((url, i) => (
                  <div key={i} className="w-20 h-14 overflow-hidden border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,11%)]">
                    <img src={url.trim()} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="space-y-3">
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
                Visible on public machinery page
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4 accent-[hsl(38,72%,52%)]"
              />
              <label htmlFor="featured" className="text-xs tracking-[0.15em] uppercase text-[hsl(220,12%,55%)]">
                Show on home page (Our Machinery)
              </label>
            </div>
          </div>
        </form>

        {createPortal(
          <div className="flex items-center gap-5 border-t border-[hsl(220,15%,18%)] fixed bottom-0 left-[224px] right-0 bg-[hsl(220,18%,9%)]/95 backdrop-blur-md px-8 py-4 z-50">
            <button
              type="submit"
              form="machinery-edit-form"
              disabled={isPending}
              className="inline-flex items-center gap-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-8 py-3 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors disabled:opacity-40"
            >
              <Save size={13} />
              {isPending ? "Saving..." : isNew ? "Add Equipment" : "Save Changes"}
            </button>
            {saved && <span className="text-green-500 text-xs tracking-widest uppercase">Saved</span>}
          </div>,
          document.body
        )}
      </div>
    </AdminLayout>
  );
}
