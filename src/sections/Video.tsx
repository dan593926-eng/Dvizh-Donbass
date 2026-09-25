import { Play, ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { siteData } from '../config/siteData'
import { Reveal } from '../components/Reveal'
import { SectionIntro } from '../components/SectionIntro'

export function VideoSection() {
  const reduced = useReducedMotion()
  return (
    <section id="video" className="section video-section">
      <div className="shell">
        <SectionIntro index={siteData.video.index} eyebrow={siteData.video.eyebrow} title={siteData.video.title} />
        <Reveal className="video-intro"><p>{siteData.video.description}</p></Reveal>
        <div className="video-grid">
          {siteData.video.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <motion.a
                className="video-card"
                href={item.href}
                target="_blank"
                rel="noreferrer"
                whileHover={reduced ? undefined : { y: -6 }}
                data-cursor="hover"
              >
                <img src={item.poster} alt="" loading="lazy" />
                <div className="video-shade" />
                <div className="video-play"><Play size={19} fill="currentColor" /></div>
                <div className="video-copy">
                  <span>{item.meta}</span>
                  <h3>{item.title}</h3>
                </div>
                <ArrowUpRight className="video-arrow" size={22} />
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
