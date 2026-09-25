import type { ComponentType } from "react";
import { ArrowUp, Globe, Instagram, Send, Users, Youtube } from "lucide-react";
import { footer, socialLinks, contactsSection } from "@/config/siteData";
import { Logo } from "./Logo";
import { MagneticButton } from "./MagneticButton";
import { DiscordIcon, TikTokIcon } from "./SocialIcons";

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
