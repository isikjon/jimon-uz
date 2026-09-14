"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/device";

export function Counter({ value, prefix = "", suffix = "", className }: { value: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (v: number) => (value >= 10000 ? Math.round(v).toLocaleString("ru-RU") : String(Math.round(v)));
    if (prefersReducedMotion()) {
      el.textContent = fmt(value);
      return;
    }
    const { gsap } = getGsap();
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration: 1.8,
      ease: "power3.out",
      onUpdate: () => (el.textContent = fmt(obj.v)),
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);
  return (
    <span className={className}>
      {prefix}
      <span ref={ref} className="tabular-nums">
        0
      </span>
      {suffix}
    </span>
  );
}
