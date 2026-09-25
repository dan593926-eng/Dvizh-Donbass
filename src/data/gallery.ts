/**
 * ФОТОГАЛЕРЕЯ
 * ---------------------------------------------------------------
 * 1. Положите фото в /public/images/gallery/
 * 2. Добавьте строку ниже. Имя файла должно совпадать ТОЧНО,
 *    включая большие/маленькие буквы: 1.JPG и 1.jpg — разные файлы.
 * 3. `span` — размер плитки: "tall" (высокая), "wide" (широкая), "big" (большая)
 *    или не указывать (обычная).
 */

export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  span?: "tall" | "wide" | "big";
  /** Необязательно: адаптивные версии фото (см. README, «Ускорение загрузки фото») */
  srcSet?: string;
};

export const galleryPhotos: GalleryPhoto[] = [
  { id: "g1", src: "/images/gallery/1.JPG", alt: "Движ Донбасс", span: "big" },
  { id: "g2", src: "/images/gallery/2.JPG", alt: "Движ Донбасс" },
  { id: "g3", src: "/images/gallery/3.JPG", alt: "Движ Донбасс", span: "tall" },
  { id: "g4", src: "/images/gallery/4.JPG", alt: "Движ Донбасс" },
  { id: "g5", src: "/images/gallery/5.JPG", alt: "Движ Донбасс", span: "wide" },
  { id: "g6", src: "/images/gallery/6.JPG", alt: "Движ Донбасс" },
  { id: "g7", src: "/images/gallery/7.JPG", alt: "Движ Донбасс", span: "tall" },
  { id: "g8", src: "/images/gallery/8.JPG", alt: "Движ Донбасс" },
  { id: "g9", src: "/images/gallery/9.jpg", alt: "Движ Донбасс" },
  { id: "g10", src: "/images/gallery/10.JPG", alt: "Движ Донбасс", span: "wide" },
];
