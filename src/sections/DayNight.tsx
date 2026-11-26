import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, Moon, Sun } from "@phosphor-icons/react";
import { INCLUDED, PERIOD_LABEL, WEEKDAYS, assetUrl, brl, hoursFor, priceFor, pushEvent, saoPauloNow, type Period } from "../data/site";
import { EASE_IN_OUT, EASE_OUT, SectionLabel, SplitWords } from "../components/motion";
import { PrimaryCta } from "../components/cta";
import { Wheat } from "./House";

/* Posições fixas (o HTML pré-renderizado precisa bater com o do navegador): [esquerda %, topo px, tamanho px]. */
const STARS: [number, number, number][] = [
  [4, 46, 2], [9, 150, 3], [14, 84, 2], [19, 228, 2], [24, 30, 3], [29, 176, 2], [34, 96, 2], [39, 268, 2], [44, 22, 2], [49, 142, 3],
  [54, 60, 2], [58, 236, 2], [63, 110, 2], [68, 34, 3], [72, 190, 2], [77, 78, 2], [81, 256, 2], [86, 140, 2], [90, 52, 3], [95, 204, 2],
  [12, 300, 2], [47, 320, 2], [70, 300, 2], [97, 110, 2],
];

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

/* ───────────── A fazenda: cenário embaixo da seção, com bichos de dia e de noite ───────────── */

const DAY = {
  serra: "#C9D8B4",
  colina: "#9FBA6A",
  pasto: "#86A04F",
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
  colina: "#1E1124",
  pasto: "#150A18",
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

const FIREFLIES: [number, number][] = [[430, 330], [522, 312], [640, 342], [704, 318], [862, 336], [934, 312], [1082, 330], [1150, 350], [360, 352]];

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

/* Vaca virada para a direita; origem nos cascos, à esquerda. */
function Cow({ grazing = false }: { grazing?: boolean }) {
  const pelo = "#FBF7EF";
  const mancha = "#2E2420";
  return (
    <g>
      <path d="M6 -36q-9 6 -7 20" fill="none" stroke={mancha} strokeWidth="2.4" strokeLinecap="round" />
      <g className={grazing ? undefined : "leg"}>
        <rect x="9" y="-15" width="5.5" height="15" rx="1.5" fill={pelo} />
        <rect x="9" y="-3" width="5.5" height="3" fill={mancha} />
        <rect x="46" y="-15" width="5.5" height="15" rx="1.5" fill={pelo} />
        <rect x="46" y="-3" width="5.5" height="3" fill={mancha} />
      </g>
      <g className={grazing ? undefined : "leg leg-b"}>
        <rect x="17" y="-15" width="5.5" height="15" rx="1.5" fill="#EFE8DC" />
        <rect x="17" y="-3" width="5.5" height="3" fill={mancha} />
        <rect x="54" y="-15" width="5.5" height="15" rx="1.5" fill="#EFE8DC" />
        <rect x="54" y="-3" width="5.5" height="3" fill={mancha} />
      </g>
      <rect x="4" y="-42" width="58" height="29" rx="13" fill={pelo} />
      <ellipse cx="21" cy="-31" rx="9" ry="6.5" fill={mancha} />
      <ellipse cx="44" cy="-24" rx="7" ry="5" fill={mancha} />
      <ellipse cx="35" cy="-38" rx="5" ry="3" fill={mancha} />
      <ellipse cx="32" cy="-12.5" rx="4.5" ry="2.6" fill="#E9A7A0" />
      <g className={grazing ? "graze" : "bob"}>
        <rect x="55" y="-48" width="17" height="18" rx="6.5" fill={pelo} />
        <rect x="63" y="-38" width="11" height="9" rx="4" fill="#E9B8A8" />
        <circle cx="63" cy="-42" r="1.5" fill={mancha} />
        <ellipse cx="56" cy="-48" rx="4.5" ry="2.2" fill={mancha} transform="rotate(-20 56 -48)" />
        <path d="M61 -48q1 -6 5 -7" fill="none" stroke="#E8DCC6" strokeWidth="2" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* Ovelha virada para a direita. */
function Sheep({ delay = 0 }: { delay?: number }) {
  const la = "#FBF6EC";
  const cara = "#2E2420";
  return (
    <g>
      <g className="leg" style={{ animationDelay: `${delay}s` }}>
        <rect x="11" y="-12" width="3" height="12" fill={cara} />
        <rect x="31" y="-12" width="3" height="12" fill={cara} />
      </g>
      <g className="leg leg-b" style={{ animationDelay: `${delay - 0.45}s` }}>
        <rect x="17" y="-12" width="3" height="12" fill={cara} />
        <rect x="37" y="-12" width="3" height="12" fill={cara} />
      </g>
      <g fill={la}>
        <circle cx="14" cy="-22" r="10" />
        <circle cx="25" cy="-27" r="11" />
        <circle cx="36" cy="-22" r="10" />
        <circle cx="20" cy="-15" r="9" />
        <circle cx="32" cy="-15" r="9" />
        <circle cx="8" cy="-20" r="6" />
      </g>
      <g className="bob" style={{ animationDelay: `${delay}s` }}>
        <ellipse cx="46" cy="-25" rx="6.5" ry="7.5" fill={cara} />
        <ellipse cx="41" cy="-30" rx="3.5" ry="1.8" fill={cara} transform="rotate(-25 41 -30)" />
        <circle cx="48" cy="-27" r="1.2" fill="#FBF6EC" />
        <circle cx="43" cy="-33" r="4.5" fill={la} />
      </g>
    </g>
  );
}

/* Lobo-guará andando: pernas compridas de meia preta, crina escura, rabo com ponta branca. */
function Wolf() {
  const pelo = "#8A4022";
  const preto = "#0B0507";
  return (
    <g>
      <path d="M12 -40q-14 4 -16 18q8 -6 14 -8z" fill={pelo} />
      <circle cx="-3" cy="-22" r="3.4" fill="#EDE2D0" />
      <g className="leg">
        <rect x="16" y="-30" width="4" height="30" rx="1.5" fill={preto} />
        <rect x="52" y="-30" width="4" height="30" rx="1.5" fill={preto} />
      </g>
      <g className="leg leg-b">
        <rect x="23" y="-30" width="4" height="30" rx="1.5" fill="#1A0C0C" />
        <rect x="59" y="-30" width="4" height="30" rx="1.5" fill="#1A0C0C" />
      </g>
      <ellipse cx="38" cy="-37" rx="27" ry="10.5" fill={pelo} />
      <path d="M52 -44q6 -10 14 -14l6 6q-8 4 -12 12z" fill={preto} />
      <g className="bob">
        <path d="M60 -46q6 -10 16 -10q8 0 12 6l-4 4q-6 2 -12 1q-6 4 -12 -1z" fill={pelo} />
        <path d="M84 -50l8 2l-2 4l-9 -1z" fill={preto} />
        <path d="M68 -54l-1 -14l7 11z" fill={preto} />
        <path d="M74 -55l3 -13l4 13z" fill={preto} />
        <circle cx="79" cy="-52" r="1.4" fill="#FBA22E" />
      </g>
    </g>
  );
}

/* Lobo sentado na serra, uivando para a lua de tempos em tempos. */
function HowlingWolf() {
  return (
    <g fill="#0B0510">
      <path d="M2 0q-20 0 -26 -9q12 4 26 1z" />
      <path d="M0 0C0 -18 6 -32 17 -40L30 -44L37 -22L36 0Z" />
      <rect x="27" y="-24" width="5" height="24" rx="2" />
      <rect x="33" y="-22" width="4.5" height="22" rx="2" />
      <g className="howl">
        <path d="M17 -40L24 -55L37 -69L43 -66L34 -53L31 -42Z" />
        <path d="M21 -51l-4 -13l9 8z" />
        <path d="M26 -55l1 -13l6 10z" />
      </g>
    </g>
  );
}

/* Coruja empoleirada; os olhos piscam e a cabeça vira de leve. */
function Owl({ delay = 0 }: { delay?: number }) {
  return (
    <g className="owl-tilt" style={{ animationDelay: `${delay}s` }}>
      <ellipse cx="0" cy="-14" rx="10" ry="13" fill="#6E5A48" />
      <ellipse cx="0" cy="-9" rx="6.5" ry="8" fill="#A48A6C" />
      <path d="M-9 -24l-1 -7l6 4zM9 -24l1 -7l-6 4z" fill="#6E5A48" />
      <g className="blink" style={{ animationDelay: `${delay}s` }}>
        <circle cx="-4.2" cy="-20" r="3.9" fill="#FBA22E" />
        <circle cx="4.2" cy="-20" r="3.9" fill="#FBA22E" />
        <circle cx="-4.2" cy="-20" r="1.8" fill="#120808" />
        <circle cx="4.2" cy="-20" r="1.8" fill="#120808" />
      </g>
      <path d="M-1.6 -16.5l1.6 3l1.6 -3z" fill="#E8B04B" />
      <path d="M-4 -1l-1 2M4 -1l1 2" stroke="#E8B04B" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function Landscape({ night }: { night: boolean }) {
  const c = night ? NIGHT : DAY;
  const dayOnly = `scene-fill ${night ? "opacity-0" : "opacity-100"}`;
  const nightOnly = `scene-fill ${night ? "opacity-100" : "opacity-0"}`;
  const posts = [470, 492, 514, 536, 558, 580];
  return (
    <svg
      data-scene
      viewBox="0 0 1440 400"
      preserveAspectRatio="xMidYMax slice"
      className="relative block h-[240px] w-full sm:h-auto"
      role="img"
      aria-label={night ? "A fazenda de noite: lua, corujas, lobos-guarás e vaga-lumes" : "A fazenda de dia: vacas e ovelhas no pasto"}
    >
      <defs>
        <radialGradient id="luz-janela">
          <stop offset="0" stopColor="#FBA22E" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FBA22E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pássaros */}
      <g className={dayOnly} fill="none" stroke="#53100D" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.55">
        <path d="M930 76q7-8 14 0q7-8 14 0" />
        <path d="M972 102q5-6 10 0q5-6 10 0" />
        <path d="M560 90q5-6 10 0q5-6 10 0" />
      </g>

      <path className="scene-fill" fill={c.serra} d="M0 400V170C90 152 170 140 260 148C360 157 430 116 540 120C650 124 720 160 820 152C920 144 990 108 1100 112C1210 116 1290 150 1360 146C1400 144 1425 138 1440 134V400Z" />

      {/* lobo uivando na serra */}
      <g className={nightOnly} transform="translate(1290 150) scale(1.35)">
        <HowlingWolf />
      </g>

      <path className="scene-fill" fill={c.colina} d="M0 400V244C120 226 240 220 380 234C500 246 600 238 700 216C780 198 860 196 940 208C1040 223 1140 246 1260 240C1340 236 1400 226 1440 220V400Z" />

      <Tree x={300} y={232} s={0.9} copa={c.copa} tronco={c.tronco} />
      <Tree x={1196} y={246} copa={c.copa} tronco={c.tronco} />
      <Tree x={1244} y={244} s={0.7} copa={c.copa} tronco={c.tronco} />

      {/* catavento */}
      <g className="scene-fill" stroke={c.madeira} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M1002 222 1010 168 1018 222M1004.5 206H1015.5M1006.5 190H1013.5" />
        <circle cx="1010" cy="164" r="13" />
        <path d="M1010 151V177M997 164H1023M1000.8 154.8 1019.2 173.2M1019.2 154.8 1000.8 173.2" />
      </g>
      <path className="scene-fill" fill={c.madeira} d="M1024 164 1038 157V171Z" />

      {/* a casa, com a árvore grande e o galho da coruja */}
      <path className="scene-fill" d="M652 196 L606 186" stroke={c.tronco} strokeWidth="3.5" strokeLinecap="round" />
      <Tree x={664} y={222} s={1.6} copa={c.copa} tronco={c.tronco} />
      <g className={nightOnly} transform="translate(612 186) scale(1.3)">
        <Owl />
      </g>
      <g transform="translate(722 216) scale(1.5)">
        <circle className={nightOnly} cx="21" cy="-22" r="22" fill="url(#luz-janela)" />
        <circle className={nightOnly} cx="75" cy="-22" r="22" fill="url(#luz-janela)" />
        <g className={dayOnly} fill="#fff" fillOpacity="0.7">
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
      <Tree x={916} y={208} s={1.2} copa={c.ipe} tronco={c.tronco} />

      {/* pasto da frente */}
      <path className="scene-fill" fill={c.pasto} d="M0 400V300C160 288 340 292 540 296C720 300 840 286 1000 288C1160 290 1320 304 1440 296V400Z" />

      {/* cerca e porteira */}
      <g className="scene-fill" stroke={c.madeira} strokeWidth="2.2" strokeLinecap="round" fill="none">
        {posts.map((x) => (
          <path key={x} d={`M${x} 304v-16`} />
        ))}
        <path d="M470 292H580M470 298.5H580" />
        <path d="M596 305v-30M652 304v-26M597 284H651M597 292H651M597 300H651M598 300 650 284" />
      </g>
      <g className={nightOnly} transform="translate(596 275) scale(1.1)">
        <Owl delay={2.2} />
      </g>

      {/* de dia: vacas e ovelhas */}
      <g className={dayOnly}>
        <g transform="translate(240 374) scale(1.3)">
          <g className="roam" style={{ ["--roam" as string]: "200px", ["--dur" as string]: "48s" }}>
            <Cow />
          </g>
        </g>
        <g transform="translate(1030 368) scale(1.2)">
          <Cow grazing />
        </g>
        <g transform="translate(610 392) scale(1.2)">
          <g className="roam" style={{ ["--roam" as string]: "180px", ["--dur" as string]: "40s", animationDelay: "-12s" }}>
            <g transform="translate(0 0)">
              <Sheep />
            </g>
            <g transform="translate(-52 6) scale(0.9)">
              <Sheep delay={-0.3} />
            </g>
            <g transform="translate(-26 -12) scale(0.8)">
              <Sheep delay={-0.6} />
            </g>
          </g>
        </g>
      </g>

      {/* de noite: lobo-guará andando e vaga-lumes */}
      <g className={nightOnly}>
        <g transform="translate(380 386) scale(1.2)">
          <g className="roam" style={{ ["--roam" as string]: "440px", ["--dur" as string]: "44s" }}>
            <Wolf />
          </g>
        </g>
        <g fill="#FFD699">
          {FIREFLIES.map(([x, y], i) => (
            <circle key={x} cx={x} cy={y} r="1.8" className="animate-twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </g>
      </g>
    </svg>
  );
}

/*
 * Almoço x jantar: o que muda de um para o outro. A chave começa no período atual
 * (pelo relógio de São Paulo), troca o céu e os bichos da fazenda e mostra o preço e o horário de hoje.
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
      <Sky night={night} />

      {/* Em cima: o que vem na mesa em cada período */}
      <div className="mx-auto max-w-3xl px-5 pt-24 text-center sm:px-8 sm:pt-28">
        <div className="flex justify-center">
          <SectionLabel tone={night ? "dark" : "light"}>Almoço e jantar</SectionLabel>
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

      <div className="mx-auto mt-14 grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-5 sm:mt-16 sm:px-8 lg:grid-cols-12 lg:gap-14">
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

      {/* Embaixo: a fazenda, só de cenário */}
      <div className="mt-16 sm:mt-24">
        <Landscape night={night} />
      </div>
    </section>
  );
}
