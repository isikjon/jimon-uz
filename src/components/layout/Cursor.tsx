"use client";

import { useEffect, useRef } from "react";
import { isTouch, prefersReducedMotion } from "@/lib/device";
import { sceneState } from "@/lib/scene-state";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return;
    let x = window.innerWidth / 2,
      y = window.innerHeight / 2,
      rx = x,
      ry = y,
      raf = 0;
    const d = dot.current!,
      r = ring.current!;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      sceneState.px = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.py = -((e.clientY / window.innerHeight) * 2 - 1);
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e: Event) => {
      const t = e.target as HTMLElement;
      const drag = t.closest("[data-cursor='drag']");
      const hov = t.closest("a, button, [role='button'], input, select, textarea, [data-cursor='hover']");
      r.dataset.hover = drag ? "drag" : hov ? "true" : "false";
    };
    const leave = () => {
      r.style.opacity = "0";
      d.style.opacity = "0";
    };
    const enter = () => {
      r.style.opacity = "1";
      d.style.opacity = "1";
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
