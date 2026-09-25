import { useState } from "react";
import { asset } from "@/lib/asset";

type LogoProps = {
  className?: string;
  /** "sm" — лёгкий вариант для навигации/футера, "full" — полноразмерный для первого экрана */
  size?: "sm" | "full";
  priority?: boolean;
};

/**
 * Логотип «Движ Донбасс». Файлы лежат в /public/images/brand/ —
 * как заменить, описано в README («Логотип»).
 * Если файл не найден, показывается текстовая заглушка — сайт не ломается.
 */
export function Logo({ className, size = "sm", priority = false }: LogoProps) {
  const [failed, setFailed] = useState(false);
  const base = size === "sm" ? "/images/brand/logo-sm" : "/images/brand/logo";

  if (failed) {
    return (
      <span
        className={`font-display inline-flex items-baseline gap-2 font-semibold uppercase leading-none text-bone ${className ?? ""}`}
      >
        Движ <span className="text-gold">Донбасс</span>
      </span>
    );
  }

  return (
    <picture>
      <source srcSet={asset(`${base}.webp`)} type="image/webp" />
      <img
        src={asset(`${base}.png`)}
        alt="Движ Донбасс"
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
      />
    </picture>
  );
}
