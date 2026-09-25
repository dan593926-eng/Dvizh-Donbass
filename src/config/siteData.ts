export type Social = {
  label: string
  href: string
}

export type GalleryItem = {
  id: string
  title: string
  meta: string
  image: string
  srcSet: string
  alt: string
}

export type TimelineItem = {
  date: string
  title: string
  text: string
}

export type Track = {
  title: string
  artist: string
  cover: string
  src?: string
}

export const siteData = {
  brand: {
    name: 'ДВИЖ ДОНБАСС',
    kicker: 'TERIKON CULTURE',
    description:
      'Музыка, улица, друзья, концерты и воспоминания. Не просто слушаем — проживаем.',
    footerLine: 'Музыка заканчивается. Движ остаётся.',
  },

  nav: [
    { id: 'home', label: 'Главная' },
    { id: 'about', label: 'О движении' },
    { id: 'music', label: 'Музыка' },
    { id: 'history', label: 'История' },
    { id: 'gallery', label: 'Фото' },
    { id: 'video', label: 'Видео' },
    { id: 'dvizh', label: 'Движ' },
    { id: 'contacts', label: 'Контакты' },
  ],

  hero: {
    eyebrow: 'NOT A FAN CLUB. A STATE OF MIND.',
    titleTop: 'ДВИЖ',
    titleBottom: 'ДОНБАСС',
    supporting: 'Своя музыка. Свои люди. Своя память.',
    scrollLabel: 'Листай вниз',
  },

  about: {
    index: '01',
    eyebrow: 'О ДВИЖЕНИИ',
    title: 'МЫ — ДВИЖ',
    text:
      'Есть места, где музыка просто играет фоном. А есть моменты, когда она становится общей памятью. «Движ Донбасс» — про это чувство: когда рядом свои, город не спит, дорога кажется короче, а несколько секунд из толпы потом вспоминаются годами.',
    quote: 'Мы не просто слушаем музыку. Мы живём ей.',
    facts: [
      ['Люди', 'свои рядом'],
      ['Звук', 'громче мыслей'],
      ['Ночь', 'ещё не конец'],
    ],
  },

  culture: {
    index: '02',
    eyebrow: 'КУЛЬТУРА',
    title: 'НЕ КАРТОЧКИ. МОМЕНТЫ.',
    intro: 'То, из чего складывается наш движ.',
    items: [
      {
        title: 'Музыка',
        tag: 'SOUND',
        image: '/images/culture-01-1440.webp',
        srcSet: '/images/culture-01-720.webp 720w, /images/culture-01-1440.webp 1440w',
      },
      {
        title: 'Концерты',
        tag: 'LIVE',
        image: '/images/culture-02-1440.webp',
        srcSet: '/images/culture-02-720.webp 720w, /images/culture-02-1440.webp 1440w',
      },
      {
        title: 'Дороги',
        tag: 'ROAD',
        image: '/images/culture-03-1440.webp',
        srcSet: '/images/culture-03-720.webp 720w, /images/culture-03-1440.webp 1440w',
      },
      {
        title: 'Свои',
        tag: 'PEOPLE',
        image: '/images/culture-04-1440.webp',
        srcSet: '/images/culture-04-720.webp 720w, /images/culture-04-1440.webp 1440w',
      },
      {
        title: 'Свобода',
        tag: 'STATE',
        image: '/images/culture-05-1440.webp',
        srcSet: '/images/culture-05-720.webp 720w, /images/culture-05-1440.webp 1440w',
      },
      {
        title: 'Память',
        tag: 'MEMORY',
        image: '/images/culture-06-1440.webp',
        srcSet: '/images/culture-06-720.webp 720w, /images/culture-06-1440.webp 1440w',
      },
    ],
  },

  music: {
    index: '03',
    eyebrow: 'МУЗЫКА',
    title: 'НАШ САУНДТРЕК',
    text:
      'Здесь можно подключить собственные легальные аудиофайлы или официальные источники. Плеер готов — треки лежат отдельно от компонентов.',
    tracks: [
      {
        title: 'Добавь свой трек',
        artist: 'public/audio/your-track.mp3',
        cover: '/images/music-cover.webp',
      },
    ] satisfies Track[],
  },

  history: {
    index: '04',
    eyebrow: 'ИСТОРИЯ',
    title: 'ПАМЯТЬ НЕ СТИРАЕТСЯ',
    text:
      'Этот таймлайн специально вынесен в конфигурацию. Добавляй реальные даты, поездки, концерты, встречи и события движения, не трогая компоненты.',
    timeline: [
      {
        date: '2010-е',
        title: 'Начинается своя история',
        text: 'Музыка становится фоном для дорог, разговоров, первых больших воспоминаний и больших вечеров.',
      },
      {
        date: 'Потом',
        title: 'Свои находят своих',
        text: 'Появляются общие маршруты, фото, встречи и ощущение, что этот движ существует сам по себе.',
      },
      {
        date: 'Сегодня',
        title: 'Движ продолжается',
        text: 'Новые лица, новые дороги и те же эмоции. Остальное допишет время.',
      },
    ] satisfies TimelineItem[],
  },

  gallery: {
    index: '05',
    eyebrow: 'ФОТО',
    title: 'КАДРЫ, КОТОРЫЕ ОСТАЛИСЬ',
    items: [
      {
        id: 'g1',
        title: 'После концерта',
        meta: 'NIGHT / 01',
        image: '/images/gallery-01-1440.webp',
        srcSet: '/images/gallery-01-720.webp 720w, /images/gallery-01-1440.webp 1440w',
        alt: 'Атмосферный ночной кадр после концерта',
      },
      {
        id: 'g2',
        title: 'Дорога домой',
        meta: 'ROAD / 02',
        image: '/images/gallery-02-1440.webp',
        srcSet: '/images/gallery-02-720.webp 720w, /images/gallery-02-1440.webp 1440w',
        alt: 'Ночная дорога и свет фонарей',
      },
      {
        id: 'g3',
        title: 'Сектор своих',
        meta: 'PEOPLE / 03',
        image: '/images/gallery-03-1440.webp',
        srcSet: '/images/gallery-03-720.webp 720w, /images/gallery-03-1440.webp 1440w',
        alt: 'Толпа под концертными прожекторами',
      },
      {
        id: 'g4',
        title: 'Ночью всё громче',
        meta: 'CITY / 04',
        image: '/images/gallery-04-1440.webp',
        srcSet: '/images/gallery-04-720.webp 720w, /images/gallery-04-1440.webp 1440w',
        alt: 'Ночной город с жёлтыми огнями',
      },
      {
        id: 'g5',
        title: 'Без лишних слов',
        meta: 'MEMORY / 05',
        image: '/images/gallery-05-1440.webp',
        srcSet: '/images/gallery-05-720.webp 720w, /images/gallery-05-1440.webp 1440w',
        alt: 'Силуэты друзей в тёплом свете',
      },
      {
        id: 'g6',
        title: 'Ещё один вечер',
        meta: 'ROAD / 06',
        image: '/images/gallery-06-1440.webp',
        srcSet: '/images/gallery-06-720.webp 720w, /images/gallery-06-1440.webp 1440w',
        alt: 'Дорога с красными и золотыми огнями',
      },
      {
        id: 'g7',
        title: 'Город говорит',
        meta: 'STREET / 07',
        image: '/images/gallery-07-1440.webp',
        srcSet: '/images/gallery-07-720.webp 720w, /images/gallery-07-1440.webp 1440w',
        alt: 'Уличный свет и городская фактура',
      },
      {
        id: 'g8',
        title: 'Движ идёт',
        meta: 'ENERGY / 08',
        image: '/images/gallery-08-1440.webp',
        srcSet: '/images/gallery-08-720.webp 720w, /images/gallery-08-1440.webp 1440w',
        alt: 'Сценический свет над толпой',
      },
    ] satisfies GalleryItem[],
  },

  video: {
    index: '06',
    eyebrow: 'ВИДЕО',
    title: 'ПОЙМАЙ МОМЕНТ',
    description:
      'Секция подготовлена под YouTube/VK/Telegram или локальные видео. Просто замени ссылки в siteData.ts.',
    items: [
      {
        title: 'Плейлист движения',
        meta: 'SOURCE PLACEHOLDER',
        href: 'https://youtube.com/',
        poster: '/images/video-01-1440.webp',
      },
      {
        title: 'Ночной город / live',
        meta: 'VIDEO PLACEHOLDER',
        href: 'https://youtube.com/',
        poster: '/images/video-02-1440.webp',
      },
    ],
  },

  dvizh: {
    index: '07',
    title: 'ГДЕ ТЫ — ТАМ И ДВИЖ.',
    subline: 'Не место на карте. Состояние внутри.',
  },

  socials: [
    { label: 'Telegram', href: 'https://t.me/' },
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'VK', href: 'https://vk.com/' },
    { label: 'YouTube', href: 'https://youtube.com/' },
  ] satisfies Social[],
} as const
