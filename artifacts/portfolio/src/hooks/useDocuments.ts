import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type CompanyDocument = {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type UploadedFile = {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
};

const DOCUMENTS_KEY = ["documents"] as const;

export function getDocumentsQueryKey() {
  return [...DOCUMENTS_KEY];
}

export async function fetchDocuments(): Promise<CompanyDocument[]> {
  const res = await fetch("/api/documents", { credentials: "include" });
  if (!res.ok) {
    let message = "Failed to load documents.";
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* keep default */
    }
    throw new Error(message);
  }
  return res.json();
}

export async function uploadDocumentFile(file: File): Promise<UploadedFile> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload/document", {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (!res.ok) {
    let message = "Upload failed.";
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* keep default */
    }
    throw new Error(message);
  }
  return res.json();
}

async function saveDocument(
  method: "POST" | "PUT",
  id: number | null,
  payload: Partial<CompanyDocument> & { title: string; fileUrl: string },
): Promise<CompanyDocument> {
  const res = await fetch(id ? `/api/admin/documents/${id}` : "/api/admin/documents", {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = "Failed to save document.";
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* keep default */
    }
    throw new Error(message);
  }
  return res.json();
}

export function useDocuments() {
  return useQuery({ queryKey: getDocumentsQueryKey(), queryFn: fetchDocuments });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CompanyDocument> & { title: string; fileUrl: string }) =>
      saveDocument("POST", null, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: getDocumentsQueryKey() }),
  });
}

export function useUpdateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; payload: Partial<CompanyDocument> & { title: string; fileUrl: string } }) =>
      saveDocument("PUT", args.id, args.payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: getDocumentsQueryKey() }),
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        let message = "Failed to delete document.";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          /* keep default */
        }
        throw new Error(message);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: getDocumentsQueryKey() }),
  });
}
