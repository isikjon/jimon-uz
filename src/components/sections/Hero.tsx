"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { useUI } from "@/components/layout/UIProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/device";
import { scrollToId } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { ArrowIcon } from "@/components/ui/Icons";

export function Hero() {
  const { t, lang } = useLang();
  const { openLead } = useUI();
  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const lines = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const el = root.current,
      box = inner.current;
    if (!el || !box) return;
    const { gsap, ScrollTrigger } = getGsap();
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      // entrance
      const tl = gsap.timeline({ delay: reduced ? 0 : 0.2 });
      tl.to(lines.current, { y: 0, duration: reduced ? 0 : 1.4, ease: "expo.out", stagger: 0.09 })
        .fromTo("[data-hero-fade]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, "-=0.9");
      if (reduced) return;
      // scroll choreography: pin and let the headline recede into the scene
      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "+=120%", scrub: 0.8, pin: true, anticipatePin: 1 },
        })
        .to(box, { scale: 0.78, opacity: 0, filter: "blur(10px)", y: -80, ease: "none" }, 0)
        .to("[data-hero-scroll]", { opacity: 0, ease: "none" }, 0);
    }, el);
    const onLoaded = () => ScrollTrigger.refresh();
    window.addEventListener("jimon:scene-ready", onLoaded, { once: true });
    return () => {
      ctx.revert();
      window.removeEventListener("jimon:scene-ready", onLoaded);
    };
  }, [lang]);

  const L = [t.hero.line1, t.hero.line2, t.hero.line3, t.hero.line4];

  return (
    <section id="hero" ref={root} className="relative min-h-[100svh] flex items-end md:items-center overflow-hidden" aria-label="Intro">
      <div ref={inner} className="container-x relative w-full pt-[calc(var(--header-h)+3rem)] pb-28 md:pb-24 will-change-transform">
        <p data-hero-fade className="eyebrow mb-7 md:mb-10 max-w-[90%]">
          {t.hero.eyebrow}
        </p>
        <h1 className="h-display text-ivory">
          {L.map((line, i) => (
            <span key={i} className="reveal-line">
              <span
                ref={(r) => {
                  if (r) lines.current[i] = r;
                }}
                className={i === 1 || i === 3 ? "gold-text italic font-light pr-[0.08em]" : ""}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>
        <div className="mt-10 md:mt-14 grid md:grid-cols-12 gap-8 md:items-end">
          <p data-hero-fade className="lead md:col-span-6 lg:col-span-5">
            {t.hero.sub}
          </p>
          <div data-hero-fade className="md:col-span-6 lg:col-span-7 flex flex-wrap gap-3 md:justify-end">
            <MagneticButton
              className="btn-gold sheen"
              onClick={() => {
                track("cta_click", { id: "hero_pick" });
                scrollToId("products");
              }}
            >
              {t.hero.ctaPrimary} <ArrowIcon />
            </MagneticButton>
            <MagneticButton
              className="btn-ghost"
              onClick={() => {
                track("cta_click", { id: "hero_partner" });
                openLead("partner");
              }}
            >
              {t.hero.ctaSecondary}
            </MagneticButton>
          </div>
        </div>
        <ul data-hero-fade className="mt-10 flex flex-wrap gap-2" aria-label="Facts">
          {t.hero.facts.map((f) => (
            <li key={f} className="chip">
              <span className="w-1.5 h-1.5 rounded-full bg-jade-300" />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div data-hero-scroll className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[0.65rem] tracking-[0.3em] uppercase text-ivory/55">
        <span>{t.common.scroll}</span>
        <span className="block w-px h-12 bg-gradient-to-b from-gold to-transparent scroll-hint" />
      </div>
    </section>
  );
}
