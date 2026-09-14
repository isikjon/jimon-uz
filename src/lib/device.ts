export type QualityTier = "high" | "medium" | "low" | "off";

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isTouch() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

export function hasWebGL() {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Heuristic quality tier for the WebGL scene. */
export function detectQuality(): QualityTier {
  if (typeof window === "undefined") return "medium";
  if (prefersReducedMotion() || !hasWebGL()) return "off";
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = navigator.hardwareConcurrency || 4;
  const mem = nav.deviceMemory || 4;
  const mobile = window.innerWidth < 820 || isTouch();
  if (nav.connection?.saveData) return "low";
  if (mobile) return cores >= 6 && mem >= 4 ? "medium" : "low";
  if (cores >= 8 && mem >= 8) return "high";
  return "medium";
}
