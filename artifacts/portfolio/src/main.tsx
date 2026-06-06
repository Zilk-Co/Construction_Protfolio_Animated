import { createRoot } from "react-dom/client";
import App from "./App";
import { setBaseUrl } from "@workspace/api-client-react";
import "./index.css";

// Dev uses the Vite /api proxy; production on Vercel uses a build-time /api rewrite to Railway.
// Set VITE_USE_DIRECT_API=true only when the SPA must call a remote API host directly (no proxy).
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
const useDirectApi = import.meta.env.VITE_USE_DIRECT_API === "true";
if (apiBaseUrl && useDirectApi) {
  setBaseUrl(apiBaseUrl);
}

createRoot(document.getElementById("root")!).render(<App />);
