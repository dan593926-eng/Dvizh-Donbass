import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { staggerContainer, wordReveal } from "./variants";

type RevealTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Доля слов, видимая до начала анимации (0..1). По умолчанию срабатывает один раз. */
  once?: boolean;
  stagger?: number;
};

/**
 * Разбивает текст на слова и проявляет их по очереди при попадании в вьюпорт.
 * Используется для крупных эмоциональных заголовков ("ГДЕ ТЫ — ТАМ И ДВИЖ.").
 */
export function RevealText({
  text,
  as = "span",
  className,
  once = true,
  stagger = 0.06,
}: RevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });
  const words = text.split(" ");
  const Tag = motion[as as "span"];

  return (
    <Tag
      ref={ref as never}
      className={className}
      variants={staggerContainer(stagger)}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      aria-label={text}
    >
      {words.flatMap((word, i) => {
        const wordSpan = (
          <span
            key={`w-${i}`}
            className="inline-block overflow-hidden pb-[0.15em] align-bottom"
          >
            <motion.span variants={wordReveal} className="inline-block" aria-hidden="true">
              {word}
            </motion.span>
          </span>
        );
        // Обычный (breakable) пробел как отдельный текстовый узел между словами,
        // чтобы браузер мог переносить строку между соседними inline-block словами —
        // склеенные без реального пробела inline-block элементы не переносятся.
        return i < words.length - 1 ? [wordSpan, " "] : [wordSpan];
      })}
    </Tag>
  );
}
