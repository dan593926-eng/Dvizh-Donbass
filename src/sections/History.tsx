import { motion } from "framer-motion";
import { historyHeading } from "@/config/siteData";
import { timeline } from "@/data/timeline";
import { SectionHeading } from "@/components/SectionHeading";
import { fadeUp } from "@/animations/variants";

export function History() {
  return (
    <section id="history" className="bg-graphite px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeading title={historyHeading} />

        <ol className="relative mt-14 border-l border-white/10 pl-8 sm:pl-10">
          {timeline.map((entry, i) => (
            <motion.li
              key={entry.year}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: i * 0.05 }}
              className="relative pb-14 last:pb-0"
            >
              <span className="absolute -left-[calc(2rem+5px)] top-1 h-2.5 w-2.5 rounded-full bg-gold sm:-left-[calc(2.5rem+5px)]" />
              <span className="font-display text-sm font-medium uppercase tracking-widish text-gold">
                {entry.year}
              </span>
              <h3 className="font-display mt-2 text-2xl font-semibold uppercase text-bone sm:text-3xl">
                {entry.title}
              </h3>
              <p className="prose-measure mt-3 text-fog">{entry.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
