import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav } from "@/config/siteData";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { isLowPerf } from "@/lib/performance";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled
            ? `bg-black/90 border-b border-white/5 ${isLowPerf ? "" : "lg:bg-black/75 lg:backdrop-blur-md"}`
            : "bg-transparent",
        ].join(" ")}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <nav
          aria-label="Основная навигация"
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
        >
          <a
            href="#home"
            data-cursor="hover"
            aria-label="Движ Донбасс — на главную"
            className="flex items-center"
          >
            <Logo size="sm" priority className="h-8 w-auto sm:h-9" />
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  data-cursor="hover"
                  className="text-sm font-medium uppercase tracking-widish text-fog transition-colors hover:text-gold"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            data-cursor="hover"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-bone lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
