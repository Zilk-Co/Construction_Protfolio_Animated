import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, Globe, EyeOff } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

type Policy = {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string | null;
  fileUrl: string | null;
  sortOrder: number;
  published: boolean;
  createdAt: string;
};

const CATEGORIES = ["HSE", "Quality", "Environmental", "Safety", "HR", "Other"];

function useListPolicies() {
  return useQuery<Policy[]>({ queryKey: ["admin-policies"], queryFn: async () => {
    const res = await fetch(`${API}/api/policies`);
    return res.json();
  }});
}

function useDeletePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/api/admin/policies/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-policies"] }),
  });
}

export default function AdminPolicies() {
  const { data: policies = [], isLoading } = useListPolicies();
  const deletePolicy = useDeletePolicy();
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [editPolicy, setEditPolicy] = useState<Policy | null>(null);
  const [formData, setFormData] = useState({ title: "", slug: "", category: "HSE", content: "", fileUrl: "" });

  const handleDelete = (id: number) => {
    deletePolicy.mutate(id, { onSuccess: () => setConfirmDelete(null) });
  };

  const startEdit = (policy: Policy) => {
    setEditPolicy(policy);
    setFormData({ title: policy.title, slug: policy.slug, category: policy.category, content: policy.content || "", fileUrl: policy.fileUrl || "" });
  };

  const handleSave = async () => {
    const method = editPolicy ? "PUT" : "POST";
    const url = editPolicy ? `${API}/api/admin/policies/${editPolicy.id}` : `${API}/api/admin/policies`;
    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) { setEditPolicy(null); setFormData({ title: "", slug: "", category: "HSE", content: "", fileUrl: "" }); queryClient.invalidateQueries({ queryKey: ["admin-policies"] }); }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-8 pb-6 border-b border-[hsl(220,15%,18%)]">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-1">Policies</p>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">HSE Policies</h1>
          <p className="text-xs text-[hsl(220,12%,50%)] mt-2">Manage health, safety, and environmental policies.</p>
        </div>
        <button onClick={() => { setEditPolicy(null); setFormData({ title: "", slug: "", category: "HSE", content: "", fileUrl: "" }); }} className="inline-flex items-center gap-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors">
          <Plus size={13} /> New Policy
        </button>
      </div>

      {/* Form */}
      <div className="bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] p-5 mb-6">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[hsl(38,72%,52%)] mb-4 font-semibold">{editPolicy ? "Edit Policy" : "New Policy"}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]" />
          <input placeholder="Slug" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]" />
          <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input placeholder="File URL (optional)" value={formData.fileUrl} onChange={e => setFormData({ ...formData, fileUrl: e.target.value })} className="bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]" />
          <textarea placeholder="Content / Description" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={4} className="col-span-1 md:col-span-2 bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] resize-none" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave} disabled={!formData.title || !formData.slug} className="bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors disabled:opacity-40">
            {editPolicy ? "Save Changes" : "Create Policy"}
          </button>
          {editPolicy && <button onClick={() => setEditPolicy(null)} className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,55%)] hover:text-white border border-[hsl(220,15%,25%)] hover:border-[hsl(220,12%,40%)] transition-colors">Cancel</button>}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />)}</div>
      ) : (
        <div className="border border-[hsl(220,15%,18%)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[hsl(220,18%,11%)] border-b border-[hsl(220,15%,18%)]">
                {["Policy", "Category", "Visibility", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[9px] tracking-[0.25em] uppercase text-[hsl(220,12%,40%)] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {policies.map(policy => (
                <tr key={policy.id} className="border-b border-[hsl(220,15%,16%)] hover:bg-[hsl(220,18%,11%)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-serif font-bold text-sm">{policy.title}</p>
                    <p className="text-[10px] text-[hsl(220,12%,40%)] mt-0.5">/{policy.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-[hsl(220,15%,16%)] text-[10px] tracking-[0.15em] uppercase px-2 py-1">{policy.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 tracking-[0.15em] uppercase border ${policy.published ? "border-green-800 text-green-500" : "border-[hsl(220,15%,25%)] text-[hsl(220,12%,45%)]"}`}>
                      {policy.published ? <><Globe size={9} /> Live</> : <><EyeOff size={9} /> Hidden</>}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <button onClick={() => startEdit(policy)} className="text-[hsl(220,12%,45%)] hover:text-[hsl(38,72%,52%)] transition-colors" title="Edit"><Pencil size={13} /></button>
                      {confirmDelete === policy.id ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleDelete(policy.id)} className="text-[9px] text-red-400 uppercase tracking-widest hover:text-red-300">Confirm</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-[9px] text-[hsl(220,12%,40%)] uppercase tracking-widest hover:text-foreground">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(policy.id)} className="text-[hsl(220,12%,35%)] hover:text-red-400 transition-colors" title="Delete"><Trash2 size={13} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {policies.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-[hsl(220,12%,40%)] text-xs tracking-widest uppercase">No policies yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
