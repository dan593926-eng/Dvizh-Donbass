import { motion, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import { useIsTouchDevice } from "@/hooks/usePointerType";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  /** Открывать ссылку в новой вкладке (для внешних соцсетей) */
  external?: boolean;
};

/**
 * Кнопка/ссылка с лёгким «магнитным» смещением к курсору.
 * Смещение идёт через motion values — без перерисовки React на каждое движение мыши.
 * На touch-устройствах — обычная кнопка без эффекта.
 */
export function MagneticButton({
  children,
  className,
  href,
  onClick,
  ariaLabel,
  external = Boolean(href),
}: MagneticButtonProps) {
  const isTouch = useIsTouchDevice();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 12, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 150, damping: 12, mass: 0.4 });

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - (rect.left + rect.width / 2)) * 0.25);
    rawY.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const shared = {
    onMouseMove: handleMove,
    onMouseLeave: reset,
    "data-cursor": "hover",
    "aria-label": ariaLabel,
    style: { x, y },
    className,
  };

  if (href) {
    return (
      <motion.a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        {...shared}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} {...shared}>
      {children}
    </motion.button>
  );
}
