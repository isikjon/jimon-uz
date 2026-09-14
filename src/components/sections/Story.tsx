"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { getGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/device";

function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll("span");
    if (prefersReducedMotion()) {
      words.forEach((w) => ((w as HTMLElement).style.opacity = "1"));
      return;
    }
    const { gsap } = getGsap();
    const tween = gsap.to(words, {
      opacity: 1,
      stagger: 0.02,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 45%", scrub: 0.6 },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text]);
  return (
    <p ref={ref} className="word-fade font-display text-[clamp(1.75rem,3.6vw,3.4rem)] leading-[1.18] text-ivory max-w-5xl">
      {text.split(" ").map((w, i) => (
        <span key={i}>{w} </span>
      ))}
    </p>
  );
}

export function Story() {
  const { t, lang } = useLang();
  const s = t.story;
  const track = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  // Horizontal timeline pinned on desktop
  useEffect(() => {
    const tr = track.current,
      p = pin.current;
    if (!tr || !p || prefersReducedMotion() || window.innerWidth < 1024) return;
    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      const dist = () => tr.scrollWidth - window.innerWidth;
      gsap.to(tr, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: { trigger: p, start: "top top", end: () => `+=${dist()}`, scrub: 0.6, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
      });
    }, p);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [lang]);

  return (
    <section id="story" className="relative">
      <div className="container-x pt-24 md:pt-36">
        <Reveal>
          <p className="eyebrow mb-8">{s.eyebrow}</p>
        </Reveal>
        <ScrollWords text={s.manifesto} />
      </div>

      {/* Stats */}
      <div className="container-x mt-20 md:mt-28">
        <SectionHeading title={s.title} lead={s.lead} />
        <dl className="mt-14 grid grid-cols-2 lg:grid-cols-3 gap-px bg-ivory/8 rounded-[24px] overflow-hidden border hairline">
          {s.stats.map((st, i) => (
            <div key={i} className="bg-char/80 p-6 md:p-8 flex flex-col gap-3 min-h-[160px]">
              <dd className="font-display text-[clamp(2.4rem,4.5vw,4.2rem)] leading-none gold-text">
                <Counter value={st.value} prefix={(st as { prefix?: string }).prefix} suffix={st.suffix} />
              </dd>
              <dt className="text-sm text-ivory/65 max-w-[22ch]">{st.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Pillars + imagery */}
      <div className="container-x mt-20 md:mt-28 grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <Reveal kind="clip">
            <div className="relative rounded-[28px] overflow-hidden aspect-[4/5]">
              <Image src="/images/brand/brands.webp" alt="JIMON GROUP" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <div className="absolute left-6 right-6 bottom-6">
                <p className="eyebrow mb-2">{s.brands.title}</p>
                <p className="text-sm text-ivory/80 max-w-md">{s.brands.text}</p>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
          {s.pillars.map((p, i) => (
            <Reveal key={i} delay={i * 0.08} kind={i % 2 ? "scale" : "up"}>
              <div className="surface rounded-[22px] p-7 h-full">
                <div className="font-display text-gold text-3xl mb-5">0{i + 1}</div>
                <h3 className="font-display text-2xl text-ivory mb-3">{p.title}</h3>
                <p className="text-sm text-ivory/65 leading-relaxed">{p.text}</p>
              </div>
            </Reveal>
          ))}
          <Reveal className="sm:col-span-2" kind="fade">
            <blockquote className="mt-4 font-display text-2xl md:text-3xl leading-snug text-ivory/90 border-l-2 border-gold pl-6">{s.mission}</blockquote>
          </Reveal>
        </div>
      </div>

      {/* Timeline */}
      <div ref={pin} className="mt-24 md:mt-32 lg:h-screen lg:flex lg:flex-col lg:justify-center overflow-hidden">
        <div className="container-x">
          <Reveal>
            <h3 className="h-sub text-ivory mb-10">{s.timelineTitle}</h3>
          </Reveal>
        </div>
        <div ref={track} className="flex gap-6 px-[var(--gutter)] overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory lg:snap-none w-max max-w-none">
          {s.timeline.map((it, i) => (
            <article key={it.year} className="snap-center shrink-0 w-[78vw] sm:w-[360px] lg:w-[380px] surface rounded-[22px] p-7 relative overflow-hidden">
              <div className="absolute -right-4 -top-6 font-display text-[7rem] leading-none text-ivory/[0.04] select-none">{it.year}</div>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <span className="font-display text-4xl gold-text">{it.year}</span>
              </div>
              <p className="text-ivory/80 leading-relaxed text-[0.95rem]">{it.text}</p>
              <div className="mt-6 text-xs text-ivory/40">{String(i + 1).padStart(2, "0")} / {String(s.timeline.length).padStart(2, "0")}</div>
            </article>
          ))}
          <div className="shrink-0 w-[10vw]" />
        </div>
      </div>

      {/* President */}
      <div className="container-x mt-20 md:mt-28 pb-24 md:pb-36">
        <div className="grid lg:grid-cols-12 gap-10 items-center surface rounded-[28px] p-7 md:p-12 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_20%_50%,rgba(201,162,74,0.12),transparent)]" />
          <div className="lg:col-span-4 relative">
            <Reveal kind="scale">
              <div className="relative w-56 h-56 md:w-72 md:h-72 mx-auto rounded-full overflow-hidden ring-1 ring-gold/40 shadow-[0_0_80px_-20px_rgba(201,162,74,0.5)]">
                <Image src="/images/brand/president.webp" alt={s.president.name} fill sizes="300px" className="object-cover" />
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-8 relative">
            <Reveal>
              <p className="eyebrow mb-3">{s.president.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h3 className="font-display text-4xl md:text-5xl text-ivory">{s.president.name}</h3>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-display text-xl md:text-2xl italic text-gold-300/90 mt-4">«{s.president.quote}»</p>
            </Reveal>
            <ul className="mt-7 grid sm:grid-cols-2 gap-3">
              {s.president.roles.map((r, i) => (
                <Reveal key={i} delay={0.12 + i * 0.05}>
                  <li className="flex gap-3 text-sm text-ivory/75">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    {r}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
