import { useEffect, useState } from "react";

/**
 * true, если основной указатель устройства — палец (touch), а не мышь/трекпад.
 * Используется, чтобы полностью отключить кастомный курсор и magnetic-эффекты на мобильных.
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isTouch;
}
