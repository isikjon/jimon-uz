"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./Icons";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LanguageProvider";

export function Modal({
  open,
  onClose,
  children,
  size = "md",
  label,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "md" | "lg" | "xl";
  label?: string;
}) {
  const t = useT();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0],
          last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    setTimeout(() => panel.current?.querySelector<HTMLElement>("input,button,[tabindex]")?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label={label}>
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md animate-[fadeIn_.35s_ease]" onClick={onClose} />
      <div
        ref={panel}
        className={cn(
          "relative w-full max-h-[92dvh] overflow-y-auto no-scrollbar surface rounded-t-[28px] sm:rounded-[28px] shadow-2xl animate-[modalIn_.55s_var(--ease-out-expo)]",
          size === "md" && "sm:max-w-[560px]",
          size === "lg" && "sm:max-w-[960px]",
          size === "xl" && "sm:max-w-[1200px]",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.a11y.closeDialog}
          className="absolute right-4 top-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-ivory/80 hover:text-ivory"
        >
          <CloseIcon />
        </button>
        {children}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes modalIn{from{opacity:0;transform:translateY(28px) scale(.98)}to{opacity:1;transform:none}}`}</style>
    </div>,
    document.body,
  );
}
