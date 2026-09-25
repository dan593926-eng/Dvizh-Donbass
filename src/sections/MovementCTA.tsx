import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { movement } from "@/config/siteData";
import { MediaImage } from "@/components/MediaImage";
import { RevealText } from "@/animations/RevealText";
import { useIsTouchDevice } from "@/hooks/usePointerType";
import { fadeUp } from "@/animations/variants";

export function MovementCTA() {
  const ref = useRef<HTMLElement>(null);
  const isTouch = useIsTouchDevice();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], isTouch ? ["-3%", "3%"] : ["-8%", "8%"]);

  return (
    <section
      id="movement"
      ref={ref}
      className="relative isolate flex min-h-[80vh] items-center justify-center overflow-hidden bg-black px-5 py-28 sm:px-8"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10" aria-hidden="true">
        <MediaImage
          src="/images/movement/crowd.jpg"
          alt=""
          className="h-full w-full scale-110 object-cover opacity-40"
        />
      </motion.div>
      <div className="bg-vignette absolute inset-0 -z-10" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl text-center">
        <RevealText
          as="h2"
          text={movement.heading}
          className="font-display block text-display-lg font-semibold uppercase leading-[0.95] tracking-tightest text-bone"
        />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="prose-measure mx-auto mt-8 text-base text-fog sm:text-lg"
        >
          {movement.body}
        </motion.p>
      </div>
    </section>
  );
}
