import { Headphones } from 'lucide-react'
import { siteData } from '../config/siteData'
import { Reveal } from '../components/Reveal'
import { SectionIntro } from '../components/SectionIntro'
import { MusicPlayer } from '../components/MusicPlayer'

export function Music() {
  return (
    <section id="music" className="section music-section">
      <div className="shell">
        <div className="music-section-header">
          <SectionIntro index={siteData.music.index} eyebrow={siteData.music.eyebrow} title={siteData.music.title} />
          <Reveal className="music-copy" delay={0.08}>
            <Headphones size={21} />
            <p>{siteData.music.text}</p>
          </Reveal>
        </div>
        <Reveal delay={0.12}>
          <MusicPlayer tracks={siteData.music.tracks} />
        </Reveal>
      </div>
    </section>
  )
}
