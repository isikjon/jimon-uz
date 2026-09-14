"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang, useL } from "@/i18n/LanguageProvider";
import { elements } from "@/content/elements";
import { productById } from "@/content/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { sceneState } from "@/lib/scene-state";
import { cn, scrollToId } from "@/lib/utils";
import { track } from "@/lib/analytics";

/** Interactive Wu Xing diagram (SVG) — the generating cycle as a pentagon, the controlling cycle as a star. */
function Diagram({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const L = useL();
  const R = 150,
    C = 200;
  const pts = elements.map((_, k) => {
    const a = -Math.PI / 2 + (k / 5) * Math.PI * 2;
    return [C + Math.cos(a) * R, C + Math.sin(a) * R] as const;
  });
  const ring = pts.map((p) => p.join(",")).join(" ");
  const star = [0, 2, 4, 1, 3, 0].map((k) => pts[k].join(",")).join(" ");
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[520px] mx-auto select-none" role="group" aria-label="Wu Xing">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon points={ring} fill="none" stroke="rgba(228,200,118,0.35)" strokeWidth="1" />
      <polygon points={star} fill="none" stroke="rgba(243,238,226,0.12)" strokeWidth="1" strokeDasharray="3 5" />
      <circle cx={C} cy={C} r={R + 28} fill="none" stroke="rgba(243,238,226,0.06)" />
      <g className="[transform-origin:200px_200px] animate-[spin_120s_linear_infinite]" opacity="0.5">
        <circle cx={C} cy={C - R - 28} r="2" fill="#e4c876" />
      </g>
      {elements.map((e, i) => {
        const [x, y] = pts[i];
        const on = active === i;
        return (
          <g
            key={e.id}
            transform={`translate(${x} ${y})`}
            onClick={() => onSelect(i)}
            onKeyDown={(ev) => (ev.key === "Enter" || ev.key === " ") && (ev.preventDefault(), onSelect(i))}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={L(e.name)}
            className="cursor-pointer outline-none focus-visible:[&>circle:first-child]:stroke-ivory"
            data-cursor="hover"
          >
            <circle r={on ? 44 : 34} fill={on ? e.color : "rgba(14,19,16,0.9)"} stroke={on ? e.glow : "rgba(243,238,226,0.22)"} strokeWidth={on ? 2 : 1} filter={on ? "url(#glow)" : undefined} className="transition-all duration-500" />
            <text textAnchor="middle" dominantBaseline="central" fontSize={on ? 30 : 24} fill={on ? (e.id === "metal" ? "#141b17" : "#f3eee2") : "rgba(243,238,226,0.75)"} className="transition-all duration-500 font-display">
              {e.hanzi}
            </text>
            <text y={on ? 62 : 52} textAnchor="middle" fontSize="11" letterSpacing="2" fill={on ? e.glow : "rgba(243,238,226,0.5)"} className="uppercase transition-all duration-500">
              {L(e.name)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Elements() {
  const { t, lang } = useLang();
  const L = useL();
  const [active, setActive] = useState(0);
  const el = elements[active];
  const panel = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  const select = useCallback((i: number) => {
    setActive(i);
    setKey((k) => k + 1);
    track("element_select", { element: elements[i].id });
  }, []);

  // Drive the 3D highlight while the section is in view
  useEffect(() => {
    const node = document.getElementById("elements");
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => {
        sceneState.element = e.isIntersecting ? active : -1;
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      sceneState.element = -1;
    };
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!panel.current?.contains(document.activeElement)) return;
      if (e.key === "ArrowRight") select((active + 1) % 5);
      if (e.key === "ArrowLeft") select((active + 4) % 5);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, select]);

  return (
    <section id="elements" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeading eyebrow={t.elements.eyebrow} title={t.elements.title} lead={t.elements.lead} align="center" />
        <div ref={panel} className="mt-14 md:mt-20 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <Reveal kind="scale">
              <Diagram active={active} onSelect={select} />
            </Reveal>
            <div className="mt-4 flex justify-center gap-2 lg:hidden" role="tablist" aria-label={t.elements.hint}>
              {elements.map((e, i) => (
                <button
                  key={e.id}
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => select(i)}
                  className={cn("chip transition-colors", active === i && "border-gold/70 bg-gold/10")}
                  style={active === i ? { borderColor: e.glow } : undefined}
                >
                  {e.hanzi} {L(e.name)}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6">
            <p className="text-xs tracking-[0.25em] uppercase text-ivory/45 mb-6 hidden lg:block">{t.elements.hint} · ← →</p>
            <div key={key} className="lang-swap">
              <div className="flex items-end gap-5">
                <span className="font-display text-[5rem] md:text-[7rem] leading-none" style={{ color: el.glow }}>
                  {el.hanzi}
                </span>
                <div className="pb-3">
                  <h3 className="font-display text-4xl md:text-5xl text-ivory">{L(el.name)}</h3>
                  <p className="text-sm text-ivory/55 mt-1">{L(el.season)} · {L(el.quality)}</p>
                </div>
              </div>
              <p className="mt-6 text-ivory/80 leading-relaxed max-w-xl">{L(el.text)}</p>
              <p className="mt-3 text-sm text-ivory/50">{L(el.organ)}</p>
              <div className="mt-8 surface rounded-[20px] p-6">
                <p className="eyebrow mb-2">{t.elements.directionLabel}</p>
                <p className="font-display text-2xl text-ivory">{L(el.direction)}</p>
                <p className="text-xs text-ivory/45 mt-5 mb-3 uppercase tracking-[0.2em]">{t.elements.productsLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {el.products.map((id) => {
                    const p = productById(id);
                    if (!p) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent("jimon:select-product", { detail: id }));
                          scrollToId("products");
                        }}
                        className="chip hover:border-gold/60 hover:text-ivory transition-colors"
                      >
                        {p.name[lang]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="mt-6 text-xs text-ivory/40 max-w-md">{t.elements.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
