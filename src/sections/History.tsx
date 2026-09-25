import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { siteData } from '../config/siteData'
import { Reveal } from '../components/Reveal'
import { SectionIntro } from '../components/SectionIntro'

export function History() {
  const reduced = useReducedMotion()
  return (
    <section id="history" className="section history-section">
      <div className="shell">
        <SectionIntro index={siteData.history.index} eyebrow={siteData.history.eyebrow} title={siteData.history.title} />
        <Reveal className="history-intro"><p>{siteData.history.text}</p></Reveal>

        <div className="timeline">
          <div className="timeline-line" aria-hidden="true" />
          {siteData.history.timeline.map((item, index) => (
            <motion.article
              key={item.date}
              className="timeline-item"
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: index % 2 ? 18 : -18 }}
              whileInView={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="timeline-marker" />
              <div className="timeline-date">{item.date}</div>
              <div className="timeline-content">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <ArrowRight size={20} />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
