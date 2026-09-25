import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Particle = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  alpha: number;
  gold: boolean;
};

/**
 * Лёгкая «пыль в луче прожектора» на canvas.
 * - на телефонах частиц в 2 раза меньше;
 * - рисование останавливается, когда блок вне экрана или вкладка скрыта;
 * - плотность пикселей ограничена 1.5 — меньше нагрузки на слабые GPU;
 * - при prefers-reduced-motion компонент не рендерится вовсе.
 */
export function Particles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;

    const spawn = (anywhere: boolean): Particle => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 10,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.25 + 0.08),
      vx: (Math.random() - 0.5) * 0.12,
      alpha: Math.random() * 0.5 + 0.15,
      gold: Math.random() < 0.35,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 768 ? 22 : 45;
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10 || p.x < -10 || p.x > width + 10) particles[i] = spawn(false);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(255,216,0,${p.alpha})`
          : `rgba(243,239,231,${p.alpha * 0.7})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();

    let inView = true;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden || !inView ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
