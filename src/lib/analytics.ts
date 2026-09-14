/**
 * Analytics hooks. Events are pushed to window.dataLayer (GTM), gtag and Yandex.Metrica when present.
 * Attach any provider later without touching components.
 */
type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
    __ymId?: number;
  }
}

export function track(event: string, props: Props = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer?.push({ event, ...props });
    window.gtag?.("event", event, props);
    if (window.ym && window.__ymId) window.ym(window.__ymId, "reachGoal", event, props);
    if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, props);
  } catch {
    /* noop */
  }
}
