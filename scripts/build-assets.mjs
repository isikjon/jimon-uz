// One-off asset pipeline: converts source material into optimized web assets.
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const SRC = "_source";
const OUT = "public/images";

async function toWebp(input, output, width, quality = 82, opts = {}) {
  await mkdir(path.dirname(output), { recursive: true });
  const img = sharp(input, { failOn: "none" }).rotate();
  if (width) img.resize({ width, withoutEnlargement: true, ...opts });
  await img.webp({ quality, effort: 5 }).toFile(output);
  console.log("✓", output);
}

// Products (studio photos, ivory background)
const productIds = [8, 10, 11, 12, 13, 14, 15, 16, 19, 23, 25, 27, 28, 30, 31, 32];
for (const n of productIds) {
  await toWebp(`${SRC}/kz/product-${n}.jpg`, `${OUT}/products/product-${n}.webp`, 1400, 80);
  await toWebp(`${SRC}/kz/product-${n}.jpg`, `${OUT}/products/product-${n}-thumb.webp`, 480, 72);
}

// Catalog pages (for product detail overlay)
for (let p = 1; p <= 20; p++) {
  const n = String(p).padStart(2, "0");
  await toWebp(`${SRC}/pdf/pages/p-${n}.png`, `${OUT}/catalog/p-${n}.webp`, 900, 74);
}

// Certificates / documents
await toWebp(`${SRC}/certs/cert-eas.png`, `${OUT}/certs/cert-eas.webp`, 1100, 78);
await toWebp(`${SRC}/certs/cert-halal.png`, `${OUT}/certs/cert-halal.webp`, 1100, 78);
await toWebp(`${SRC}/certs/cert-halal-list.png`, `${OUT}/certs/cert-halal-list.webp`, 1100, 78);
await toWebp(`${SRC}/certs/cert-awards.png`, `${OUT}/certs/cert-awards.webp`, 1100, 78);
await toWebp(`${SRC}/certs/cert-reg.png`, `${OUT}/certs/cert-reg.webp`, 1100, 78);
await toWebp(`${SRC}/brand/t_697c3b21d7fd4.jpg`, `${OUT}/certs/quality-award.webp`, 1000, 80);

// Brand imagery from the official site
await toWebp(`${SRC}/brand/t_69cb613013b85.png`, `${OUT}/brand/president.webp`, 700, 82);
await toWebp(`${SRC}/brand/t_69ef271fe3c32.png`, `${OUT}/brand/lab.webp`, 1600, 78);
await toWebp(`${SRC}/brand/t_697c39fc216a5.png`, `${OUT}/brand/factory.webp`, 1200, 80);
await toWebp(`${SRC}/brand/t_69a2a5e329459.png`, `${OUT}/brand/brands.webp`, 1600, 78);
await toWebp(`${SRC}/brand/t_69cb8a6ed9ec7.png`, `${OUT}/brand/bases.webp`, 1600, 78);
await toWebp(`${SRC}/brand/t_69c48b04e1f31.jpg`, `${OUT}/brand/family.webp`, 1600, 78);
await toWebp(`${SRC}/brand/t_69c27c4b8ed02.png`, `${OUT}/brand/people.webp`, 1600, 78);
await toWebp(`${SRC}/pdf/pages/p-01.png`, `${OUT}/brand/catalog-cover.webp`, 900, 80);

// Logo: trim the app-icon PNG and export crisp sizes
const logo = sharp(`${SRC}/brand/logo-jimon.png`).trim();
await mkdir(`${OUT}/brand`, { recursive: true });
await logo.clone().resize(256).png().toFile(`${OUT}/brand/logo-256.png`);
await logo.clone().resize(96).png().toFile(`${OUT}/brand/logo-96.png`);
await sharp(`${SRC}/brand/logo-jimon.png`).trim().resize(512).png().toFile(`public/icon.png`);
await sharp(`${SRC}/brand/logo-jimon.png`).trim().resize(180).png().toFile(`public/apple-icon.png`);
await sharp(`${SRC}/brand/logo-jimon.png`).trim().resize(32).png().toFile(`public/favicon-32.png`);
console.log("done");
