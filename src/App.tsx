import { MotionConfig } from "framer-motion";
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { GrainOverlay } from "@/components/GrainOverlay";
import { CustomCursor } from "@/components/CustomCursor";
import { IntroOverlay } from "@/components/IntroOverlay";
import { Ticker } from "@/components/Ticker";
import { Footer } from "@/components/Footer";
import { tickers } from "@/config/siteData";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Culture } from "@/sections/Culture";
import { Music } from "@/sections/Music";
import { Gallery } from "@/sections/Gallery";
import { Video } from "@/sections/Video";
import { MovementCTA } from "@/sections/MovementCTA";

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    // reducedMotion="user": framer-motion сам приглушает анимации,
    // если в системе включено «уменьшить движение»
    <MotionConfig reducedMotion="user">
      <IntroOverlay onDone={() => setIntroDone(true)} />
      <CustomCursor />
      <GrainOverlay />
      <Navigation />

      <main>
        <Hero ready={introDone} />
        <About />
        <Ticker items={tickers.primary} variant="gold" tilt={-2} />
        <Culture />
        <Music />
        <Gallery />
        <Ticker items={tickers.secondary} variant="dark" tilt={1.5} reverse />
        <Video />
        <MovementCTA />
      </main>

      <Footer />
    </MotionConfig>
  );
}
