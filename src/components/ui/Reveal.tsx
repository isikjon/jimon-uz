"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/device";

type Kind = "up" | "mask" | "fade" | "scale" | "clip";

/** Scroll-triggered reveal with several entrance styles (used sparingly and varied per section). */
export function Reveal({
  children,
  kind = "up",
  delay = 0,
  className,
  once = true,
  y = 32,
  start = "top 88%",
}: {
  children: ReactNode;
  kind?: Kind;
  delay?: number;
  className?: string;
  once?: boolean;
  y?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.clipPath = "none";
      return;
    }
    const { gsap } = getGsap();
    const from: gsap.TweenVars = { opacity: 0 };
    const to: gsap.TweenVars = { opacity: 1, duration: 1.1, delay, ease: "power3.out", overwrite: "auto" };
    if (kind === "up") {
      from.y = y;
      to.y = 0;
    } else if (kind === "scale") {
      from.scale = 0.92;
      to.scale = 1;
    } else if (kind === "clip") {
      from.clipPath = "inset(0 0 100% 0)";
      from.opacity = 1;
      to.clipPath = "inset(0 0 0% 0)";
      to.duration = 1.3;
      to.ease = "expo.out";
    } else if (kind === "mask") {
      from.clipPath = "inset(0 100% 0 0)";
      from.opacity = 1;
      to.clipPath = "inset(0 0% 0 0)";
      to.duration = 1.2;
      to.ease = "expo.inOut";
    }
    const tween = gsap.fromTo(el, from, { ...to, scrollTrigger: { trigger: el, start, once, toggleActions: "play none none reverse" } });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [kind, delay, once, y, start]);
  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
