import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetPageContent, useUpdatePageContent } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Save, RotateCcw, Type, AlignLeft, FileText, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

function PageIcon({ type }: { type: "text" | "textarea" | "richtext" }) {
  if (type === "textarea") return <AlignLeft size={11} />;
  if (type === "richtext") return <FileText size={11} />;
  return <Type size={11} />;
}

export default function AdminPageContent() {
  const { data, isLoading } = useGetPageContent();
  const updateMutation = useUpdatePageContent();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});
  const [activePage, setActivePage] = useState<string | null>(null);

  // Initialise the draft from the server response, keyed by `page::key`.
  useEffect(() => {
    if (!data) return;
    const next: Record<string, string> = {};
    for (const page of data.pages) {
      for (const item of page.items) {
        next[`${page.page}::${item.key}`] = item.value;
      }
    }
    setDraft(next);
    if (!activePage && data.pages[0]) {
      setActivePage(data.pages[0].page);
      setExpandedPages({ [data.pages[0].page]: true });
    }
  }, [data, activePage]);

  // Group items within a page by their category for the accordion layout.
  const groupedByPage = useMemo(() => {
    if (!data) return [];
    return data.pages.map((page) => {
      const groups = new Map<string, typeof page.items>();
      for (const item of page.items) {
        if (!groups.has(item.category)) groups.set(item.category, []);
        groups.get(item.category)!.push(item);
      }
      return {
        page: page.page,
        label: page.label,
        categoryGroups: Array.from(groups.entries()).map(([category, items]) => ({
          category,
          items: items.slice().sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label)),
        })),
      };
    });
  }, [data]);

  const dirtyKeys = useMemo(() => {
    if (!data) return new Set<string>();
    const out = new Set<string>();
    for (const page of data.pages) {
      for (const item of page.items) {
        const k = `${page.page}::${item.key}`;
        if (draft[k] !== item.value) out.add(k);
      }
    }
    return out;
  }, [draft, data]);

  const handleChange = (page: string, key: string, value: string) => {
    setDraft((prev) => ({ ...prev, [`${page}::${key}`]: value }));
  };

  const handleReset = () => {
    if (!data) return;
    const next: Record<string, string> = {};
    for (const page of data.pages) {
      for (const item of page.items) {
        next[`${page.page}::${item.key}`] = item.value;
      }
    }
    setDraft(next);
    setSaved(false);
    setError(null);
  };

  const handleSave = () => {
    if (!data) return;
    setError(null);
    if (dirtyKeys.size === 0) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }
    const updates = Array.from(dirtyKeys).map((k) => {
      const [page, key] = k.split("::");
      return { page, key, value: draft[k] ?? "" };
    });
    updateMutation.mutate(
      { data: { updates } },
      {
        onSuccess: (res) => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
          void res;
        },
        onError: (err: unknown) => {
          const e = err as { data?: { error?: string }; message?: string };
          setError(e?.data?.error ?? e?.message ?? "Failed to save");
        },
      },
    );
  };

  const togglePage = (page: string) => {
    setExpandedPages((prev) => ({ ...prev, [page]: !prev[page] }));
    setActivePage(page);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-8 pb-6 border-b border-[hsl(220,15%,18%)]">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: "hsl(38,72%,52%)" }}>Content Management</p>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-tight text-white">Page Text</h1>
          <p className="text-xs text-gray-500 mt-2 max-w-2xl">
            Edit every piece of text that appears on the public site. Changes take effect immediately after saving.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dirtyKeys.size > 0 && (
            <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500">
              {dirtyKeys.size} unsaved
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            disabled={dirtyKeys.size === 0 || updateMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs tracking-[0.2em] uppercase text-gray-500 hover:text-white border border-[hsl(220,15%,22%)] hover:border-[hsl(220,15%,35%)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold transition-colors disabled:opacity-50"
            style={{ backgroundColor: "hsl(38,72%,52%)", color: "hsl(220,18%,9%)" }}
            onMouseEnter={(e) => { if (!updateMutation.isPending) e.currentTarget.style.backgroundColor = "hsl(38,72%,62%)"; }}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "hsl(38,72%,52%)")}
          >
            <Save size={13} />
            {updateMutation.isPending ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 px-4 py-3 border flex items-center gap-3"
            style={{ backgroundColor: "hsla(38,72%,52%,0.08)", borderColor: "hsl(38,72%,52%)" }}
          >
            <CheckCircle2 size={14} style={{ color: "hsl(38,72%,58%)" }} />
            <p className="text-xs tracking-widest uppercase" style={{ color: "hsl(38,72%,58%)" }}>
              Page content saved. Visitors will see the updated text on their next request.
            </p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 px-4 py-3 border border-red-500/60 bg-red-500/5 flex items-center gap-3"
          >
            <AlertCircle size={14} className="text-red-400" />
            <p className="text-xs tracking-widest uppercase text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {groupedByPage.map((pageGroup) => {
            const isOpen = !!expandedPages[pageGroup.page];
            const pageDirty = Array.from(dirtyKeys).some((k) => k.startsWith(`${pageGroup.page}::`));
            return (
              <div key={pageGroup.page} className="border border-[hsl(220,15%,18%)]" style={{ backgroundColor: "hsl(220,18%,9%)" }}>
                <button
                  type="button"
                  onClick={() => togglePage(pageGroup.page)}
                  className="w-full flex items-center justify-between px-6 py-5 hover:bg-[hsl(220,18%,11%)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-serif font-bold uppercase tracking-tight text-white">
                      {pageGroup.label}
                    </h2>
                    <span className="text-[10px] tracking-[0.25em] uppercase text-gray-500">
                      {pageGroup.categoryGroups.reduce((acc, g) => acc + g.items.length, 0)} fields ·{" "}
                      {pageGroup.categoryGroups.length} categories
                    </span>
                    {pageDirty && (
                      <span
                        className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5"
                        style={{ backgroundColor: "hsl(38,72%,52%,0.15)", color: "hsl(38,72%,68%)" }}
                      >
                        Modified
                      </span>
                    )}
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={18} className="text-gray-500" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="border-t border-[hsl(220,15%,18%)] p-6 space-y-8">
                        {pageGroup.categoryGroups.map((group) => (
                          <div key={group.category}>
                            <div className="flex items-center gap-3 mb-4">
                              <p
                                className="text-[10px] tracking-[0.3em] uppercase font-semibold"
                                style={{ color: "hsl(38,72%,58%)" }}
                              >
                                {group.category}
                              </p>
                              <div className="flex-1 h-px bg-[hsl(220,15%,18%)]" />
                              <span className="text-[10px] tracking-widest uppercase text-gray-600">
                                {group.items.length} field{group.items.length !== 1 ? "s" : ""}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                              {group.items.map((item) => {
                                const k = `${pageGroup.page}::${item.key}`;
                                const value = draft[k] ?? "";
                                const isDirty = dirtyKeys.has(k);
                                return (
                                  <div key={item.key} className="relative">
                                    <div className="flex items-center justify-between mb-2">
                                      <label className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-gray-400">
                                        <PageIcon type={item.type} />
                                        {item.label}
                                        <code className="text-[9px] text-gray-600 ml-1 font-mono">
                                          {item.key}
                                        </code>
                                      </label>
                                      {isDirty && (
                                        <span
                                          className="text-[9px] tracking-[0.2em] uppercase"
                                          style={{ color: "hsl(38,72%,68%)" }}
                                        >
                                          ● Modified
                                        </span>
                                      )}
                                    </div>
                                    {item.type === "textarea" ? (
                                      <textarea
                                        value={value}
                                        onChange={(e) => handleChange(pageGroup.page, item.key, e.target.value)}
                                        rows={3}
                                        className="w-full border px-4 py-3 text-sm focus:outline-none transition-colors resize-y text-white"
                                        style={{
                                          backgroundColor: "hsl(220,18%,12%)",
                                          borderColor: isDirty ? "hsl(38,72%,52%)" : "hsl(220,15%,24%)",
                                        }}
                                        onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(38,72%,52%)")}
                                        onBlur={(e) =>
                                          (e.currentTarget.style.borderColor = isDirty
                                            ? "hsl(38,72%,52%)"
                                            : "hsl(220,15%,24%)")
                                        }
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleChange(pageGroup.page, item.key, e.target.value)}
                                        className="w-full border px-4 py-3 text-sm focus:outline-none transition-colors text-white"
                                        style={{
                                          backgroundColor: "hsl(220,18%,12%)",
                                          borderColor: isDirty ? "hsl(38,72%,52%)" : "hsl(220,15%,24%)",
                                        }}
                                        onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(38,72%,52%)")}
                                        onBlur={(e) =>
                                          (e.currentTarget.style.borderColor = isDirty
                                            ? "hsl(38,72%,52%)"
                                            : "hsl(220,15%,24%)")
                                        }
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
