import { motion } from "framer-motion";
import { cultureItems } from "@/config/siteData";
import { MediaImage } from "@/components/MediaImage";
import { fadeUp } from "@/animations/variants";

// Чередующаяся ширина карточек — намеренно "неровный" ритм ленты
const WIDTHS = [
  "w-[78vw] xs:w-[340px]",
  "w-[70vw] xs:w-[300px]",
  "w-[85vw] xs:w-[400px]",
];

export function Culture() {
  return (
    <section aria-labelledby="culture-heading" className="relative overflow-hidden bg-black py-20 sm:py-28">
      <motion.h2
        id="culture-heading"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        className="font-display px-5 text-display-md font-semibold uppercase tracking-tightest text-bone sm:px-8"
      >
        Культура движа
      </motion.h2>

      <div className="scrollbar-none mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:gap-6 sm:px-8">
        {cultureItems.map((item, i) => (
          <motion.div
            key={item.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className={`group relative shrink-0 snap-start overflow-hidden rounded-sm ${WIDTHS[i % WIDTHS.length]}`}
          >
            <div className="relative aspect-[3/4]">
              <MediaImage
                src={`/images/culture/${item.id}.jpg`}
                alt={item.title}
                className="h-full w-full object-cover grayscale-[35%] transition-[transform,filter] duration-700 ease-cinematic group-hover:scale-110 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <h3 className="font-display text-2xl font-semibold uppercase text-bone sm:text-3xl">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[30ch] translate-y-1 text-sm text-fog opacity-90 transition-all duration-500 ease-cinematic group-hover:translate-y-0 group-hover:opacity-100">
                {item.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
