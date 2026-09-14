"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/device";
import { sceneState, setMorph } from "@/lib/scene-state";
import { clamp } from "@/lib/utils";
import { cn } from "@/lib/utils";

const visuals = [
  { src: "/images/brand/catalog-cover.webp", alt: "Nature" },
  { src: "/images/brand/raw.webp", alt: "Raw material" },
  { src: "/images/brand/lab.webp", alt: "Research" },
  { src: "/images/brand/production.webp", alt: "Production" },
  { src: "/images/certs/quality-award.webp", alt: "Quality control" },
  { src: "/images/products/cut/product-31.webp", alt: "Product", contain: true },
];

/**
 * Pinned cinematic sequence on desktop: scroll progress drives the stage index,
 * a circular clip reveal between visuals, and the particle field (product → plant → molecule → product).
 * On small screens the same content stacks vertically with reveals.
 */
export function Production() {
  const { t, lang } = useLang();
  const s = t.production;
  const pin = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const upd = () => setDesktop(mq.matches && !prefersReducedMotion());
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    const el = pin.current;
    if (!el || !desktop) return;
    const { gsap, ScrollTrigger } = getGsap();
    const n = s.steps.length;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: () => `+=${n * 90}%`,
      pin: true,
      anticipatePin: 1,
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);
        setStage(Math.min(n - 1, Math.floor(p * n)));
        // particle choreography: product(4) → plant(1) → molecule(3) → product(4)
        if (p < 0.2) setMorph(4, 1, clamp(p / 0.2, 0, 1));
        else if (p < 0.5) setMorph(1, 3, clamp((p - 0.3) / 0.2, 0, 1));
        else if (p < 0.85) setMorph(3, 3, 1);
        else setMorph(3, 4, clamp((p - 0.85) / 0.15, 0, 1));
        sceneState.opacity = 0.85;
        sceneState.scale = 1.05 + Math.sin(p * Math.PI) * 0.1;
      },
    });
    ScrollTrigger.refresh();
    return () => {
      st.kill();
      gsap.set(el, { clearProps: "all" });
    };
  }, [desktop, s.steps.length, lang]);

  const n = s.steps.length;

  return (
    <section id="production" className="relative">
      <div className="container-x pt-24 md:pt-36 pb-10">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      </div>

      {/* Desktop pinned stage */}
      <div ref={pin} className={cn("relative", desktop ? "h-screen" : "hidden")}>
        <div className="container-x h-full grid grid-cols-12 gap-10 items-center">
          {/* Visual */}
          <div className="col-span-6 relative aspect-[4/3] rounded-[32px] overflow-hidden plate">
            {visuals.map((v, i) => {
              const local = clamp(progress * n - i, 0, 1);
              const r = i === 0 ? 100 : Math.round(local * 100);
              return (
                <div key={v.src} className="absolute inset-0" style={{ clipPath: `circle(${r * 0.85}% at 50% 50%)`, transition: "clip-path .1s linear" }}>
                  <Image src={v.src} alt={v.alt} fill sizes="50vw" className={v.contain ? "object-contain p-10" : "object-cover"} />
                  {!v.contain && <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />}
                </div>
              );
            })}
            <div className="absolute left-6 top-6 chip bg-ink/50 backdrop-blur">
              <span className="font-display text-gold text-base">0{stage + 1}</span> / 0{n}
            </div>
          </div>

          {/* Text */}
          <div className="col-span-6 relative min-h-[420px]">
            {s.steps.map((st, i) => {
              const local = progress * n - i; // 0..1 while this stage is active
              const on = i === stage;
              const enter = clamp(local + 0.35, 0, 1);
              const exit = clamp(1 - (local - 0.85) / 0.25, 0, 1);
              const op = on ? Math.min(enter, exit) : 0;
              return (
                <div key={i} className="absolute inset-0 flex flex-col justify-center" style={{ opacity: op, transform: `translateY(${(1 - op) * 24}px)`, pointerEvents: on ? "auto" : "none", transition: "opacity .25s, transform .25s" }} aria-hidden={!on}>
                  <p className="eyebrow mb-4">{st.k}</p>
                  <h3 className="font-display text-[clamp(2.4rem,4.2vw,4.4rem)] leading-[0.98] text-ivory">{st.t}</h3>
                  <p className="mt-6 lead">{st.d}</p>
                </div>
              );
            })}
            {/* progress rail */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {s.steps.map((st, i) => (
                <span key={i} className={cn("w-1 rounded-full transition-all duration-500", i === stage ? "h-10 bg-gold" : "h-3 bg-ivory/20")} aria-hidden="true" />
              ))}
            </div>
          </div>
        </div>
        {/* flow labels */}
        <div className="absolute bottom-8 inset-x-0">
          <div className="container-x flex items-center justify-between text-[0.68rem] tracking-[0.22em] uppercase text-ivory/40">
            {s.steps.map((st, i) => (
              <span key={i} className={cn("transition-colors duration-500", i <= stage && "text-gold")}>
                {st.k}
                {i < n - 1 && <span className="mx-3 text-ivory/25">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / reduced-motion stacked version */}
      <div className={cn("container-x pb-24", desktop && "hidden")}>
        <ol className="space-y-8">
          {s.steps.map((st, i) => (
            <Reveal key={i} kind={i % 2 ? "mask" : "clip"}>
              <li className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                <div className="sm:col-span-5 relative aspect-[4/3] rounded-[22px] overflow-hidden plate">
                  <Image src={visuals[i].src} alt={visuals[i].alt} fill sizes="(min-width:640px) 40vw, 100vw" className={visuals[i].contain ? "object-contain p-6" : "object-cover"} />
                  <span className="absolute left-4 top-4 chip bg-ink/60 backdrop-blur">
                    <span className="font-display text-gold text-base">0{i + 1}</span>
                  </span>
                </div>
                <div className="sm:col-span-7">
                  <p className="eyebrow mb-2">{st.k}</p>
                  <h3 className="font-display text-3xl text-ivory">{st.t}</h3>
                  <p className="mt-3 text-ivory/70 text-sm leading-relaxed">{st.d}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
