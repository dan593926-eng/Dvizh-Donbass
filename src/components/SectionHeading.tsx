import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/animations/variants";

type SectionHeadingProps = {
  title: string;
  align?: "left" | "center";
  subtitle?: ReactNode;
  id?: string;
};

export function SectionHeading({
  title,
  align = "left",
  subtitle,
  id,
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className={align === "center" ? "text-center" : "text-left"}
    >
      <h2
        id={id}
        className="font-display text-display-lg font-semibold uppercase tracking-tightest text-bone"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="prose-measure mt-4 text-base text-fog sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}
