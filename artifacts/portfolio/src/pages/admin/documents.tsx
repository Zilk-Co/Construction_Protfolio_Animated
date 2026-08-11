import { AdminLayout } from "@/components/layout/AdminLayout";
import { useDocuments, useCreateDocument, useUpdateDocument, useDeleteDocument, uploadDocumentFile, type CompanyDocument } from "@/hooks/useDocuments";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, Download, X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type FormState = { title: string; description: string; file: File | null; fileName: string };

const EMPTY_FORM: FormState = { title: "", description: "", file: null, fileName: "" };

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "";
  }
}

function DocForm({
  initial,
  submitLabel,
  onCancel,
  onSubmit,
}: {
  initial: FormState;
  submitLabel: string;
  onCancel?: () => void;
  onSubmit: (data: { title: string; description: string; file: File | null }) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | null) => {
    if (!f) return;
    setForm((prev) => ({ ...prev, file: f, fileName: f.name }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Please enter a title.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSubmit({ title: form.title.trim(), description: form.description.trim(), file: form.file });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save document.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,11%)] p-6 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-2">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. Company Brochure 2026"
            className="w-full border px-4 py-3 text-sm focus:outline-none transition-colors text-white"
            style={{ backgroundColor: "hsl(220,18%,12%)", borderColor: "hsl(220,15%,24%)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(38,72%,52%)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(220,15%,24%)")}
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-2">File</label>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center gap-3 border px-4 py-3 text-sm text-left transition-colors hover:border-[hsl(38,72%,52%)]"
            style={{ backgroundColor: "hsl(220,18%,12%)", borderColor: "hsl(220,15%,24%)" }}
          >
            <Upload size={14} style={{ color: "hsl(38,72%,58%)" }} />
            <span className="truncate text-gray-300">
              {form.file ? form.fileName : "Choose a document (PDF, DOCX — max 10 MB)"}
            </span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-2">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          rows={2}
          placeholder="A short description shown next to the download link."
          className="w-full border px-4 py-3 text-sm focus:outline-none transition-colors resize-y text-white"
          style={{ backgroundColor: "hsl(220,18%,12%)", borderColor: "hsl(220,15%,24%)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(38,72%,52%)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(220,15%,24%)")}
        />
      </div>

      {error && (
        <div className="flex items-center gap-3 border border-red-500/60 bg-red-500/5 px-4 py-3">
          <AlertCircle size={13} className="text-red-400" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold transition-colors disabled:opacity-50"
          style={{ backgroundColor: "hsl(38,72%,52%)", color: "hsl(220,18%,9%)" }}
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
          {busy ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs tracking-[0.2em] uppercase text-gray-500 hover:text-white border border-[hsl(220,15%,22%)] transition-colors disabled:opacity-50"
          >
            <X size={12} />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function AdminDocuments() {
  const { data: documents = [], isLoading } = useDocuments();
  const createDoc = useCreateDocument();
  const updateDoc = useUpdateDocument();
  const deleteDoc = useDeleteDocument();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleCreate = async (data: { title: string; description: string; file: File | null }) => {
    const uploaded = data.file ? await uploadDocumentFile(data.file) : null;
    await createDoc.mutateAsync({
      title: data.title,
      description: data.description,
      fileUrl: uploaded?.fileUrl ?? "",
      fileName: uploaded?.fileName ?? "document",
      fileType: uploaded?.fileType ?? "application/octet-stream",
      fileSize: uploaded?.fileSize ?? 0,
    });
    setShowAdd(false);
  };

  const handleUpdate = async (doc: CompanyDocument, data: { title: string; description: string; file: File | null }) => {
    let fileUrl = doc.fileUrl;
    let fileName = doc.fileName;
    let fileType = doc.fileType;
    let fileSize = doc.fileSize;
    if (data.file) {
      const uploaded = await uploadDocumentFile(data.file);
      fileUrl = uploaded.fileUrl;
      fileName = uploaded.fileName;
      fileType = uploaded.fileType;
      fileSize = uploaded.fileSize;
    }
    await updateDoc.mutateAsync({
      id: doc.id,
      payload: { title: data.title, description: data.description, fileUrl, fileName, fileType, fileSize, sortOrder: doc.sortOrder },
    });
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    deleteDoc.mutate(id, { onSuccess: () => setConfirmDelete(null) });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-10 pb-6 border-b border-[hsl(220,15%,18%)]">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-1">About Page</p>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">Documents</h1>
          <p className="text-xs text-gray-500 mt-2 max-w-xl">
            Documents appear as downloadable files in the About page "Documents &amp; Policies" section. PDF / Word files up to 10 MB.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowAdd((v) => !v); setEditingId(null); }}
          className="inline-flex items-center gap-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors"
        >
          {showAdd ? <X size={13} /> : <Plus size={13} />}
          {showAdd ? "Close" : "Add Document"}
        </button>
      </div>

      {showAdd && (
        <div className="mb-8">
          <DocForm
            initial={EMPTY_FORM}
            submitLabel="Upload & Publish"
            onCancel={() => setShowAdd(false)}
            onSubmit={handleCreate}
          />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />)}
        </div>
      ) : (
        <div className="border border-[hsl(220,15%,18%)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[hsl(220,18%,11%)] border-b border-[hsl(220,15%,18%)]">
                {["Document", "Description", "File", "Added", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[9px] tracking-[0.25em] uppercase text-[hsl(220,12%,40%)] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, i) => (
                <motion.tr
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-[hsl(220,15%,16%)] hover:bg-[hsl(220,18%,11%)] transition-colors"
                >
                  {editingId === doc.id ? (
                    <td colSpan={5} className="px-4 py-5">
                      <DocForm
                        initial={{ title: doc.title, description: doc.description, file: null, fileName: doc.fileName }}
                        submitLabel="Save Changes"
                        onCancel={() => setEditingId(null)}
                        onSubmit={(data) => handleUpdate(doc, data)}
                      />
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full" style={{ backgroundColor: "hsla(38,72%,52%,0.14)", color: "hsl(38,72%,58%)" }}>
                            <FileText size={15} />
                          </span>
                          <p className="font-serif font-bold text-sm text-white">{doc.title}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-[hsl(220,12%,55%)] max-w-[280px]">{doc.description || "—"}</td>
                      <td className="px-4 py-4">
                        <p className="text-xs text-[hsl(220,12%,55%)]">{doc.fileName}</p>
                        <p className="text-[10px] text-[hsl(220,12%,40%)] mt-0.5">{doc.fileType} · {formatSize(doc.fileSize)}</p>
                      </td>
                      <td className="px-4 py-4 text-xs text-[hsl(220,12%,55%)]">{formatDate(doc.createdAt)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3 justify-end">
                          <a
                            href={doc.fileUrl}
                            download={doc.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[hsl(220,12%,45%)] hover:text-[hsl(38,72%,52%)] transition-colors"
                            title="Download"
                          >
                            <Download size={13} />
                          </a>
                          <button onClick={() => setEditingId(doc.id)} className="text-[hsl(220,12%,45%)] hover:text-[hsl(38,72%,52%)] transition-colors" title="Edit">
                            <Pencil size={13} />
                          </button>
                          {confirmDelete === doc.id ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleDelete(doc.id)} className="text-[9px] text-red-400 uppercase tracking-widest">Confirm</button>
                              <button onClick={() => setConfirmDelete(null)} className="text-[9px] text-[hsl(220,12%,40%)] uppercase tracking-widest">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(doc.id)} className="text-[hsl(220,12%,35%)] hover:text-red-400 transition-colors" title="Delete">
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[hsl(220,12%,40%)] text-xs tracking-widest uppercase">
                    No documents added yet
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
