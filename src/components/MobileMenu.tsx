import { motion } from "framer-motion";
import { nav, socialLinks } from "@/config/siteData";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { staggerContainer, fadeUp } from "@/animations/variants";

type MobileMenuProps = {
  onClose: () => void;
};

export function MobileMenu({ onClose }: MobileMenuProps) {
  useLockBodyScroll(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-40 flex flex-col bg-black lg:hidden"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex-1 overflow-y-auto px-8 pt-28 pb-10">
        <motion.ul
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-2"
        >
          {nav.map((item) => (
            <motion.li key={item.href} variants={fadeUp}>
              <a
                href={item.href}
                onClick={onClose}
                className="block py-3 font-display text-4xl font-semibold uppercase tracking-tightest text-bone active:text-gold xs:text-5xl"
              >
                {item.label}
              </a>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-12 flex flex-wrap gap-x-6 gap-y-2"
        >
          {socialLinks.map((link) => (
            <a
              key={link.type}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm font-medium uppercase tracking-widish text-fog"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
