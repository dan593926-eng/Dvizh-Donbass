import { Maximize2 } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { siteData } from '../config/siteData'
import { Reveal } from '../components/Reveal'
import { SectionIntro } from '../components/SectionIntro'
import { Lightbox } from '../components/Lightbox'

export function Gallery() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="gallery" className="section gallery-section">
      <div className="shell">
        <SectionIntro index={siteData.gallery.index} eyebrow={siteData.gallery.eyebrow} title={siteData.gallery.title} />
      </div>

      <div className="shell gallery-grid">
        {siteData.gallery.items.map((item, index) => (
          <Reveal key={item.id} delay={(index % 4) * 0.04} className={`gallery-item gallery-item-${index + 1}`}>
            <motion.button
              className="gallery-frame"
              onClick={() => setActive(index)}
              whileHover={reduced ? undefined : { scale: 0.992 }}
              data-cursor="hover"
              aria-label={`Открыть: ${item.title}`}
            >
              <img
                src={item.image}
                srcSet={item.srcSet}
                sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 31vw"
                alt={item.alt}
                loading="lazy"
              />
              <div className="gallery-shade" />
              <div className="gallery-caption">
                <span>{item.meta}</span>
                <strong>{item.title}</strong>
              </div>
              <Maximize2 size={17} className="gallery-open" aria-hidden="true" />
            </motion.button>
          </Reveal>
        ))}
      </div>

      <Lightbox items={siteData.gallery.items} active={active} onClose={() => setActive(null)} onChange={setActive} />
    </section>
  )
}
