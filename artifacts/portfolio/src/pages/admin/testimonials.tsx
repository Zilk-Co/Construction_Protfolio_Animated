import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, Globe, EyeOff, Star } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

type Testimonial = {
  id: number;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  published: boolean;
  sortOrder: number;
  createdAt: string;
};

function useListTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/testimonials`);
      return res.json();
    },
  });
}

function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/api/admin/testimonials/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });
}

function useToggleTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      const res = await fetch(`${API}/api/admin/testimonials/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });
      if (!res.ok) throw new Error("Update failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });
}

export default function AdminTestimonials() {
  const { data: testimonials = [], isLoading } = useListTestimonials();
  const deleteTestimonial = useDeleteTestimonial();
  const toggleTestimonial = useToggleTestimonial();
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    sortOrder: 0,
  });

  const handleDelete = (id: number) => {
    deleteTestimonial.mutate(id, { onSuccess: () => setConfirmDelete(null) });
  };

  const handleToggle = (id: number, published: boolean) => {
    toggleTestimonial.mutate({ id, published });
  };

  const startEdit = (item: Testimonial) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      role: item.role || "",
      company: item.company || "",
      content: item.content,
      rating: item.rating,
      sortOrder: item.sortOrder,
    });
  };

  const handleSave = async () => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem
      ? `${API}/api/admin/testimonials/${editItem.id}`
      : `${API}/api/admin/testimonials`;
    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setEditItem(null);
      setFormData({ name: "", role: "", company: "", content: "", rating: 5, sortOrder: 0 });
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-8 pb-6 border-b border-[hsl(220,15%,18%)]">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-1">Testimonials</p>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">Client Testimonials</h1>
          <p className="text-xs text-[hsl(220,12%,50%)] mt-2">Manage testimonials displayed on the site.</p>
        </div>
        <button
          onClick={() => {
            setEditItem(null);
            setFormData({ name: "", role: "", company: "", content: "", rating: 5, sortOrder: 0 });
          }}
          className="inline-flex items-center gap-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors"
        >
          <Plus size={13} /> New Testimonial
        </button>
      </div>

      {/* Inline form */}
      <div className="bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] p-5 mb-6">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[hsl(38,72%,52%)] mb-4 font-semibold">
          {editItem ? "Edit Testimonial" : "New Testimonial"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">Name *</label>
            <input
              placeholder="Client name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)]"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">Role / Title</label>
            <input
              placeholder="Project Director"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)]"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">Company</label>
            <input
              placeholder="Company name"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)]"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: r })}
                  className="transition-colors"
                >
                  <Star
                    size={16}
                    className={r <= formData.rating ? "text-[hsl(38,72%,52%)]" : "text-[hsl(220,15%,25%)]"}
                    fill={r <= formData.rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">Testimonial Content *</label>
            <textarea
              placeholder="What the client said..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)] resize-none"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">Sort Order</label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
              className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            disabled={!formData.name || !formData.content}
            className="bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors disabled:opacity-40"
          >
            {editItem ? "Save Changes" : "Create Testimonial"}
          </button>
          {editItem && (
            <button
              onClick={() => setEditItem(null)}
              className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,55%)] hover:text-white border border-[hsl(220,15%,25%)] hover:border-[hsl(220,12%,40%)] transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Testimonial Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] p-5 hover:border-[hsl(220,15%,25%)] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-serif font-bold text-sm">{item.name}</h3>
                  <p className="text-[10px] text-[hsl(220,12%,40%)] mt-0.5">
                    {item.role}{item.role && item.company ? ", " : ""}{item.company}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={10} className="text-[hsl(38,72%,52%)]" fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[hsl(220,12%,55%)] leading-relaxed line-clamp-3 mb-4 italic">"{item.content}"</p>
              <div className="flex items-center gap-2 pt-3 border-t border-[hsl(220,15%,16%)]">
                <button
                  onClick={() => handleToggle(item.id, !item.published)}
                  className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 tracking-[0.15em] uppercase border transition-all rounded-sm ${
                    item.published
                      ? "border-green-800 text-green-500 hover:bg-green-900/20"
                      : "border-[hsl(220,15%,25%)] text-[hsl(220,12%,45%)] hover:border-[hsl(220,15%,35%)]"
                  }`}
                >
                  {item.published ? <><Globe size={9} /> Live</> : <><EyeOff size={9} /> Hidden</>}
                </button>
                <div className="flex-1" />
                <button onClick={() => startEdit(item)} className="text-[hsl(220,12%,45%)] hover:text-[hsl(38,72%,52%)] transition-colors p-1" title="Edit">
                  <Pencil size={13} />
                </button>
                {confirmDelete === item.id ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDelete(item.id)} className="text-[9px] text-red-400 uppercase tracking-widest hover:text-red-300">
                      Confirm
                    </button>
                    <button onClick={() => setConfirmDelete(null)} className="text-[9px] text-[hsl(220,12%,40%)] uppercase tracking-widest hover:text-white">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(item.id)} className="text-[hsl(220,12%,35%)] hover:text-red-400 transition-colors p-1" title="Delete">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {testimonials.length === 0 && (
            <div className="col-span-full py-12 text-center text-[hsl(220,12%,40%)] text-xs tracking-widest uppercase">
              No testimonials yet
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
