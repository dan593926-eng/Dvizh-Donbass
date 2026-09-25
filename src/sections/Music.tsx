import { motion } from "framer-motion";
import { Music as MusicIcon, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { musicSection } from "@/config/siteData";
import { tracks } from "@/data/tracks";
import { SectionHeading } from "@/components/SectionHeading";
import { MediaImage } from "@/components/MediaImage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeUp } from "@/animations/variants";
import { asset } from "@/lib/asset";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function Music() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  const track = tracks[trackIndex];

  // Настраиваем Web Audio API один раз — createMediaElementSource нельзя вызывать дважды
  // на одном и том же <audio>-элементе.
  const ensureAudioGraph = () => {
    if (!audioRef.current || sourceRef.current) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    const source = ctx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    sourceRef.current = source;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(data);

    const { width, height } = canvas;
    ctx2d.clearRect(0, 0, width, height);

    const barCount = 28;
    const barWidth = width / barCount;
    for (let i = 0; i < barCount; i++) {
      const value = data[Math.floor((i / barCount) * bufferLength)] / 255;
      const barHeight = Math.max(3, value * height);
      ctx2d.fillStyle = i % 4 === 0 ? "#FFE666" : "#FFD800";
      ctx2d.fillRect(i * barWidth + 1, height - barHeight, barWidth - 2, barHeight);
    }

    rafRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close();
    };
  }, []);

  if (!track) {
    return (
      <section id="music" className="bg-black px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title={musicSection.heading} />
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="prose-measure mt-10 flex items-start gap-4 rounded-sm border border-white/10 bg-graphite p-6 sm:p-8"
          >
            <MusicIcon className="mt-1 shrink-0 text-gold" size={22} aria-hidden="true" />
            <p className="text-sm text-fog sm:text-base">{musicSection.emptyState}</p>
          </motion.div>
        </div>
      </section>
    );
  }

  const togglePlay = async () => {
    ensureAudioGraph();
    if (audioCtxRef.current?.state === "suspended") {
      await audioCtxRef.current.resume();
    }
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      await audioRef.current.play();
    }
    setIsPlaying((v) => !v);
  };

  const changeTrack = (nextIndex: number) => {
    setIsPlaying(false);
    setProgress(0);
    setTrackIndex((nextIndex + tracks.length) % tracks.length);
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = value;
    setProgress(value);
  };

  return (
    <section id="music" className="bg-black px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={musicSection.heading} subtitle={musicSection.subheading} />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-12 overflow-hidden rounded-sm border border-white/10 bg-graphite"
        >
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
            <MediaImage
              src={track.cover}
              alt={`Обложка: ${track.title}`}
              className="h-40 w-40 shrink-0 rounded-sm object-cover sm:h-44 sm:w-44"
            />

            <div className="min-w-0 flex-1">
              <h3 className="font-display truncate text-2xl font-semibold uppercase text-bone sm:text-3xl">
                {track.title}
              </h3>
              <p className="mt-1 text-fog">{track.artist}</p>

              <canvas
                ref={canvasRef}
                width={480}
                height={64}
                className="mt-5 h-16 w-full"
                aria-hidden="true"
              />

              <audio
                ref={audioRef}
                src={asset(track.src)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
                onEnded={() => changeTrack(trackIndex + 1)}
                preload="none"
              />

              <div className="mt-4 flex items-center gap-3">
                <span className="w-10 text-xs text-smoke">{formatTime(progress)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={progress}
                  onChange={handleSeek}
                  aria-label="Перемотка трека"
                  className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-steel accent-gold"
                />
                <span className="w-10 text-xs text-smoke">{formatTime(duration)}</span>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => changeTrack(trackIndex - 1)}
                  aria-label="Предыдущий трек"
                  data-cursor="hover"
                  className="text-fog hover:text-gold"
                >
                  <SkipBack size={20} />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
                  data-cursor="hover"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-black transition-transform hover:scale-105"
                >
                  {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => changeTrack(trackIndex + 1)}
                  aria-label="Следующий трек"
                  data-cursor="hover"
                  className="text-fog hover:text-gold"
                >
                  <SkipForward size={20} />
                </button>
              </div>
            </div>
          </div>

          {tracks.length > 1 && (
            <ul className="divide-y divide-white/5 border-t border-white/10">
              {tracks.map((t, i) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => changeTrack(i)}
                    data-cursor="hover"
                    className={`flex w-full items-center justify-between px-6 py-3 text-left text-sm transition-colors sm:px-8 ${
                      i === trackIndex ? "text-gold" : "text-fog hover:text-bone"
                    }`}
                  >
                    <span className="truncate">{t.title} — {t.artist}</span>
                    {i === trackIndex && isPlaying && (
                      <span className="ml-3 shrink-0 text-xs uppercase tracking-widish">
                        {reducedMotion ? "Играет" : "● Играет"}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  );
}
