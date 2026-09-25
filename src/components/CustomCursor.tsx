import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useIsTouchDevice } from "@/hooks/usePointerType";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Кастомный курсор: точка + мягкое кольцо с задержкой.
 * Позиция идёт через motion values (без перерисовки React на каждое движение мыши);
 * состояние меняется только когда курсор заходит на ссылку/кнопку или уходит с неё.
 * Полностью отключён на touch-устройствах и при prefers-reduced-motion.
 */
export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const hoverRef = useRef(false);
  const visibleRef = useRef(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { damping: 28, stiffness: 260, mass: 0.5 });
  const ringY = useSpring(y, { damping: 28, stiffness: 260, mass: 0.5 });

  useEffect(() => {
    if (isTouch || reducedMotion) return;
    document.documentElement.classList.add("cursor-ready");

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = Boolean(
        target?.closest?.('a, button, [data-cursor="hover"], input, textarea')
      );
      if (interactive !== hoverRef.current) {
        hoverRef.current = interactive;
        setIsHovering(interactive);
      }
    };

    const handleLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      document.documentElement.classList.remove("cursor-ready");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, [isTouch, reducedMotion, x, y]);

  if (isTouch || reducedMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] hidden md:block"
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s ease" }}
    >
      <motion.div
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      {/* Размер кольца меняется через scale (дешёвый transform), а не width/height */}
      <motion.div
        className="fixed left-0 top-0 h-7 w-7 rounded-full border border-gold/70"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? "rgba(255,216,0,0.1)" : "rgba(255,216,0,0)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </div>
  );
}
