import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { hero, site } from "@/config/siteData";
import { Logo } from "@/components/Logo";
import { Particles } from "@/components/Particles";
import { useIsTouchDevice } from "@/hooks/usePointerType";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { asset } from "@/lib/asset";
import { isLowPerf } from "@/lib/performance";
import { staggerContainer, wordReveal, fadeIn, scaleIn } from "@/animations/variants";

type HeroProps = {
  /** false, пока идёт интро — анимация появления стартует сразу после него */
  ready: boolean;
};

export function Hero({ ready }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Параллакс: слои двигаются с разной скоростью при прокрутке.
  // Только на компьютерах. На телефонах прокрутка идёт в отдельном потоке,
  // и JS-параллакс за ней не успевает — слои дрожат. Там слои стоят на месте.
  const parallax = !isTouch && !reducedMotion;
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const skylineY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const showVideo = Boolean(hero.backgroundVideo) && !reducedMotion;
  const showImage = Boolean(hero.backgroundImage) && !showVideo;

  return (
    <section
      id="home"
      ref={ref}
      className="scanlines relative isolate flex h-[100svh] min-h-[560px] w-full items-center justify-center overflow-hidden bg-black"
    >
      {/* Настоящий H1 для поисковиков и скринридеров — визуально его роль играет логотип */}
      <h1 className="sr-only">
        {site.name} — {hero.kicker}
      </h1>

      {/* Необязательный фон: фото или видео из siteData.ts → hero */}
      {(showVideo || showImage) && (
        <motion.div style={parallax ? { y: bgY } : undefined} className="absolute inset-0 -z-10" aria-hidden="true">
          {showVideo ? (
            <video
              className="h-[115%] w-full object-cover opacity-35 grayscale-[40%]"
              src={asset(hero.backgroundVideo)}
              poster={hero.backgroundImage ? asset(hero.backgroundImage) : undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              className="h-[115%] w-full object-cover opacity-35 grayscale-[40%]"
              src={asset(hero.backgroundImage)}
              alt=""
              decoding="async"
            />
          )}
        </motion.div>
      )}

      {/* Световые засветы: мягкие радиальные градиенты вместо filter: blur —
          выглядят так же, но почти ничего не стоят видеокарте */}
      <motion.div
        aria-hidden="true"
        style={parallax ? { y: glowY } : undefined}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="light-leak absolute left-1/2 top-[-12%] h-[95vh] w-[120vw] max-w-[1400px] -translate-x-1/2"
          style={{ background: "radial-gradient(closest-side, rgba(255,216,0,0.22), rgba(255,216,0,0.06) 55%, transparent)" }}
        />
        <div
          className="light-leak-slow absolute -left-[25%] top-[12%] h-[70vh] w-[70vw]"
          style={{ background: "radial-gradient(closest-side, rgba(193,68,30,0.22), transparent)" }}
        />
        <div
          className="light-leak absolute -right-[25%] top-[-6%] h-[60vh] w-[60vw]"
          style={{ background: "radial-gradient(closest-side, rgba(255,216,0,0.12), transparent)" }}
        />
      </motion.div>

      {!isLowPerf && <Particles />}

      {/* Силуэт терриконов — та же гора, что в логотипе, в масштабе пейзажа */}
      <motion.svg
        aria-hidden="true"
        style={parallax ? { y: skylineY } : undefined}
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] w-full text-graphite"
      >
        <path
          d="M0,260 L0,180 L90,120 L150,175 L230,90 L300,170 L380,60 L460,165 L560,110 L640,170 L720,40 L800,160 L900,100 L980,175 L1060,80 L1150,170 L1230,120 L1310,175 L1440,150 L1440,260 Z"
          fill="currentColor"
        />
      </motion.svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] w-full bg-gradient-to-t from-black to-transparent" />

      {/* Виньетка для читаемости */}
      <div className="bg-vignette pointer-events-none absolute inset-0" aria-hidden="true" />

      <motion.div
        style={parallax ? { y: contentY, opacity: contentOpacity } : undefined}
        variants={staggerContainer(0.18, 0.1)}
        initial="hidden"
        animate={ready ? "show" : "hidden"}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <motion.span
          variants={wordReveal}
          className="font-display mb-5 text-xs font-medium uppercase tracking-widish text-gold sm:text-sm"
        >
          {hero.kicker}
        </motion.span>

        <motion.div
          variants={scaleIn}
          className="w-full max-w-[280px] xs:max-w-[340px] sm:max-w-[460px] lg:max-w-[560px]"
        >
          <Logo
            size="full"
            priority
            className="h-auto w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
          />
        </motion.div>

        <motion.p variants={fadeIn} className="prose-measure mt-7 text-sm text-fog sm:text-base">
          {hero.subtitle}
        </motion.p>
      </motion.div>

      <motion.a
        href="#about"
        variants={fadeIn}
        initial="hidden"
        animate={ready ? "show" : "hidden"}
        data-cursor="hover"
        className="absolute bottom-6 left-1/2 z-10 flex min-h-[44px] -translate-x-1/2 flex-col items-center justify-end gap-2 text-fog hover:text-gold"
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <span className="text-[11px] uppercase tracking-widish">{hero.scrollHint}</span>
        {/* Покачивание стрелки — чистый CSS, работает без JavaScript на каждом кадре */}
        <span className="scroll-bob">
          <ChevronDown size={16} aria-hidden="true" />
        </span>
      </motion.a>
    </section>
  );
}
