import { Quote } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { siteData } from '../config/siteData'
import { Reveal } from '../components/Reveal'
import { SectionIntro } from '../components/SectionIntro'

export function About() {
  const reduced = useReducedMotion()
  return (
    <section id="about" className="section about-section">
      <div className="shell">
        <SectionIntro index={siteData.about.index} eyebrow={siteData.about.eyebrow} title={siteData.about.title} />

        <div className="about-grid">
          <Reveal className="about-copy">
            <p className="lead-copy">{siteData.about.text}</p>
            <div className="about-rule" />
            <div className="about-facts">
              {siteData.about.facts.map(([value, label]) => (
                <div key={value} className="about-fact">
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="about-quote-wrap">
            <motion.div className="about-quote" whileHover={reduced ? undefined : { rotate: -1, y: -4 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
              <Quote size={28} strokeWidth={1.25} />
              <blockquote>{siteData.about.quote}</blockquote>
              <span>— ДВИЖ / MEMORY 001</span>
            </motion.div>
            <div className="about-side-note">NO SCRIPT.<br />JUST LIFE.</div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
