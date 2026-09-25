import { AnimatePresence, motion } from "framer-motion";
import { Film, Play, X } from "lucide-react";
import { useRef, useState } from "react";
import { videoSection } from "@/config/siteData";
import { videoClips } from "@/data/videos";
import { SectionHeading } from "@/components/SectionHeading";
import { MediaImage } from "@/components/MediaImage";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { fadeUp } from "@/animations/variants";
import { asset } from "@/lib/asset";

function VideoCard({
  title,
  poster,
  src,
  onOpen,
}: {
  title: string;
  poster: string;
  src: string;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <motion.button
      type="button"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      onClick={onOpen}
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => videoRef.current?.pause()}
      data-cursor="hover"
      aria-label={`Смотреть: ${title}`}
      className="group relative isolate aspect-video overflow-hidden rounded-sm bg-graphite text-left"
    >
      <video
        ref={videoRef}
        src={asset(src)}
        poster={asset(poster)}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
        onError={(e) => {
          (e.target as HTMLVideoElement).style.display = "none";
        }}
      />
      <MediaImage
        src={poster}
        alt={title}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/90 text-black transition-transform duration-300 group-hover:scale-110">
          <Play size={20} className="ml-0.5" />
        </span>
      </div>
      <h3 className="font-display absolute bottom-4 left-4 right-4 text-lg font-semibold uppercase text-bone sm:text-xl">
        {title}
      </h3>
    </motion.button>
  );
}

export function Video() {
  const [openSrc, setOpenSrc] = useState<string | null>(null);
  useLockBodyScroll(openSrc !== null);

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

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {videoClips.map((clip) => (
            <VideoCard
              key={clip.id}
              title={clip.title}
              poster={clip.poster}
              src={clip.src}
              onOpen={() => setOpenSrc(clip.src)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setOpenSrc(null)}
              aria-label="Закрыть видео"
              data-cursor="hover"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone sm:right-8 sm:top-8"
              style={{ marginTop: "env(safe-area-inset-top, 0px)" }}
            >
              <X size={20} />
            </button>
            <video
              src={asset(openSrc)}
              controls
              autoPlay
              playsInline
              className="max-h-[82vh] max-w-[92vw] rounded-sm shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
