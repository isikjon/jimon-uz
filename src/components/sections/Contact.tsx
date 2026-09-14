"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BuyerForm } from "@/components/forms/BuyerForm";
import { site, telegramLink, whatsappLink } from "@/content/site";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { track } from "@/lib/analytics";

export function Contact() {
  const { t, lang } = useLang();
  const wa = whatsappLink();
  const items = [
    { k: "telegram", label: t.contacts.telegram, value: `${site.telegramHandle} · ${site.telegram.replace("https://", "")}`, href: telegramLink(t.tg.general), icon: <TelegramIcon /> },
    wa ? { k: "whatsapp", label: t.contacts.whatsapp, value: site.whatsapp, href: wa, icon: <WhatsAppIcon /> } : null,
    { k: "instagram", label: t.contacts.instagram, value: site.instagramHandle, href: site.instagram, icon: <InstagramIcon /> },
    site.phone ? { k: "phone", label: t.contacts.phone, value: site.phone, href: `tel:${site.phone.replace(/[^\d+]/g, "")}`, icon: null } : null,
  ].filter(Boolean) as { k: string; label: string; value: string; href: string; icon: React.ReactNode }[];

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={t.contacts.eyebrow} title={t.contacts.title} lead={t.contacts.lead} />
          <ul className="mt-10 flex flex-col divide-y hairline border-y hairline">
            {items.map((it, i) => (
              <Reveal key={it.k} delay={i * 0.06} kind="fade">
                <li>
                  <a
                    href={it.href}
                    target={it.k === "phone" ? undefined : "_blank"}
                    rel="noopener"
                    onClick={() => track("cta_click", { id: `contact_${it.k}` })}
                    className="group flex items-center justify-between gap-4 py-5"
                  >
                    <span className="flex items-center gap-4">
                      <span className="w-11 h-11 rounded-full border border-ivory/15 flex items-center justify-center text-ivory/80 group-hover:border-gold/60 group-hover:text-gold-300 transition-colors">
                        {it.icon ?? <span className="text-sm">☎</span>}
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-[0.2em] text-ivory/45">{it.label}</span>
                        <span className="block text-ivory group-hover:text-gold-300 transition-colors">{it.value}</span>
                      </span>
                    </span>
                    <span className="text-ivory/40 group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </li>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ivory/50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-jade-300 pulse-dot" /> {t.contacts.hours} · {site.representative[lang]}
          </p>
        </div>
        <div className="lg:col-span-7">
          <Reveal kind="scale">
            <div className="surface rounded-[28px] p-6 md:p-10">
              <h3 className="font-display text-3xl md:text-4xl text-ivory">{t.forms.buyer.title}</h3>
              <p className="muted mt-2 mb-8">{t.forms.buyer.lead}</p>
              <BuyerForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
