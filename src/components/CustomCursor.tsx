import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useIsTouchDevice } from "@/hooks/usePointerType";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Кастомный курсор: маленькая точка + мягкое кольцо с задержкой (spring trailing).
 * При наведении на элементы с [data-cursor="hover"] или на ссылки/кнопки — кольцо увеличивается.
 * Полностью отключён на touch-устройствах и при prefers-reduced-motion.
 */
export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);

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
      if (!visible) setVisible(true);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [data-cursor="hover"], input, textarea'
      );
      setIsHovering(Boolean(interactive));
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      document.documentElement.classList.remove("cursor-ready");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouch, reducedMotion]);

  if (isTouch || reducedMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] hidden md:block"
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s ease" }}
    >
      {/* Точка — следует за курсором мгновенно */}
      <motion.div
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      {/* Кольцо — следует с мягкой задержкой (spring) */}
      <motion.div
        className="fixed left-0 top-0 rounded-full border border-gold/70"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isHovering ? 56 : 28,
          height: isHovering ? 56 : 28,
          backgroundColor: isHovering ? "rgba(255,216,0,0.1)" : "rgba(255,216,0,0)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </div>
  );
}
