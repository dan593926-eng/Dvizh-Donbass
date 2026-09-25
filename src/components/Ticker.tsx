import { useEffect, useRef } from "react";

type TickerProps = {
  items: readonly string[];
  variant?: "gold" | "dark";
  /** Наклон ленты в градусах — как росчерк в логотипе */
  tilt?: number;
  reverse?: boolean;
};

/**
 * Бегущая строка между секциями — переход «как на концерте»:
 * жёлтая лента-росчерк из логотипа + повторяющийся текст.
 * Анимация на чистом CSS (transform), останавливается при prefers-reduced-motion.
 * Контейнер обрезает наклонённую ленту — горизонтального скролла не будет.
 */
export function Ticker({ items, variant = "gold", tilt = -2, reverse = false }: TickerProps) {
  // Повторяем фразы, чтобы одна половина ленты была шире любого экрана (до 2560px)
  const ref = useRef<HTMLDivElement>(null);

  // Лента крутится только пока видна на экране — вне экрана анимация на паузе
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      el.classList.toggle("ticker-paused", !entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const line = Array.from({ length: 3 }, () => items.join("  ✦  ")).join("  ✦  ") + "  ✦  ";
  const colors =
    variant === "gold"
      ? "bg-gold text-black"
      : "bg-graphite text-bone border-y border-white/10";

  return (
    <div
      ref={ref}
      className="pointer-events-none relative overflow-hidden py-8 sm:py-10"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <div
        className={`-mx-[5%] w-[110%] ${colors}`}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <div className={`ticker-track flex w-max whitespace-nowrap py-3 sm:py-4 ${reverse ? "ticker-reverse" : ""}`}>
          <span className="font-display px-2 text-2xl font-bold uppercase tracking-wide sm:text-4xl">
            {line}
          </span>
          <span className="font-display px-2 text-2xl font-bold uppercase tracking-wide sm:text-4xl">
            {line}
          </span>
        </div>
      </div>
    </div>
  );
}
