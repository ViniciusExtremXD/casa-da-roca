import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Car, InstagramLogo, Star } from "@phosphor-icons/react";
import { COMPANY, PRICES, assetUrl, brl, openStatus, type OpenStatus } from "../data/site";
import { EASE_OUT, Magnetic, SplitWords } from "../components/motion";
import { PrimaryCta } from "../components/cta";

/* Brasas com posições fixas (nada de Math.random: o HTML pré-renderizado precisa bater com o do navegador). */
const EMBERS = [
  { left: "6%", s: 5, d: 0, t: 9, dx: 30 },
  { left: "14%", s: 3, d: 2.4, t: 11, dx: -20 },
  { left: "23%", s: 6, d: 5.1, t: 10, dx: 44 },
  { left: "31%", s: 4, d: 1.2, t: 12, dx: -36 },
  { left: "42%", s: 3, d: 6.6, t: 9, dx: 18 },
  { left: "51%", s: 5, d: 3.3, t: 13, dx: -28 },
  { left: "60%", s: 4, d: 7.8, t: 10, dx: 36 },
  { left: "68%", s: 6, d: 0.6, t: 12, dx: -16 },
  { left: "77%", s: 3, d: 4.2, t: 9, dx: 26 },
  { left: "85%", s: 5, d: 8.4, t: 11, dx: -40 },
  { left: "93%", s: 4, d: 2.9, t: 13, dx: 14 },
];

/* "Aberto agora": só no navegador, atualizado a cada minuto. No HTML pré-renderizado fica o horário geral. */
export function useOpenStatus(): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const tick = () => setStatus(openStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}

export function Hero({ ready }: { ready: boolean }) {
  const status = useOpenStatus();

  /* As fotos acompanham o ponteiro de leve (só com mouse). */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const mainX = useTransform(sx, (v) => v * -14);
  const mainY = useTransform(sy, (v) => v * -10);
  const sideX = useTransform(sx, (v) => v * 22);
  const sideY = useTransform(sy, (v) => v * 16);

  const show = ready ? "show" : "hidden";
  const fade = (delay: number) => ({
    variants: { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } },
    initial: "hidden",
    animate: show,
    transition: { duration: 0.9, ease: EASE_OUT, delay },
  });

  return (
    <section
      id="topo"
      className="relative isolate overflow-hidden bg-wine-950 text-cream-50"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      {/* Madeira escura, luz de forno e brasas */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-wine-900 via-wine-950 to-[#120302]" />
        <div className="bg-grain absolute inset-0 opacity-70" />
        <div className="glow absolute -right-40 top-10 h-[820px] w-[820px] [--glow-a:0.34] [--glow:240_137_15]" />
        <div className="glow absolute -left-64 bottom-[-220px] h-[720px] w-[720px] [--glow-a:0.5] [--glow:107_26_20]" />
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="ember-dot animate-rise"
            style={{ left: e.left, ["--s" as string]: `${e.s}px`, ["--dx" as string]: `${e.dx}px`, animationDelay: `${e.d}s`, animationDuration: `${e.t}s` }}
          />
        ))}
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-5 pb-16 pt-32 sm:px-8 sm:pt-36 lg:min-h-[100svh] lg:grid-cols-12 lg:gap-8 lg:pb-20">
        <div className="min-w-0 lg:col-span-7">
          <motion.div {...fade(0.05)} className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-1.5 pr-4 text-[13px] font-medium text-cream-100 backdrop-blur-sm">
            <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${status && !status.open ? "bg-white/15 text-cream-50" : "bg-ember-500 text-wine-950"}`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className={`absolute inline-flex h-full w-full rounded-full ${status && !status.open ? "" : "animate-pulse-ring bg-wine-950"}`} />
                <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${status && !status.open ? "bg-cream-50" : "bg-wine-950"}`} />
              </span>
              {status ? status.label : "Aberto todos os dias"}
            </span>
            <span className="min-w-0 truncate">{status ? `${status.detail} · R$ ${brl(status.price)} por pessoa` : "das 11h às 23h"}</span>
          </motion.div>

          <h1 className="font-display mt-7 text-[clamp(2.9rem,8.2vw,6.6rem)] font-medium leading-[0.96] tracking-tightest text-balance">
            <SplitWords text="Comida de roça," immediate={ready} delay={0.15} />{" "}
            <SplitWords text="*à* *vontade,*" immediate={ready} delay={0.42} accentClassName="italic text-ember-400" />{" "}
            <SplitWords text="na Zona Sul." immediate={ready} delay={0.62} />
          </h1>

          <motion.p {...fade(0.85)} className="mt-7 max-w-xl text-[17px] leading-relaxed text-cream-100/80 sm:text-lg">
            Buffet caipira completo, carnes grelhadas, mesa de sobremesas e, no jantar, rodízio de pizzas. Todos os dias no Socorro, a partir de{" "}
            <strong className="whitespace-nowrap font-semibold text-cream-50">R$ {brl(PRICES.from)}</strong> por pessoa.
          </motion.p>

          <motion.div {...fade(1)} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <PrimaryCta location="hero" tone="ember" message="Olá! Vim pelo site da Casa da Roça e gostaria de reservar uma mesa.">
              Reservar pelo WhatsApp
            </PrimaryCta>
            <Magnetic strength={0.15}>
              <a href="#valores" className="group inline-flex items-center gap-3 text-[15px] font-semibold text-cream-50">
                <span className="border-b border-cream-50/40 pb-0.5 transition-colors group-hover:border-ember-400">Ver valores</span>
                <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition-colors group-hover:border-ember-400 group-hover:text-ember-400">
                  <ArrowDown weight="bold" className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5" />
                </span>
              </a>
            </Magnetic>
          </motion.div>

          <motion.ul {...fade(1.15)} className="mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-7 text-[13px] sm:gap-4 sm:text-sm">
            <li>
              <p className="font-display flex items-baseline gap-1 whitespace-nowrap text-[1.6rem] font-medium text-cream-50 min-[380px]:text-3xl sm:gap-1.5 sm:text-4xl">
                {COMPANY.googleRating.toLocaleString("pt-BR")} <Star weight="fill" className="h-4 w-4 translate-y-[-2px] text-ember-400 sm:h-5 sm:w-5" />
              </p>
              <p className="mt-1 leading-snug text-cream-100/60">{COMPANY.googleReviews} avaliações no Google</p>
            </li>
            <li>
              <p className="font-display flex items-baseline gap-1 whitespace-nowrap text-[1.6rem] font-medium text-cream-50 min-[380px]:text-3xl sm:gap-1.5 sm:text-4xl">
                31 mil <InstagramLogo weight="bold" className="h-4 w-4 translate-y-[-1px] text-ember-400 sm:h-5 sm:w-5" />
              </p>
              <p className="mt-1 leading-snug text-cream-100/60">seguidores no Instagram</p>
            </li>
            <li>
              <p className="font-display flex items-baseline gap-1 whitespace-nowrap text-[1.6rem] font-medium text-cream-50 min-[380px]:text-3xl sm:gap-1.5 sm:text-4xl">
                Grátis <Car weight="fill" className="h-4 w-4 translate-y-[-1px] text-ember-400 sm:h-5 sm:w-5" />
              </p>
              <p className="mt-1 leading-snug text-cream-100/60">estacionamento no local</p>
            </li>
          </motion.ul>
        </div>

        {/* Fotos em arco de forno + selo do preço */}
        <div className="relative mx-auto w-full max-w-[420px] lg:col-span-5 lg:max-w-none">
          <motion.div
            className="arch relative aspect-[4/5] overflow-hidden shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
            style={{ x: mainX, y: mainY }}
            initial={{ clipPath: "inset(100% 0% 0% 0% round 999px 999px 28px 28px)" }}
            animate={ready ? { clipPath: "inset(0% 0% 0% 0% round 999px 999px 28px 28px)" } : undefined}
            transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
          >
            <motion.img
              src={assetUrl("images/buffet-farofa.webp")}
              alt="Buffet da Casa da Roça com travessas de barro cheias de farofa, arroz e assados"
              width={719}
              height={1258}
              className="h-full w-full object-cover object-[50%_72%]"
              initial={{ scale: 1.25 }}
              animate={ready ? { scale: 1.04 } : undefined}
              transition={{ duration: 2.2, ease: EASE_OUT, delay: 0.2 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wine-950/55 via-transparent to-transparent" />
            <p className="absolute inset-x-0 bottom-5 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-cream-50/85">Fotos reais do nosso buffet</p>
          </motion.div>

          <motion.div
            className="absolute -left-5 bottom-10 w-[42%] sm:-left-12 lg:-left-16"
            style={{ x: sideX, y: sideY }}
            initial={{ opacity: 0, y: 60, rotate: -14 }}
            animate={ready ? { opacity: 1, y: 0, rotate: -7 } : undefined}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.95 }}
          >
            <figure className="rounded-[18px] bg-cream-50 p-1.5 pb-2 shadow-[0_24px_50px_-18px_rgba(0,0,0,0.75)]">
              <img src={assetUrl("images/doces-brigadeiro.webp")} alt="Docinhos e tortas da mesa de sobremesas" width={717} height={890} className="aspect-square w-full rounded-[13px] object-cover object-[50%_30%]" />
              <figcaption className="font-display pt-1.5 text-center text-[13px] italic text-wine-700 sm:text-sm">sobremesa incluída</figcaption>
            </figure>
          </motion.div>

          <motion.div
            className="absolute -right-2 top-[9%] sm:-right-3"
            initial={{ opacity: 0, scale: 0.4, rotate: -40 }}
            animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
            transition={{ type: "spring", stiffness: 160, damping: 14, delay: 1.15 }}
          >
            <PriceSeal />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* Selo do preço: o texto gira em volta, o número fica parado (como o selo das artes de promoção). */
function PriceSeal() {
  const [int, cents] = brl(PRICES.from).split(",");
  return (
    <div className="relative grid h-[124px] w-[124px] place-items-center rounded-full bg-ember-500 text-wine-950 shadow-[0_18px_40px_-12px_rgba(240,137,15,0.7)] sm:h-[148px] sm:w-[148px]">
      <svg viewBox="0 0 148 148" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden>
        <defs>
          <path id="seal-circle" d="M74 74 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
        </defs>
        <text className="fill-wine-950 text-[10.5px] font-bold uppercase" style={{ letterSpacing: "0.21em" }}>
          <textPath href="#seal-circle">à vontade • almoço e jantar • a partir de •</textPath>
        </text>
      </svg>
      <div className="relative text-center leading-none">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em]">a partir de</p>
        <p className="font-display mt-0.5 flex items-start justify-center text-[2.6rem] font-semibold tracking-tight sm:text-[3.1rem]">
          <span className="mr-0.5 mt-1.5 text-sm font-bold">R$</span>
          {int}
          <span className="mt-1.5 text-lg font-bold">,{cents}</span>
        </p>
      </div>
    </div>
  );
}
