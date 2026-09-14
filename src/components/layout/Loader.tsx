"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/LanguageProvider";
import { prefersReducedMotion } from "@/lib/device";

/**
 * Short branded loader. Waits for fonts + first paint of the scene (or a 1.8s cap), never longer.
 */
let shownOnce = false;

export function Loader() {
  const t = useT();
  const [done, setDone] = useState(() => shownOnce);
  const [n, setN] = useState(1);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shownOnce) return;
    shownOnce = true;
    if (prefersReducedMotion()) {
      setDone(true);
      return;
    }
    let alive = true;
    const start = performance.now();
    const minTime = 900;
    const maxTime = 1800;
    let ready = false;
    const fontsReady = (document.fonts?.ready ?? Promise.resolve()).then(() => undefined);
    const sceneReady = new Promise<void>((res) => {
      const h = () => res();
      window.addEventListener("jimon:scene-ready", h, { once: true });
      setTimeout(res, maxTime);
    });
    Promise.all([fontsReady, sceneReady]).then(() => (ready = true));

    const tick = () => {
      if (!alive) return;
      const el = performance.now() - start;
      const target = ready ? 100 : Math.min(92, (el / maxTime) * 100);
      setN((v) => Math.max(v, Math.round(v + (target - v) * 0.12)));
      if (ready && el >= minTime) {
        setN(100);
        setTimeout(() => alive && setDone(true), 350);
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (done) document.documentElement.classList.add("is-loaded");
  }, [done]);

  if (done) return null;
  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] bg-ink flex flex-col items-center justify-center transition-opacity duration-500"
      style={{ opacity: n >= 100 ? 0 : 1 }}
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative flex flex-col items-center">
        <span className="font-display text-[clamp(2.4rem,7vw,5.5rem)] tracking-[0.18em] text-ivory leading-none">JIMON</span>
        <span className="mt-3 text-[0.68rem] tracking-[0.3em] uppercase text-gold">{t.loader.tagline}</span>
        <div className="mt-10 w-[220px] h-px bg-ivory/10 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-700 via-gold to-gold-300"
            style={{ width: `${n}%`, transition: "width 120ms linear" }}
          />
        </div>
        <div className="mt-4 font-display text-2xl text-ivory/70 tabular-nums">
          {String(Math.min(100, Math.max(1, n))).padStart(2, "0")}
          <span className="text-ivory/30"> / 100</span>
        </div>
      </div>
    </div>
  );
}
