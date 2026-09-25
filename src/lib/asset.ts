/**
 * Превращает путь вида "/images/gallery/01.jpg" в правильный адрес
 * с учётом базового пути сайта (на GitHub Pages это "/<репозиторий>/").
 * Внешние ссылки (http/https, data:) возвращаются без изменений.
 *
 * В файлах src/data/*.ts и src/config/siteData.ts пишите пути как обычно,
 * начиная с "/images/...", "/audio/...", "/videos/..." — всё остальное делает эта функция.
 */
export function asset(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  const base = import.meta.env.BASE_URL || "/";
  return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}

/** То же для srcset: "/a-800.webp 800w, /a-1600.webp 1600w" */
export function assetSrcSet(srcSet?: string): string | undefined {
  if (!srcSet) return undefined;
  return srcSet
    .split(",")
    .map((part) => {
      const [url, descriptor] = part.trim().split(/\s+/);
      return descriptor ? `${asset(url)} ${descriptor}` : asset(url);
    })
    .join(", ");
}
