import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { pauseOffscreenAnimations } from "./lib/visibility";
import { pushEvent } from "./data/site";
import { CookieNotice, Header, MobileBar } from "./components/chrome";
import { Hero } from "./sections/Hero";
import { Reviews } from "./sections/Reviews";
import { Faq, Footer, Visit } from "./sections/Location";
import { DayNight } from "./sections/DayNight";
import { House } from "./sections/House";

export default function App() {
  useEffect(() => {
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
      stopPause();
      io.disconnect();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main>
        <Hero />
        <Reviews />
        <Visit />
        <DayNight />
        <House />
        <Faq />
      </main>
      <Footer />
      <MobileBar />
      <CookieNotice />
    </MotionConfig>
  );
}
