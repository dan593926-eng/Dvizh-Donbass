import { AnimatePresence, motion } from "framer-motion";
import { Film, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { videoSection } from "@/config/siteData";
import { videoClips, type VideoClip } from "@/data/videos";
import { SectionHeading } from "@/components/SectionHeading";
import { MediaImage } from "@/components/MediaImage";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useIsTouchDevice } from "@/hooks/usePointerType";
import { fadeUp } from "@/animations/variants";
import { asset } from "@/lib/asset";

/**
 * Карточка ролика. Вертикальные ролики (как снято на телефон) — карточка 9:16,
 * горизонтальные — 16:9 на две колонки.
 * На компьютере при наведении ролик тихо проигрывается прямо в карточке.
 * Видео не скачивается, пока его не запустили (экономит трафик и не тормозит сайт).
 */
function VideoCard({ clip, onOpen }: { clip: VideoClip; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isTouch = useIsTouchDevice();
  const [previewing, setPreviewing] = useState(false);
  const vertical = clip.format !== "horizontal";

  const startPreview = () => {
    if (isTouch) return;
    setPreviewing(true);
    videoRef.current?.play().catch(() => {});
  };
  const stopPreview = () => {
    setPreviewing(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <motion.button
      type="button"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      onClick={onOpen}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      data-cursor="hover"
      aria-label={`Смотреть: ${clip.title}`}
      className={`group relative isolate overflow-hidden rounded-lg bg-graphite text-left ${
        vertical ? "aspect-[9/16]" : "col-span-2 aspect-video"
      }`}
    >
      <MediaImage
        src={clip.poster}
        alt={clip.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
      />
      {/* Тихий предпросмотр при наведении (только компьютер) */}
      {!isTouch && (
        <video
          ref={videoRef}
          src={asset(clip.src)}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            previewing ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/90 text-black shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
          <Play size={20} className="ml-0.5" />
        </span>
      </div>
      <h3 className="font-display absolute bottom-3 left-3 right-3 text-sm font-semibold uppercase leading-tight text-bone sm:bottom-4 sm:left-4 sm:right-4 sm:text-lg">
        {clip.title}
      </h3>
    </motion.button>
  );
}

/**
 * Полноэкранный просмотр со звуком. Закрыть: крестик, клик по фону, Esc,
 * кнопка/жест «Назад» (не уводит с сайта).
 */
function VideoModal({ clip, onClose }: { clip: VideoClip; onClose: () => void }) {
  useLockBodyScroll(true);
  const closedByHistory = useRef(false);
  const vertical = clip.format !== "horizontal";

  useEffect(() => {
    window.history.pushState({ dvizhVideo: true }, "");
    const onPop = () => {
      closedByHistory.current = true;
      onClose();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestClose = useCallback(() => {
    if (!closedByHistory.current && window.history.state?.dvizhVideo) {
      window.history.back();
    } else {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={clip.title}
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <video
        key={clip.id}
        src={asset(clip.src)}
        poster={asset(clip.poster)}
        controls
        autoPlay
        playsInline
        className={`rounded-lg bg-black shadow-2xl ${
          vertical ? "max-h-[85vh] w-auto max-w-[92vw]" : "max-h-[85vh] w-full max-w-5xl"
        }`}
      />
      <button
        type="button"
        onClick={requestClose}
        aria-label="Закрыть видео"
        data-cursor="hover"
        className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/60 text-bone hover:border-gold hover:text-gold sm:right-6 sm:top-6"
        style={{ marginTop: "env(safe-area-inset-top, 0px)" }}
      >
        <X size={22} />
      </button>
    </motion.div>
  );
}

export function Video() {
  const [openClip, setOpenClip] = useState<VideoClip | null>(null);
  const close = useCallback(() => setOpenClip(null), []);

  if (videoClips.length === 0) {
    return (
      <section id="video" className="bg-graphite px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title={videoSection.heading} subtitle={videoSection.subtitle} />
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="prose-measure mt-10 flex items-start gap-4 rounded-sm border border-white/10 bg-black/40 p-6 sm:p-8"
          >
            <Film className="mt-1 shrink-0 text-gold" size={22} aria-hidden="true" />
            <p className="text-sm text-fog sm:text-base">
              Клипы ещё не добавлены. Загляните в src/data/videos.ts — там объяснено, как
              подключить свои видео из /public/videos.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="video" className="bg-graphite px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={videoSection.heading} subtitle={videoSection.subtitle} />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {videoClips.map((clip) => (
            <VideoCard key={clip.id} clip={clip} onOpen={() => setOpenClip(clip)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openClip && <VideoModal key={openClip.id} clip={openClip} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
