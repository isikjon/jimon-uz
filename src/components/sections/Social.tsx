"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { site, telegramLink } from "@/content/site";
import { DownloadIcon, InstagramIcon, PlayIcon, TelegramIcon } from "@/components/ui/Icons";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

function ReelVideo({ title, sub }: { title: string; sub: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
          v.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <div className="relative rounded-[24px] overflow-hidden aspect-[9/16] surface group" data-cursor="hover">
      <video
        ref={ref}
        src="/video/brand-reel.mp4"
        poster="/video/brand-reel-poster.webp"
        muted={muted}
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover"
        aria-label={title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/20 pointer-events-none" />
      <button
        type="button"
        onClick={() => {
          const v = ref.current;
          if (!v) return;
          if (!playing) v.play().then(() => setPlaying(true));
          setMuted((m) => !m);
          track("reel_toggle_sound", { muted: !muted });
        }}
        className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-ivory/90"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <span className="text-xs">🔇</span> : <span className="text-xs">🔊</span>}
      </button>
      {!playing && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-16 h-16 rounded-full glass flex items-center justify-center text-ivory">
            <PlayIcon className="w-6 h-6 translate-x-0.5" />
          </span>
        </span>
      )}
      <div className="absolute left-5 right-5 bottom-5">
        <p className="font-display text-2xl text-ivory">{title}</p>
        <p className="text-xs text-ivory/60 mt-1">{sub}</p>
      </div>
    </div>
  );
}

export function Social() {
  const { t } = useLang();
  const c = t.social.cards;
  return (
    <section id="social" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container-x">
        <SectionHeading eyebrow={t.social.eyebrow} title={t.social.title} lead={t.social.lead} />
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
          <Reveal kind="clip" className="row-span-2 col-span-1">
            <ReelVideo title={c.video} sub={c.videoSub} />
          </Reveal>

          <Reveal kind="scale" delay={0.05} className="col-span-1 lg:col-span-2">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener"
              onClick={() => track("cta_click", { id: "social_instagram" })}
              className="group relative block rounded-[24px] overflow-hidden surface h-full min-h-[240px]"
            >
              <Image src="/images/brand/people.webp" alt="" fill sizes="(min-width:1024px) 50vw, 50vw" className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-[1.4s] [transition-timing-function:var(--ease-out-expo)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow mb-2">{c.instagramSub}</p>
                  <p className="font-display text-2xl md:text-3xl text-ivory">{c.instagram}</p>
                  <p className="text-sm text-ivory/60 mt-1">{site.instagramFollowers} {t.trust.represent.followers}</p>
                </div>
                <span className="w-12 h-12 rounded-full glass flex items-center justify-center text-ivory group-hover:bg-gold group-hover:text-ink transition-colors">
                  <InstagramIcon />
                </span>
              </div>
            </a>
          </Reveal>

          <Reveal kind="up" delay={0.1} className="col-span-1">
            <a
              href={site.catalogPdf}
              target="_blank"
              rel="noopener"
              download
              onClick={() => track("catalog_download", { from: "social" })}
              className={cn("group relative block rounded-[24px] overflow-hidden h-full min-h-[240px] plate")}
            >
              <Image src="/images/brand/catalog-cover.webp" alt="" fill sizes="25vw" className="object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-[1.4s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
                <div>
                  <p className="font-display text-2xl text-ivory">{c.catalog}</p>
                  <p className="text-xs text-ivory/70 mt-1">{c.catalogSub}</p>
                </div>
                <span className="w-10 h-10 rounded-full glass flex items-center justify-center text-ivory">
                  <DownloadIcon />
                </span>
              </div>
            </a>
          </Reveal>

          <Reveal kind="up" delay={0.15} className="col-span-2 lg:col-span-3">
            <a
              href={telegramLink(t.tg.general)}
              target="_blank"
              rel="noopener"
              onClick={() => track("cta_click", { id: "social_telegram" })}
              className="group relative flex items-center justify-between gap-6 rounded-[24px] surface p-6 md:p-8 h-full min-h-[160px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(50%_120%_at_100%_50%,rgba(99,199,155,0.16),transparent)]" />
              <div className="relative">
                <p className="eyebrow mb-2">{c.telegramSub}</p>
                <p className="font-display text-2xl md:text-3xl text-ivory">{c.telegram}</p>
                <p className="text-sm text-ivory/60 mt-2">{site.telegramHandle} · {site.telegram.replace("https://", "")}</p>
              </div>
              <span className="relative w-14 h-14 rounded-full bg-gold text-ink flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <TelegramIcon className="w-6 h-6" />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
