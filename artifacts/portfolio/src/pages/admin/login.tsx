import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, useGetAdminMe } from "@workspace/api-client-react";
import { motion } from "framer-motion";

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
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const { data: me } = useGetAdminMe({
    query: { retry: false, throwOnError: false }
  });
  const loginMutation = useAdminLogin();

  useEffect(() => {
    if (me?.authenticated) {
      setLocation("/admin");
    }
  }, [me, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ data: { username, password } }, {
      onSuccess: (data) => {
        if (data.authenticated) {
          setLocation("/admin");
        } else {
          setError("Invalid credentials");
        }
      },
      onError: () => {
        setError("Invalid username or password");
      }
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: "360px" }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p style={{ fontSize: "20px", fontFamily: "serif", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: TEXT, margin: 0 }}>
            Zain Manzoor
          </p>
          <p style={{ fontSize: "11px", letterSpacing: "0.45em", textTransform: "uppercase", fontWeight: 600, color: GOLD, margin: "4px 0 0" }}>
            Co.
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
              onChange={e => setUsername(e.target.value)}
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
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              data-testid="input-password"
              style={{ width: "100%", backgroundColor: BG2, border: `1px solid ${BORDER}`, color: TEXT, padding: "12px 16px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              onFocus={e => (e.currentTarget.style.borderColor = BORDER_FOCUS)}
              onBlur={e => (e.currentTarget.style.borderColor = BORDER)}
            />
          </div>

          {error && (
            <p style={{ color: "#f87171", fontSize: "12px", letterSpacing: "0.05em", margin: 0 }}>{error}</p>
          )}

          <div style={{ paddingTop: "4px" }}>
            <button
              type="submit"
              disabled={loginMutation.isPending || !username || !password}
              data-testid="button-login"
              style={{
                width: "100%",
                backgroundColor: GOLD_BTN,
                color: DARK,
                padding: "14px",
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontWeight: "bold",
                border: "none",
                cursor: loginMutation.isPending || !username || !password ? "not-allowed" : "pointer",
                opacity: loginMutation.isPending || !username || !password ? 0.5 : 1,
                transition: "background-color 0.15s",
              }}
              onMouseEnter={e => { if (!loginMutation.isPending) e.currentTarget.style.backgroundColor = GOLD_HOVER; }}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD_BTN)}
            >
              {loginMutation.isPending ? "Authenticating..." : "Sign In"}
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: TEXT_DIM, marginTop: "32px" }}>
          Zain Manzoor Co. — Admin Portal
        </p>
      </motion.div>
    </div>
  );
}
