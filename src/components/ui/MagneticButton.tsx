"use client";

import { useRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type PointerEvent as RPointerEvent } from "react";
import { isTouch, prefersReducedMotion } from "@/lib/device";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; strength?: number };
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; strength?: number };
type Props = ButtonProps | AnchorProps;

/** Button/anchor with a subtle magnetic pull on desktop pointers. */
export function MagneticButton({ strength = 0.35, className, children, ...rest }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = (e: RPointerEvent<HTMLElement>) => {
    if (isTouch() || prefersReducedMotion() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (inner.current) inner.current.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0)`;
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "";
    if (inner.current) inner.current.style.transform = "";
  };

  const content = (
    <span ref={inner} className="inline-flex items-center gap-2 transition-transform duration-300 [transition-timing-function:var(--ease-out-expo)]">
      {children}
    </span>
  );

  if ("href" in rest && rest.href) {
    const { strength: _s, ...a } = rest as AnchorProps;
    void _s;
    return (
      <a ref={(el) => void (ref.current = el)} onPointerMove={onMove} onPointerLeave={onLeave} className={cn("btn", className)} {...a}>
        {content}
      </a>
    );
  }
  const { strength: _s, href: _h, ...b } = rest as ButtonProps;
  void _s;
  void _h;
  return (
    <button ref={(el) => void (ref.current = el)} type="button" onPointerMove={onMove} onPointerLeave={onLeave} className={cn("btn", className)} {...b}>
      {content}
    </button>
  );
}
