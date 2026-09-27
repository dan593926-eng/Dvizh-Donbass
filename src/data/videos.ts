/**
 * ВИДЕО-СЕКЦИЯ
 * ---------------------------------------------------------------
 * Файлы лежат в /public/videos/: сам ролик (01.mp4) и обложка (01.jpg).
 * Порядок строк = порядок роликов на сайте.
 *
 * Как добавить ролик:
 *   1. Загрузите в public/videos/ файл 08.mp4 и обложку 08.jpg
 *   2. Допишите строку перед ];
 *      { id: "v8", title: "Название", src: "/videos/08.mp4", poster: "/videos/08.jpg" },
 *
 * format — "vertical" (как снято на телефон, по умолчанию) или "horizontal" (16:9).
 * Видео должно быть в формате MP4 (H.264). Ролики с iPhone (.MOV, HEVC)
 * многие браузеры не воспроизводят — их нужно перекодировать.
 */

export type VideoClip = {
  id: string;
  title: string;
  src: string;
  poster: string;
  format?: "vertical" | "horizontal";
};

export const videoClips: VideoClip[] = [
  { id: "v1", title: "Движ под грозовым небом", src: "/videos/01.mp4", poster: "/videos/01.jpg" },
  { id: "v2", title: "Свет, звук, толпа", src: "/videos/02.mp4", poster: "/videos/02.jpg" },
  { id: "v3", title: "С флагом на стадионе", src: "/videos/03.mp4", poster: "/videos/03.jpg" },
  { id: "v4", title: "Уличный движ", src: "/videos/04.mp4", poster: "/videos/04.jpg" },
  { id: "v5", title: "Ночной город", src: "/videos/05.mp4", poster: "/videos/05.jpg" },
  { id: "v6", title: "Стадион в красном", src: "/videos/06.mp4", poster: "/videos/06.jpg" },
  { id: "v7", title: "Кружим в толпе", src: "/videos/07.mp4", poster: "/videos/07.jpg" },
];
