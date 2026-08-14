import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Image, Link as LinkIcon, Upload, X, Check } from "lucide-react";

const PREDEFINED_GALLERY = [
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=75",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=75",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=75",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=75",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=75",
  "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=900&q=75",
  "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=900&q=75",
  "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=900&q=75",
  "https://images.unsplash.com/photo-1590725140246-20acdee442be?w=900&q=75",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=75",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=75",
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=75",
];

interface GalleryPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  acceptUpload?: boolean;
  onFileUpload?: (file: File) => Promise<string>;
  uploading?: boolean;
}

export function GalleryPicker({
  value,
  onChange,
  label = "Image",
  acceptUpload = true,
  onFileUpload,
  uploading = false,
}: GalleryPickerProps) {
  const [mode, setMode] = useState<"url" | "gallery">(value ? "url" : "gallery");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [urlInput, setUrlInput] = useState(value);

  useEffect(() => { setUrlInput(value); }, [value]);

  const { data } = useQuery<{ images: string[] }>({
    queryKey: ["gallery"],
    queryFn: async () => {
      const resp = await fetch("/api/gallery");
      if (!resp.ok) throw new Error("Failed to load gallery");
      return resp.json();
    },
    enabled: galleryOpen,
  });

  const images = [...PREDEFINED_GALLERY, ...(data?.images ?? []).filter(u => !PREDEFINED_GALLERY.includes(u))];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onFileUpload) return;
    try {
      const url = await onFileUpload(file);
      onChange(url);
    } catch { /* handled by parent */ }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)]">
        {label}
      </label>

      {/* Mode tabs */}
      <div className="flex gap-1 text-[10px] tracking-[0.15em] uppercase">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-3 py-1.5 border transition-colors ${
            mode === "url"
              ? "border-[hsl(38,72%,52%)] text-[hsl(38,72%,52%)] bg-[hsl(38,72%,52%)/8%]"
              : "border-[hsl(220,15%,20%)] text-[hsl(220,12%,45%)] hover:border-[hsl(220,15%,30%)]"
          }`}
        >
          <LinkIcon size={10} className="inline mr-1" />
          Direct URL
        </button>
        <button
          type="button"
          onClick={() => { setMode("gallery"); setGalleryOpen(true); }}
          className={`px-3 py-1.5 border transition-colors ${
            mode === "gallery"
              ? "border-[hsl(38,72%,52%)] text-[hsl(38,72%,52%)] bg-[hsl(38,72%,52%)/8%]"
              : "border-[hsl(220,15%,20%)] text-[hsl(220,12%,45%)] hover:border-[hsl(220,15%,30%)]"
          }`}
        >
          <Image size={10} className="inline mr-1" />
          Gallery
        </button>
      </div>

      {/* URL input */}
      {mode === "url" && (
        <input
          name="imageUrl"
          value={urlInput}
          onChange={(e) => { setUrlInput(e.target.value); onChange(e.target.value); }}
          placeholder="https://i.ibb.co/... (img.bb direct link)"
          className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-2.5 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)]"
        />
      )}

      {/* Gallery picker */}
      {mode === "gallery" && !galleryOpen && value && (
        <div className="flex items-center gap-3">
          <div className="w-20 h-14 overflow-hidden border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,11%)]">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
          <button type="button" onClick={() => setGalleryOpen(true)} className="text-[10px] tracking-[0.15em] uppercase text-[hsl(38,72%,52%)] hover:text-[hsl(38,72%,62%)] transition-colors">
            Change
          </button>
        </div>
      )}

      {/* Gallery modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setGalleryOpen(false)}>
          <div className="bg-[hsl(220,18%,10%)] border border-[hsl(220,15%,20%)] w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(220,15%,18%)]">
              <h3 className="text-sm font-serif uppercase tracking-widest text-[hsl(38,72%,52%)]">Choose from Gallery</h3>
              <button type="button" onClick={() => setGalleryOpen(false)} className="text-[hsl(220,12%,45%)] hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => { onChange(url); setUrlInput(url); setGalleryOpen(false); setMode("url"); }}
                    className={`relative aspect-square overflow-hidden border-2 transition-colors group ${
                      value === url
                        ? "border-[hsl(38,72%,52%)] ring-1 ring-[hsl(38,72%,52%)]"
                        : "border-transparent hover:border-[hsl(220,15%,30%)]"
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    {value === url && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-[hsl(38,72%,52%)] flex items-center justify-center">
                        <Check size={12} className="text-[hsl(220,18%,9%)]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload button */}
      {acceptUpload && onFileUpload && (
        <label className="flex items-center justify-center gap-2 bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] border-dashed px-4 py-2.5 text-sm cursor-pointer hover:border-[hsl(38,72%,52%)] transition-colors text-[hsl(220,12%,45%)]">
          <Upload size={14} />
          <span>{uploading ? "Uploading..." : "Upload file"}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
        </label>
      )}

      {/* Preview */}
      {value && (
        <div className="relative w-full max-w-sm aspect-video overflow-hidden border border-[hsl(220,15%,18%)] bg-[hsl(220,18%,11%)]">
          <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <button type="button" onClick={() => { onChange(""); setUrlInput(""); }} className="absolute top-2 right-2 w-6 h-6 bg-black/60 flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
