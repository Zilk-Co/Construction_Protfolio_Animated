import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Copy, Check, Image, ExternalLink } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

type MediaItem = {
  id: number;
  url: string;
  name: string;
  alt: string | null;
  type: string | null;
  createdAt: string;
};

function useListMedia() {
  return useQuery<MediaItem[]>({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/admin/media`, { credentials: "include" });
      return res.json();
    },
  });
}

function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/api/admin/media/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-media"] }),
  });
}

function useAddMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { url: string; name: string; alt: string }) => {
      const res = await fetch(`${API}/api/admin/media`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Add failed");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-media"] }),
  });
}

export default function AdminMedia() {
  const { data: media = [], isLoading } = useListMedia();
  const deleteMedia = useDeleteMedia();
  const addMedia = useAddMedia();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [altInput, setAltInput] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleAdd = () => {
    if (!urlInput.trim()) return;
    addMedia.mutate(
      { url: urlInput.trim(), name: nameInput.trim(), alt: altInput.trim() },
      {
        onSuccess: () => {
          setUrlInput("");
          setNameInput("");
          setAltInput("");
          setShowAdd(false);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteMedia.mutate(id, { onSuccess: () => setConfirmDelete(null) });
  };

  const copyUrl = async (url: string, id: number) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-8 pb-6 border-b border-[hsl(220,15%,18%)]">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-1">Media</p>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">Media Library</h1>
          <p className="text-xs text-[hsl(220,12%,50%)] mt-2">Manage image URLs for use across the site.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors"
        >
          <Plus size={13} /> Add Image
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] p-5 mb-6">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[hsl(38,72%,52%)] mb-4 font-semibold">Add Image URL</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">Image URL *</label>
              <input
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">Name</label>
              <input
                placeholder="Image name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mb-1.5">Alt Text</label>
              <input
                placeholder="Describe the image"
                value={altInput}
                onChange={(e) => setAltInput(e.target.value)}
                className="w-full bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,18%)] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,35%)]"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              disabled={!urlInput.trim() || addMedia.isPending}
              className="bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors disabled:opacity-40"
            >
              {addMedia.isPending ? "Adding..." : "Add to Library"}
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,55%)] hover:text-white border border-[hsl(220,15%,25%)] hover:border-[hsl(220,12%,40%)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-square bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] hover:border-[hsl(220,15%,25%)] transition-colors">
              <div className="aspect-square overflow-hidden bg-[hsl(220,18%,9%)] relative">
                <img
                  src={item.url}
                  alt={item.alt || item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(item.url, item.id)}
                    className="w-8 h-8 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[hsl(38,72%,52%)] transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[hsl(38,72%,52%)] transition-colors"
                    title="Open"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-[10px] text-[hsl(220,12%,55%)] truncate mb-2">{item.name || "Unnamed"}</p>
                <div className="flex items-center justify-end">
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
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {media.length === 0 && (
            <div className="col-span-full py-12 text-center text-[hsl(220,12%,40%)] text-xs tracking-widest uppercase">
              <Image size={24} className="mx-auto mb-3 text-[hsl(220,12%,25%)]" />
              No images in library yet
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
