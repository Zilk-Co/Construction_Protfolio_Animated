import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Plus, Pencil, Trash2, Globe, EyeOff, Calendar } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  published: boolean;
  featured: boolean;
  author: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

function useListPosts() {
  return useQuery<BlogPost[]>({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/admin/blog`, { credentials: "include" });
      return res.json();
    },
  });
}

function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/api/admin/blog/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-blog"] }),
  });
}

function useTogglePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      const res = await fetch(`${API}/api/admin/blog/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });
      if (!res.ok) throw new Error("Update failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-blog"] }),
  });
}

export default function AdminBlog() {
  const { data: posts = [], isLoading } = useListPosts();
  const deletePost = useDeletePost();
  const togglePost = useTogglePost();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    deletePost.mutate(id, { onSuccess: () => setConfirmDelete(null) });
  };

  const handleToggle = (id: number, published: boolean) => {
    togglePost.mutate({ id, published });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-8 pb-6 border-b border-[hsl(220,15%,18%)]">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-1">Blog</p>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">All Posts</h1>
          <p className="text-xs text-[hsl(220,12%,50%)] mt-2">Manage blog posts and news articles.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors"
        >
          <Plus size={13} /> New Post
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] p-5 hover:border-[hsl(220,15%,25%)] transition-colors rounded-sm"
            >
              {post.coverImage && (
                <div className="w-full h-32 overflow-hidden border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,9%)] mb-4">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-serif font-bold text-sm leading-tight">{post.title}</h3>
              </div>

              {post.category && (
                <span className="inline-block text-[9px] tracking-[0.15em] uppercase bg-[hsl(38,72%,52%/0.15)] text-[hsl(38,72%,52%)] px-2 py-0.5 mb-2">
                  {post.category}
                </span>
              )}

              {post.excerpt && (
                <p className="text-xs text-[hsl(220,12%,55%)] mb-3 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-[hsl(220,12%,45%)] mb-4">
                <Calendar size={10} />
                <span>{formatDate(post.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[hsl(220,15%,16%)]">
                <button
                  onClick={() => handleToggle(post.id, !post.published)}
                  className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 tracking-[0.15em] uppercase border transition-all rounded-sm ${
                    post.published
                      ? "border-green-800 text-green-500 hover:bg-green-900/20"
                      : "border-[hsl(220,15%,25%)] text-[hsl(220,12%,45%)] hover:border-[hsl(38,72%,52%/50%)] hover:text-[hsl(38,72%,52%)]"
                  }`}
                >
                  {post.published ? (
                    <>
                      <Globe size={9} /> Live
                    </>
                  ) : (
                    <>
                      <EyeOff size={9} /> Draft
                    </>
                  )}
                </button>
                <div className="flex-1" />
                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className="text-[hsl(220,12%,45%)] hover:text-[hsl(38,72%,52%)] transition-colors p-1"
                  title="Edit"
                >
                  <Pencil size={13} />
                </Link>
                {confirmDelete === post.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-[9px] text-red-400 uppercase tracking-widest hover:text-red-300"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="text-[9px] text-[hsl(220,12%,40%)] uppercase tracking-widest hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(post.id)}
                    className="text-[hsl(220,12%,35%)] hover:text-red-400 transition-colors p-1"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-12 text-center text-[hsl(220,12%,40%)] text-xs tracking-widest uppercase">
              No blog posts yet
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
