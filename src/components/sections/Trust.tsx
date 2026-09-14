"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang, useL } from "@/i18n/LanguageProvider";
import { badges, docs } from "@/content/certificates";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Modal } from "@/components/ui/Modal";
import { site, telegramLink } from "@/content/site";
import { InstagramIcon, TelegramIcon } from "@/components/ui/Icons";
import { track } from "@/lib/analytics";

export function Trust() {
  const { t, lang } = useLang();
  const L = useL();
  const [open, setOpen] = useState<number | null>(null);
  const doc = open !== null ? docs[open] : null;

  return (
    <section id="trust" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeading eyebrow={t.trust.eyebrow} title={t.trust.title} lead={t.trust.lead} />

        {/* Badges */}
        <Reveal>
          <p className="eyebrow mt-16 mb-6">{t.trust.badgesTitle}</p>
        </Reveal>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.06} kind="scale">
              <li className="surface rounded-[20px] p-5 flex items-center gap-4 h-full">
                <div className="relative w-14 h-14 shrink-0 rounded-full bg-ivory p-1.5 overflow-hidden">
                  <Image src={b.image} alt={L(b.title)} fill sizes="56px" className="object-contain p-1.5" />
                </div>
                <div>
                  <p className="font-display text-xl text-ivory leading-none">{L(b.title)}</p>
                  <p className="text-xs text-ivory/55 mt-1.5 leading-snug">{L(b.text)}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Documents gallery */}
      <div className="mt-16">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow mb-6">{t.trust.docsTitle}</p>
          </Reveal>
        </div>
        <div className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-[var(--gutter)] pb-4 mask-fade-x" data-cursor="drag">
          {docs.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setOpen(i);
                track("doc_open", { id: d.id });
              }}
              className="group snap-start shrink-0 w-[68vw] sm:w-[320px] text-left"
              aria-label={`${t.trust.open}: ${L(d.title)}`}
            >
              <div className="relative rounded-[18px] overflow-hidden plate aspect-[3/4]">
                <Image src={d.image} alt={L(d.title)} fill sizes="(min-width:640px) 320px, 68vw" className="object-cover object-top transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-4 left-4 btn btn-sm btn-gold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">{t.trust.open}</span>
              </div>
              <p className="mt-4 font-display text-xl text-ivory leading-tight">{L(d.title)}</p>
              <p className="mt-1 text-xs text-ivory/50 leading-snug">{L(d.meta)}</p>
            </button>
          ))}
          <div className="shrink-0 w-2" />
        </div>
      </div>

      {/* Representative + international */}
      <div className="container-x mt-16 grid lg:grid-cols-2 gap-5">
        <Reveal kind="mask">
          <div className="surface rounded-[24px] p-7 md:p-9 h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_0%,rgba(201,162,74,0.12),transparent)]" />
            <p className="eyebrow mb-3 relative">{t.trust.represent.title}</p>
            <p className="text-ivory/75 relative max-w-lg">{t.trust.represent.text}</p>
            <div className="mt-7 flex flex-wrap gap-3 relative">
              <a href={site.instagram} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">
                <InstagramIcon className="w-4 h-4" /> {site.instagramHandle} · {site.instagramFollowers}
              </a>
              <a href={telegramLink(t.tg.general)} target="_blank" rel="noopener" onClick={() => track("cta_click", { id: "trust_telegram" })} className="btn btn-gold btn-sm">
                <TelegramIcon className="w-4 h-4" /> {site.telegramHandle}
              </a>
            </div>
            <p className="mt-5 text-xs text-ivory/45 relative">{site.representative[lang]}</p>
          </div>
        </Reveal>
        <Reveal kind="mask" delay={0.1}>
          <div className="relative rounded-[24px] overflow-hidden h-full min-h-[260px]">
            <Image src="/images/brand/bases.webp" alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/20" />
            <div className="absolute inset-0 p-7 md:p-9 flex flex-col justify-end">
              <p className="eyebrow mb-3">{t.trust.international.title}</p>
              <p className="text-ivory/80 max-w-md text-sm md:text-base">{t.trust.international.text}</p>
            </div>
          </div>
        </Reveal>
      </div>

      <Modal open={open !== null} onClose={() => setOpen(null)} size="lg" label={doc ? L(doc.title) : undefined}>
        {doc && (
          <div className="grid md:grid-cols-12">
            <div className="md:col-span-8 bg-ivory p-3 md:p-6">
              <div className="relative w-full" style={{ aspectRatio: String(doc.aspect) }}>
                <Image src={doc.image} alt={L(doc.title)} fill sizes="(min-width:768px) 60vw, 100vw" className="object-contain" priority />
              </div>
            </div>
            <div className="md:col-span-4 p-7 md:p-9 flex flex-col">
              <p className="eyebrow mb-3">{t.trust.docsTitle}</p>
              <h3 className="font-display text-3xl text-ivory">{L(doc.title)}</h3>
              <p className="mt-4 text-sm text-ivory/65">{L(doc.meta)}</p>
              <div className="mt-auto pt-8 flex gap-2">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen((open! + docs.length - 1) % docs.length)}>
                  ← {t.common.prev}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen((open! + 1) % docs.length)}>
                  {t.common.next} →
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
