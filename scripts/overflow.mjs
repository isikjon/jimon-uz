import puppeteer from "puppeteer-core";
const vps = (process.argv[2] || "820x1180").split(",");
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox", "--hide-scrollbars"] });
for (const vp of vps) {
  const [w, h] = vp.split("x").map(Number);
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 2500));
  const res = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = [];
    const isFixedTree = (el) => { for (let e = el; e; e = e.parentElement) if (getComputedStyle(e).position === "fixed") return true; return false; };
    document.querySelectorAll("main *, footer *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || isFixedTree(el)) return;
      // skip elements inside an overflow-clipping ancestor
      let clipped = false;
      for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) { const o = getComputedStyle(e).overflowX; if (o === "hidden" || o === "clip" || o === "auto" || o === "scroll") { clipped = true; break; } }
      if (clipped) return;
      if (r.right > vw + 1) out.push({ tag: el.tagName, id: el.id, cls: (el.className || "").toString().slice(0, 80), right: Math.round(r.right), w: Math.round(r.width), text: (el.textContent || "").trim().slice(0, 30) });
    });
    out.sort((a, b) => b.right - a.right);
    return { vw, sw: document.documentElement.scrollWidth, out: out.slice(0, 12) };
  });
  console.log(vp, JSON.stringify(res));
  await page.close();
}
await browser.close();
