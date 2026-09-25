import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { siteData } from '../config/siteData'

export function Dvizh() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const x = useTransform(scrollYProgress, [0.55, 0.95], ['-8%', '6%'])

  return (
    <section id="dvizh" className="dvizh-section">
      <div className="dvizh-backdrop">
        <img src="/images/dvizh-1600.webp" srcSet="/images/dvizh-800.webp 800w, /images/dvizh-1600.webp 1600w" sizes="100vw" alt="" loading="lazy" />
        <div className="dvizh-shade" />
        <div className="dvizh-noise" />
      </div>

      <div className="shell dvizh-inner">
        <div className="dvizh-topline"><span>{siteData.dvizh.index}</span><span>ENERGY / 24H</span></div>
        <motion.h2 style={{ x: reduced ? undefined : x }}>
          <span>ГДЕ ТЫ —</span>
          <span>ТАМ И</span>
          <span>ДВИЖ.</span>
        </motion.h2>
        <p>{siteData.dvizh.subline}</p>
        <div className="dvizh-bottomline"><span>DD / STATE OF MIND</span><span>KEEP MOVING</span></div>
      </div>
    </section>
  )
}
