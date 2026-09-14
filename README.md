# JIMON GROUP Uzbekistan — bilingual landing (RU / O‘Z)

Premium storytelling landing for the official JIMON GROUP (金木集团) representative in Uzbekistan.
Next.js 15 · React 19 · TypeScript · Tailwind v4 · GSAP ScrollTrigger · Lenis · React Three Fiber (WebGL particle scene).

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in contacts / lead delivery
npm run dev                  # http://localhost:3000  (RU)  ·  http://localhost:3000/uz  (O‘Z)
npm run build && npm start   # production
```

## Where things live

| Area | Path |
| --- | --- |
| Site config (contacts, links, catalog PDF) | `src/content/site.ts` |
| Products (16 items, RU/UZ) | `src/content/products.ts` |
| UI copy & all section texts (RU / UZ) | `src/content/dictionary/ru.ts`, `uz.ts` |
| Five elements scene content | `src/content/elements.ts` |
| Certificates & documents | `src/content/certificates.ts` |
| Sections | `src/components/sections/*` |
| 3D scene (particles, shapes, shaders) | `src/components/three/*` |
| Scroll ↔ scene bridge | `src/lib/scene-state.ts`, `src/components/three/Scene.tsx` |
| Forms + validation | `src/components/forms/*`, `src/lib/leads/schema.ts` |
| Lead delivery (Telegram bot / webhook / log) | `src/lib/leads/server.ts`, `src/app/api/lead/route.ts` |
| SEO (metadata, hreflang, JSON-LD, sitemap, robots) | `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts` |
| Static assets (optimized) | `public/images`, `public/video`, `public/catalog` |
| Asset pipeline (from `_source`) | `scripts/build-assets.mjs`, `scripts/build-cutouts.mjs` |
| QA screenshots (headless Chrome) | `scripts/shots.mjs` |

Routing: RU is served at `/`, Uzbek at `/uz` (rewrites/redirects in `next.config.ts`). The language switch is instant
(no reload) and updates the URL via `history.replaceState`; both versions are fully server-rendered for SEO with `hreflang`.

## Lead delivery

`POST /api/lead` validates with zod, drops honeypot hits, rate-limits per IP, then runs every enabled adapter:

- **Telegram**: set `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` (create a bot via @BotFather, add it to a group, use the group chat id).
- **Webhook / CRM**: set `LEADS_WEBHOOK_URL` (receives `{ lead, meta }` JSON).
- **Log**: always on (server console).

Analytics: `src/lib/analytics.ts` pushes events to `dataLayer`, `gtag` and Yandex.Metrica if they are present on the page.
Events: `lead_submit_*`, `lead_modal_open`, `cta_click`, `product_view`, `product_detail`, `catalog_download`, `language_switch`, `element_select`, `doc_open`, `faq_open`, `nav_click`.

## Items that require confirmation from the client (TODO(confirm))

- WhatsApp is intentionally disabled (client decision, Sept 2026): only Telegram (@Gulytok) and the phone +998 99 992 11 55 are shown.
- Final production domain → `NEXT_PUBLIC_SITE_URL` (used for canonical / OG / sitemap).
- Delivery terms (FAQ answer intentionally says terms are confirmed by the representative).
- Partner program details are described only as far as the 2026 catalog and the official KZ site state them; no income figures are shown.

## Content sources (verified)

- JIMON product catalog 2026 for Uzbekistan (PDF, `public/catalog`).
- Official group site jimontorangy.com (history, numbers, honors, president, imagery).
- Official Kazakhstan site jimongroup.kz (certificates, documents, product photography).
- Instagram @jimon_group_uz (representative, Telegram contact).

Product texts do not make medical claims; a disclaimer is shown in the products section and the footer.

## Performance notes

- WebGL particle count adapts to device tier (`src/lib/device.ts`); the canvas pauses when hidden / off-scene.
- `prefers-reduced-motion` → static backdrop, no pinning, no reveals.
- Images are WebP with responsive `sizes`; the reel video is `preload="none"` and plays only in view.

## QA performed (Sept 2026)

- Production build passes (`next build`): page bundle 35 kB, first load 224 kB; the WebGL scene is a lazy chunk.
- Headless-Chrome screenshot sweep at 390×844 (mobile), 820×1180 (tablet), 1366×768, 1440×900, 1920×1080 for RU and UZ:
  no horizontal overflow, no console errors, all sections render; pinned scenes (hero, timeline, production) verified.
- `POST /api/lead` validated (valid → 200, invalid → 422); honeypot and rate limit in place.
- Language switch verified: instant, URL → `/uz`, `<html lang>` and title update, layout stable.
- Re-run the sweep any time: `node scripts/shots.mjs 1440x900` (dev server must be running), `node scripts/overflow.mjs 820x1180`.

## Deploy to shared hosting (Apache + PHP, no Node.js)

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.uz ./scripts/build-static.sh
```

This produces `out/` and `jimon-site.zip` (~15 MB). Then:

1. Upload the **contents** of `out/` into the domain's web root (`public_html` / `www` / `htdocs`), including the hidden `.htaccess`.
   In cPanel File Manager: upload `jimon-site.zip` into `public_html` → right click → Extract → delete the zip.
2. Rename `api/lead.config.example.php` → `api/lead.config.php` and fill in `telegram_bot_token` + `telegram_chat_id`
   (bot from @BotFather; your chat id from @userinfobot). Optionally add `email_to`.
3. Issue an SSL certificate in the hosting panel (Let's Encrypt), then uncomment the two HTTPS lines in `.htaccess`.
4. Check: `/` (RU), `/uz` (O‘Z), `/privacy`, `/sitemap.xml`, and send a test lead from the form — it must arrive in Telegram.

Routing on Apache is handled by `deploy/.htaccess` (RU at `/`, UZ at `/uz`, 301 from `/ru`, pretty URLs, caching, gzip, security headers).
Leads are handled by `deploy/lead.php` (validation, honeypot, per-IP rate limit, Telegram + e-mail delivery, protected local log).

For Node hosting or Vercel use the regular build instead (`npm run build && npm start`) — the `/api/lead` route and Next rewrites take over automatically.
