import { motion } from "framer-motion";
import { about } from "@/config/siteData";
import { SectionHeading } from "@/components/SectionHeading";
import { fadeUp, staggerContainer } from "@/animations/variants";

export function About() {
  return (
    <section
      id="about"
      className="relative bg-black px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <SectionHeading title={about.heading} />

          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="prose-measure mt-8 flex flex-col gap-5"
          >
            {about.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className="text-base leading-relaxed text-fog sm:text-lg"
              >
                {p}
              </motion.p>
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="relative flex items-center border-l-2 border-gold/60 pl-6 lg:mt-24 lg:pl-10"
        >
          <p className="font-display text-display-md font-medium leading-[1.05] text-bone">
            {about.quote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
