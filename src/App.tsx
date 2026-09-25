import { useEffect, useState } from 'react'
import { CustomCursor } from './components/CustomCursor'
import { Navbar } from './components/Navbar'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Culture } from './sections/Culture'
import { Music } from './sections/Music'
import { History } from './sections/History'
import { Gallery } from './sections/Gallery'
import { VideoSection } from './sections/Video'
import { Dvizh } from './sections/Dvizh'
import { Contacts, Footer } from './sections/Contacts'

function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
}

export default function App() {
  return (
    <div className="app">
      <ScrollProgress />
      <CustomCursor />
      <a className="skip-link" href="#main-content">К содержимому</a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Culture />
        <Music />
        <History />
        <Gallery />
        <VideoSection />
        <Dvizh />
        <Contacts />
      </main>
      <Footer />
    </div>
  )
}
