import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface EditModeContextType {
  editMode: boolean;
  toggleEditMode: () => void;
}

const EditModeContext = createContext<EditModeContextType>({
  editMode: false,
  toggleEditMode: () => {},
});

export function useEditMode() {
  return useContext(EditModeContext);
}

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(() => {
    return sessionStorage.getItem("adminEditMode") === "true";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setEditMode(sessionStorage.getItem("adminEditMode") === "true");
    };
    const handleEditModeChange = ((e: CustomEvent<{ editMode: boolean }>) => {
      setEditMode(e.detail.editMode);
    }) as EventListener;

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("adminEditModeChange", handleEditModeChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("adminEditModeChange", handleEditModeChange);
    };
  }, []);

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => {
      const next = !prev;
      sessionStorage.setItem("adminEditMode", String(next));
      (window as unknown as Record<string, unknown>).__adminEditMode = next;
      window.dispatchEvent(new CustomEvent("adminEditModeChange", { detail: { editMode: next } }));
      return next;
    });
  }, []);

  return (
    <EditModeContext.Provider value={{ editMode, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}
