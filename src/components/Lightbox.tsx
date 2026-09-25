import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, type TouchEvent } from "react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { asset, assetSrcSet } from "@/lib/asset";
import type { GalleryPhoto } from "@/data/gallery";

type LightboxProps = {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
};

export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  useLockBodyScroll(true);
  const touchStartX = useRef<number | null>(null);
  const photo = photos[index];

  const goPrev = () => onNavigate((index - 1 + photos.length) % photos.length);
  const goNext = () => onNavigate((index + 1) % photos.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goPrev() : goNext();
    }
    touchStartX.current = null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть просмотр"
        data-cursor="hover"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone sm:right-8 sm:top-8"
        style={{ marginTop: "env(safe-area-inset-top, 0px)" }}
      >
        <X size={20} />
      </button>

      <button
        type="button"
        onClick={goPrev}
        aria-label="Предыдущее фото"
        data-cursor="hover"
        className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-bone sm:left-6 sm:flex"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Следующее фото"
        data-cursor="hover"
        className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-bone sm:right-6 sm:flex"
      >
        <ChevronRight size={22} />
      </button>

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
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="max-h-[82vh] max-w-[90vw] rounded-sm object-contain shadow-2xl"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </AnimatePresence>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 text-center text-sm text-fog">
        {index + 1} / {photos.length}
      </p>
    </motion.div>
  );
}
