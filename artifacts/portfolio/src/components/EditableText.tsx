import { useState, useRef, useEffect } from "react";
import { useEditMode } from "./EditModeProvider";
import { Pencil } from "lucide-react";

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  tag?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  placeholder?: string;
}

export function EditableText({
  value,
  onSave,
  tag: Tag = "p",
  className = "",
  placeholder = "Click to edit...",
}: EditableTextProps) {
  const { editMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!editMode) {
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  const handleSave = async () => {
    if (draft.trim() === value) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onSave(draft.trim());
      setIsEditing(false);
    } catch {
      // Keep editing state on error
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setDraft(value);
      setIsEditing(false);
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={saving}
          rows={Tag === "p" || Tag === "span" || Tag === "div" ? 3 : 1}
          className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(38,72%,52%)] px-3 py-2 text-sm text-white focus:outline-none resize-none"
          placeholder={placeholder}
        />
        {saving && (
          <span className="absolute top-1 right-2 text-[9px] text-[hsl(38,72%,52%)] animate-pulse">
            Saving...
          </span>
        )}
      </div>
    );
  }

  return (
    <Tag
      className={`${className} relative cursor-pointer group/edit border border-dashed border-[hsl(38,72%,52%)]/30 hover:border-[hsl(38,72%,52%)]/60 bg-[hsl(38,72%,52%)]/5 hover:bg-[hsl(38,72%,52%)]/10 transition-all duration-200`}
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {value || <span className="text-neutral-500 italic">{placeholder}</span>}
      <span className="absolute -top-2 -right-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] p-0.5 opacity-0 group-hover/edit:opacity-100 transition-opacity pointer-events-none">
        <Pencil size={10} />
      </span>
    </Tag>
  );
}
