"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { localePath } from "@/i18n/config";
import { LangSwitch } from "./LangSwitch";
import { site, telegramLink, whatsappLink } from "@/content/site";
import { cn, scrollToId } from "@/lib/utils";
import { useUI } from "./UIProvider";
import { track } from "@/lib/analytics";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/ui/Icons";

const links = [
  { id: "products", key: "products" },
  { id: "story", key: "about" },
  { id: "trust", key: "quality" },
  { id: "partnership", key: "partnership" },
  { id: "contact", key: "contacts" },
] as const;

export function Header() {
  const { t, lang } = useLang();
  const { openLead } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 500 && y > last + 4 && !open);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    window.__lenis?.[open ? "stop" : "start"]();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    track("nav_click", { id });
    setTimeout(() => scrollToId(id), open ? 250 : 0);
  };

  const wa = whatsappLink();

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] btn btn-gold btn-sm">
        {t.a11y.skip}
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[70] transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)]",
          hidden ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-4 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)]",
            scrolled
              ? "mt-3 max-w-[1180px] w-[calc(100%-1.5rem)] rounded-full glass px-3 py-2 md:px-5"
              : "max-w-[1520px] w-full px-[var(--gutter)] py-5",
          )}
        >
          <Link href={localePath(lang)} className="flex items-center gap-3 group" aria-label="JIMON GROUP">
            <Image
              src="/images/brand/logo-96.png"
              alt=""
              width={40}
              height={40}
              priority
              className={cn("rounded-[9px] transition-all duration-500", scrolled ? "w-8 h-8" : "w-10 h-10")}
            />
            <span className="leading-none">
              <span className="block font-display text-[1.15rem] tracking-[0.16em] text-ivory whitespace-nowrap">JIMON GROUP</span>
              <span className="block text-[0.6rem] tracking-[0.3em] text-gold/90 mt-0.5">{t.common.cn} · UZBEKISTAN</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main">
            {links.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => go(l.id)}
                className="relative whitespace-nowrap text-[0.86rem] font-medium text-ivory/75 hover:text-ivory transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full"
              >
                {t.nav[l.key]}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href={telegramLink(t.tg.general)}
              target="_blank"
              rel="noopener"
              aria-label="Telegram"
              onClick={() => track("cta_click", { id: "header_telegram" })}
              className="hidden sm:inline-flex w-9 h-9 items-center justify-center rounded-full border border-ivory/15 text-ivory/80 hover:text-ivory hover:border-gold/60 transition-colors"
            >
              <TelegramIcon className="w-4 h-4" />
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              onClick={() => track("cta_click", { id: "header_instagram" })}
              className="hidden sm:inline-flex w-9 h-9 items-center justify-center rounded-full border border-ivory/15 text-ivory/80 hover:text-ivory hover:border-gold/60 transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener"
                aria-label="WhatsApp"
                onClick={() => track("cta_click", { id: "header_whatsapp" })}
                className="hidden sm:inline-flex w-9 h-9 items-center justify-center rounded-full border border-ivory/15 text-ivory/80 hover:text-ivory hover:border-gold/60 transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            )}
            <LangSwitch className="hidden sm:inline-grid" />
            <button
              type="button"
              onClick={() => {
                track("cta_click", { id: "header_consult" });
                openLead("buyer");
              }}
              className="btn btn-gold btn-sm hidden md:inline-flex"
            >
              {t.nav.cta}
            </button>
            <button
              type="button"
              aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden relative w-10 h-10 rounded-full border border-ivory/15 flex flex-col items-center justify-center gap-[5px]"
            >
              <span className={cn("block h-px w-4 bg-ivory transition-transform duration-300", open && "translate-y-[3px] rotate-45")} />
              <span className={cn("block h-px w-4 bg-ivory transition-transform duration-300", open && "-translate-y-[3px] -rotate-45")} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[65] lg:hidden transition-opacity duration-400",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-ink/85 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <div
          className={cn(
            "absolute inset-x-3 bottom-3 top-[84px] rounded-[28px] surface p-6 flex flex-col transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)]",
            open ? "translate-y-0" : "translate-y-8",
          )}
        >
          <nav className="flex flex-col gap-1 mt-2" aria-label="Mobile">
            {links.map((l, i) => (
              <button
                key={l.id}
                type="button"
                onClick={() => go(l.id)}
                className="flex items-center justify-between py-4 border-b hairline text-left font-display text-[2rem] leading-none text-ivory"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {t.nav[l.key]}
                <span className="text-gold text-base font-sans">0{i + 1}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <LangSwitch />
              <div className="flex gap-2">
                <a href={telegramLink(t.tg.general)} target="_blank" rel="noopener" className="btn btn-ghost btn-sm" aria-label="Telegram">
                  <TelegramIcon className="w-4 h-4" /> Telegram
                </a>
                <a href={site.instagram} target="_blank" rel="noopener" className="btn btn-ghost btn-sm" aria-label="Instagram">
                  <InstagramIcon className="w-4 h-4" />
                </a>
                {wa && (
                  <a href={wa} target="_blank" rel="noopener" className="btn btn-ghost btn-sm" aria-label="WhatsApp">
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-gold w-full"
              onClick={() => {
                setOpen(false);
                openLead("buyer");
              }}
            >
              {t.common.consult}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
