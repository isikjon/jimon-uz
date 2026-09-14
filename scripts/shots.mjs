// QA screenshots with the system Chrome (headless). Usage: node scripts/shots.mjs 1440x900 [mobile]
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const [vp = "1440x900", mode = ""] = process.argv.slice(2);
const [w, h] = vp.split("x").map(Number);
const mobile = mode === "mobile";
const base = process.env.URL || "http://localhost:3000";
const out = `_source/shots/${vp}${mobile ? "m" : ""}`;
await mkdir(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox", "--use-gl=angle", "--enable-webgl", "--ignore-gpu-blocklist", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
if (mobile) await page.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1");
const errors = [];
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(`[${m.type()}] ${m.text()}`));
page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
await page.goto(base + (process.env.PATHNAME || "/"), { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 3500));

const scrollTo = async (y) => {
  await page.evaluate((y) => {
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }, y);
  await new Promise((r) => setTimeout(r, 1300));
};
const shot = async (name) => {
  await page.screenshot({ path: `${out}/${name}.png` });
  console.log("✓", name);
};

await shot("00-hero");
const ids = ["story", "elements", "products", "production", "trust", "social", "journeys", "partnership", "faq", "contact", "final"];
const tops = await page.evaluate((ids) =>
  Object.fromEntries(ids.map((id) => [id, document.getElementById(id)?.getBoundingClientRect().top + window.scrollY])),
  ids,
);
const heights = await page.evaluate((ids) => Object.fromEntries(ids.map((id) => [id, document.getElementById(id)?.getBoundingClientRect().height])), ids);
let i = 1;
await scrollTo(h * 0.6);
await shot(`${String(i++).padStart(2, "0")}-hero-mid`);
for (const id of ids) {
  const top = tops[id];
  await scrollTo(top - 40);
  await shot(`${String(i++).padStart(2, "0")}-${id}`);
  if (id === "story") {
    await scrollTo(top + heights[id] * 0.35);
    await shot(`${String(i++).padStart(2, "0")}-${id}-b`);
    await scrollTo(top + heights[id] * 0.62);
    await shot(`${String(i++).padStart(2, "0")}-${id}-c`);
    await scrollTo(top + heights[id] * 0.85);
    await shot(`${String(i++).padStart(2, "0")}-${id}-d`);
  }
  if (id === "production") {
    for (const f of [0.22, 0.4, 0.58, 0.8]) {
      await scrollTo(top + heights[id] * f);
      await shot(`${String(i++).padStart(2, "0")}-${id}-${f}`);
    }
  }
  if (id === "products" || id === "trust" || id === "partnership") {
    await scrollTo(top + heights[id] * 0.5);
    await shot(`${String(i++).padStart(2, "0")}-${id}-b`);
  }
}
await scrollTo(999999);
await shot(`${String(i++).padStart(2, "0")}-footer`);
const overflow = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
console.log("overflow:", JSON.stringify(overflow));
console.log("console issues:", errors.length ? "\n" + errors.slice(0, 20).join("\n") : "none");
await browser.close();
