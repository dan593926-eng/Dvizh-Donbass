import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { galleryHeading } from "@/config/siteData";
import { galleryPhotos, type GalleryPhoto } from "@/data/gallery";
import { SectionHeading } from "@/components/SectionHeading";
import { MediaImage } from "@/components/MediaImage";
import { Lightbox } from "@/components/Lightbox";
import { fadeUp } from "@/animations/variants";

const ROW_SPAN: Record<NonNullable<GalleryPhoto["span"]> | "default", number> = {
  default: 28,
  tall: 40,
  wide: 20,
  big: 34,
};

const COL_SPAN: Partial<Record<NonNullable<GalleryPhoto["span"]>, string>> = {
  wide: "sm:col-span-2",
  big: "sm:col-span-2",
};

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="bg-black px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={galleryHeading.title} subtitle={galleryHeading.subtitle} />

        <div className="mt-12 grid auto-rows-[10px] grid-flow-row-dense grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {galleryPhotos.map((photo, i) => (
            <motion.button
              key={photo.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              data-cursor="hover"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              aria-label={`Открыть фото: ${photo.alt}`}
              style={{ gridRowEnd: `span ${ROW_SPAN[photo.span ?? "default"]}` }}
              className={`group relative overflow-hidden rounded-sm text-left ${
                COL_SPAN[photo.span as keyof typeof COL_SPAN] ?? ""
              }`}
            >
              <MediaImage
                src={photo.src}
                srcSet={photo.srcSet}
                sizes="(min-width: 1024px) 25vw, (min-width: 600px) 33vw, 50vw"
                alt={photo.alt}
                className="h-full w-full object-cover grayscale-[35%] transition-[transform,filter] duration-700 ease-cinematic group-hover:scale-110 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <Lightbox
            photos={galleryPhotos}
            index={activeIndex}
            onClose={() => setActiveIndex(null)}
            onNavigate={setActiveIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
