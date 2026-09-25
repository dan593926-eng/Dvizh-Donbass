import { ArrowDownRight } from 'lucide-react'
import { Reveal } from './Reveal'

type SectionIntroProps = {
  index: string
  eyebrow: string
  title: string
  intro?: string
  align?: 'left' | 'right'
}

export function SectionIntro({ index, eyebrow, title, intro, align = 'left' }: SectionIntroProps) {
  return (
    <div className={`section-intro ${align === 'right' ? 'section-intro-right' : ''}`}>
      <Reveal>
        <div className="section-label">
          <span>{index}</span>
          <div className="section-label-line" />
          <span>{eyebrow}</span>
        </div>
      </Reveal>
      <Reveal delay={0.06}>
        <h2>{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.12}>
          <p>{intro}</p>
        </Reveal>
      )}
      <ArrowDownRight className="section-arrow" size={25} strokeWidth={1.25} />
    </div>
  )
}
