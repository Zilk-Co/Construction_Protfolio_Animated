import { useState } from "react";
import { Pencil } from "lucide-react";
import { useEditMode } from "./EditModeProvider";
import { GalleryPicker } from "./admin/GalleryPicker";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface HeroImageEditorProps {
  value: string;
  onSave: (url: string) => Promise<void>;
  className?: string;
}

export function HeroImageEditor({ value, onSave, className = "" }: HeroImageEditorProps) {
  const { editMode } = useEditMode();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  if (!editMode) return null;

  const handleSave = async () => {
    if (draft === value) { setOpen(false); return; }
    setSaving(true);
    try {
      await onSave(draft);
      setOpen(false);
    } catch { /* keep open */ } finally { setSaving(false); }
  };

  return (
    <div className={`absolute z-20 top-4 right-4 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center bg-black/60 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:border-[hsl(38,72%,52%)] transition-colors"
            title="Change hero background"
          >
            <Pencil size={14} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-[380px] max-h-[70vh] overflow-y-auto bg-[hsl(220,18%,10%)] border-[hsl(220,15%,20%)] p-0"
        >
          <div className="px-4 py-3 border-b border-[hsl(220,15%,18%)]">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[hsl(38,72%,52%)]">Hero Background</p>
          </div>
          <div className="p-4">
            <GalleryPicker
              value={draft}
              onChange={setDraft}
              label=""
              acceptUpload={false}
            />
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || draft === value}
                className="flex-1 px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase font-bold transition-colors disabled:opacity-40"
                style={{ backgroundColor: "hsl(38,72%,52%)", color: "hsl(220,18%,9%)" }}
              >
                {saving ? "Saving..." : "Apply"}
              </button>
              <button
                type="button"
                onClick={() => { setDraft(value); setOpen(false); }}
                className="px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase text-gray-500 hover:text-white border border-[hsl(220,15%,22%)] hover:border-[hsl(220,15%,35%)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
