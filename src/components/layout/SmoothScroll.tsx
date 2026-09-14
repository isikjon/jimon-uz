"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/device";
import { sceneState } from "@/lib/scene-state";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap, ScrollTrigger } = getGsap();
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      syncTouch: false,
    });
    window.__lenis = lenis;
    lenis.on("scroll", (e: { velocity: number }) => {
      sceneState.velocity = e.velocity;
      ScrollTrigger.update();
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);
  return null;
}
