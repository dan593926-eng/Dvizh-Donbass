import { useState, type ImgHTMLAttributes } from "react";
import { ImageOff } from "lucide-react";
import { asset, assetSrcSet } from "@/lib/asset";

type MediaImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  src: string;
  alt: string;
  /** Необязательно: адаптивные версии, например "/images/a-800.webp 800w, /images/a-1600.webp 1600w" */
  srcSet?: string;
  /** Подсказка браузеру, какой ширины будет картинка на экране */
  sizes?: string;
  /** true — картинка нужна сразу (первый экран), без lazy-загрузки */
  priority?: boolean;
};

/**
 * <img> с поддержкой srcset, lazy-загрузкой и аккуратной градиентной заглушкой
 * вместо сломанной иконки, пока в /public/images не добавлены реальные фото.
 */
export function MediaImage({
  src,
  alt,
  srcSet,
  sizes,
  priority = false,
  className,
  ...rest
}: MediaImageProps) {
  const [failed, setFailed] = useState(false);
  const decorative = alt === "";

  if (failed || !src) {
    return (
      <div
        className={[
          "flex items-center justify-center bg-gradient-to-br from-steel via-graphite to-black",
          className ?? "",
        ].join(" ")}
        {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": alt })}
      >
        <ImageOff className="text-smoke" size={28} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={asset(src)}
      srcSet={assetSrcSet(srcSet)}
      sizes={srcSet ? sizes ?? "100vw" : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
