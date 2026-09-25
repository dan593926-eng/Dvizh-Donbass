/**
 * Автоматическое сжатие фото при сборке (запускается сам после `vite build`).
 * ---------------------------------------------------------------
 * Проходит по готовой сборке (папка dist) и для каждого .jpg/.jpeg/.png/.webp:
 *   - поворачивает по EXIF (фото с телефона не окажутся «на боку»);
 *   - уменьшает до 2000 px по длинной стороне, если фото больше;
 *   - пережимает в том же формате и с тем же именем;
 *   - заменяет файл, только если новый получился меньше.
 * Ваши оригиналы в папке public НЕ изменяются — сжимается только копия на сайте.
 * Логотип и иконки (images/brand, favicon) не трогаются — они уже оптимизированы.
 *
 * Также предупреждает о слишком тяжёлых видео и аудио — их нужно сжать самостоятельно.
 * Если пакет sharp почему-то недоступен, сборка НЕ падает — просто без сжатия.
 */
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIST = path.resolve("dist");
const MAX_SIDE = 2000;
const SKIP = [path.join(DIST, "images", "brand")];
const HEAVY_MEDIA_MB = 15;

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("[images] sharp недоступен — фото не сжаты (сайт при этом работает).");
  process.exit(0);
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const kb = (b) => `${Math.round(b / 1024)} КБ`;
let before = 0;
let after = 0;
let count = 0;

for await (const file of walk(DIST)) {
  const ext = path.extname(file).toLowerCase();
  const rel = path.relative(DIST, file);

  if ([".mp4", ".webm", ".mov", ".mp3", ".m4a", ".aac", ".wav"].includes(ext)) {
    const size = (await stat(file)).size;
    if (size > HEAVY_MEDIA_MB * 1024 * 1024) {
      console.warn(`[images] ⚠ ${rel}: ${(size / 1024 / 1024).toFixed(1)} МБ — тяжёлый файл, будет долго грузиться на телефонах`);
    }
    continue;
  }

  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;
  if (SKIP.some((dir) => file.startsWith(dir))) continue;
  if (/favicon|apple-touch-icon/i.test(file)) continue;

  try {
    const input = await readFile(file);
    let pipeline = sharp(input, { failOn: "none" })
      .rotate()
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true });

    if (ext === ".png") pipeline = pipeline.png({ compressionLevel: 9, effort: 8 });
    else if (ext === ".webp") pipeline = pipeline.webp({ quality: 80 });
    else pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true, progressive: true });

    const output = await pipeline.toBuffer();
    before += input.length;
    if (output.length < input.length) {
      await writeFile(file, output);
      after += output.length;
      count++;
      console.log(`[images] ${rel}: ${kb(input.length)} → ${kb(output.length)}`);
    } else {
      after += input.length;
    }
  } catch (err) {
    console.warn(`[images] пропущен ${rel}: ${err.message}`);
  }
}

if (before > 0) {
  console.log(`[images] Готово: сжато ${count} фото, ${kb(before)} → ${kb(after)}`);
} else {
  console.log("[images] Фото для сжатия не найдены.");
}
