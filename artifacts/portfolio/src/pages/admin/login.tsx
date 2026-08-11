import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, useGetAdminMe } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const BG = "hsl(220,18%,7%)";
const BG2 = "hsl(220,18%,12%)";
const BORDER = "hsl(220,15%,22%)";
const BORDER_FOCUS = "hsl(38,72%,52%)";
const GOLD = "hsl(38,85%,62%)";
const GOLD_BTN = "hsl(38,72%,52%)";
const GOLD_HOVER = "hsl(38,72%,62%)";
const TEXT = "#e8eaed";
const TEXT_MID = "#9ca3af";
const TEXT_DIM = "#6b7280";
const DARK = "hsl(220,18%,9%)";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);
  const [, setLocation] = useLocation();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: me } = useGetAdminMe();
  const loginMutation = useAdminLogin();

  useEffect(() => {
    if (me?.authenticated) setLocation("/admin");
  }, [me, setLocation]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startCountdown = (seconds: number) => {
    setRateLimitSeconds(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRateLimitSeconds(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); timerRef.current = null; return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rateLimitSeconds > 0) return;
    if (password.includes(" ")) {
      setError("Password cannot contain spaces");
      setPassword("");
      return;
    }
    setError("");
    loginMutation.mutate({ data: { username, password } }, {
      onSuccess: (data) => {
        if (data.authenticated) {
          setLocation("/admin");
        } else {
          setError("Invalid username or password");
          setPassword("");
        }
      },
      onError: (err: any) => {
        const body = err?.response?.data ?? err?.data ?? {};
        if (body?.rateLimited && body?.secondsLeft) {
          startCountdown(body.secondsLeft);
          setError("");
        } else {
          setError("Invalid username or password");
        }
        setPassword("");
      }
    });
  };

  const isLocked = rateLimitSeconds > 0;
  const minutes = Math.floor(rateLimitSeconds / 60);
  const secs = rateLimitSeconds % 60;
  const lockLabel = minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: "360px" }}>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p style={{ fontSize: "20px", fontFamily: "serif", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: TEXT, margin: 0 }}>
            Azhar Engineering
          </p>
          <p style={{ fontSize: "11px", letterSpacing: "0.45em", textTransform: "uppercase", fontWeight: 600, color: GOLD, margin: "4px 0 0" }}>
            Pvt. Ltd.
          </p>
          <div style={{ width: "32px", height: "1px", backgroundColor: GOLD_BTN, margin: "20px auto 0" }} />
          <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: TEXT_MID, margin: "16px 0 0" }}>
            Admin Access
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: TEXT_MID, marginBottom: "8px" }}>
              Username
            </label>
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(""); }}
              autoFocus
              data-testid="input-username"
              style={{ width: "100%", backgroundColor: BG2, border: `1px solid ${BORDER}`, color: TEXT, padding: "12px 16px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              onFocus={e => (e.currentTarget.style.borderColor = BORDER_FOCUS)}
              onBlur={e => (e.currentTarget.style.borderColor = BORDER)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: TEXT_MID, marginBottom: "8px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                data-testid="input-password"
                style={{ width: "100%", backgroundColor: BG2, border: `1px solid ${BORDER}`, color: TEXT, padding: "12px 44px 12px 16px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                onFocus={e => (e.currentTarget.style.borderColor = BORDER_FOCUS)}
                onBlur={e => (e.currentTarget.style.borderColor = BORDER)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: TEXT_DIM, display: "flex", alignItems: "center", padding: 0 }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {isLocked && (
            <div style={{ backgroundColor: "hsl(220,18%,11%)", border: "1px solid hsl(220,15%,22%)", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "hsl(38,72%,52%)", flexShrink: 0 }} />
              <p style={{ color: TEXT_MID, fontSize: "12px", margin: 0, letterSpacing: "0.05em" }}>
                Too many attempts. Try again in <strong style={{ color: TEXT }}>{lockLabel}</strong>
              </p>
            </div>
          )}

          {error && !isLocked && (
            <p style={{ color: "#f87171", fontSize: "12px", letterSpacing: "0.05em", margin: 0 }}>{error}</p>
          )}

          <div style={{ paddingTop: "4px" }}>
            <button
              type="submit"
              disabled={loginMutation.isPending || !username || !password || isLocked}
              data-testid="button-login"
              style={{
                width: "100%",
                backgroundColor: isLocked ? "hsl(220,15%,20%)" : GOLD_BTN,
                color: isLocked ? TEXT_DIM : DARK,
                padding: "14px",
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontWeight: "bold",
                border: "none",
                cursor: loginMutation.isPending || !username || !password || isLocked ? "not-allowed" : "pointer",
                opacity: !isLocked && (loginMutation.isPending || !username || !password) ? 0.5 : 1,
                transition: "background-color 0.15s",
              }}
              onMouseEnter={e => { if (!loginMutation.isPending && !isLocked) e.currentTarget.style.backgroundColor = GOLD_HOVER; }}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = isLocked ? "hsl(220,15%,20%)" : GOLD_BTN)}
            >
              {isLocked ? `Locked — ${lockLabel}` : loginMutation.isPending ? "Authenticating..." : "Sign In"}
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: TEXT_DIM, marginTop: "32px" }}>
          Azhar Engineering (Pvt.) Ltd — Admin Portal
        </p>
      </motion.div>
    </div>
  );
}
