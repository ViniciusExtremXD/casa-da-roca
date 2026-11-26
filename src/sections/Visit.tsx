import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, NavigationArrow, Star } from "@phosphor-icons/react";
import { COMPANY, REVIEWS, assetUrl, hoursFor, pushEvent, saoPauloNow } from "../data/site";
import { Counter, Reveal, SectionLabel, SplitWords } from "../components/motion";
import { PrimaryCta } from "../components/cta";
import { useOpenStatus } from "./Hero";

const AUTO_MS = 7000;

const HOURS = [
  { days: "Segunda a sexta", match: (d: number) => d >= 1 && d <= 5, h: hoursFor(1) },
  { days: "Sábado e domingo", match: (d: number) => d === 0 || d === 6, h: hoursFor(6) },
];

function Stars({ size = "h-4 w-4", rating = 5 }: { size?: string; rating?: number }) {
  return (
    <span className="flex gap-0.5 text-ember-500" role="img" aria-label={`Nota ${String(rating).replace(".", ",")} de 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} weight={i + 1 <= Math.round(rating) ? "fill" : "regular"} className={size} />
      ))}
    </span>
  );
}

/*
 * Avaliações (com foto da casa) à esquerda e mapa à direita, na mesma seção.
 * Os depoimentos ficam empilhados na mesma célula do grid: a altura é a do mais longo, então nada pula ao trocar.
 */
function ReviewCarousel() {
  const [index, setIndex] = useState(0);
  const loaded = useRef(new Set<number>([0, 1]));
  const box = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const touched = useRef(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const n = REVIEWS.length;

  const go = useCallback(
    (to: number) => {
      const next = (to + n) % n;
      loaded.current.add(next);
      loaded.current.add((next + 1) % n);
      setIndex(next);
    },
    [n],
  );
  const byHand = (to: number) => {
    touched.current = true;
    go(to);
  };

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.45 });
    io.observe(el);
    const timer = window.setInterval(() => {
      if (!visible || hovering.current || touched.current || document.hidden) return;
      setIndex((i) => {
        const next = (i + 1) % n;
        loaded.current.add(next);
        loaded.current.add((next + 1) % n);
        return next;
      });
    }, AUTO_MS);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [n]);

  return (
    <div
      ref={box}
      className="flex h-full min-w-0 flex-col rounded-[28px] bg-white p-5 ring-1 ring-wine-600/[0.08] sm:p-7"
      onPointerEnter={(e) => e.pointerType === "mouse" && (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
        <div className="flex items-center gap-3">
          <p className="font-display text-[2.6rem] font-medium leading-none tracking-tight text-wine-700">
            <Counter to={COMPANY.googleRating} decimals={1} />
          </p>
          <div>
            <Stars rating={COMPANY.googleRating} />
            <p className="mt-1 text-[13px] text-wine-900/60">nota média em {COMPANY.googleReviews} avaliações</p>
          </div>
        </div>
        <a
          href={COMPANY.googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => pushEvent("google_reviews_click", { link_location: "avaliacoes" })}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-wine-700 underline decoration-wine-600/30 underline-offset-4 transition-colors hover:decoration-wine-600"
        >
          Ver todas no Google <ArrowUpRight weight="bold" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      <div
        className="mt-6 grid flex-1 touch-pan-y select-none"
        aria-roledescription="carrossel"
        aria-label="Avaliações publicadas no Google"
        onPointerDown={(e) => (start.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => {
          const s = start.current;
          start.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(e.clientY - s.y)) byHand(index + (dx < 0 ? 1 : -1));
        }}
        onPointerCancel={() => (start.current = null)}
      >
        {REVIEWS.map((r, i) => {
          const on = i === index;
          return (
            <figure
              key={r.name}
              aria-hidden={!on}
              className={`col-start-1 row-start-1 flex min-w-0 flex-col transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                on ? "translate-x-0 opacity-100 delay-200 duration-700" : "pointer-events-none -translate-x-3 opacity-0 duration-200"
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-cream-200">
                {loaded.current.has(i) && (
                  <img
                    src={assetUrl(r.photo)}
                    alt={r.photoAlt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    style={{ objectPosition: r.photoPosition }}
                    className={`h-full w-full object-cover transition-transform duration-[2.4s] ease-out ${on ? "scale-100" : "scale-[1.06]"}`}
                  />
                )}
              </div>
              <blockquote className="font-display mt-5 text-[1.2rem] leading-[1.45] text-wine-900 sm:text-[1.35rem]">“{r.text}”</blockquote>
              <figcaption className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-5 text-sm">
                <span>
                  <span className="font-semibold text-wine-800">{r.name}</span>
                  <span className="text-wine-900/55">
                    {r.guide ? " · Local Guide" : ""} · {r.when}
                  </span>
                </span>
                <Stars size="h-3.5 w-3.5" />
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-wine-600/10 pt-5">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => byHand(index - 1)}
            aria-label="Avaliação anterior"
            className="grid h-11 w-11 place-items-center rounded-full border border-wine-600/20 text-wine-700 transition-colors duration-300 hover:border-wine-600 hover:bg-wine-600 hover:text-cream-50"
          >
            <ArrowLeft weight="bold" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => byHand(index + 1)}
            aria-label="Próxima avaliação"
            className="grid h-11 w-11 place-items-center rounded-full border border-wine-600/20 text-wine-700 transition-colors duration-300 hover:border-wine-600 hover:bg-wine-600 hover:text-cream-50"
          >
            <ArrowRight weight="bold" className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          {REVIEWS.map((r, i) => (
            <button key={r.name} type="button" aria-current={i === index} aria-label={`Ver a avaliação ${i + 1}`} onClick={() => byHand(i)} className="group grid h-8 place-items-center px-[3px]">
              <span className={`block h-1.5 rounded-full transition-[width,background-color] duration-500 ${i === index ? "w-6 bg-wine-600" : "w-1.5 bg-wine-600/25 group-hover:bg-wine-600/50"}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* O mapa só carrega quando a seção está chegando: o iframe do Google pesa. */
function MapPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-[400px] min-w-0 overflow-hidden rounded-[28px] bg-cream-200 ring-1 ring-wine-600/[0.08] sm:h-[480px] lg:h-full lg:min-h-[520px]">
      {show && (
        <iframe
          title="Mapa: Casa da Roça, Av. Guarapiranga, 143, Socorro, São Paulo"
          src={COMPANY.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
        />
      )}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-white/95 p-4 shadow-[0_10px_30px_-12px_rgba(43,7,7,0.35)] backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-5">
        <div className="min-w-0">
          <p className="font-display text-xl font-medium leading-tight text-wine-800 sm:text-2xl">{COMPANY.address.street}</p>
          <p className="text-sm text-wine-900/65">
            {COMPANY.address.district} · {COMPANY.address.city} · CEP {COMPANY.address.cep}
          </p>
        </div>
        <div className="pointer-events-auto flex gap-2">
          <a
            href={COMPANY.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => pushEvent("maps_click", { link_location: "mapa" })}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-wine-600 px-5 text-sm font-semibold text-cream-50 transition-colors hover:bg-wine-800"
          >
            <NavigationArrow weight="fill" className="h-4 w-4" /> Traçar rota
          </a>
          <a
            href={COMPANY.wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => pushEvent("maps_click", { link_location: "waze" })}
            className="inline-flex h-11 items-center rounded-full border border-wine-600/20 bg-white px-5 text-sm font-semibold text-wine-800 transition-colors hover:bg-cream-100"
          >
            Waze
          </a>
        </div>
      </div>
    </div>
  );
}

export function Visit() {
  const status = useOpenStatus();
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(saoPauloNow().dow), []);

  return (
    <section id="como-chegar" className="relative bg-cream-100 py-20 sm:py-28">
      <div id="avaliacoes" className="absolute top-0" aria-hidden />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-7">
            <SectionLabel>Avaliações e como chegar</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(2.3rem,5vw,4.4rem)] font-medium leading-[1.03] tracking-tight text-wine-800 text-balance">
              <SplitWords text="Quem já veio conta como *foi.*" accentClassName="italic text-ember-600" />
            </h2>
          </div>
          <Reveal className="text-lg leading-relaxed text-wine-900/70 lg:col-span-5">
            Na Avenida Guarapiranga, no Socorro, com estacionamento grátis na porta. A casa abre todos os dias, do almoço ao jantar.
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2 lg:gap-6">
          <Reveal className="min-w-0">
            <ReviewCarousel />
          </Reveal>
          <Reveal delay={0.08} className="min-w-0">
            <MapPanel />
          </Reveal>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-wine-900/50">
          Fotos do salão e do buffet da casa. Os textos são trechos de avaliações públicas de 5 estrelas no Google, com o nome abreviado.
        </p>

        {/* Horários e reserva, sem cartão: duas colunas separadas por linha */}
        <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-12 border-t border-wine-600/15 pt-12 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-display text-[1.9rem] font-medium leading-tight text-wine-800">Horários</h3>
              {status && <p className={`text-sm font-semibold ${status.open ? "text-ember-700" : "text-wine-900/55"}`}>{status.open ? `Aberto agora, ${status.detail}` : `${status.label}, ${status.detail}`}</p>}
            </div>
            <table className="mt-5 w-full text-[15px]">
              <thead className="text-left text-[11px] font-bold uppercase tracking-[0.16em] text-wine-900/45">
                <tr>
                  <th className="pb-2 font-bold">Dia</th>
                  <th className="pb-2 font-bold">Almoço</th>
                  <th className="pb-2 font-bold">Jantar</th>
                </tr>
              </thead>
              <tbody>
                {HOURS.map((row) => {
                  const active = today !== null && row.match(today);
                  return (
                    <tr key={row.days} className={`border-t border-wine-600/10 ${active ? "text-wine-800" : "text-wine-900/75"}`}>
                      <td className={`py-3.5 pr-2 leading-snug ${active ? "font-semibold" : "font-medium"}`}>
                        {row.days}
                        {active && <span className="ml-2 align-middle text-[11px] font-bold uppercase tracking-[0.14em] text-ember-600">hoje</span>}
                      </td>
                      <td className="tnum whitespace-nowrap py-3.5 pr-3">
                        {row.h.almoco[0]}h às {row.h.almoco[1]}h
                      </td>
                      <td className="tnum whitespace-nowrap py-3.5">
                        {row.h.jantar[0]}h às {row.h.jantar[1]}h
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-3 text-[13px] leading-relaxed text-wine-900/55">Em feriados, o almoço segue o horário de fim de semana. Estacionamento grátis no pátio da frente.</p>
          </Reveal>

          <Reveal delay={0.08} className="min-w-0 lg:col-span-5 lg:border-l lg:border-wine-600/15 lg:pl-12">
            <h3 className="font-display text-[1.9rem] font-medium leading-tight text-wine-800">Quer garantir a mesa?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-wine-900/70">Mande o dia, o horário e quantas pessoas vêm. A equipe responde pelo WhatsApp com a disponibilidade.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
              <PrimaryCta location="como_chegar" size="md" message="Olá! Vim pelo site da Casa da Roça e gostaria de reservar uma mesa.">
                Reservar pelo WhatsApp
              </PrimaryCta>
              <a href="#reservas" className="text-[15px] font-semibold text-wine-700 underline decoration-wine-600/30 underline-offset-4 transition-colors hover:decoration-wine-600">
                Montar o pedido por aqui
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
