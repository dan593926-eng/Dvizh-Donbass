import { ArrowDown, ArrowDownRight } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { siteData } from '../config/siteData'

export function Hero() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const imageY = useTransform(scrollYProgress, [0, 0.25], ['0%', '15%'])
  const titleY = useTransform(scrollYProgress, [0, 0.18], ['0%', '20%'])

  const enter = reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }
  const hidden = reduced ? { opacity: 0 } : { opacity: 0, y: 24 }

  return (
    <section id="home" className="hero" aria-label="Движ Донбасс">
      <div className="cinematic-curtain" aria-hidden="true"><span>ДД / 001</span></div>
      <div className="hero-image" style={{ transform: reduced ? undefined : `translate3d(0, ${0}px, 0)` }}>
        <motion.img
          src="/images/hero-1600.webp"
          srcSet="/images/hero-800.webp 800w, /images/hero-1600.webp 1600w"
          sizes="100vw"
          alt=""
          fetchPriority="high"
          className="hero-bg"
          style={{ y: reduced ? undefined : imageY }}
        />
        <div className="hero-vignette" />
        <div className="hero-light-leak" />
        <div className="hero-scanlines" />
        <div className="hero-noise" />
      </div>

      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content shell">
        <motion.div className="hero-eyebrow" initial={hidden} animate={enter} transition={{ delay: reduced ? 0 : 0.35, duration: 0.55 }}>
          <span className="status-dot" />
          {siteData.hero.eyebrow}
        </motion.div>

        <motion.div className="hero-title-wrap" initial={hidden} animate={enter} transition={{ delay: reduced ? 0 : 0.48, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ y: reduced ? undefined : titleY }}>
          <span className="hero-title-small">{siteData.hero.titleTop}</span>
          <h1>{siteData.hero.titleBottom}</h1>
        </motion.div>

        <motion.div className="hero-meta" initial={hidden} animate={enter} transition={{ delay: reduced ? 0 : 0.72, duration: 0.65 }}>
          <p>{siteData.hero.supporting}</p>
          <div className="hero-meta-right">
            <span>48°00′ N</span>
            <span>37°48′ E</span>
            <span>EST. / MEMORY</span>
          </div>
        </motion.div>

        <motion.a className="hero-scroll" href="#about" initial={hidden} animate={enter} transition={{ delay: reduced ? 0 : 0.9, duration: 0.55 }}>
          <span>{siteData.hero.scrollLabel}</span>
          <ArrowDown size={17} />
        </motion.a>
      </div>

      <div className="hero-side-mark" aria-hidden="true"><ArrowDownRight size={22} /> <span>DD / 001</span></div>
    </section>
  )
}
