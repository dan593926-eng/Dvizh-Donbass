import { useEffect, useState } from 'react'
import { Menu, X, ArrowDownRight } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { siteData } from '../config/siteData'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 28)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  const goTo = (id: string) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <>
      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <button className="nav-brand" aria-label="На главную" onClick={() => goTo('home')}>
          <span className="brand-mark">ДД</span>
          <span className="brand-copy">
            <strong>Движ Донбасс</strong>
            <small>Terikon Culture</small>
          </span>
        </button>

        <nav className="desktop-nav" aria-label="Основная навигация">
          {siteData.nav.map((item) => (
            <button key={item.id} onClick={() => goTo(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="menu-toggle" onClick={() => setOpen(true)} aria-label="Открыть меню" aria-expanded={open}>
          <Menu size={22} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.18 : 0.35 }}
          >
            <div className="mobile-menu-top">
              <span>ДД / MENU</span>
              <button onClick={() => setOpen(false)} aria-label="Закрыть меню">
                <X size={28} />
              </button>
            </div>
            <nav aria-label="Мобильная навигация">
              {siteData.nav.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => goTo(item.id)}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  transition={{ delay: reduced ? 0 : index * 0.045, duration: 0.35 }}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                  <ArrowDownRight size={18} />
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
