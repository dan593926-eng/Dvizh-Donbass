/**
 * ФОТОГАЛЕРЕЯ
 * ---------------------------------------------------------------
 * 1. Положите свои фото в /public/images/gallery/
 * 2. Впишите путь в `src` ниже (например "/images/gallery/01.jpg")
 * 3. `span` управляет размером плитки в masonry-сетке: "tall" | "wide" | "big" | undefined
 *
 * Если файла не будет найдено, автоматически покажется placeholder-плашка
 * с градиентом вместо сломанной иконки — так проще собирать сайт до того,
 * как готовы реальные фотографии.
 */

export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  span?: "tall" | "wide" | "big";
  /**
   * Необязательно: адаптивные версии фото для быстрой загрузки на телефонах.
   * Команда `npm run images` создаёт их автоматически и печатает готовую строку
   * для вставки сюда. Пример: "/images/gallery/01-800.webp 800w, /images/gallery/01-1600.webp 1600w"
   */
  srcSet?: string;
};

export const galleryPhotos: GalleryPhoto[] = [
  { id: "g1", src: "/images/gallery/01.jpg", alt: "Толпа на концерте", span: "big" },
  { id: "g2", src: "/images/gallery/02.jpg", alt: "Огни сцены" },
  { id: "g3", src: "/images/gallery/03.jpg", alt: "Друзья на движе", span: "tall" },
  { id: "g4", src: "/images/gallery/04.jpg", alt: "Ночная дорога" },
  { id: "g5", src: "/images/gallery/05.jpg", alt: "Терриконы на закате", span: "wide" },
  { id: "g6", src: "/images/gallery/06.jpg", alt: "Момент перед выходом на сцену" },
  { id: "g7", src: "/images/gallery/07.jpg", alt: "Толпа поёт хором", span: "tall" },
  { id: "g8", src: "/images/gallery/08.jpg", alt: "Свет прожекторов" },
  { id: "g9", src: "/images/gallery/09.jpg", alt: "Дым над сценой" },
  { id: "g10", src: "/images/gallery/10.jpg", alt: "Дорога домой", span: "wide" },
];
