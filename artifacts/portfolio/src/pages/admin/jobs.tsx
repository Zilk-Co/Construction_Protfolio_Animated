import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Plus, Pencil, Trash2, Globe, EyeOff, MapPin, Briefcase } from "lucide-react";

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
  createdAt: string;
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

function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/api/admin/jobs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-jobs"] }),
  });
}

function useToggleJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      const res = await fetch(`${API}/api/admin/jobs/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });
      if (!res.ok) throw new Error("Update failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-jobs"] }),
  });
}

export default function AdminJobs() {
  const { data: jobs = [], isLoading } = useListJobs();
  const deleteJob = useDeleteJob();
  const toggleJob = useToggleJob();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    deleteJob.mutate(id, { onSuccess: () => setConfirmDelete(null) });
  };

  const handleToggle = (id: number, published: boolean) => {
    toggleJob.mutate({ id, published });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-8 pb-6 border-b border-[hsl(220,15%,18%)]">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-1">Careers</p>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">Job Openings</h1>
          <p className="text-xs text-[hsl(220,12%,50%)] mt-2">Manage job listings for the careers page.</p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="inline-flex items-center gap-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors"
        >
          <Plus size={13} /> New Job
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="border border-[hsl(220,15%,18%)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[hsl(220,18%,11%)] border-b border-[hsl(220,15%,18%)]">
                {["Title", "Department", "Location", "Type", "Visibility", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[9px] tracking-[0.25em] uppercase text-[hsl(220,12%,40%)] font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-[hsl(220,15%,16%)] hover:bg-[hsl(220,18%,11%)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-serif font-bold text-sm">{job.title}</p>
                    <p className="text-[10px] text-[hsl(220,12%,40%)] mt-0.5">/{job.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[hsl(220,12%,55%)]">
                    <span className="inline-flex items-center gap-1">
                      <Briefcase size={10} />
                      {job.department || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[hsl(220,12%,55%)]">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={10} />
                      {job.location || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[9px] tracking-[0.15em] uppercase px-2 py-1 border border-[hsl(220,15%,25%)] text-[hsl(220,12%,55%)] rounded-sm">
                      {job.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(job.id, !job.published)}
                      className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 tracking-[0.15em] uppercase border transition-all ${
                        job.published
                          ? "border-green-800 text-green-500 hover:bg-green-900/20"
                          : "border-[hsl(220,15%,25%)] text-[hsl(220,12%,45%)] hover:border-[hsl(220,15%,35%)]"
                      }`}
                    >
                      {job.published ? <Globe size={9} /> : <EyeOff size={9} />}
                      {job.published ? "Live" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/admin/jobs/${job.id}/edit`}
                        className="text-[hsl(220,12%,45%)] hover:text-[hsl(38,72%,52%)] transition-colors"
                      >
                        <Pencil size={13} />
                      </Link>
                      {confirmDelete === job.id ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleDelete(job.id)} className="text-[9px] text-red-400 uppercase tracking-widest">
                            Confirm
                          </button>
                          <button onClick={() => setConfirmDelete(null)} className="text-[9px] text-[hsl(220,12%,40%)] uppercase tracking-widest">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(job.id)} className="text-[hsl(220,12%,35%)] hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[hsl(220,12%,40%)] text-xs tracking-widest uppercase">
                    No job openings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
