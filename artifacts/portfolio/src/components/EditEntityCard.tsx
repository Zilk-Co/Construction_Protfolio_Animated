import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useEditMode } from "./EditModeProvider";
import { useGetAdminMe } from "@workspace/api-client-react";
import { Pencil, Trash2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

interface EditEntityCardProps {
  entityId: number;
  entityType: "project" | "client" | "service";
  entitySlug: string;
  entityName: string;
  children: ReactNode;
  onDeleted?: () => void;
  flexValue?: number;
  className?: string;
}

export function EditEntityCard({
  entityId,
  entityType,
  entitySlug: _entitySlug,
  entityName,
  children,
  onDeleted,
  flexValue,
  className,
}: EditEntityCardProps) {
  const { editMode } = useEditMode();
  const { data: me } = useGetAdminMe();
  const [, setLocation] = useLocation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!editMode || !me?.authenticated) {
    return <>{children}</>;
  }

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const endpoint =
        entityType === "project"
          ? `${API}/api/projects/${entityId}/delete`
          : entityType === "client"
          ? `${API}/api/admin/clients/${entityId}`
          : `${API}/api/services/${entityId}/delete`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Delete failed" }));
        throw new Error(body.error || `Delete failed (${res.status})`);
      }
      setConfirmDelete(false);
      onDeleted?.();
    } catch (err) {
      alert(`Failed to delete ${entityName}: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setDeleting(false);
    }
  };

  const editUrl =
    entityType === "project"
      ? `/admin/projects/${entityId}/edit`
      : entityType === "client"
      ? `/admin/clients`
      : `/admin/services/${entityId}/edit`;

  return (
    <motion.div
      className={`relative group/edit-card min-w-0 ${className || ""}`}
      animate={flexValue !== undefined ? { flex: flexValue } : undefined}
      transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}

      {/* Edit controls overlay */}
      <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5 opacity-0 group-hover/edit-card:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLocation(editUrl);
          }}
          className="p-1.5 bg-[hsl(220,18%,9%)]/80 backdrop-blur-sm border border-[hsl(220,15%,20%)] hover:border-[hsl(38,72%,52%)] text-[hsl(220,12%,55%)] hover:text-[hsl(38,72%,52%)] transition-all duration-200"
          title={`Edit ${entityName}`}
        >
          <Pencil size={12} />
        </button>

        {confirmDelete ? (
          <div className="flex items-center gap-1 bg-[hsl(220,18%,9%)]/90 backdrop-blur-sm border border-red-500/30 px-1.5 py-0.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete();
              }}
              disabled={deleting}
              className="text-[9px] text-red-400 uppercase tracking-widest hover:text-red-300 disabled:opacity-50"
            >
              {deleting ? "..." : "Yes"}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setConfirmDelete(false);
              }}
              className="text-[9px] text-[hsl(220,12%,40%)] uppercase tracking-widest hover:text-white"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setConfirmDelete(true);
            }}
            className="p-1.5 bg-[hsl(220,18%,9%)]/80 backdrop-blur-sm border border-[hsl(220,15%,20%)] hover:border-red-500/50 text-[hsl(220,12%,40%)] hover:text-red-400 transition-all duration-200"
            title={`Delete ${entityName}`}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
