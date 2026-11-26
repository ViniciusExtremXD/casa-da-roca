import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, Moon, Sun } from "@phosphor-icons/react";
import { INCLUDED, PERIOD_LABEL, WEEKDAYS, assetUrl, brl, hoursFor, priceFor, pushEvent, saoPauloNow, type Period } from "../data/site";
import { EASE_IN_OUT, EASE_OUT, SectionLabel, SplitWords } from "../components/motion";
import { PrimaryCta } from "../components/cta";
import { Wheat } from "./House";

/* ───────────── A fazenda: o mesmo sítio de dia (almoço) e de noite (jantar) ───────────── */

const DAY = {
  serra: "#C3D4AE",
  colina: "#8FAA5B",
  roca: "#DDBE6C",
  sulco: "#C6A450",
  chao: "#FFEBCC",
  copa: "#5E7B3A",
  tronco: "#6B4423",
  ipe: "#F2B43C",
  parede: "#FFF7EA",
  barra: "#8A2E22",
  telhado: "#A4412C",
  porta: "#53100D",
  janela: "#7FA9BC",
  madeira: "#8B5E34",
};
const NIGHT: typeof DAY = {
  serra: "#2A1B36",
  colina: "#1B0E1E",
  roca: "#150810",
  sulco: "#26111A",
  chao: "#1A0404",
  copa: "#0F0612",
  tronco: "#0F0612",
  ipe: "#1A0B16",
  parede: "#3A2233",
  barra: "#24101A",
  telhado: "#160810",
  porta: "#12060C",
  janela: "#FBA22E",
  madeira: "#0C0408",
};

/* Posições fixas (o HTML pré-renderizado precisa bater com o do navegador): [esquerda %, topo px, tamanho px]. */
const STARS: [number, number, number][] = [
  [4, 46, 2], [9, 150, 3], [14, 84, 2], [19, 228, 2], [24, 30, 3], [29, 176, 2], [34, 96, 2], [39, 268, 2], [44, 22, 2], [49, 142, 3],
  [54, 60, 2], [58, 236, 2], [63, 110, 2], [68, 34, 3], [72, 190, 2], [77, 78, 2], [81, 256, 2], [86, 140, 2], [90, 52, 3], [95, 204, 2],
  [12, 300, 2], [47, 320, 2], [70, 300, 2], [97, 110, 2],
];
const FIREFLIES: [number, number][] = [[430, 236], [522, 222], [640, 214], [704, 232], [862, 224], [934, 238], [1082, 222]];

function Tree({ x, y, s = 1, copa, tronco }: { x: number; y: number; s?: number; copa: string; tronco: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect className="scene-fill" x="-2.5" y="-20" width="5" height="22" fill={tronco} />
      <circle className="scene-fill" cx="0" cy="-34" r="17" fill={copa} />
      <circle className="scene-fill" cx="-13" cy="-25" r="12" fill={copa} />
      <circle className="scene-fill" cx="13" cy="-24" r="12.5" fill={copa} />
    </g>
  );
}

function Cloud({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 120 46" className={className} aria-hidden>
      <g fill="#fff">
        <ellipse cx="60" cy="32" rx="56" ry="12" />
        <circle cx="42" cy="24" r="16" />
        <circle cx="68" cy="20" r="18" />
        <circle cx="90" cy="28" r="12" />
      </g>
    </svg>
  );
}

/* Céu: duas camadas de degradê trocando a opacidade, sol que se põe, lua que sobe, nuvens e estrelas. */
function Sky({ night }: { night: boolean }) {
  const swap = { duration: 1.3, ease: EASE_IN_OUT };
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #A9D9EC 0%, #DDF0EF 45%, #FFF1D6 82%)" }} />
      <div className={`absolute inset-0 transition-opacity duration-[1100ms] ${night ? "opacity-100" : "opacity-0"}`} style={{ background: "linear-gradient(180deg, #0B0E28 0%, #1A1436 48%, #3B1A33 84%)" }} />

      <div className={`absolute inset-0 transition-opacity duration-[1100ms] ${night ? "opacity-100" : "opacity-0"}`}>
        {STARS.map(([left, top, size], i) => (
          <span
            key={i}
            className={`absolute rounded-full bg-cream-50 ${night && i % 3 === 0 ? "animate-twinkle" : "opacity-70"}`}
            style={{ left: `${left}%`, top, width: size, height: size, animationDelay: `${(i % 7) * 0.6}s` }}
          />
        ))}
      </div>

      <div className={`absolute inset-0 transition-opacity duration-[1100ms] ${night ? "opacity-0" : "opacity-100"}`}>
        <Cloud className="animate-drift absolute left-[18%] top-[150px] hidden w-32 opacity-80 sm:block" />
        <Cloud className="animate-drift absolute right-[20%] top-[52px] w-24 opacity-70 [animation-delay:-8s] sm:w-36" />
        <Cloud className="animate-drift absolute right-[6%] top-[236px] hidden w-28 opacity-60 [animation-delay:-14s] lg:block" />
      </div>

      <motion.div className="absolute left-[6%] top-6 sm:left-[11%] sm:top-9" initial={false} animate={{ y: night ? 260 : 0, opacity: night ? 0 : 1 }} transition={swap}>
        <span className="relative block h-14 w-14 sm:h-20 sm:w-20">
          <span className="absolute -inset-7 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(251,162,46,0.42), rgba(251,162,46,0))" }} />
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-ember-300 to-ember-500" />
        </span>
      </motion.div>

      <motion.div className="absolute right-[6%] top-6 sm:right-[11%] sm:top-9" initial={false} animate={{ y: night ? 0 : 260, opacity: night ? 1 : 0 }} transition={swap}>
        <span className="relative block h-14 w-14 sm:h-20 sm:w-20">
          <span className="absolute -inset-8 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(255,241,210,0.16), rgba(255,241,210,0))" }} />
          <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full">
            <defs>
              <mask id="lua-crescente">
                <rect width="80" height="80" fill="#fff" />
                <circle cx="54" cy="30" r="29" fill="#000" />
              </mask>
            </defs>
            <circle cx="40" cy="40" r="30" fill="#FFF1D2" mask="url(#lua-crescente)" />
          </svg>
        </span>
      </motion.div>
    </div>
  );
}

/* Paisagem em camadas. As cores mudam por transição de `fill` (classe .scene-fill no styles.css). */
function Landscape({ night }: { night: boolean }) {
  const c = night ? NIGHT : DAY;
  const fade = `scene-fill ${night ? "opacity-0" : "opacity-100"}`;
  const glow = `scene-fill ${night ? "opacity-100" : "opacity-0"}`;
  const posts = [470, 492, 514, 536, 558, 580];
  return (
    <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" className="relative -mb-px block h-[190px] w-full sm:h-[260px] lg:h-[320px]" aria-hidden>
      <defs>
        <radialGradient id="luz-janela">
          <stop offset="0" stopColor="#FBA22E" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FBA22E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pássaros */}
      <g className={fade} fill="none" stroke="#53100D" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.55">
        <path d="M930 56q7-8 14 0q7-8 14 0" />
        <path d="M972 82q5-6 10 0q5-6 10 0" />
        <path d="M560 70q5-6 10 0q5-6 10 0" />
      </g>

      {/* serra ao fundo */}
      <path className="scene-fill" fill={c.serra} d="M0 320V150C90 132 170 120 260 128C360 137 430 96 540 100C650 104 720 140 820 132C920 124 990 88 1100 92C1210 96 1290 130 1360 126C1400 124 1425 118 1440 114V320Z" />

      {/* colina da casa */}
      <path className="scene-fill" fill={c.colina} d="M0 320V214C120 196 240 190 380 204C500 216 600 208 700 186C780 168 860 166 940 178C1040 193 1140 216 1260 210C1340 206 1400 196 1440 190V320Z" />

      <Tree x={300} y={200} s={0.9} copa={c.copa} tronco={c.tronco} />
      <Tree x={1196} y={216} copa={c.copa} tronco={c.tronco} />
      <Tree x={1244} y={214} s={0.7} copa={c.copa} tronco={c.tronco} />

      {/* catavento */}
      <g className="scene-fill" stroke={c.madeira} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M1002 192 1010 138 1018 192M1004.5 176H1015.5M1006.5 160H1013.5" />
        <circle cx="1010" cy="134" r="13" />
        <path d="M1010 121V147M997 134H1023M1000.8 124.8 1019.2 143.2M1019.2 124.8 1000.8 143.2" />
      </g>
      <path className="scene-fill" fill={c.madeira} d="M1024 134 1038 127V141Z" />

      {/* a casa */}
      <Tree x={664} y={192} s={1.6} copa={c.copa} tronco={c.tronco} />
      <g transform="translate(722 186) scale(1.5)">
        <circle className={glow} cx="21" cy="-22" r="22" fill="url(#luz-janela)" />
        <circle className={glow} cx="75" cy="-22" r="22" fill="url(#luz-janela)" />
        <g className={fade} fill="#fff" fillOpacity="0.7">
          <circle cx="74" cy="-84" r="4" />
          <circle cx="79" cy="-95" r="5.5" />
          <circle cx="87" cy="-108" r="7" />
        </g>
        <rect className="scene-fill" x="68" y="-76" width="10" height="20" fill={c.barra} />
        <rect className="scene-fill" x="0" y="-38" width="96" height="38" fill={c.parede} />
        <rect className="scene-fill" x="0" y="-8" width="96" height="8" fill={c.barra} />
        <path className="scene-fill" fill={c.telhado} d="M-10-36 14-64H82L106-36Z" />
        <rect className="scene-fill" x="42" y="-27" width="12" height="27" fill={c.porta} />
        <rect className="scene-fill" x="14" y="-29" width="14" height="13" fill={c.janela} />
        <rect className="scene-fill" x="68" y="-29" width="14" height="13" fill={c.janela} />
      </g>
      <Tree x={916} y={178} s={1.2} copa={c.ipe} tronco={c.tronco} />

      {/* roça */}
      <path className="scene-fill" fill={c.roca} d="M0 320V248C180 232 380 246 580 242C780 238 900 226 1080 233C1240 239 1360 252 1440 242V320Z" />
      <g className="scene-fill" fill="none" stroke={c.sulco} strokeWidth="1.6" strokeOpacity="0.7">
        <path d="M0 258C180 242 380 256 580 252C780 248 900 236 1080 243C1240 249 1360 262 1440 252" />
        <path d="M0 268C180 252 380 266 580 262C780 258 900 246 1080 253C1240 259 1360 272 1440 262" />
      </g>

      {/* cerca e porteira */}
      <g className="scene-fill" stroke={c.madeira} strokeWidth="2.2" strokeLinecap="round" fill="none">
        {posts.map((x) => (
          <path key={x} d={`M${x} 248v-16`} />
        ))}
        <path d="M470 236H580M470 242.5H580" />
        <path d="M596 249v-26M652 248v-26M597 228H651M597 236H651M597 244H651M598 244 650 228" />
      </g>

      {/* vaga-lumes */}
      <g className={glow} fill="#FFD699">
        {FIREFLIES.map(([x, y], i) => (
          <circle key={x} cx={x} cy={y} r="1.7" className={night ? "animate-twinkle" : undefined} style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
      </g>

      {/* chão: mesma cor da parte de baixo da seção */}
      <path className="scene-fill" fill={c.chao} d="M0 320V278C160 264 340 270 540 274C720 278 840 264 1000 266C1160 268 1320 282 1440 272V320Z" />
    </svg>
  );
}

/*
 * Almoço x jantar: o que muda de um para o outro. A chave começa no período atual
 * (pelo relógio de São Paulo), troca o céu da fazenda e mostra o preço e o horário de hoje.
 */
export function DayNight() {
  const [period, setPeriod] = useState<Period>("jantar");
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    const { dow, minutes } = saoPauloNow();
    setToday(dow);
    setPeriod(minutes < hoursFor(dow).almoco[1] * 60 ? "almoco" : "jantar");
  }, []);

  const data = INCLUDED[period];
  const night = period === "jantar";

  return (
    <section id="pizzas" className={`relative isolate overflow-hidden transition-colors duration-[1100ms] ${night ? "text-cream-50" : "text-wine-900"}`}>
      {/* Céu e paisagem */}
      <div className="relative isolate">
        <Sky night={night} />
        <div className="mx-auto max-w-3xl px-5 pt-24 text-center sm:px-8 sm:pt-32">
          <div className="flex justify-center">
            <SectionLabel index="05" tone={night ? "dark" : "light"}>Almoço e jantar</SectionLabel>
          </div>
          <h2 className="font-display mt-6 text-[clamp(2.3rem,5.2vw,4.6rem)] font-medium leading-[1.03] tracking-tight text-balance">
            <SplitWords text="De dia, carne na chapa." />{" "}
            <SplitWords text="*De* *noite,* *rodízio* *de* *pizzas.*" delay={0.3} accentClassName={`italic transition-colors duration-[1100ms] ${night ? "text-ember-400" : "text-ember-700"}`} />
          </h2>

          {/* Chave almoço / jantar */}
          <div role="tablist" aria-label="Período" className={`relative mx-auto mt-10 inline-grid grid-cols-2 rounded-full p-1.5 ring-1 transition-colors duration-700 ${night ? "bg-white/[0.09] ring-white/15" : "bg-white ring-wine-600/10 shadow-soft"}`}>
            {(["almoco", "jantar"] as Period[]).map((p) => {
              const active = p === period;
              const Ico = p === "almoco" ? Sun : Moon;
              return (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    if (active) return;
                    setPeriod(p);
                    pushEvent("period_toggle", { period: p });
                  }}
                  className={`relative z-10 flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-colors duration-500 sm:px-9 ${
                    active ? (p === "jantar" ? "text-wine-950" : "text-cream-50") : night ? "text-cream-100/75 hover:text-cream-50" : "text-wine-800/70 hover:text-wine-800"
                  }`}
                >
                  {active && <motion.span layoutId="period-pill" className={`absolute inset-0 -z-10 rounded-full ${p === "jantar" ? "bg-ember-400" : "bg-wine-600"}`} transition={{ type: "spring", stiffness: 320, damping: 30 }} />}
                  <Ico weight="fill" className="h-4 w-4" /> {PERIOD_LABEL[p]}
                </button>
              );
            })}
          </div>
        </div>
        <Landscape night={night} />
      </div>

      {/* Chão da fazenda: o que vem em cada período */}
      <div className={`relative isolate pb-24 pt-10 transition-colors duration-[1100ms] sm:pb-32 sm:pt-14 ${night ? "bg-wine-950" : "bg-ember-100"}`}>
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className={`bg-grain absolute inset-0 transition-opacity duration-[1100ms] ${night ? "opacity-60" : "opacity-0"}`} />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
          <div className="relative lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={period}
                className="relative overflow-hidden rounded-[34px] shadow-[0_40px_80px_-36px_rgba(0,0,0,0.7)]"
                initial={{ clipPath: "inset(0% 100% 0% 0% round 34px)", opacity: 0.6 }}
                animate={{ clipPath: "inset(0% 0% 0% 0% round 34px)", opacity: 1 }}
                exit={{ clipPath: "inset(0% 0% 0% 100% round 34px)", opacity: 0.4 }}
                transition={{ duration: 0.75, ease: EASE_IN_OUT }}
              >
                <img src={assetUrl(data.image)} alt={data.alt} loading="lazy" decoding="async" className="aspect-[16/11] w-full object-cover" />
              </motion.div>
            </AnimatePresence>
            {night && (
              <motion.figure
                key="forno"
                className="absolute -bottom-9 right-4 hidden w-[30%] rotate-[5deg] rounded-[18px] bg-cream-50 p-1.5 shadow-float sm:block"
                initial={{ opacity: 0, y: 40, rotate: 14 }}
                animate={{ opacity: 1, y: 0, rotate: 5 }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.35 }}
              >
                <img src={assetUrl("images/forno-pizza.webp")} alt="Forno de pizza da Casa da Roça" loading="lazy" decoding="async" className="aspect-[4/4.4] w-full rounded-[13px] object-cover object-[70%_35%]" />
                <figcaption className="font-display pt-1.5 text-center text-sm italic text-wine-700">direto do forno</figcaption>
              </motion.figure>
            )}
          </div>

          <div className="min-w-0 lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div key={period} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
                <p className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] ${night ? "text-ember-300" : "text-ember-700"}`}>
                  <Wheat className="h-4 w-4" /> {data.title}, à vontade
                </p>
                <ul className="mt-5 space-y-3">
                  {data.items.map((item, i) => (
                    <motion.li
                      key={item}
                      className="font-display flex items-center gap-3.5 text-[1.55rem] font-medium leading-tight sm:text-[1.8rem]"
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.1 + i * 0.08 }}
                    >
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${night ? "bg-ember-400 text-wine-950" : "bg-wine-600 text-cream-50"}`}>
                        <Check weight="bold" className="h-4 w-4" />
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <p className={`mt-6 text-[15px] leading-relaxed ${night ? "text-cream-100/65" : "text-wine-900/65"}`}>{data.note}</p>

                <div className={`mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-3xl p-5 ring-1 ${night ? "bg-white/[0.06] ring-white/10" : "bg-white ring-wine-600/10 shadow-soft"}`}>
                  <div>
                    <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${night ? "text-cream-100/55" : "text-wine-900/55"}`}>{today === null ? "A partir de" : `Hoje, ${WEEKDAYS[today]}`}</p>
                    <p className="font-display mt-1 text-4xl font-medium tracking-tight">
                      <span className="mr-1 text-lg">R$</span>
                      {brl(today === null ? 44.9 : priceFor(today, period))}
                    </p>
                  </div>
                  <p className={`flex items-center gap-2 text-[15px] font-medium ${night ? "text-cream-100/80" : "text-wine-900/75"}`}>
                    <Clock weight="duotone" className="h-5 w-5 text-ember-500" />
                    {today === null ? (period === "almoco" ? "a partir das 11h" : "das 18h às 23h") : `das ${hoursFor(today)[period][0]}h às ${hoursFor(today)[period][1]}h`}
                  </p>
                </div>

                <div className="mt-8">
                  <PrimaryCta location="almoco_jantar" tone={night ? "ember" : "wine"} size="md" message={`Olá! Vim pelo site da Casa da Roça e gostaria de reservar uma mesa para o ${PERIOD_LABEL[period].toLowerCase()}.`}>
                    Reservar para o {PERIOD_LABEL[period].toLowerCase()}
                  </PrimaryCta>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
