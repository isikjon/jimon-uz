"use client";

import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="container-x grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
        </div>
        <div className="lg:col-span-8">
          <div className="border-t hairline">
            {t.faq.items.map((it, i) => {
              const on = open === i;
              return (
                <Reveal key={i} delay={i * 0.03} kind="fade">
                  <div className="border-b hairline">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={on}
                        aria-controls={`faq-${i}`}
                        onClick={() => {
                          setOpen(on ? null : i);
                          if (!on) track("faq_open", { i });
                        }}
                        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                      >
                        <span className="font-display text-2xl md:text-[1.75rem] text-ivory group-hover:text-gold-300 transition-colors">{it.q}</span>
                        <span className={cn("relative shrink-0 w-9 h-9 rounded-full border border-ivory/20 transition-transform duration-500", on && "rotate-45 border-gold")}>
                          <span className="absolute left-1/2 top-1/2 w-3.5 h-px bg-ivory -translate-x-1/2 -translate-y-1/2" />
                          <span className="absolute left-1/2 top-1/2 h-3.5 w-px bg-ivory -translate-x-1/2 -translate-y-1/2" />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-${i}`}
                      className="grid transition-[grid-template-rows] duration-500 [transition-timing-function:var(--ease-out-expo)]"
                      style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-7 text-ivory/70 leading-relaxed max-w-3xl">{it.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
