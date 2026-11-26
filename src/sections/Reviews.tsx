import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, GoogleLogo, Star } from "@phosphor-icons/react";
import { COMPANY, REVIEWS, pushEvent } from "../data/site";
import { Counter, Reveal, SectionLabel, SplitWords } from "../components/motion";

const AUTO_MS = 6500;

/*
 * Avaliações públicas do Google em carrossel.
 * - no celular arrasta com o dedo; no computador tem setas, arrasto com o mouse e as bolinhas;
 * - anda sozinho a cada 6,5 s enquanto está na tela, e para de vez assim que o visitante mexe.
 */
export function Reviews() {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [stops, setStops] = useState(REVIEWS.length);
  const hovering = useRef(false);
  const touched = useRef(false);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  /* Passo = largura de um cartão + o espaço entre eles. */
  const step = useCallback(() => {
    const el = track.current;
    const card = el?.children[0] as HTMLElement | undefined;
    if (!el || !card) return 1;
    return card.offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0);
  }, []);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const s = step();
    const perView = Math.max(1, Math.round((el.clientWidth + (parseFloat(getComputedStyle(el).columnGap) || 0)) / s));
    const n = Math.max(1, REVIEWS.length - perView + 1);
    setStops(n);
    setIndex(Math.min(n - 1, Math.max(0, Math.round(el.scrollLeft / s))));
  }, [step]);

  const go = useCallback(
    (to: number, loop = false) => {
      const el = track.current;
      if (!el) return;
      const s = step();
      const perView = Math.max(1, Math.round((el.clientWidth + (parseFloat(getComputedStyle(el).columnGap) || 0)) / s));
      const last = Math.max(0, REVIEWS.length - perView);
      const target = to > last ? (loop ? 0 : last) : to < 0 ? (loop ? last : 0) : to;
      el.scrollTo({ left: target * s, behavior: "smooth" });
    },
    [step],
  );

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    const timer = window.setInterval(() => {
      if (!visible || hovering.current || touched.current || document.hidden) return;
      go(Math.round(el.scrollLeft / step()) + 1, true);
    }, AUTO_MS);

    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [go, measure, step]);

  const byHand = (to: number) => {
    touched.current = true;
    go(to, true);
  };

  /* Arrastar com o mouse: solta o encaixe enquanto arrasta e encaixa no cartão mais próximo ao soltar. */
  const endDrag = () => {
    const el = track.current;
    const d = drag.current;
    drag.current = null;
    if (!el || !d?.moved) return;
    el.style.cursor = "";
    el.style.userSelect = "";
    go(Math.round(el.scrollLeft / step()));
    window.setTimeout(() => (el.style.scrollSnapType = ""), 450);
  };

  return (
    <section id="avaliacoes" className="relative overflow-hidden bg-cream-50 py-20 sm:py-28">
      <div aria-hidden className="bg-gingham mask-fade-b pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-8 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <SectionLabel index="01">Avaliações no Google</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(2.3rem,5vw,4.4rem)] font-medium leading-[1.03] tracking-tight text-wine-800 text-balance">
              <SplitWords text="Quem já veio conta como *foi.*" accentClassName="italic text-ember-600" />
            </h2>
          </div>

          <Reveal className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-3 lg:col-span-5 lg:justify-end">
            <p className="font-display text-[4.6rem] font-medium leading-[0.85] tracking-tight text-wine-700 sm:text-[5.4rem]">
              <Counter to={COMPANY.googleRating} decimals={1} />
            </p>
            <div>
              <div className="flex gap-0.5 text-ember-500" role="img" aria-label="Nota 4,4 de 5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} weight={i < 4 ? "fill" : "duotone"} className="h-6 w-6" />
                ))}
              </div>
              <p className="mt-1.5 text-sm text-wine-900/65">nota média em {COMPANY.googleReviews} avaliações</p>
              <a
                href={COMPANY.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => pushEvent("google_reviews_click", { link_location: "avaliacoes" })}
                className="group mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-wine-700 underline decoration-wine-600/30 underline-offset-4 transition-colors hover:decoration-wine-600"
              >
                Ver todas no Google <ArrowUpRight weight="bold" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </Reveal>
        </div>

        <ul
          ref={track}
          aria-label="Avaliações publicadas no Google"
          className="no-scrollbar -mx-5 mt-8 flex cursor-grab snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 py-4 sm:-mx-8 sm:scroll-px-8 sm:gap-5 sm:px-8 lg:mx-0 lg:scroll-px-1 lg:px-1"
          onPointerEnter={(e) => e.pointerType === "mouse" && (hovering.current = true)}
          onPointerLeave={() => {
            hovering.current = false;
            endDrag();
          }}
          onTouchStart={() => (touched.current = true)}
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse" || e.button !== 0) return;
            drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: false };
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            const dx = e.clientX - d.x;
            if (!d.moved && Math.abs(dx) < 6) return;
            if (!d.moved) {
              d.moved = true;
              touched.current = true;
              e.currentTarget.style.scrollSnapType = "none";
              e.currentTarget.style.cursor = "grabbing";
              e.currentTarget.style.userSelect = "none";
            }
            e.currentTarget.scrollLeft = d.left - dx;
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {REVIEWS.map((r) => (
            <li
              key={r.name}
              className="flex w-[86%] shrink-0 snap-start flex-col rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-wine-600/[0.07] sm:w-[calc((100%-1.25rem)/2)] sm:p-7 lg:w-[calc((100%-2.5rem)/3)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5 text-ember-500" role="img" aria-label="5 de 5 estrelas">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} weight="fill" className="h-[18px] w-[18px]" />
                  ))}
                </div>
                <GoogleLogo weight="bold" className="h-5 w-5 text-wine-300" aria-label="Publicada no Google" />
              </div>
              <blockquote className="font-display mt-4 text-[1.18rem] leading-[1.46] text-wine-900 sm:text-[1.25rem]">“{r.text}”</blockquote>
              <div className="mt-auto flex items-center gap-3 pt-6">
                <span aria-hidden className="font-display grid h-11 w-11 shrink-0 place-items-center rounded-full bg-wine-600 text-lg font-medium text-cream-50">
                  {r.name[0]}
                </span>
                <p className="min-w-0 text-sm leading-snug">
                  <span className="block font-semibold text-wine-800">{r.name}</span>
                  <span className="block text-wine-900/60">
                    {r.guide ? "Local Guide · " : ""}
                    {r.when}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => byHand(index - 1)}
              aria-label="Avaliação anterior"
              className="grid h-12 w-12 place-items-center rounded-full border border-wine-600/20 text-wine-700 transition-colors duration-300 hover:border-wine-600 hover:bg-wine-600 hover:text-cream-50"
            >
              <ArrowLeft weight="bold" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => byHand(index + 1)}
              aria-label="Próxima avaliação"
              className="grid h-12 w-12 place-items-center rounded-full border border-wine-600/20 text-wine-700 transition-colors duration-300 hover:border-wine-600 hover:bg-wine-600 hover:text-cream-50"
            >
              <ArrowRight weight="bold" className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: stops }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-current={i === index}
                aria-label={`Ir para a avaliação ${i + 1}`}
                onClick={() => byHand(i)}
                className="group grid h-8 place-items-center px-0.5"
              >
                <span className={`block h-1.5 rounded-full transition-[width,background-color] duration-500 ${i === index ? "w-8 bg-wine-600" : "w-1.5 bg-wine-600/25 group-hover:bg-wine-600/50"}`} />
              </button>
            ))}
          </div>
        </div>
        <p className="mt-5 text-[13px] leading-relaxed text-wine-900/50">Trechos de avaliações públicas de 5 estrelas, com o nome abreviado.</p>
      </div>
    </section>
  );
}
