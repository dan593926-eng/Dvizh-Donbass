# Движ Донбасс

Атмосферный React + TypeScript + Vite + Tailwind CSS сайт, подготовленный для GitHub Pages.

## Быстрый старт

```bash
npm install
npm run dev
```

Проверка production-сборки:

```bash
npm run typecheck
npm run build
npm run preview
```

## Что редактировать

Главный файл контента:

`src/config/siteData.ts`

Там можно менять:
- название и описания;
- тексты секций;
- соцсети;
- timeline;
- галерею;
- видео-ссылки;
- аудио.

Изображения лежат в:

`public/images/`

Аудио:

`public/audio/`

Видео:

`public/videos/`

### Важно для отсутствующих медиа

Чтобы сайт не давал 404 на старте, в конфигурации используются только уже существующие локальные изображения. Для музыки и видео добавляются пустые/выключенные записи, пока пользователь не положит свои легальные файлы.

## GitHub Pages

Проект уже содержит `.github/workflows/deploy.yml`. После загрузки проекта в репозиторий на GitHub достаточно оставить ветку `main`, а в `Settings → Pages → Build and deployment` выбрать `GitHub Actions`, если GitHub еще не выбрал workflow автоматически.

GitHub Pages сможет собрать проект через Action и опубликовать `dist`.

## Технологии

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- Motion for React
- Lucide React

## Примечание по эстетике

Сайт не использует автоматически загружаемую copyrighted-музыку или чужие изображения. Локальные `.webp`-визуалы в `/public/images/` — самостоятельные атмосферные placeholder-artworks, которые можно заменить реальными фотографиями движения.
