"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useLang, useL } from "@/i18n/LanguageProvider";
import { categories, products, type CategoryId, type Product } from "@/content/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Modal } from "@/components/ui/Modal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useUI } from "@/components/layout/UIProvider";
import { site, telegramLink } from "@/content/site";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { isTouch, prefersReducedMotion } from "@/lib/device";
import { ArrowIcon, DownloadIcon, TelegramIcon } from "@/components/ui/Icons";

const cutout = (p: Product) => p.image.replace("/products/", "/products/cut/");

/** Hero visual: product cut-out floating over a jade/gold glow with pointer tilt. */
function Stage({ product, dir }: { product: Product; dir: 1 | -1 }) {
  const box = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState(cutout(product));
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    setSrc(cutout(product));
    setFallback(false);
  }, [product]);

  const onMove = (e: React.PointerEvent) => {
    if (isTouch() || prefersReducedMotion() || !box.current) return;
    const r = box.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    box.current.style.transform = `perspective(1200px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateZ(0)`;
  };
  const onLeave = () => box.current && (box.current.style.transform = "");

  return (
    <div className="relative aspect-[4/3] md:aspect-[5/4] lg:aspect-[4/3]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(99,199,155,0.28),rgba(30,92,70,0.12)_45%,transparent_70%)] blur-2xl" />
      <div className="absolute inset-[20%] rounded-full bg-[radial-gradient(closest-side,rgba(228,200,118,0.22),transparent_70%)] blur-3xl" />
      <div key={product.id} ref={box} className="absolute inset-0 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] will-change-transform">
        <div className={cn("absolute inset-0 animate-[stageIn_.9s_var(--ease-out-expo)]", fallback && "plate rounded-[28px] overflow-hidden")} style={{ ["--dir" as string]: dir }}>
          <Image
            src={fallback ? product.image : src}
            alt={product.name.ru}
            fill
            sizes="(min-width:1024px) 48vw, 100vw"
            className={cn("object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]", fallback ? "object-cover" : "p-2 md:p-6")}
            priority={false}
            onError={() => setFallback(true)}
          />
        </div>
      </div>
      <style>{`@keyframes stageIn{from{opacity:0;transform:translateX(calc(var(--dir)*60px)) scale(.94)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

export function Products() {
  const { t, lang } = useLang();
  const L = useL();
  const { openLead } = useUI();
  const [cat, setCat] = useState<CategoryId>("complex");
  const list = useMemo(() => products.filter((p) => p.category === cat), [cat]);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [detail, setDetail] = useState<Product | null>(null);
  const [page, setPage] = useState<number | null>(null);
  const product = list[Math.min(idx, list.length - 1)];
  const stripRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (n: number) => {
      setDir(n > idx ? 1 : -1);
      setIdx(((n % list.length) + list.length) % list.length);
    },
    [idx, list.length],
  );

  const selectCategory = (c: CategoryId) => {
    setCat(c);
    setIdx(0);
    setDir(1);
    track("product_category", { category: c });
  };

  // external selection (e.g. from the elements section)
  useEffect(() => {
    const h = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const p = products.find((x) => x.id === id);
      if (!p) return;
      setCat(p.category);
      const i = products.filter((x) => x.category === p.category).findIndex((x) => x.id === id);
      setIdx(Math.max(0, i));
    };
    window.addEventListener("jimon:select-product", h);
    return () => window.removeEventListener("jimon:select-product", h);
  }, []);

  useEffect(() => {
    if (product) track("product_view", { id: product.id });
    // keep the active thumb visible
    const strip = stripRef.current;
    const el = strip?.querySelector<HTMLElement>(`[data-thumb="${product?.id}"]`);
    if (strip && el) strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [product]);

  // touch swipe on the stage
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY });
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) go(idx + (dx < 0 ? 1 : -1));
    touch.current = null;
  };

  if (!product) return null;

  return (
    <section id="products" className="relative py-24 md:py-36">
      <div className="container-x">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <SectionHeading eyebrow={t.products.eyebrow} title={t.products.title} lead={t.products.lead} />
          <Reveal delay={0.2}>
            <a href={site.catalogPdf} target="_blank" rel="noopener" download onClick={() => track("catalog_download", { from: "products" })} className="btn btn-ghost">
              <DownloadIcon /> {t.common.catalog} <span className="text-ivory/45 text-xs">{t.common.catalogPdf}</span>
            </a>
          </Reveal>
        </div>

        {/* Category nav */}
        <div className="mt-12 md:mt-16 flex gap-2 overflow-x-auto no-scrollbar -mx-[var(--gutter)] px-[var(--gutter)] pb-1" role="tablist" aria-label={t.products.categoryOf}>
          {categories.map((c) => {
            const n = products.filter((p) => p.category === c.id).length;
            const on = c.id === cat;
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={on}
                onClick={() => selectCategory(c.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-2 h-11 px-5 rounded-full border text-sm transition-all duration-300",
                  on ? "border-gold bg-gold text-ink font-semibold" : "border-ivory/15 text-ivory/70 hover:border-ivory/40 hover:text-ivory",
                )}
              >
                {L(c.name)}
                <span className={cn("text-[0.7rem] tabular-nums", on ? "text-ink/60" : "text-ivory/40")}>{n}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-ivory/50">{L(categories.find((c) => c.id === cat)!.lead)}</p>

        {/* Explorer */}
        <div className="mt-8 md:mt-12 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 order-1" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <Stage product={product} dir={dir} />
            <div className="mt-2 flex items-center justify-between text-xs text-ivory/45">
              <span className="lg:hidden">{t.products.swipeHint}</span>
              <span className="ml-auto tabular-nums">
                {String(idx + 1).padStart(2, "0")} {t.products.counter} {String(list.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 order-2" id={`product-${product.id}`}>
            <div key={product.id} className="lang-swap">
              <p className="eyebrow mb-3">{L(product.tagline)}</p>
              <h3 className="font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.02] text-ivory">{L(product.name)}</h3>
              {(product.cn || product.latin) && (
                <p className="mt-2 text-sm text-ivory/45">
                  {[product.cn, product.latin].filter(Boolean).join(" · ")}
                </p>
              )}
              <p className="mt-6 text-ivory/78 leading-relaxed max-w-xl">{L(product.short)}</p>

              <div className="mt-7 grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ivory/45 mb-3">{t.products.purpose}</p>
                  <ul className="space-y-2">
                    {L(product.purpose).slice(0, 4).map((x) => (
                      <li key={x} className="flex gap-2.5 text-sm text-ivory/80">
                        <span className="mt-2 w-1 h-1 rounded-full bg-gold shrink-0" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ivory/45 mb-3">{t.products.components}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {L(product.components).map((c) => (
                      <span key={c.name} className="chip text-[0.75rem]">
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <dl className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm border-t hairline pt-5">
                <div>
                  <dt className="text-ivory/40 text-xs">{t.products.form}</dt>
                  <dd className="text-ivory/85">{L(product.form)}</dd>
                </div>
                <div>
                  <dt className="text-ivory/40 text-xs">{t.products.volume}</dt>
                  <dd className="text-ivory/85">{product.volume}</dd>
                </div>
                {product.count && (
                  <div>
                    <dt className="text-ivory/40 text-xs">{t.products.count}</dt>
                    <dd className="text-ivory/85">{L(product.count)}</dd>
                  </div>
                )}
                {product.course && (
                  <div>
                    <dt className="text-ivory/40 text-xs">{t.products.course}</dt>
                    <dd className="text-ivory/85">{L(product.course)}</dd>
                  </div>
                )}
                {product.insured && (
                  <div>
                    <dt className="text-ivory/40 text-xs">PICC</dt>
                    <dd className="text-jade-300">{t.products.insured}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <MagneticButton
                  className="btn-gold sheen"
                  onClick={() => {
                    track("cta_click", { id: "product_consult", product: product.id });
                    openLead("buyer", { product: product.name[lang] });
                  }}
                >
                  {t.products.consultAbout} <ArrowIcon />
                </MagneticButton>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setDetail(product);
                    track("product_detail", { id: product.id });
                  }}
                >
                  {t.products.detail}
                </button>
              </div>
              <a
                href={telegramLink(t.tg.product.replace("{product}", product.name[lang]))}
                target="_blank"
                rel="noopener"
                onClick={() => track("cta_click", { id: "product_telegram", product: product.id })}
                className="mt-4 inline-flex items-center gap-2 text-sm text-ivory/60 hover:text-gold-300 transition-colors"
              >
                <TelegramIcon className="w-4 h-4" /> {t.common.writeTelegram} · {site.telegramHandle}
              </a>
            </div>

            {/* prev / next */}
            <div className="mt-8 flex items-center gap-3">
              <button type="button" onClick={() => go(idx - 1)} aria-label={t.a11y.prevProduct} className="w-12 h-12 rounded-full border border-ivory/15 flex items-center justify-center hover:border-gold/60 transition-colors">
                <ArrowIcon className="w-4 h-4 rotate-180" />
              </button>
              <button type="button" onClick={() => go(idx + 1)} aria-label={t.a11y.nextProduct} className="w-12 h-12 rounded-full border border-ivory/15 flex items-center justify-center hover:border-gold/60 transition-colors">
                <ArrowIcon className="w-4 h-4" />
              </button>
              <div className="ml-2 flex gap-1.5">
                {list.map((p, i) => (
                  <span key={p.id} className={cn("h-1 rounded-full transition-all duration-500", i === idx ? "w-8 bg-gold" : "w-2 bg-ivory/20")} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails strip */}
        <div ref={stripRef} className="mt-10 flex gap-3 overflow-x-auto no-scrollbar snap-x -mx-[var(--gutter)] px-[var(--gutter)] pb-2" data-cursor="drag">
          {list.map((p, i) => (
            <button
              key={p.id}
              data-thumb={p.id}
              type="button"
              onClick={() => go(i)}
              aria-label={L(p.name)}
              aria-current={i === idx}
              className={cn(
                "group snap-start shrink-0 w-[150px] sm:w-[180px] text-left rounded-[16px] overflow-hidden border transition-all duration-300",
                i === idx ? "border-gold/70" : "border-ivory/10 hover:border-ivory/30",
              )}
            >
              <div className="relative aspect-[4/3] plate">
                <Image src={p.image.replace(".webp", "-thumb.webp")} alt="" fill sizes="180px" className="object-cover" />
              </div>
              <div className="p-3 bg-char/80">
                <p className="text-xs text-ivory/85 leading-snug line-clamp-2">{L(p.name)}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-8 text-xs text-ivory/40 max-w-2xl">{t.products.disclaimer}</p>
      </div>

      {/* Detail overlay */}
      <Modal open={!!detail} onClose={() => setDetail(null)} size="xl" label={detail ? L(detail.name) : undefined}>
        {detail && (
          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-5 relative bg-gradient-to-b from-char-2 to-ink p-6 md:p-10 flex flex-col">
              <div className="relative aspect-square">
                <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgba(99,199,155,0.25),transparent_70%)] blur-2xl" />
                <Image src={cutout(detail)} alt={L(detail.name)} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-contain p-4" onError={(e) => ((e.currentTarget as HTMLImageElement).src = detail.image)} />
              </div>
              <button type="button" onClick={() => setPage(detail.catalogPage)} className="mt-4 group flex items-center gap-4 text-left surface rounded-[16px] p-3 hover:border-gold/50 transition-colors">
                <span className="relative w-14 h-[74px] rounded-[8px] overflow-hidden shrink-0 bg-ivory">
                  <Image src={`/images/catalog/p-${String(detail.catalogPage).padStart(2, "0")}.webp`} alt="" fill sizes="56px" className="object-cover object-top" />
                </span>
                <span>
                  <span className="block text-xs text-ivory/45 uppercase tracking-[0.2em]">{t.products.catalogPage}</span>
                  <span className="block text-ivory/85 text-sm">
                    {String(detail.catalogPage).padStart(2, "0")} / 20 · {t.common.open}
                  </span>
                </span>
              </button>
            </div>
            <div className="lg:col-span-7 p-6 md:p-10">
              <p className="eyebrow mb-3">{L(detail.tagline)}</p>
              <h3 className="font-display text-3xl md:text-4xl text-ivory pr-10">{L(detail.name)}</h3>
              {(detail.cn || detail.latin) && <p className="mt-2 text-sm text-ivory/45">{[detail.cn, detail.latin].filter(Boolean).join(" · ")}</p>}
              <p className="mt-5 text-ivory/80 leading-relaxed">{L(detail.short)}</p>

              <div className="mt-7 grid md:grid-cols-2 gap-7">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ivory/45 mb-3">{t.products.purpose}</p>
                  <ul className="space-y-2">
                    {L(detail.purpose).map((x) => (
                      <li key={x} className="flex gap-2.5 text-sm text-ivory/80">
                        <span className="mt-2 w-1 h-1 rounded-full bg-gold shrink-0" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ivory/45 mb-3">{t.products.specs}</p>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4 border-b hairline pb-2"><dt className="text-ivory/45">{t.products.form}</dt><dd className="text-ivory/85 text-right">{L(detail.form)}</dd></div>
                    <div className="flex justify-between gap-4 border-b hairline pb-2"><dt className="text-ivory/45">{t.products.volume}</dt><dd className="text-ivory/85 text-right">{detail.volume}</dd></div>
                    {detail.count && <div className="flex justify-between gap-4 border-b hairline pb-2"><dt className="text-ivory/45">{t.products.count}</dt><dd className="text-ivory/85 text-right">{L(detail.count)}</dd></div>}
                    {detail.course && <div className="flex justify-between gap-4 border-b hairline pb-2"><dt className="text-ivory/45">{t.products.course}</dt><dd className="text-ivory/85 text-right">{L(detail.course)}</dd></div>}
                    {detail.standard && <div className="flex justify-between gap-4 border-b hairline pb-2"><dt className="text-ivory/45">{t.products.standard}</dt><dd className="text-ivory/85 text-right">{detail.standard}</dd></div>}
                    {detail.insured && <div className="flex justify-between gap-4 border-b hairline pb-2"><dt className="text-ivory/45">PICC</dt><dd className="text-jade-300 text-right">{t.products.insured}</dd></div>}
                  </dl>
                </div>
              </div>

              <div className="mt-7">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ivory/45 mb-3">{t.products.components}</p>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {L(detail.components).map((c) => (
                    <li key={c.name} className="text-sm">
                      <span className="text-ivory font-medium">{c.name}</span>
                      <span className="text-ivory/60"> — {c.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 surface rounded-[16px] p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ivory/45 mb-2">{t.products.usage}</p>
                <p className="text-sm text-ivory/85">{L(detail.usage)}</p>
                {detail.caution && (
                  <p className="mt-3 text-xs text-gold-300/90">
                    {t.products.cautionLabel}: {L(detail.caution)}
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn btn-gold sheen"
                  onClick={() => {
                    setDetail(null);
                    openLead("buyer", { product: detail.name[lang] });
                  }}
                >
                  {t.products.consultAbout} <ArrowIcon />
                </button>
                <a
                  href={telegramLink(t.tg.product.replace("{product}", detail.name[lang]))}
                  target="_blank"
                  rel="noopener"
                  onClick={() => track("cta_click", { id: "product_detail_telegram", product: detail.id })}
                  className="btn btn-ghost"
                >
                  <TelegramIcon className="w-4 h-4" /> {t.common.writeTelegram}
                </a>
                <a href={site.catalogPdf} target="_blank" rel="noopener" download className="btn btn-ghost">
                  <DownloadIcon /> {t.common.catalog}
                </a>
              </div>
              <p className="mt-6 text-xs text-ivory/40">{t.products.disclaimer}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Catalog page viewer */}
      <Modal open={page !== null} onClose={() => setPage(null)} size="lg" label={t.products.catalogPage}>
        {page !== null && (
          <div className="bg-ivory p-2 md:p-4">
            <div className="relative w-full" style={{ aspectRatio: "1055 / 1491" }}>
              <Image src={`/images/catalog/p-${String(page).padStart(2, "0")}.webp`} alt={`${t.products.catalogPage} ${page}`} fill sizes="(min-width:768px) 900px, 100vw" className="object-contain" priority />
            </div>
            <div className="flex items-center justify-between p-3 text-ink text-sm">
              <button type="button" className="btn btn-sm btn-jade" onClick={() => setPage(Math.max(1, page - 1))}>← {t.common.prev}</button>
              <span className="tabular-nums">{page} / 20</span>
              <button type="button" className="btn btn-sm btn-jade" onClick={() => setPage(Math.min(20, page + 1))}>{t.common.next} →</button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
