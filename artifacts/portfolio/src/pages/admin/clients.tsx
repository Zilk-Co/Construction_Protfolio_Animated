import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Plus, Pencil, Trash2, Globe, EyeOff, ExternalLink, FolderOpen } from "lucide-react";

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
  projectCount?: number;
};

type Project = {
  id: number;
  title: string;
  slug: string;
};

function useListClients() {
  return useQuery<Client[]>({ queryKey: ["admin-clients"], queryFn: async () => {
    const res = await fetch(`${API}/api/clients`);
    return res.json();
  }});
}

function useListProjects() {
  return useQuery<Project[]>({ queryKey: ["admin-projects"], queryFn: async () => {
    const res = await fetch(`${API}/api/projects`);
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
  const { data: allProjects = [] } = useListProjects();
  const deleteClient = useDeleteClient();
  const toggleClient = useToggleClient();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", website: "", logoUrl: "" });
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);

  const handleDelete = (id: number) => {
    deleteClient.mutate(id, { onSuccess: () => setConfirmDelete(null) });
  };

  const handleToggle = (id: number, published: boolean) => {
    toggleClient.mutate({ id, published });
  };

  const startEdit = async (client: Client) => {
    setEditClient(client);
    setFormData({ name: client.name, slug: client.slug, description: client.description || "", website: client.website || "", logoUrl: client.logoUrl || "" });
    
    // Fetch projects for this client
    try {
      const res = await fetch(`${API}/api/admin/clients/${client.id}/projects`, { credentials: "include" });
      const clientProjects = await res.json();
      setSelectedProjectIds(clientProjects.map((p: Project) => p.id));
    } catch {
      setSelectedProjectIds([]);
    }
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
    
    if (res.ok) {
      const savedClient = await res.json();
      
      // Update project assignments
      if (editClient) {
        // Get current projects for this client
        const currentRes = await fetch(`${API}/api/admin/clients/${editClient.id}/projects`, { credentials: "include" });
        const currentProjects = await currentRes.json();
        const currentIds = currentProjects.map((p: Project) => p.id);
        
        // Assign new projects
        for (const projectId of selectedProjectIds) {
          if (!currentIds.includes(projectId)) {
            await fetch(`${API}/api/projects/${projectId}/update`, {
              method: "PUT",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ clientId: editClient.id }),
            });
          }
        }
        
        // Unassign removed projects
        for (const projectId of currentIds) {
          if (!selectedProjectIds.includes(projectId)) {
            await fetch(`${API}/api/projects/${projectId}/update`, {
              method: "PUT",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ clientId: null }),
            });
          }
        }
      }
      
      setEditClient(null);
      setFormData({ name: "", slug: "", description: "", website: "", logoUrl: "" });
      setSelectedProjectIds([]);
    }
  };

  const toggleProjectAssignment = (projectId: number) => {
    setSelectedProjectIds(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
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
          onClick={() => { setEditClient(null); setFormData({ name: "", slug: "", description: "", website: "", logoUrl: "" }); setSelectedProjectIds([]); }}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">Client Name *</label>
            <input placeholder="Enter client name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)]" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">URL Slug *</label>
            <input placeholder="client-slug" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)] font-mono" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">Description</label>
            <input placeholder="Brief description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)]" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">Website URL</label>
            <input placeholder="https://example.com" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)]" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">Logo URL</label>
            <input placeholder="https://example.com/logo.png" value={formData.logoUrl} onChange={e => setFormData({ ...formData, logoUrl: e.target.value })} className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)]" />
          </div>
        </div>
        
        {/* Project Assignment (only in edit mode) */}
        {editClient && (
          <div className="mt-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,55%)] mb-2 font-semibold">Assign Projects</p>
            <div className="bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] p-3 max-h-40 overflow-y-auto">
              {allProjects.length === 0 ? (
                <p className="text-[10px] text-[hsl(220,12%,40%)]">No projects available</p>
              ) : (
                <div className="space-y-2">
                  {allProjects.map(project => (
                    <label key={project.id} className="flex items-center gap-2 cursor-pointer hover:bg-[hsl(220,18%,11%)] p-1.5 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedProjectIds.includes(project.id)}
                        onChange={() => toggleProjectAssignment(project.id)}
                        className="w-3 h-3 accent-[hsl(38,72%,52%)]"
                      />
                      <span className="text-xs text-white">{project.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave} disabled={!formData.name || !formData.slug} className="bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors disabled:opacity-40">
            {editClient ? "Save Changes" : "Create Client"}
          </button>
          {editClient && (
            <button onClick={() => { setEditClient(null); setSelectedProjectIds([]); }} className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,55%)] hover:text-white border border-[hsl(220,15%,25%)] hover:border-[hsl(220,12%,40%)] transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Client Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map(client => (
            <div key={client.id} className="bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] p-5 hover:border-[hsl(220,15%,25%)] transition-colors rounded-sm">
              <div className="flex items-start gap-4 mb-4">
                {client.logoUrl ? (
                  <img src={client.logoUrl} alt={client.name} className="w-12 h-12 object-contain bg-[hsl(220,18%,9%)] p-1 border border-[hsl(220,15%,18%)] rounded-sm" />
                ) : (
                  <div className="w-12 h-12 bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] flex items-center justify-center rounded-sm">
                    <span className="text-lg font-serif text-[hsl(220,12%,40%)]">{client.name.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-sm truncate">{client.name}</h3>
                  <p className="text-[10px] text-[hsl(220,12%,40%)] mt-0.5 font-mono">/{client.slug}</p>
                </div>
              </div>
              
              {client.description && (
                <p className="text-xs text-[hsl(220,12%,55%)] mb-3 line-clamp-2 leading-relaxed">{client.description}</p>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-[10px] text-[hsl(220,12%,45%)]">
                  <FolderOpen size={11} />
                  <span>{client.projectCount || 0} projects</span>
                </div>
                {client.website && (
                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[hsl(220,12%,45%)] hover:text-[hsl(38,72%,52%)] inline-flex items-center gap-1 transition-colors">
                    Website <ExternalLink size={9} />
                  </a>
                )}
              </div>
              
              <div className="flex items-center gap-2 pt-3 border-t border-[hsl(220,15%,16%)]">
                <button 
                  onClick={() => handleToggle(client.id, !client.published)} 
                  className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 tracking-[0.15em] uppercase border transition-all rounded-sm ${client.published ? "border-green-800 text-green-500 hover:bg-green-900/20" : "border-[hsl(220,15%,25%)] text-[hsl(220,12%,45%)] hover:border-[hsl(38,72%,52%/50%)] hover:text-[hsl(38,72%,52%)]"}`}
                >
                  {client.published ? <><Globe size={9} /> Live</> : <><EyeOff size={9} /> Hidden</>}
                </button>
                <div className="flex-1" />
                <button onClick={() => startEdit(client)} className="text-[hsl(220,12%,45%)] hover:text-[hsl(38,72%,52%)] transition-colors p-1" title="Edit">
                  <Pencil size={13} />
                </button>
                {confirmDelete === client.id ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDelete(client.id)} className="text-[9px] text-red-400 uppercase tracking-widest hover:text-red-300">Confirm</button>
                    <button onClick={() => setConfirmDelete(null)} className="text-[9px] text-[hsl(220,12%,40%)] uppercase tracking-widest hover:text-foreground">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(client.id)} className="text-[hsl(220,12%,35%)] hover:text-red-400 transition-colors p-1" title="Delete">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {clients.length === 0 && (
            <div className="col-span-full py-12 text-center text-[hsl(220,12%,40%)] text-xs tracking-widest uppercase">No clients yet</div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}