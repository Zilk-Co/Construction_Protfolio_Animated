import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { Shield } from "lucide-react";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";

const SESSION_KEY = "adminSessionStart";
const ONE_HOUR_MS = 60 * 60 * 1000;

export function AdminFloatingButton() {
  const [, setLocation] = useLocation();
  const { data: me, isLoading } = useGetAdminMe();
  const logout = useAdminLogout();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!me?.authenticated) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeLeft(null);
      return;
    }

    let start = sessionStorage.getItem(SESSION_KEY);
    if (!start) {
      start = String(Date.now());
      sessionStorage.setItem(SESSION_KEY, start);
    }
    const startMs = parseInt(start, 10);

    const tick = () => {
      const elapsed = Date.now() - startMs;
      const remaining = ONE_HOUR_MS - elapsed;
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        sessionStorage.removeItem(SESSION_KEY);
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
  }, [me?.authenticated, logout, setLocation]);

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem(SESSION_KEY);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  if (isLoading || !me?.authenticated) return null;

  const minutes = timeLeft !== null ? Math.floor(timeLeft / 60000) : 60;
  const seconds = timeLeft !== null ? Math.floor((timeLeft % 60000) / 1000) : 0;
  const timerLabel = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
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
        <span
          className="text-[9px] tracking-wider font-mono hidden group-hover:inline opacity-70"
          data-testid="text-session-timer"
        >
          {timerLabel}
        </span>
      </button>
      <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-[hsl(220,18%,9%)] text-white text-xs px-3 py-1.5 border border-[hsl(220,15%,18%)] shadow-lg pointer-events-none">
        Go to admin page
      </div>
    </div>
  );
}
