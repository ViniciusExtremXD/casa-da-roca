import { useCallback, useEffect, useRef, useState } from "react";
import { COMPANY, REVIEWS, pushEvent } from "../data/site";
import { Arrow } from "../components/cta";

const STAR = "M8 1.2l2 4.3 4.7.5-3.5 3.2 1 4.6L8 11.5l-4.2 2.3 1-4.6L1.3 6l4.7-.5z";

function Stars({ value = 5, className = "h-3.5" }: { value?: number; className?: string }) {
  const pct = `${(value / 5) * 100}%`;
  const row = (fill: string) => (
    <svg viewBox="0 0 80 16" className={`${className} w-auto`} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={STAR} transform={`translate(${i * 16} 0)`} fill={fill} />
      ))}
    </svg>
  );
  return (
    <span className="relative inline-block align-middle" role="img" aria-label={`${String(value).replace(".", ",")} de 5 estrelas`}>
      <span className="block opacity-25">{row("currentColor")}</span>
      <span className="absolute inset-y-0 left-0 overflow-hidden text-lamparina" style={{ width: pct }}>
        {row("currentColor")}
      </span>
    </span>
  );
}

/*
 * Avaliações públicas do Google em carrossel: arrasta no celular, setas no computador e avança
 * sozinho a cada 7 s enquanto está na tela. Para quando o visitante mexe.
 */
export function Reviews() {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const paused = useRef(false);
  const touched = useRef(false);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el || !el.children.length) return;
    const card = (el.children[0] as HTMLElement).offsetWidth;
    setPerView(Math.max(1, Math.round(el.clientWidth / card)));
    setIndex(Math.round(el.scrollLeft / card));
  }, []);

  const go = useCallback((to: number) => {
    const el = track.current;
    if (!el) return;
    const card = (el.children[0] as HTMLElement).offsetWidth;
    const last = Math.max(0, REVIEWS.length - Math.max(1, Math.round(el.clientWidth / card)));
    const target = to > last ? 0 : to < 0 ? last : to;
    el.scrollTo({ left: target * card, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setInterval(() => {
      if (reduce || !visible || paused.current || touched.current) return;
      const card = (el.children[0] as HTMLElement).offsetWidth;
      go(Math.round(el.scrollLeft / card) + 1);
    }, 7000);

    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [go, measure]);

  const stop = () => {
    touched.current = true;
  };
  const shown = Math.min(REVIEWS.length, index + perView);

  return (
    <section id="avaliacoes" className="bg-vinho text-cal-hi">
      <div className="gutter mx-auto max-w-page py-20 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="label text-cal-hi/60">Avaliações no Google</p>
            <div className="mt-4 flex items-end gap-5">
              <span className="font-display text-[clamp(4.5rem,10vw,7.5rem)] leading-[0.8]">{String(COMPANY.googleRating).replace(".", ",")}</span>
              <span className="pb-1">
                <Stars value={COMPANY.googleRating} className="h-4" />
                <span className="mt-2 block text-[15px] text-cal-hi/75">{COMPANY.googleReviews} avaliações</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <p className="tnum text-[14px] text-cal-hi/60" aria-live="polite">
              {String(shown).padStart(2, "0")} / {String(REVIEWS.length).padStart(2, "0")}
            </p>
            <div className="flex">
              <button
                type="button"
                onClick={() => {
                  stop();
                  go(index - 1);
                }}
                className="grid h-12 w-12 place-items-center border border-cal-hi/30 transition-colors hover:bg-cal-hi hover:text-vinho"
                aria-label="Avaliação anterior"
              >
                <Arrow dir="left" />
              </button>
              <button
                type="button"
                onClick={() => {
                  stop();
                  go(index + 1);
                }}
                className="-ml-px grid h-12 w-12 place-items-center border border-cal-hi/30 transition-colors hover:bg-cal-hi hover:text-vinho"
                aria-label="Próxima avaliação"
              >
                <Arrow />
              </button>
            </div>
          </div>
        </div>

        <ul
          ref={track}
          className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain md:mx-0"
          onPointerEnter={() => (paused.current = true)}
          onPointerLeave={() => (paused.current = false)}
          onTouchStart={stop}
          onFocus={() => (paused.current = true)}
          aria-label="Trechos de avaliações publicadas no Google"
        >
          {REVIEWS.map((r, i) => (
            <li
              key={r.name}
              className={`flex w-[86%] shrink-0 snap-start flex-col border-cal-hi/20 px-5 sm:w-1/2 md:px-8 lg:w-1/3 ${i === 0 ? "md:pl-0" : "border-l"}`}
            >
              <Stars className="h-3" />
              <blockquote className="font-display mt-5 text-[1.35rem] leading-[1.38] sm:text-[1.5rem]">“{r.text}”</blockquote>
              <p className="mt-auto pt-7 text-[14px]">
                <span className="font-semibold">{r.name}</span>
                {r.guide && <span className="text-cal-hi/60"> · Local Guide</span>}
                <span className="block text-cal-hi/60">{r.when}</span>
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-12 border-t border-cal-hi/20 pt-6 text-[14px] text-cal-hi/65">
          Trechos de avaliações públicas, com o nome abreviado.{" "}
          <a
            href={COMPANY.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => pushEvent("google_reviews_click", { link_location: "avaliacoes" })}
            className="link inline-flex items-center gap-1.5 text-cal-hi"
          >
            Ler todas no Google <Arrow dir="out" className="h-3.5 w-3.5" />
          </a>
        </p>
      </div>
    </section>
  );
}
