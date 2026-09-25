import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { intro } from "@/config/siteData";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STORAGE_KEY = "dvizh-intro-seen";

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* приватный режим браузера — просто показываем интро снова */
  }
}

type IntroOverlayProps = {
  onDone: () => void;
};

/**
 * Кинематографичное интро ~2 секунды:
 * чёрный экран → шум плёнки → «ДВИЖ» → «ДОНБАСС» → экран растворяется.
 * Показывается один раз за сессию, пропускается кликом/клавишей,
 * полностью отключается при prefers-reduced-motion.
 */
export function IntroOverlay({ onDone }: IntroOverlayProps) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(
    () => intro.enabled && !reducedMotion && !alreadySeen()
  );

  useEffect(() => {
    if (!visible) {
      onDone();
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => setVisible(false), 2100);

    const skip = () => setVisible(false);
    window.addEventListener("keydown", skip);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        markSeen();
        onDone();
      }}
    >
      {visible && (
        <motion.div
          key="intro"
          aria-hidden="true"
          onClick={() => setVisible(false)}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
        >
          {/* Шум плёнки: вспыхивает и оседает */}
          <motion.div
            className="intro-noise absolute inset-[-10%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0.12] }}
            transition={{ duration: 0.8, times: [0, 0.3, 1] }}
          />
          {/* Горизонтальная полоса «VHS-трекинга» пробегает один раз */}
          <motion.div
            className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent"
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 1.2, delay: 0.2, ease: "linear" }}
          />

          <div className="relative flex flex-col items-center text-center leading-[0.85]">
            <motion.span
              className="intro-word font-display text-[clamp(3.5rem,18vw,12rem)] font-bold uppercase text-bone"
              initial={{ opacity: 0, y: 30, skewX: -8 }}
              animate={{ opacity: 1, y: 0, skewX: -8 }}
              transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {intro.wordTop}
            </motion.span>
            <motion.span
              className="intro-word font-display text-[clamp(2.6rem,13vw,8.5rem)] font-bold uppercase text-gold"
              initial={{ opacity: 0, y: 30, skewX: -8 }}
              animate={{ opacity: 1, y: 0, skewX: -8 }}
              transition={{ duration: 0.5, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              {intro.wordBottom}
            </motion.span>
            {/* Жёлтый росчерк — как подчёркивание в логотипе */}
            <motion.span
              className="mt-3 block h-[6px] origin-left -rotate-3 rounded-full bg-gold"
              style={{ width: "min(70vw, 520px)" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
