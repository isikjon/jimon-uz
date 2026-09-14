"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ParticleField } from "./ParticleField";
import { Halo } from "./Halo";
import { detectQuality, type QualityTier } from "@/lib/device";
import { sceneState, setMorph, type ShapeIndex } from "@/lib/scene-state";
import { getGsap } from "@/lib/gsap";
import { clamp } from "@/lib/utils";

const counts: Record<QualityTier, number> = { high: 30000, medium: 16000, low: 8000, off: 0 };

/**
 * Generic scroll → scene mapping. Each entry covers one section (start "top center" → end "bottom center"),
 * so exactly one entry is active at a time. Sections with custom choreography (production) drive the state themselves.
 */
type Segment = { id: string; from: ShapeIndex; to: ShapeIndex; morph: [number, number]; opacity: [number, number]; scale?: [number, number] };
const segments: Segment[] = [
  { id: "hero", from: 0, to: 1, morph: [0.55, 1], opacity: [1, 0.85], scale: [1, 1.1] },
  { id: "story", from: 1, to: 1, morph: [0, 1], opacity: [0.75, 0.6], scale: [1.1, 1.05] },
  { id: "elements", from: 1, to: 2, morph: [0, 0.25], opacity: [1, 1], scale: [1.05, 1] },
  { id: "products", from: 2, to: 4, morph: [0, 0.2], opacity: [0.35, 0.25], scale: [1, 1] },
  { id: "trust", from: 3, to: 3, morph: [0, 1], opacity: [0.3, 0.25] },
  { id: "social", from: 3, to: 3, morph: [0, 1], opacity: [0.25, 0.2] },
  { id: "journeys", from: 3, to: 2, morph: [0, 0.5], opacity: [0.35, 0.35] },
  { id: "partnership", from: 2, to: 2, morph: [0, 1], opacity: [0.3, 0.25] },
  { id: "faq", from: 2, to: 3, morph: [0, 0.4], opacity: [0.2, 0.2] },
  { id: "contact", from: 3, to: 3, morph: [0, 1], opacity: [0.25, 0.3] },
  { id: "final", from: 3, to: 5, morph: [0, 0.5], opacity: [1, 1], scale: [1, 1.15] },
];

function useSceneScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const { ScrollTrigger } = getGsap();
    const triggers = segments
      .map((seg) => {
        const el = document.getElementById(seg.id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onUpdate: (self) => {
            const p = self.progress;
            const m = clamp((p - seg.morph[0]) / Math.max(0.0001, seg.morph[1] - seg.morph[0]), 0, 1);
            setMorph(seg.from, seg.to, m);
            sceneState.opacity = seg.opacity[0] + (seg.opacity[1] - seg.opacity[0]) * p;
            if (seg.scale) sceneState.scale = seg.scale[0] + (seg.scale[1] - seg.scale[0]) * p;
            sceneState.element = -1;
          },
        });
      })
      .filter(Boolean);
    const total = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        sceneState.rot = self.progress * Math.PI * 1.5;
      },
    });
    ScrollTrigger.refresh();
    return () => {
      triggers.forEach((t) => t?.kill());
      total.kill();
    };
  }, [enabled]);
}

export function Scene() {
  const [tier, setTier] = useState<QualityTier | null>(null);
  const [active, setActive] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTier(detectQuality());
    setMounted(true);
  }, []);

  // Pause rendering when the scene is invisible (opacity ~0) or the tab is hidden.
  useEffect(() => {
    const check = () => setActive(!document.hidden && sceneState.opacity > 0.03);
    const id = window.setInterval(check, 300);
    document.addEventListener("visibilitychange", check);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  useSceneScroll(mounted && tier !== null && tier !== "off");

  const onReady = useCallback(() => {
    window.dispatchEvent(new Event("jimon:scene-ready"));
  }, []);

  const dpr = useMemo<[number, number]>(() => (tier === "high" ? [1, 2] : tier === "medium" ? [1, 1.5] : [1, 1.25]), [tier]);

  if (tier === null) return null;
  if (tier === "off") return <StaticBackdrop />;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 6.5], fov: 42, near: 0.1, far: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false, depth: false }}
        frameloop={active ? "always" : "never"}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ParticleField count={counts[tier]} onReady={onReady} />
          <Halo />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 vignette" />
    </div>
  );
}

function StaticBackdrop() {
  useEffect(() => {
    window.dispatchEvent(new Event("jimon:scene-ready"));
  }, []);
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 42%, rgba(99,199,155,0.22) 0%, rgba(30,92,70,0.12) 40%, transparent 70%), radial-gradient(60% 50% at 50% 50%, rgba(228,200,118,0.08), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 vignette" />
    </div>
  );
}
