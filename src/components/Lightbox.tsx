import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, type MouseEvent, type TouchEvent } from "react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { asset, assetSrcSet } from "@/lib/asset";
import type { GalleryPhoto } from "@/data/gallery";

type LightboxProps = {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
};

/**
 * Полноэкранный просмотр фото. Закрыть можно любым привычным способом:
 * - крестик в углу;
 * - клик/тап по тёмному фону вокруг фото;
 * - клавиша Escape;
 * - кнопка/жест «Назад» на телефоне и в браузере (не уводит с сайта);
 * - свайп вниз на телефоне.
 * Листать: стрелки на экране, стрелки клавиатуры, свайп влево/вправо.
 */
export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  useLockBodyScroll(true);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const photo = photos[index];

  // «Назад» в браузере закрывает просмотр, а не уходит с сайта:
  // при открытии добавляем запись в историю, при «Назад» — закрываемся.
  const closedByHistory = useRef(false);
  useEffect(() => {
    window.history.pushState({ dvizhLightbox: true }, "");
    const onPop = () => {
      closedByHistory.current = true;
      onClose();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Закрытие крестиком/фоном/Escape/свайпом: убираем свою запись из истории
  const requestClose = useCallback(() => {
    if (!closedByHistory.current && window.history.state?.dvizhLightbox) {
      window.history.back(); // сработает popstate → onClose
    } else {
      onClose();
    }
  }, [onClose]);

  const goPrev = useCallback(
    () => onNavigate((index - 1 + photos.length) % photos.length),
    [index, photos.length, onNavigate]
  );
  const goNext = useCallback(
    () => onNavigate((index + 1) % photos.length),
    [index, photos.length, onNavigate]
  );

  useEffect(() => {
    closeButtonRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestClose, goPrev, goNext]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) goPrev();
      else goNext();
    } else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) {
      requestClose(); // свайп вниз
    }
  };

  // Клик по фону (не по фото и не по кнопкам) закрывает просмотр
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) requestClose();
  };

  const buttonClass =
    "flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/60 text-bone transition-colors hover:border-gold hover:text-gold";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={photo.id}
          src={asset(photo.src)}
          srcSet={assetSrcSet(photo.srcSet)}
          sizes="90vw"
          alt={photo.alt}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-h-[80vh] max-w-[92vw] select-none rounded-sm object-contain shadow-2xl"
          draggable={false}
          onClick={(e: MouseEvent) => e.stopPropagation()}
        />
      </AnimatePresence>

      <button
        ref={closeButtonRef}
        type="button"
        onClick={requestClose}
        aria-label="Закрыть просмотр"
        data-cursor="hover"
        className={`absolute right-3 top-3 z-10 sm:right-6 sm:top-6 ${buttonClass}`}
        style={{ marginTop: "env(safe-area-inset-top, 0px)" }}
      >
        <X size={22} />
      </button>

      <button
        type="button"
        onClick={goPrev}
        aria-label="Предыдущее фото"
        data-cursor="hover"
        className={`absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 sm:left-6 sm:flex ${buttonClass}`}
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Следующее фото"
        data-cursor="hover"
        className={`absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 sm:right-6 sm:flex ${buttonClass}`}
      >
        <ChevronRight size={22} />
      </button>

      <p
        className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 px-4 text-center text-sm text-fog"
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {index + 1} / {photos.length}
        <span className="ml-3 hidden text-smoke sm:inline">Esc или клик по фону — закрыть</span>
        <span className="ml-3 text-smoke sm:hidden">свайп вниз — закрыть</span>
      </p>
    </motion.div>
  );
}
