/**
 * Оптимизация фотографий: npm run images
 * ---------------------------------------------------------------
 * Берёт все .jpg/.jpeg/.png из public/images/gallery, culture, movement, hero
 * и создаёт рядом WebP-версии шириной 800 и 1600 px (файлы -800.webp и -1600.webp).
 * Оригиналы не трогает. В конце печатает готовые строки srcSet для src/data/gallery.ts.
 *
 * Нужна библиотека sharp (один раз): npm install -D sharp
 */
import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("\n  Не найден пакет sharp. Установите его один раз:\n\n    npm install -D sharp\n");
  process.exit(1);
}

const ROOT = path.resolve("public/images");
const FOLDERS = ["gallery", "culture", "movement", "hero"];
const WIDTHS = [800, 1600];

for (const folder of FOLDERS) {
  const dir = path.join(ROOT, folder);
  if (!existsSync(dir)) continue;
  const files = (await readdir(dir)).filter(
    (f) => /\.(jpe?g|png)$/i.test(f) && !/-\d+\.webp$/i.test(f)
  );
  if (files.length === 0) continue;
  console.log(`\n${folder}/`);

  for (const file of files) {
    const input = path.join(dir, file);
    const name = file.replace(/\.[^.]+$/, "");
    const meta = await sharp(input).metadata();
    const parts = [];

    for (const w of WIDTHS) {
      const width = Math.min(w, meta.width ?? w);
      const outName = `${name}-${w}.webp`;
      const out = path.join(dir, outName);
      await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
      const kb = Math.round((await stat(out)).size / 1024);
      parts.push(`/images/${folder}/${outName} ${width}w`);
      console.log(`  ✓ ${outName} (${kb} КБ)`);
    }
    console.log(`    srcSet: "${parts.join(", ")}"`);
  }
}
console.log("\nГотово. Скопируйте строки srcSet в src/data/gallery.ts (поле srcSet у нужного фото).\n");
