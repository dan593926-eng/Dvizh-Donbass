import { motion } from "framer-motion";
import { useRef, useState, type ReactNode, type MouseEvent } from "react";
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
 * Оборачивает кнопку/ссылку лёгким "магнитным" смещением к курсору.
 * На touch-устройствах ведёт себя как обычный элемент — без смещения.
 */
export function MagneticButton({
  children,
  className,
  href,
  onClick,
  ariaLabel,
  external = Boolean(href),
}: MagneticButtonProps) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTouch = useIsTouchDevice();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: MouseEvent) => {
    const el = href ? anchorRef.current : buttonRef.current;
    if (isTouch || !el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: relX * 0.25, y: relY * 0.35 });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  const motionProps = {
    onMouseMove: handleMove,
    onMouseLeave: reset,
    "data-cursor": "hover" as const,
    "aria-label": ariaLabel,
    animate: { x: offset.x, y: offset.y },
    transition: { type: "spring" as const, stiffness: 150, damping: 12, mass: 0.4 },
    className,
  };

  if (href) {
    return (
      <motion.a
        ref={anchorRef}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button ref={buttonRef} type="button" onClick={onClick} {...motionProps}>
      {children}
    </motion.button>
  );
}
