/**
 * ЕДИНЫЙ ФАЙЛ КОНТЕНТА САЙТА
 * ---------------------------------------------------------------
 * Меняйте тексты, ссылки и подписи здесь — компоненты трогать не нужно.
 * Фотографии/видео/аудио лежат в /public/images, /public/videos, /public/audio
 * и подключаются в src/data/*.ts (там же — как их заменить).
 */

export const site = {
  name: "ДВИЖ ДОНБАСС",
  tagline: "TERIKON CULTURE",
  description:
    "Не просто сайт и не фан-клуб. Это музыка, свобода, единство и энергия улицы.",
};

export const nav = [
  { label: "Главная", href: "#home" },
  { label: "О движении", href: "#about" },
  { label: "Музыка", href: "#music" },
  { label: "История", href: "#history" },
  { label: "Фото", href: "#gallery" },
  { label: "Видео", href: "#video" },
  { label: "Движ", href: "#movement" },
  { label: "Контакты", href: "#contacts" },
];

export const hero = {
  kicker: "TERIKON CULTURE",
  titleTop: "ДВИЖ",
  titleBottom: "ДОНБАСС",
  subtitle:
    "ДОНБАСС ПОРОЖНЯК НЕ ГОНИТ",
  scrollHint: "Листай вниз",
  /**
   * Необязательный фон первого экрана (толпа, концерт, ночной город).
   * Оставьте пустую строку — будет фирменный фон с терриконами.
   * Пример: "/images/hero/crowd.jpg" и "/videos/hero.mp4" (mp4 до ~5 МБ, без звука).
   * Если указаны оба, картинка станет обложкой видео и заменит его на телефонах
   * с включённой экономией анимаций.
   */
  backgroundImage: "",
  backgroundVideo: "",
};

/** Короткий интро-экран при первом открытии сайта (показывается 1 раз за сессию). */
export const intro = {
  enabled: true,
  wordTop: "ДВИЖ",
  wordBottom: "ДОНБАСС",
};

/** Бегущие строки между секциями */
export const tickers = {
  primary: ["ДВИЖ ДОНБАСС", "TERIKON CULTURE", "ГДЕ ТЫ — ТАМ И ДВИЖ"],
  secondary: ["МУЗЫКА", "СВОБОДА", "ДРУЗЬЯ", "ДОРОГА", "ТЕРРИКОНЫ", "ДВИЖ"],
};

export const about = {
  heading: "МЫ — ДВИЖ",
  paragraphs: [
    "Движ Донбасс начался не с сайта и не с идеи «сделать сообщество». Он начался в толпе — где-то между первым рядом и колонками, между случайным знакомством и песней, которую знают все вокруг.",
    "Это про то, как один трек может собрать людей из разных городов в одном дворе. Про дорогу до концерта, которая запоминается больше, чем сам концерт. Про друзей, которых находишь в толпе незнакомцев.",
    "Мы не продаём атмосферу. Мы её собираем — по кусочку, с каждой поездки, каждой встречи, каждого лета.",
  ],
  quote: "Мы не просто слушаем музыку. Мы живём ей.",
};

export const cultureItems = [
  {
    id: "music",
    title: "Музыка",
    text: "Треки, которые становятся общим языком двора и трассы.",
  },
  {
    id: "concerts",
    title: "Концерты",
    text: "Первый ряд, последний вагон электрички домой — и не жалко.",
  },
  {
    id: "terikony",
    title: "Терриконы",
    text: "Рукотворные горы на горизонте — ни с чем не спутаешь этот пейзаж.",
  },
  {
    id: "friends",
    title: "Друзья",
    text: "Знакомства, которые начинаются словами «а ты тоже сюда?»",
  },
  {
    id: "street",
    title: "Улица",
    text: "Двор, подъезд, остановка — там, где всё и начинается.",
  },
  {
    id: "road",
    title: "Дорога",
    text: "Плейлист на всю ночь и указатель «до следующего города».",
  },
  {
    id: "memory",
    title: "Воспоминания",
    text: "Фото, которые пересматриваешь спустя годы — и улыбаешься.",
  },
] as const;

export const musicSection = {
  heading: "МУЗЫКА",
  subheading:
    "Добавьте свои легальные аудиофайлы в /public/audio — плеер подхватит их автоматически из src/data/tracks.ts.",
  emptyState:
    "Треки ещё не добавлены. Загляните в src/data/tracks.ts — там объяснено, как подключить свою подборку.",
};

export const historyHeading = "ИСТОРИЯ";

export const galleryHeading = {
  title: "ФОТО",
  subtitle: "Моменты, которые не влезают в один кадр.",
};

export const videoSection = {
  heading: "ВИДЕО",
  subtitle: "Клипы с движа — от первого лица.",
};

export const movement = {
  heading: "ГДЕ ТЫ — ТАМ И ДВИЖ.",
  body: "Не важно, откуда ты выехал и куда едешь дальше. Если рядом свои — движ уже начался.",
};

export const footer = {
  name: "ДВИЖ ДОНБАСС",
  tagline: "Музыка заканчивается. Движ остаётся.",
  contactsHeading: "КОНТАКТЫ",
  copyright: `© ${new Date().getFullYear()} Движ Донбасс. Сделано своими.`,
};

// Замените на реальные ссылки сообщества — иконки подберутся автоматически
// по полю `type` (см. src/components/Footer.tsx).
export const socialLinks = [
  { type: "telegram", label: "Telegram", href: "https://t.me/your_channel" },
  { type: "instagram", label: "Instagram", href: "https://instagram.com/your_page" },
  { type: "vk", label: "VK", href: "https://vk.com/your_group" },
  { type: "youtube", label: "YouTube", href: "https://youtube.com/@your_channel" },
] as const;

export const contactsSection = {
  heading: "НА СВЯЗИ",
  body: "Пишите, предлагайте фото и видео с движа, зовите в свой город — мы на связи во всех соцсетях.",
};
