import { AdminLayout } from "@/components/layout/AdminLayout";
import { GalleryPicker } from "@/components/admin/GalleryPicker";
import { Link, useLocation, useParams } from "wouter";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  category: string | null;
  published: boolean;
  featured: boolean;
  author: string;
  sortOrder: number;
};

const CATEGORIES = [
  "Project Update",
  "Company News",
  "Industry Insight",
  "Awards",
  "Events",
  "Sustainability",
  "Technology",
  "Safety",
];

function useGetPost(id: number | null) {
  return useQuery<BlogPost>({
    queryKey: ["admin-blog-post", id],
    queryFn: async () => {
      const res = await fetch(`${API}/api/admin/blog`, { credentials: "include" });
      const posts = await res.json();
      return posts.find((p: BlogPost) => p.id === id);
    },
    enabled: id !== null,
  });
}

export default function AdminBlogEdit() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const postId = id && id !== "new" ? parseInt(id, 10) : null;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: existing } = useGetPost(postId);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "Project Update",
    published: false,
    featured: false,
    author: "Azhar Engineering",
    sortOrder: 0,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || "",
        slug: existing.slug || "",
        excerpt: existing.excerpt || "",
        content: existing.content || "",
        coverImage: existing.coverImage || "",
        category: existing.category || "Project Update",
        published: existing.published,
        featured: existing.featured,
        author: existing.author || "Azhar Engineering",
        sortOrder: existing.sortOrder || 0,
      });
    }
  }, [existing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

  const handleImageUpload = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setForm((prev) => ({ ...prev, coverImage: data.imageUrl }));
      return data.imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? `${API}/api/admin/blog` : `${API}/api/admin/blog/${postId}`;

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      await queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      if (isNew) {
        setLocation("/admin/blog");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-[hsl(220,15%,18%)]">
          <Link
            href="/admin/blog"
            className="text-[hsl(220,12%,45%)] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-0.5">
              {isNew ? "New Post" : "Edit Post"}
            </p>
            <h1 className="text-2xl font-serif font-bold uppercase tracking-tight">
              {isNew ? "Create Post" : form.title || "Edit"}
            </h1>
          </div>
        </div>

        <form id="blog-edit-form" onSubmit={handleSubmit} className="space-y-6 pb-24">
          {/* Title + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">
                Title *
              </label>
              <input
                required
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Post Title"
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
                placeholder="post-slug"
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)] font-mono"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <GalleryPicker
              value={form.coverImage}
              onChange={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
              label="Cover Image"
              acceptUpload
              onFileUpload={handleImageUpload}
              uploading={uploading}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">
              Excerpt <span className="text-[hsl(220,12%,35%)] normal-case tracking-normal">(short summary)</span>
            </label>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              rows={3}
              placeholder="Brief summary of the post..."
              className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors resize-none placeholder:text-[hsl(220,12%,30%)]"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">
              Content <span className="text-[hsl(220,12%,35%)] normal-case tracking-normal">(full article body)</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={12}
              placeholder="Write your article content here..."
              className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors resize-none placeholder:text-[hsl(220,12%,30%)] font-mono leading-relaxed"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">
              Author
            </label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Azhar Engineering"
              className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)]"
            />
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">
              Sort Order
            </label>
            <input
              type="number"
              name="sortOrder"
              value={form.sortOrder}
              onChange={handleChange}
              className="w-32 bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors"
            />
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
              <label
                htmlFor="published"
                className="text-xs tracking-[0.15em] uppercase text-[hsl(220,12%,55%)]"
              >
                Published (visible on public site)
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
              <label
                htmlFor="featured"
                className="text-xs tracking-[0.15em] uppercase text-[hsl(220,12%,55%)]"
              >
                Featured (highlight on blog page)
              </label>
            </div>
          </div>
        </form>

        {createPortal(
          <div className="flex items-center gap-5 border-t border-[hsl(220,15%,18%)] fixed bottom-0 left-[224px] right-0 bg-[hsl(220,18%,9%)]/95 backdrop-blur-md px-8 py-4 z-50">
            <button
              type="submit"
              form="blog-edit-form"
              className="inline-flex items-center gap-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-8 py-3 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors rounded-sm"
            >
              <Save size={13} />
              {isNew ? "Create Post" : "Save Changes"}
            </button>
            {saved && (
              <span className="text-green-500 text-xs tracking-widest uppercase">Saved</span>
            )}
          </div>,
          document.body
        )}
      </div>
    </AdminLayout>
  );
}
