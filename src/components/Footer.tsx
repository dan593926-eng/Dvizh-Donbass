import type { ComponentType, ReactNode } from "react";
import { ArrowUp, Globe, Instagram, Send, Users, Youtube } from "lucide-react";
import { footer, socialLinks, contactsSection } from "@/config/siteData";
import { Logo } from "./Logo";
import { MagneticButton } from "./MagneticButton";

// ---------- Иконки Discord и TikTok (в библиотеке lucide-react их нет) ----------
// Нарисованы в том же линейном стиле, что и остальные иконки сайта.
type IconProps = {
  size?: number;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

function Base({ size = 24, className, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

function DiscordIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" />
      <path d="M7 16.5c3.5 1 6.5 1 10 0" />
    </Base>
  );
}

function TikTokIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 12a4 4 0 1 0 4 4V3a5 5 0 0 0 5 5" />
    </Base>
  );
}

// ---------- Кнопки соцсетей ----------
type IconComponent = ComponentType<{ size?: number }>;

// Иконка подбирается по полю `type` в socialLinks (src/config/siteData.ts).
// Для неизвестного типа показывается значок «глобус».
const ICONS: Record<string, IconComponent> = {
  telegram: Send,
  instagram: Instagram,
  discord: DiscordIcon,
  tiktok: TikTokIcon,
  youtube: Youtube,
  vk: Users,
};

export function Footer() {
  return (
    <footer
      id="contacts"
      className="relative border-t border-white/10 bg-graphite px-5 pb-10 pt-20 sm:px-8"
      style={{ paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-sm font-medium uppercase tracking-widish text-gold">
          {contactsSection.heading}
        </h2>
        <p className="prose-measure mt-3 text-fog">{contactsSection.body}</p>

        <Logo size="sm" className="mt-10 h-16 w-auto sm:h-20" />
        <p className="mt-4 text-base text-fog sm:text-lg">{footer.tagline}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          {socialLinks.map((link) => {
            const Icon = ICONS[link.type] ?? Globe;
            return (
              <MagneticButton
                key={link.type}
                href={link.href}
                ariaLabel={link.label}
                className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-bone transition-colors hover:border-gold hover:text-gold"
              >
                <Icon size={16} aria-hidden="true" />
                {link.label}
              </MagneticButton>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-smoke sm:flex-row sm:items-center sm:justify-between">
          <span>{footer.copyright}</span>
          <a
            href="#home"
            data-cursor="hover"
            className="inline-flex items-center gap-1.5 hover:text-gold"
          >
            <ArrowUp size={14} aria-hidden="true" />
            Наверх
          </a>
        </div>
      </div>
    </footer>
  );
}
