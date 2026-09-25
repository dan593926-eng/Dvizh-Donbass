import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { GalleryItem } from '../config/siteData'

type LightboxProps = {
  items: readonly GalleryItem[]
  active: number | null
  onClose: () => void
  onChange: (index: number) => void
}

export function Lightbox({ items, active, onClose, onChange }: LightboxProps) {
  const reduced = useReducedMotion()
  const item = active !== null ? items[active] : null

  useEffect(() => {
    if (active === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onChange((active + 1) % items.length)
      if (event.key === 'ArrowLeft') onChange((active - 1 + items.length) % items.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, items.length, onChange, onClose])

  useEffect(() => {
    document.body.classList.toggle('lightbox-open', active !== null)
    return () => document.body.classList.remove('lightbox-open')
  }, [active])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button className="lightbox-close" onClick={onClose} aria-label="Закрыть просмотр"><X /></button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); onChange((active! - 1 + items.length) % items.length) }} aria-label="Предыдущее фото"><ChevronLeft /></button>
          <motion.figure
            className="lightbox-figure"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={item.image} alt={item.alt} draggable={false} />
            <figcaption><span>{item.meta}</span><strong>{item.title}</strong></figcaption>
          </motion.figure>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); onChange((active! + 1) % items.length) }} aria-label="Следующее фото"><ChevronRight /></button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
