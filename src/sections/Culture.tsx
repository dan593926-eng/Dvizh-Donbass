import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { siteData } from '../config/siteData'
import { Reveal } from '../components/Reveal'
import { SectionIntro } from '../components/SectionIntro'

export function Culture() {
  const reduced = useReducedMotion()
  return (
    <section id="culture" className="section culture-section">
      <div className="shell">
        <SectionIntro index={siteData.culture.index} eyebrow={siteData.culture.eyebrow} title={siteData.culture.title} intro={siteData.culture.intro} />
      </div>

      <div className="culture-track-wrap">
        <div className="culture-track">
          {siteData.culture.items.map((item, index) => (
            <motion.article
              key={item.title}
              className={`culture-card culture-card-${index + 1}`}
              whileHover={reduced ? undefined : { y: -10 }}
            >
              <div className="culture-image-wrap">
                <img
                  src={item.image}
                  srcSet={item.srcSet}
                  sizes="(max-width: 700px) 76vw, 34vw"
                  alt=""
                  loading="lazy"
                  className="culture-image"
                />
                <div className="culture-overlay" />
                <div className="culture-index">0{index + 1}</div>
              </div>
              <div className="culture-info">
                <span>{item.tag}</span>
                <h3>{item.title}</h3>
                <ArrowUpRight size={22} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <Reveal className="shell culture-footer">
        <p>Горизонтальный скролл на телефоне работает пальцем. На десктопе — колёсиком или трекпадом.</p>
        <span>SCROLL / FEEL / REPEAT</span>
      </Reveal>
    </section>
  )
}
