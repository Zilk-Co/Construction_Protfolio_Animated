import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2, Mail, MailOpen, User, Phone, ArrowLeft } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

type Message = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

function useListMessages() {
  return useQuery<Message[]>({ queryKey: ["admin-messages"], queryFn: async () => {
    const res = await fetch(`${API}/api/admin/messages`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load messages");
    return res.json();
  }});
}

function useMessageStats() {
  return useQuery<{ total: number; unread: number }>({ queryKey: ["admin-messages-stats"], queryFn: async () => {
    const res = await fetch(`${API}/api/admin/messages/stats`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load stats");
    return res.json();
  }});
}

function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${API}/api/admin/messages/${id}/read`, { method: "PUT", credentials: "include" });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-messages"] }); qc.invalidateQueries({ queryKey: ["admin-messages-stats"] }); },
  });
}

function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${API}/api/admin/messages/${id}`, { method: "DELETE", credentials: "include" });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-messages"] }); qc.invalidateQueries({ queryKey: ["admin-messages-stats"] }); },
  });
}

export default function AdminMessages() {
  const { data: messages = [], isLoading, error } = useListMessages();
  const { data: stats } = useMessageStats();
  const markRead = useMarkRead();
  const deleteMessage = useDeleteMessage();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  if (error) {
    return (
      <AdminLayout>
        <div className="mb-8 pb-6 border-b border-[hsl(220,15%,18%)]">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-1">Communication</p>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">Inbox</h1>
        </div>
        <div className="text-center py-16">
          <p className="text-xs text-red-400 tracking-widest uppercase">Failed to load messages. Please try again.</p>
        </div>
      </AdminLayout>
    );
  }

  const handleMarkRead = (id: number) => {
    markRead.mutate(id);
  };

  const handleDelete = (id: number) => {
    deleteMessage.mutate(id, { onSuccess: () => { setConfirmDelete(null); if (selectedMessage?.id === id) setSelectedMessage(null); } });
  };

  const openMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.read) handleMarkRead(msg.id);
  };

  if (selectedMessage) {
    return (
      <AdminLayout>
        <button onClick={() => setSelectedMessage(null)} className="inline-flex items-center gap-2 text-xs text-[hsl(220,12%,55%)] hover:text-[hsl(38,72%,52%)] transition-colors mb-6">
          <ArrowLeft size={12} /> Back to Inbox
        </button>
        <div className="bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] p-6">
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-[hsl(220,15%,16%)]">
            <div>
              <h2 className="text-xl font-serif font-bold">{selectedMessage.subject || "No Subject"}</h2>
              <p className="text-xs text-[hsl(220,12%,40%)] mt-1">From: {selectedMessage.name} &lt;{selectedMessage.email}&gt;</p>
              {selectedMessage.phone && <p className="text-xs text-[hsl(220,12%,40%)] mt-0.5 flex items-center gap-1"><Phone size={10} /> {selectedMessage.phone}</p>}
              <p className="text-[10px] text-[hsl(220,12%,35%)] mt-1">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => handleDelete(selectedMessage.id)} className="text-[hsl(220,12%,35%)] hover:text-red-400 transition-colors" title="Delete"><Trash2 size={14} /></button>
          </div>
          <div className="text-sm text-[hsl(220,12%,70%)] whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</div>
          <div className="mt-6 pt-4 border-t border-[hsl(220,15%,16%)]">
            <a href={`mailto:${selectedMessage.email}`} className="inline-flex items-center gap-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors">
              Reply via Email
            </a>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 pb-6 border-b border-[hsl(220,15%,18%)]">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-1">Communication</p>
        <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">Inbox</h1>
        <p className="text-xs text-[hsl(220,12%,50%)] mt-2">Messages submitted through the contact form.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] px-5 py-4">
          <p className="text-2xl font-serif font-bold">{stats?.total ?? 0}</p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mt-0.5">Total Messages</p>
        </div>
        <div className="bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] px-5 py-4">
          <p className="text-2xl font-serif font-bold text-[hsl(38,72%,52%)]">{stats?.unread ?? 0}</p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,45%)] mt-0.5">Unread</p>
        </div>
      </div>

      {/* Messages list */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />)}</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 text-[hsl(220,12%,40%)] text-xs tracking-widest uppercase">No messages yet</div>
      ) : (
        <div className="space-y-2">
          {messages.map(msg => (
            <div key={msg.id} onClick={() => openMessage(msg)} className={`flex items-center gap-4 px-5 py-4 border cursor-pointer transition-all hover:bg-[hsl(220,18%,11%)] ${msg.read ? "border-[hsl(220,15%,16%)] bg-[hsl(220,18%,7%)]" : "border-[hsl(38,72%,52%,30%)] bg-[hsl(220,18%,11%)]"}`}>
              <div className="shrink-0">
                {msg.read ? <MailOpen size={14} className="text-[hsl(220,12%,35%)]" /> : <Mail size={14} className="text-[hsl(38,72%,52%)]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-serif font-bold truncate ${msg.read ? "text-[hsl(220,12%,55%)]" : "text-white"}`}>{msg.name}</p>
                  {!msg.read && <span className="w-1.5 h-1.5 bg-[hsl(38,72%,52%)] rounded-full shrink-0" />}
                </div>
                <p className="text-xs text-[hsl(220,12%,45%)] truncate mt-0.5">{msg.subject || msg.message.slice(0, 80)}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] text-[hsl(220,12%,35%)]">{new Date(msg.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); setConfirmDelete(msg.id); }} className="shrink-0 text-[hsl(220,12%,30%)] hover:text-red-400 transition-colors" title="Delete">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setConfirmDelete(null)}>
          <div className="bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <p className="text-sm font-serif font-bold mb-2">Delete Message?</p>
            <p className="text-xs text-[hsl(220,12%,50%)] mb-4">This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => handleDelete(confirmDelete)} className="bg-red-900/50 border border-red-800 text-red-400 px-4 py-2 text-[10px] tracking-[0.2em] uppercase hover:bg-red-900/80 transition-colors">Delete</button>
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,55%)] hover:text-white border border-[hsl(220,15%,25%)] transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
