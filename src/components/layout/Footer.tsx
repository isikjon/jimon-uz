"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { localePath } from "@/i18n/config";
import { site, telegramLink, whatsappLink } from "@/content/site";
import { LangSwitch } from "./LangSwitch";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { scrollToId } from "@/lib/utils";

export function Footer() {
  const { t, lang } = useLang();
  const wa = whatsappLink();
  const nav = [
    { id: "products", label: t.nav.products },
    { id: "story", label: t.nav.about },
    { id: "trust", label: t.nav.quality },
    { id: "partnership", label: t.nav.partnership },
    { id: "contact", label: t.nav.contacts },
  ];
  return (
    <footer className="relative z-[1] bg-ink border-t hairline">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-5">
            <div className="flex items-center gap-3">
              <Image src="/images/brand/logo-96.png" alt="JIMON GROUP" width={44} height={44} className="rounded-[10px]" />
              <div className="leading-none">
                <div className="font-display text-xl tracking-[0.16em]">JIMON GROUP</div>
                <div className="text-[0.62rem] tracking-[0.3em] text-gold mt-1">{t.common.cn} · UZBEKISTAN</div>
              </div>
            </div>
            <p className="font-display text-2xl mt-8 text-ivory/90">{t.footer.tagline}</p>
            <p className="muted text-sm mt-4 max-w-md">{t.footer.representative}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={telegramLink(t.tg.general)} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">
                <TelegramIcon className="w-4 h-4" /> {site.telegramHandle}
              </a>
              {wa && (
                <a href={wa} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">
                  <WhatsAppIcon className="w-4 h-4" /> WhatsApp
                </a>
              )}
              <a href={site.instagram} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">
                <InstagramIcon className="w-4 h-4" /> Instagram
              </a>
            </div>
          </div>
          <div className="lg:col-span-2 lg:col-start-7">
            <div className="eyebrow mb-5">{t.footer.nav}</div>
            <ul className="space-y-3">
              {nav.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => scrollToId(n.id)} className="text-ivory/75 hover:text-ivory transition-colors">
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <div className="eyebrow mb-5">{t.footer.contacts}</div>
            <ul className="space-y-3 text-ivory/75">
              <li>
                <a href={telegramLink(t.tg.general)} target="_blank" rel="noopener" className="hover:text-ivory transition-colors">
                  Telegram {site.telegramHandle}
                </a>
              </li>
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener" className="hover:text-ivory transition-colors">
                    WhatsApp
                  </a>
                </li>
              )}
              <li>
                <a href={site.instagram} target="_blank" rel="noopener" className="hover:text-ivory transition-colors">
                  {site.instagramHandle}
                </a>
              </li>
              {site.phone && (
                <li>
                  <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="hover:text-ivory transition-colors">
                    {site.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="lg:col-span-2 sm:col-span-2 lg:col-start-11">
            <div className="eyebrow mb-5">{t.footer.legal}</div>
            <ul className="space-y-3 text-ivory/75 [overflow-wrap:anywhere]">
              <li>
                <Link href={localePath(lang, "/privacy")} className="hover:text-ivory transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <a href={site.officialSite} target="_blank" rel="noopener" className="hover:text-ivory transition-colors">
                  {t.footer.official}
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <div className="eyebrow mb-3">{t.footer.lang}</div>
              <LangSwitch />
            </div>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t hairline flex flex-col md:flex-row gap-4 md:items-center justify-between text-xs text-ivory/45">
          <p className="max-w-2xl">{t.footer.disclaimer}</p>
          <p>
            © {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
