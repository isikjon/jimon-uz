"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { useUI } from "@/components/layout/UIProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { scrollToId } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { ArrowIcon } from "@/components/ui/Icons";

export function Journeys() {
  const { t } = useLang();
  const { openLead } = useUI();
  const j = t.journeys;
  const cards = [
    {
      k: "buyer",
      d: j.buyer,
      accent: "from-jade-700/60 to-jade-900/40",
      cta: () => {
        track("cta_click", { id: "journey_buyer" });
        scrollToId("products");
      },
    },
    {
      k: "partner",
      d: j.partner,
      accent: "from-gold-700/40 to-char/40",
      cta: () => {
        track("cta_click", { id: "journey_partner" });
        openLead("partner");
      },
    },
  ] as const;
  return (
    <section id="journeys" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={j.eyebrow} title={j.title} align="center" />
        <div className="mt-14 grid md:grid-cols-2 gap-5">
          {cards.map((c, i) => (
            <Reveal key={c.k} kind={i ? "mask" : "clip"} delay={i * 0.1}>
              <article className={`relative overflow-hidden rounded-[28px] surface p-8 md:p-10 h-full bg-gradient-to-br ${c.accent}`}>
                <div className="absolute -right-6 -top-10 font-display text-[9rem] text-ivory/[0.04] leading-none select-none">0{i + 1}</div>
                <h3 className="font-display text-4xl md:text-5xl text-ivory">{c.d.title}</h3>
                <p className="mt-4 text-ivory/70 max-w-md">{c.d.text}</p>
                <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
                  {c.d.steps.map((s, k) => (
                    <li key={k} className="flex items-start gap-3 text-sm text-ivory/85">
                      <span className="font-display text-gold text-xl leading-none w-6 shrink-0">{k + 1}</span>
                      <span className="pt-0.5">{s}</span>
                    </li>
                  ))}
                </ol>
                <MagneticButton className={i ? "btn-gold mt-10" : "btn-ghost mt-10"} onClick={c.cta}>
                  {c.d.cta} <ArrowIcon />
                </MagneticButton>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
