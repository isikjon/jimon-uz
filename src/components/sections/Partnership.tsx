"use client";

import Image from "next/image";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PartnerForm } from "@/components/forms/PartnerForm";
import { CheckIcon, TelegramIcon } from "@/components/ui/Icons";
import { site, telegramLink } from "@/content/site";
import { track } from "@/lib/analytics";

export function Partnership() {
  const { t } = useLang();
  const p = t.partnership;
  return (
    <section id="partnership" className="relative py-24 md:py-36">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
          </div>
          <div className="lg:col-span-5">
            <Reveal kind="clip">
              <div className="relative rounded-[24px] overflow-hidden aspect-[16/10]">
                <Image src="/images/brand/family.webp" alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid lg:grid-cols-12 gap-10">
          {/* Steps */}
          <div className="lg:col-span-7">
            <Reveal>
              <h3 className="h-sub text-ivory mb-8">{p.stepsTitle}</h3>
            </Reveal>
            <ol className="relative border-l hairline ml-3">
              {p.steps.map((s, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <li className="relative pl-10 pb-10 last:pb-0">
                    <span className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-ink border border-gold flex items-center justify-center text-[0.65rem] font-semibold text-gold">{i + 1}</span>
                    <h4 className="font-display text-2xl md:text-3xl text-ivory">{s.t}</h4>
                    <p className="mt-2 text-ivory/65 max-w-xl">{s.d}</p>
                  </li>
                </Reveal>
              ))}
            </ol>

            <div className="mt-14 grid sm:grid-cols-2 gap-8">
              <div>
                <Reveal>
                  <h3 className="font-display text-2xl text-ivory mb-5">{p.whoTitle}</h3>
                </Reveal>
                <ul className="space-y-3">
                  {p.who.map((w, i) => (
                    <Reveal key={i} delay={i * 0.05} kind="fade">
                      <li className="flex gap-3 text-sm text-ivory/75">
                        <span className="mt-1 w-5 h-5 rounded-full bg-jade/40 text-jade-300 flex items-center justify-center shrink-0">
                          <CheckIcon className="w-3 h-3" />
                        </span>
                        {w}
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
              <div>
                <Reveal>
                  <h3 className="font-display text-2xl text-ivory mb-5">{p.whyTitle}</h3>
                </Reveal>
                <ul className="space-y-3">
                  {p.why.map((w, i) => (
                    <Reveal key={i} delay={i * 0.05} kind="fade">
                      <li className="flex gap-3 text-sm text-ivory/75">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                        {w}
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
            <Reveal kind="fade">
              <p className="mt-10 text-xs text-ivory/40 max-w-2xl">{p.disclaimer}</p>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-5">
            <Reveal kind="scale">
              <div className="surface rounded-[28px] p-6 md:p-9 lg:sticky lg:top-28">
                <h3 className="font-display text-3xl text-ivory">{p.formTitle}</h3>
                <p className="muted mt-2 mb-8 text-sm">{p.formLead}</p>
                <PartnerForm />
                <a
                  href={telegramLink(t.tg.partner)}
                  target="_blank"
                  rel="noopener"
                  onClick={() => track("cta_click", { id: "partnership_telegram" })}
                  className="mt-5 flex items-center justify-center gap-2 text-sm text-ivory/65 hover:text-ivory transition-colors"
                >
                  <TelegramIcon className="w-4 h-4" /> {t.common.writeTelegram} · {site.telegramHandle}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
