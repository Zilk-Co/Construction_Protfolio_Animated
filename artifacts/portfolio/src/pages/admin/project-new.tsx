import { AdminLayout } from "@/components/layout/AdminLayout";
import { useCreateProject, useListServices } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "";

type Client = {
  id: number;
  name: string;
  slug: string;
};

export default function AdminProjectNew() {
  const [, setLocation] = useLocation();
  const createProject = useCreateProject();
  const { data: services = [] } = useListServices();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  useState(() => {
    fetch(`${API}/api/clients`)
      .then(res => res.json())
      .then(data => { setClients(data); setIsLoadingClients(false); })
      .catch(() => setIsLoadingClients(false));
  });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    location: "",
    status: "Working",
    sector: "",
    serviceId: "",
    clientId: "",
    client: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject.mutate({
      data: {
        ...formData,
        serviceId: formData.serviceId ? parseInt(formData.serviceId, 10) : null,
        clientId: formData.clientId ? parseInt(formData.clientId, 10) : null,
        published: false
      }
    }, {
      onSuccess: (data) => {
        setLocation(`/admin/projects/${data.id}/edit`);
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates: Record<string, string> = { [name]: value };
      
      // Auto-generate slug from title if title is changed
      if (name === 'title') {
        updates.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      
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
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 border-b border-[hsl(220,15%,18%)] pb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-1">Portfolio</p>
            <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">New Project</h1>
            <p className="text-xs text-[hsl(220,12%,50%)] mt-2">Create a new project profile.</p>
          </div>
          <Link href="/admin" className="text-xs uppercase tracking-[0.15em] text-[hsl(220,12%,45%)] hover:text-white transition-colors">
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Project Title *</label>
              <input 
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors font-serif text-xl placeholder:text-[hsl(220,12%,30%)]"
                placeholder="The Obsidian Tower"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">URL Slug *</label>
              <input 
                required
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors font-mono placeholder:text-[hsl(220,12%,30%)]"
                placeholder="the-obsidian-tower"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Location</label>
                <input 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)]"
                  placeholder="City, Country"
                />
              </div>
              
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors appearance-none"
                >
                  <option value="Working">Working</option>
                  <option value="Completed">Completed</option>
                  <option value="Incoming">Incoming</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Sector</label>
              <input 
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)]"
                placeholder="Cultural, Commercial, Civic"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Service Used *</label>
              <select
                required
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors appearance-none"
              >
                <option value="">Select a service</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">Client</label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] px-4 py-3 text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors appearance-none"
              >
                <option value="">No Client</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-[hsl(220,15%,18%)]">
            <button
              type="submit"
              disabled={createProject.isPending}
              className="px-8 py-3 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] font-bold tracking-[0.2em] uppercase text-xs hover:bg-[hsl(38,72%,60%)] transition-colors disabled:opacity-50 rounded-sm"
            >
              {createProject.isPending ? "Creating..." : "Create & Continue to Editor"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
