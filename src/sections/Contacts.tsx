import { ArrowUpRight, Send } from 'lucide-react'
import { siteData } from '../config/siteData'
import { Reveal } from '../components/Reveal'

export function Contacts() {
  return (
    <section id="contacts" className="section contacts-section">
      <div className="shell">
        <div className="contacts-label">08 <span /> CONTACTS</div>
        <Reveal className="contacts-title">
          <h2>СТАНЬ ЧАСТЬЮ<br /><em>ИСТОРИИ.</em></h2>
        </Reveal>
        <Reveal className="contacts-grid" delay={0.08}>
          <p>Соцсети, новые встречи, фото и всё, что хочется оставить в общей памяти. Все ссылки ниже меняются в одном файле конфигурации.</p>
          <div className="socials">
            {siteData.socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" data-cursor="hover">
                <span>{social.label}</span>
                <ArrowUpRight size={20} />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-top">
        <div className="footer-brand">ДВИЖ<br />ДОНБАСС</div>
        <div className="footer-line">{siteData.brand.footerLine}</div>
        <a className="footer-send" href="#home" aria-label="Наверх" data-cursor="hover"><Send size={20} /></a>
      </div>
      <div className="shell footer-bottom">
        <span>TERIKON CULTURE / 2026</span>
        <span>MADE FOR THE MOVEMENT</span>
      </div>
    </footer>
  )
}
