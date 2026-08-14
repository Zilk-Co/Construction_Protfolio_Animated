import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Shield, Pencil, Eye } from "lucide-react";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";

export function AdminFloatingButton() {
  const [, setLocation] = useLocation();
  const { data: me, isLoading, refetch } = useGetAdminMe();
  const logout = useAdminLogout();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiresAtRef = useRef<number | null>(null);

  // Edit mode state (persisted in sessionStorage, NOT used for auth)
  const [editMode, setEditMode] = useState(() => {
    return sessionStorage.getItem("adminEditMode") === "true";
  });

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => {
      const next = !prev;
      sessionStorage.setItem("adminEditMode", String(next));
      return next;
    });
  }, []);

  // Expose editMode globally for other components to read
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__adminEditMode = editMode;
    window.dispatchEvent(new CustomEvent("adminEditModeChange", { detail: { editMode } }));
  }, [editMode]);

  // Session timer - based on server-side expiresInMs from /admin/me
  useEffect(() => {
    if (!me?.authenticated) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeLeft(null);
      expiresAtRef.current = null;
      setEditMode(false);
      sessionStorage.removeItem("adminEditMode");
      return;
    }

    // Calculate absolute expiry time from server-provided expiresInMs
    if (me.expiresInMs !== undefined && me.expiresInMs !== null) {
      expiresAtRef.current = Date.now() + me.expiresInMs;
    }

    const tick = () => {
      if (!expiresAtRef.current) return;
      const remaining = expiresAtRef.current - Date.now();
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setTimeLeft(0);
        sessionStorage.removeItem("adminEditMode");
        logout.mutate(undefined, {
          onSettled: () => setLocation("/admin-panel"),
        });
        return;
      }
      setTimeLeft(remaining);
    };

    tick();
    timerRef.current = setInterval(tick, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [me?.authenticated, me?.expiresInMs, logout, setLocation]);

  // Refresh session status every 5 minutes to keep server-side validation in sync
  useEffect(() => {
    if (!me?.authenticated) return;
    const interval = setInterval(() => {
      refetch();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [me?.authenticated, refetch]);

  // Clean up edit mode on browser close
  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem("adminEditMode");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  if (isLoading || !me?.authenticated) return null;

  const minutes = timeLeft !== null ? Math.floor(timeLeft / 60000) : 60;
  const seconds = timeLeft !== null ? Math.floor((timeLeft % 60000) / 1000) : 0;
  const timerLabel = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isLowTime = timeLeft !== null && timeLeft < 10 * 60 * 1000;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Session timer badge */}
      <div
        className={`flex items-center gap-1.5 text-[9px] tracking-wider font-mono px-2.5 py-1 border backdrop-blur-md ${
          isLowTime
            ? "border-red-500/50 text-red-400 bg-red-950/80"
            : "border-[hsl(220,15%,20%)] text-[hsl(220,12%,55%)] bg-[hsl(220,18%,7%)]/90"
        }`}
        data-testid="session-timer"
      >
        <span className="uppercase tracking-[0.15em]">Session</span>
        <span className="font-bold" data-testid="text-session-timer">{timerLabel}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Edit/Preview Mode Toggle */}
        <button
          onClick={toggleEditMode}
          data-testid="button-edit-mode"
          aria-label={editMode ? "Switch to Preview Mode" : "Switch to Edit Mode"}
          className={`flex items-center gap-1.5 border backdrop-blur-md transition-all duration-200 shadow-lg shadow-black/40 cursor-pointer text-[10px] tracking-[0.15em] uppercase font-semibold ${
            editMode
              ? "border-[hsl(38,72%,52%)] bg-[hsl(38,72%,52%)] text-[hsl(220,18%,7%)]"
              : "border-[hsl(220,15%,20%)] bg-[hsl(220,18%,7%)]/90 text-[hsl(220,12%,55%)] hover:text-[hsl(38,72%,52%)] hover:border-[hsl(38,72%,52%)]"
          }`}
          style={{ borderRadius: "9999px", padding: "10px 14px" }}
        >
          {editMode ? <Pencil size={14} /> : <Eye size={14} />}
          <span className="hidden sm:inline">{editMode ? "Edit" : "Preview"}</span>
        </button>

        {/* Admin Shield Button */}
        <button
          onClick={() => setLocation("/admin")}
          data-testid="button-admin-floating"
          aria-label="Go to admin page"
          className="flex items-center gap-2 border border-[hsl(38,72%,52%)] bg-[hsl(220,18%,7%)]/90 backdrop-blur-md text-[hsl(38,72%,52%)] hover:bg-[hsl(38,72%,52%)] hover:text-[hsl(220,18%,7%)] transition-all duration-200 shadow-lg shadow-black/40 cursor-pointer"
          style={{ borderRadius: "9999px", padding: "10px 14px" }}
        >
          <Shield size={16} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold hidden group-hover:inline">
            Admin
          </span>
        </button>
      </div>
    </div>
  );
}
