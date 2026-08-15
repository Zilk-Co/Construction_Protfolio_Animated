export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID || "";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function initAnalytics() {
  if (!GA_MEASUREMENT_ID) return;
  // GA is loaded via index.html script tag
}

export function trackPageView(url: string) {
  if (!GA_MEASUREMENT_ID || typeof window.gtag === "undefined") return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
}

export function trackEvent(action: string, category: string, label?: string) {
  if (!GA_MEASUREMENT_ID || typeof window.gtag === "undefined") return;
  window.gtag("event", action, { event_category: category, event_label: label });
}
