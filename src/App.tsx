import { useCallback, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { bindAnchorLinks, initSmoothScroll } from "./lib/smooth-scroll";
import { pauseOffscreenAnimations } from "./lib/visibility";
import { pushEvent } from "./data/site";
import { CookieNotice, FloatingContact, Nav, Preloader, ScrollProgress } from "./components/chrome";
import { Hero } from "./sections/Hero";
import { House, Strip } from "./sections/House";
import { Buffet } from "./sections/Buffet";
import { DayNight } from "./sections/DayNight";
import { Reviews } from "./sections/Reviews";
import { Prices } from "./sections/Prices";
import { Gallery } from "./sections/Gallery";
import { Reservation } from "./sections/Reservation";
import { Faq, Footer, Location } from "./sections/Location";

export default function App() {
  const [ready, setReady] = useState(false);
  const onIntroDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    const stopScroll = initSmoothScroll();
    const unbind = bindAnchorLinks();
    const stopPause = pauseOffscreenAnimations();

    // Quais partes da página o visitante chega a ver (uma vez por seção).
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!entry.isIntersecting || seen.has(id)) continue;
          seen.add(id);
          pushEvent("section_view", { section_id: id });
        }
      },
      { threshold: 0.3 },
    );
    document.querySelectorAll("main section[id]").forEach((el) => io.observe(el));

    return () => {
      stopScroll();
      unbind();
      stopPause();
      io.disconnect();
    };
  }, []);

  return (
    // Motion é parte da proposta; muitos PCs Windows informam "reduzir movimento" só por terem efeitos desligados.
    <MotionConfig reducedMotion="never">
      <Preloader onDone={onIntroDone} />
      <ScrollProgress />
      <Nav />
      <main className="paper">
        <Hero ready={ready} />
        <Strip />
        <Reviews />
        <Location />
        <House />
        <Buffet />
        <DayNight />
        <Prices />
        <Gallery />
        <Reservation />
        <Faq />
      </main>
      <Footer />
      <FloatingContact />
      <CookieNotice />
    </MotionConfig>
  );
}
