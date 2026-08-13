import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Plus, Pencil, Trash2, Globe, EyeOff, ExternalLink } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

type Client = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  sortOrder: number;
  published: boolean;
  createdAt: string;
};

function useListClients() {
  return useQuery<Client[]>({ queryKey: ["admin-clients"], queryFn: async () => {
    const res = await fetch(`${API}/api/clients`);
    return res.json();
  }});
}

function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/api/admin/clients/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-clients"] }),
  });
}

function useToggleClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      const res = await fetch(`${API}/api/admin/clients/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });
      if (!res.ok) throw new Error("Update failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-clients"] }),
  });
}

export default function AdminClients() {
  const { data: clients = [], isLoading } = useListClients();
  const deleteClient = useDeleteClient();
  const toggleClient = useToggleClient();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", website: "", logoUrl: "" });

  const handleDelete = (id: number) => {
    deleteClient.mutate(id, { onSuccess: () => setConfirmDelete(null) });
  };

  const handleToggle = (id: number, published: boolean) => {
    toggleClient.mutate({ id, published });
  };

  const startEdit = (client: Client) => {
    setEditClient(client);
    setFormData({ name: client.name, slug: client.slug, description: client.description || "", website: client.website || "", logoUrl: client.logoUrl || "" });
  };

  const handleSave = async () => {
    const method = editClient ? "PUT" : "POST";
    const url = editClient ? `${API}/api/admin/clients/${editClient.id}` : `${API}/api/admin/clients`;
    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) { setEditClient(null); setFormData({ name: "", slug: "", description: "", website: "", logoUrl: "" }); }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-8 pb-6 border-b border-[hsl(220,15%,18%)]">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-1">Clients</p>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">All Clients</h1>
          <p className="text-xs text-[hsl(220,12%,50%)] mt-2">Manage client organizations displayed on the site.</p>
        </div>
        <button
          onClick={() => { setEditClient(null); setFormData({ name: "", slug: "", description: "", website: "", logoUrl: "" }); }}
          className="inline-flex items-center gap-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors"
        >
          <Plus size={13} /> New Client
        </button>
      </div>

      {/* Inline form */}
      <div className="bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] p-5 mb-6">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[hsl(38,72%,52%)] mb-4 font-semibold">
          {editClient ? "Edit Client" : "New Client"}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Client Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]" />
          <input placeholder="Slug" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]" />
          <input placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]" />
          <input placeholder="Website URL" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} className="bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]" />
          <input placeholder="Logo URL" value={formData.logoUrl} onChange={e => setFormData({ ...formData, logoUrl: e.target.value })} className="bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)]" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave} disabled={!formData.name || !formData.slug} className="bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors disabled:opacity-40">
            {editClient ? "Save Changes" : "Create Client"}
          </button>
          {editClient && (
            <button onClick={() => setEditClient(null)} className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,55%)] hover:text-white border border-[hsl(220,15%,25%)] hover:border-[hsl(220,12%,40%)] transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />)}</div>
      ) : (
        <div className="border border-[hsl(220,15%,18%)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[hsl(220,18%,11%)] border-b border-[hsl(220,15%,18%)]">
                {["Client", "Website", "Visibility", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[9px] tracking-[0.25em] uppercase text-[hsl(220,12%,40%)] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="border-b border-[hsl(220,15%,16%)] hover:bg-[hsl(220,18%,11%)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-serif font-bold text-sm">{client.name}</p>
                    <p className="text-[10px] text-[hsl(220,12%,40%)] mt-0.5">/{client.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[hsl(220,12%,55%)]">
                    {client.website ? <a href={client.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-[hsl(38,72%,52%)]">{client.website}<ExternalLink size={10} /></a> : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(client.id, !client.published)} className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 tracking-[0.15em] uppercase border transition-all ${client.published ? "border-green-800 text-green-500 hover:bg-green-900/20" : "border-[hsl(220,15%,25%)] text-[hsl(220,12%,45%)] hover:border-[hsl(38,72%,52%/50%)] hover:text-[hsl(38,72%,52%)]"}`}>
                      {client.published ? <><Globe size={9} /> Live</> : <><EyeOff size={9} /> Hidden</>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <button onClick={() => startEdit(client)} className="text-[hsl(220,12%,45%)] hover:text-[hsl(38,72%,52%)] transition-colors" title="Edit"><Pencil size={13} /></button>
                      {confirmDelete === client.id ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleDelete(client.id)} className="text-[9px] text-red-400 uppercase tracking-widest hover:text-red-300">Confirm</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-[9px] text-[hsl(220,12%,40%)] uppercase tracking-widest hover:text-foreground">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(client.id)} className="text-[hsl(220,12%,35%)] hover:text-red-400 transition-colors" title="Delete"><Trash2 size={13} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-[hsl(220,12%,40%)] text-xs tracking-widest uppercase">No clients yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
