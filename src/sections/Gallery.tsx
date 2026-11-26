import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, InstagramLogo } from "@phosphor-icons/react";
import { COMPANY, HOUSE_PHOTOS, REELS, assetUrl, pushEvent } from "../data/site";
import { Reveal, SectionLabel, SplitWords } from "../components/motion";

/*
 * Fotos do salão passando sozinhas.
 * - só baixa as fotos quando a seção está chegando;
 * - espera todas decodificarem e só então começa, então nunca aparece moldura vazia;
 * - velocidade constante em px/s; para fora da tela (lib/visibility.ts) e, com mouse, quando o ponteiro passa por cima.
 */
const TILTS = [-2.5, 2, -1.5, 3, -2, 1.5, -3, 2.5];
const REEL_SPEED = 46; // px por segundo

function PhotoReel() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const loop = [...HOUSE_PHOTOS, ...HOUSE_PHOTOS];

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "1400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!near || !el) return;
    let cancelled = false;
    const setDuration = () => el.style.setProperty("--reel-duration", `${Math.max(24, el.scrollWidth / 2 / REEL_SPEED).toFixed(1)}s`);
    const ro = new ResizeObserver(setDuration);
    Promise.all([...el.querySelectorAll("img")].map((img) => img.decode().catch(() => undefined))).then(() => {
      if (cancelled) return;
      setDuration();
      ro.observe(el);
      setReady(true);
    });
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [near]);

  return (
    <div ref={root} data-ready={ready} className="reel pause-hover relative flex min-h-[360px] items-center overflow-hidden py-10 sm:min-h-[460px]">
      <div ref={track} className="reel-track items-center gap-6 pr-6">
        {loop.map((p, i) => (
          <figure key={`${p.src}-${i}`} aria-hidden={i >= HOUSE_PHOTOS.length} className="shrink-0 rounded-[22px] bg-cream-50 p-2 shadow-[0_26px_50px_-24px_rgba(0,0,0,0.7)]" style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}>
            <img
              src={near ? assetUrl(p.src) : undefined}
              width={p.w}
              height={p.h}
              alt={i < HOUSE_PHOTOS.length ? p.alt : ""}
              loading="eager"
              decoding="async"
              draggable={false}
              className="h-64 w-auto rounded-[16px] object-cover sm:h-[22rem]"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

/* Salão em fotos + o que estão falando (Google e perfis de gastronomia). */
export function Gallery() {
  return (
    <section id="quem-ja-veio" className="relative isolate overflow-hidden bg-wine-800 py-24 text-cream-50 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grain absolute inset-0 opacity-60" />
        <div className="glow absolute -right-48 -top-24 h-[720px] w-[720px] [--glow-a:0.24] [--glow:240_137_15]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionLabel index="07" tone="dark">Quem já veio</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(2.4rem,5.4vw,4.8rem)] font-medium leading-[1.02] tracking-tight text-balance">
              <SplitWords text="Casa cheia desde o *primeiro* dia." accentClassName="italic text-ember-400" />
            </h2>
          </div>
          <Reveal className="text-lg leading-relaxed text-cream-100/75 lg:col-span-4">Abrimos em 18 de novembro e a Zona Sul já apareceu em peso. Veja o salão e os vídeos de quem já passou por aqui.</Reveal>
        </div>
      </div>

      <div className="mt-8">
        <PhotoReel />
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-5 px-5 sm:px-8 lg:grid-cols-12">
        {/* Instagram da casa */}
        <Reveal className="min-w-0 lg:col-span-5">
          <a
            href={COMPANY.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => pushEvent("instagram_click", { link_location: "secao_instagram" })}
            className="group flex h-full flex-col justify-between gap-8 rounded-[30px] bg-ember-500 p-6 text-wine-950 transition-transform duration-500 hover:-translate-y-0.5 sm:p-9"
          >
            <div>
              <InstagramLogo weight="bold" className="h-9 w-9" />
              <p className="font-display mt-5 text-[2.6rem] font-medium leading-[0.95] tracking-tight sm:text-[3.4rem]">31,1 mil</p>
              <p className="mt-2 max-w-xs text-[15px] font-medium leading-snug opacity-80">pessoas acompanham as novidades da casa no Instagram.</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-display min-w-0 truncate text-lg font-medium sm:text-xl">@{COMPANY.instagramHandle}</span>
              <span className="shrink-0 rounded-full bg-wine-950 px-5 py-3 text-sm font-semibold text-cream-50 transition-colors group-hover:bg-wine-800">Seguir</span>
            </div>
          </a>
        </Reveal>

        {/* Reels de quem visitou */}
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 lg:col-span-7">
          {REELS.map((r, i) => (
            <Reveal key={r.url} delay={i * 0.06}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => pushEvent("instagram_click", { link_location: "reels" })}
                className="group flex items-center gap-4 rounded-[22px] bg-white/[0.06] p-4 ring-1 ring-white/10 transition-[background-color,transform] duration-500 hover:-translate-y-0.5 hover:bg-white/[0.11] sm:p-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-ember-400 to-wine-500 text-cream-50">
                  <InstagramLogo weight="bold" className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display block truncate text-xl font-medium leading-tight">{r.title}</span>
                  <span className="mt-0.5 block truncate text-sm text-cream-100/60">
                    @{r.handle}
                    {r.likes ? ` · ${r.likes}` : ""}
                  </span>
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 transition-colors duration-500 group-hover:border-ember-400 group-hover:bg-ember-400 group-hover:text-wine-950">
                  <ArrowUpRight weight="bold" className="h-4 w-4" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
