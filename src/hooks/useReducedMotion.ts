import { useEffect, useState } from "react";

/**
 * Отслеживает системную настройку prefers-reduced-motion в реальном времени.
 * Используется, чтобы вручную приглушать тяжёлые эффекты (частицы, canvas-визуализатор)
 * там, где framer-motion's MotionConfig недостаточно (например, в canvas/requestAnimationFrame коде).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
