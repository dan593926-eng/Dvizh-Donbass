import { useEffect, useRef, useState } from 'react'
import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { motion } from 'motion/react'
import type { Track } from '../config/siteData'

type MusicPlayerProps = {
  tracks: readonly Track[]
}

export function MusicPlayer({ tracks }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const track = tracks[current]
  const hasSource = Boolean(track?.src)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const sync = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0)
    audio.addEventListener('timeupdate', sync)
    audio.addEventListener('ended', () => setPlaying(false))
    return () => audio.removeEventListener('timeupdate', sync)
  }, [])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio || !hasSource) return
    if (audio.paused) {
      await audio.play()
      setPlaying(true)
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  const changeTrack = (direction: -1 | 1) => {
    setPlaying(false)
    setProgress(0)
    setCurrent((value) => (value + direction + tracks.length) % tracks.length)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    setPlaying(false)
    if (track?.src) audio.load()
  }, [track])

  return (
    <div className="music-player">
      {track?.src && <audio ref={audioRef} src={track.src} preload="none" />}
      <div className="music-art-wrap">
        <motion.img
          src={track?.cover}
          alt=""
          className="music-art"
          animate={{ scale: playing ? [1, 1.03, 1] : 1 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="music-art-stamp">ДД / SOUND</span>
      </div>

      <div className="music-main">
        <div className="music-topline">
          <span>NOW PLAYING</span>
          <span>{hasSource ? 'LOCAL AUDIO' : 'ADD YOUR TRACK'}</span>
        </div>
        <h3>{track?.title}</h3>
        <p>{track?.artist}</p>

        <div className="waveform" aria-hidden="true">
          {Array.from({ length: 52 }, (_, index) => (
            <i key={index} style={{ height: `${10 + ((index * 17) % 24)}%` }} />
          ))}
          <span className="waveform-progress" style={{ width: `${progress * 100}%` }} />
        </div>

        <div className="music-controls">
          <button onClick={() => changeTrack(-1)} aria-label="Предыдущий трек" data-cursor="hover">
            <SkipBack size={18} />
          </button>
          <button className="play-button" onClick={toggle} disabled={!hasSource} aria-label={playing ? 'Пауза' : 'Воспроизвести'} data-cursor="hover">
            {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button onClick={() => changeTrack(1)} aria-label="Следующий трек" data-cursor="hover">
            <SkipForward size={18} />
          </button>
          <span className="volume-control"><Volume2 size={15} /> 100%</span>
        </div>
      </div>
    </div>
  )
}
