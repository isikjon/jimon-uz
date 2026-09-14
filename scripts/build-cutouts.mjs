import sharp from "sharp";
import { readdir } from "node:fs/promises";
const files = (await readdir("_source/cut")).filter((f) => /^product-\d+\.png$/.test(f));
for (const f of files) {
  const out = `public/images/products/cut/${f.replace(".png", ".webp")}`;
  await sharp(`_source/cut/${f}`).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 84, alphaQuality: 90, effort: 5 }).toFile(out);
  console.log("✓", out);
}
