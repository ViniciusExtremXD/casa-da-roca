import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MENU, PRICES, assetUrl, brl, saoPauloNow, type Course, type Period } from "../data/site";
import { EASE_OUT } from "../components/motion";
import { useOpenStatus } from "./Hero";
import { PERIOD_EVENT } from "./Reservation";

/*
 * Almoço e jantar como a mesma fazenda vista de dia e de noite. A paisagem é uma faixa só, de
 * 1600 de largura: o painel do dia mostra a metade esquerda e o da noite a direita, então no
 * computador os morros continuam de um painel para o outro.
 */

const SERRA =
  "M0 300V172C120 150 220 160 320 150C430 140 520 118 640 132C760 146 860 166 980 150C1100 134 1180 120 1300 136C1420 152 1520 150 1600 140V300Z";
const MORRO =
  "M0 300V222C140 200 260 196 380 210C480 222 560 214 640 196C700 184 760 186 820 194C900 206 980 214 1060 206C1180 192 1300 210 1420 220C1500 226 1560 220 1600 214V300Z";
const CHAO = "M0 300V268C200 254 380 262 560 258C700 255 760 250 820 252C1000 258 1200 266 1400 258C1500 254 1560 256 1600 258V300Z";

/* Estrelas em posições fixas (o HTML pré-renderizado precisa bater com o do navegador). */
const STARS = [
  [828, 40, 1.2], [860, 92, 0.9], [905, 24, 1.4], [948, 70, 1], [990, 118, 0.8], [1032, 36, 1.3], [1066, 88, 0.9], [1110, 20, 1],
  [1150, 64, 1.5], [1188, 108, 0.8], [1226, 30, 1.1], [1262, 80, 0.9], [1300, 14, 1.2], [1338, 120, 0.8], [1372, 50, 1], [1470, 28, 1.3],
  [1508, 98, 0.9], [1546, 46, 1.1], [1578, 128, 0.8], [880, 140, 0.7], [1090, 150, 0.7], [1240, 146, 0.8], [1530, 150, 0.7], [1012, 8, 0.9],
] as const;

const SCENE = {
  almoco: { sky: ["#BCD3DC", "#E5E2D2", "#F2E7D0"], serra: "#B4BE9A", morro: "#8E9D6E", chao: "#F3ECDF", tree: "#6A7B4A", trunk: "#6B4E36", wall: "#F6F1E8", barra: "#B5532C", roof: "#97472A", door: "#5B1913", window: "#5E7684", fence: "#8B6B4A" },
  jantar: { sky: ["#090E1C", "#121A31", "#28324F"], serra: "#222B46", morro: "#182038", chao: "#0F1527", tree: "#0D1322", trunk: "#0D1322", wall: "#2D3651", barra: "#1F2539", roof: "#1A2034", door: "#141929", window: "#E9A646", fence: "#0B1020" },
} as const;

function House({ x, y, c, night }: { x: number; y: number; c: (typeof SCENE)[Period]; night: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(1.25)`}>
      {night && (
        <>
          <circle cx="15" cy="-18" r="16" fill="url(#luz)" className="animate-flicker" />
          <circle cx="61" cy="-18" r="16" fill="url(#luz)" className="animate-flicker" style={{ animationDelay: "1.4s" }} />
        </>
      )}
      <rect x="0" y="-30" width="76" height="30" fill={c.wall} />
      <rect x="0" y="-7" width="76" height="7" fill={c.barra} />
      <rect x="56" y="-56" width="7" height="14" fill={c.roof} />
      <path d="M-6-29 9-47H67L82-29Z" fill={c.roof} />
      <rect x="33" y="-21" width="10" height="21" fill={c.door} />
      <rect x="10" y="-23" width="10" height="11" fill={c.window} />
      <rect x="56" y="-23" width="10" height="11" fill={c.window} />
      {!night && (
        <g fill="#FFFFFF" opacity="0.55">
          <circle cx="62" cy="-64" r="3.2" />
          <circle cx="66" cy="-72" r="4" />
          <circle cx="72" cy="-81" r="4.8" />
        </g>
      )}
    </g>
  );
}

function Tree({ x, y, c, s = 1 }: { x: number; y: number; c: (typeof SCENE)[Period]; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2" y="-16" width="4" height="16" fill={c.trunk} />
      <circle cx="0" cy="-26" r="13" fill={c.tree} />
      <circle cx="-9" cy="-19" r="9" fill={c.tree} />
      <circle cx="9" cy="-18" r="9.5" fill={c.tree} />
    </g>
  );
}

function Fence({ from, to, y, c }: { from: number; to: number; y: number; c: (typeof SCENE)[Period] }) {
  const posts: number[] = [];
  for (let x = from; x <= to; x += 18) posts.push(x);
  return (
    <g fill={c.fence}>
      {posts.map((x) => (
        <rect key={x} x={x} y={y - 14} width="2.4" height="15" />
      ))}
      <rect x={from} y={y - 11} width={to - from + 2.4} height="1.6" />
      <rect x={from} y={y - 5.5} width={to - from + 2.4} height="1.6" />
    </g>
  );
}

function Scene({ period }: { period: Period }) {
  const night = period === "jantar";
  const c = SCENE[period];
  const id = `ceu-${period}`;
  return (
    <svg viewBox={`${night ? 800 : 0} 0 800 300`} className="block h-[210px] w-full sm:h-auto" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.sky[0]} />
          <stop offset="0.62" stopColor={c.sky[1]} />
          <stop offset="1" stopColor={c.sky[2]} />
        </linearGradient>
        {night && (
          <>
            <radialGradient id="luz">
              <stop offset="0" stopColor="#E9A646" stopOpacity="0.55" />
              <stop offset="1" stopColor="#E9A646" stopOpacity="0" />
            </radialGradient>
            <mask id="lua">
              <rect x="1300" y="0" width="200" height="200" fill="#fff" />
              <circle cx="1436" cy="74" r="24" fill="#000" />
            </mask>
          </>
        )}
      </defs>

      <rect x={night ? 800 : 0} y="0" width="800" height="300" fill={`url(#${id})`} />

      {night ? (
        <>
          {STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#EDE8DE" className={i % 3 === 0 ? "animate-twinkle" : undefined} style={i % 3 === 0 ? { animationDelay: `${(i % 7) * 0.7}s` } : undefined} opacity={i % 3 === 0 ? undefined : 0.7} />
          ))}
          <motion.g initial={{ y: 26, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 2.2, ease: EASE_OUT }}>
            <circle cx="1420" cy="82" r="58" fill="#EDE8DE" opacity="0.05" />
            <circle cx="1420" cy="82" r="24" fill="#EDE8DE" mask="url(#lua)" />
          </motion.g>
        </>
      ) : (
        <>
          <motion.g initial={{ y: 34, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 2.2, ease: EASE_OUT }}>
            <circle cx="190" cy="92" r="62" fill="#F6D493" opacity="0.32" />
            <circle cx="190" cy="92" r="30" fill="#F0B04E" />
          </motion.g>
          <g fill="#FFFFFF" opacity="0.7">
            <ellipse cx="420" cy="62" rx="44" ry="9" />
            <ellipse cx="446" cy="54" rx="22" ry="10" />
            <ellipse cx="640" cy="98" rx="34" ry="7" />
          </g>
        </>
      )}

      <path d={SERRA} fill={c.serra} />
      <path d={MORRO} fill={c.morro} />
      {night ? (
        <>
          <House x={1010} y={211} c={c} night />
          <Tree x={1140} y={204} c={c} s={1.1} />
          <Tree x={1172} y={202} c={c} s={0.8} />
        </>
      ) : (
        <>
          <House x={540} y={210} c={c} night={false} />
          <Tree x={486} y={213} c={c} s={1.15} />
          <Tree x={700} y={190} c={c} s={0.85} />
        </>
      )}
      <path d={CHAO} fill={c.chao} />
      <Fence from={night ? 840 : 80} to={night ? 980 : 300} y={night ? 255 : 258} c={c} />
    </svg>
  );
}

/* ───────────── Painel de um período ───────────── */

function isPeak(dow: number, period: Period) {
  return period === "almoco" ? dow === 0 || dow === 6 : dow === 5 || dow === 6;
}

function Panel({ period, today }: { period: Period; today: number | null }) {
  const night = period === "jantar";
  const status = useOpenStatus();
  const [open, setOpen] = useState<string | null>(null);
  const menu = MENU[period];
  const p = PRICES[period];

  const tone = night
    ? { bg: "bg-noite text-noite-texto", soft: "text-noite-texto/70", line: "border-noite-texto/15", accent: "text-lamparina", btn: "btn-claro" }
    : { bg: "bg-dia-chao text-tinta", soft: "text-tinta-soft", line: "border-tinta/15", accent: "text-vinho", btn: "btn-vinho" };

  const rows = [
    { label: p.baseLabel, note: p.baseNote, value: p.base, active: today !== null && !isPeak(today, period) },
    { label: p.peakLabel, note: "", value: p.peak, active: today !== null && isPeak(today, period) },
  ];

  const live = status && status.period === period ? (status.open ? `Servindo agora, ${status.detail.replace(/^(almoço|jantar) /, "")}` : status.label) : null;

  return (
    <article className={`flex min-w-0 flex-col ${tone.bg}`} data-scene aria-labelledby={`titulo-${period}`}>
      <Scene period={period} />

      <div className="gutter flex flex-1 flex-col pb-16 pt-4 sm:pb-20 lg:!px-12 xl:!px-16">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className={`label ${tone.soft}`}>{night ? "De noite" : "De dia"}</p>
          {live && (
            <p className={`text-[14px] font-medium ${tone.accent}`} aria-live="polite">
              {live}
            </p>
          )}
        </div>
        <h3 id={`titulo-${period}`} className="font-display mt-3 text-[clamp(3.2rem,6vw,5rem)] leading-none">
          {night ? "Jantar" : "Almoço"}
        </h3>
        <p className={`mt-4 max-w-md text-[16px] leading-relaxed ${tone.soft}`}>
          {night ? "Todos os dias, das 18h às 23h." : "Segunda a sexta, das 11h às 15h. Sábado, domingo e feriado, das 11h às 18h."}
        </p>

        <dl className="mt-9 space-y-4">
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline gap-3">
              <dt className={`min-w-0 text-[16px] leading-snug ${r.active ? "font-semibold" : ""}`}>
                {r.label}
                {r.note && <span className={`ml-1.5 text-[14px] font-normal ${tone.soft}`}>({r.note})</span>}
                {r.active && <span className={`label ml-2 align-middle ${tone.accent}`}>hoje</span>}
              </dt>
              <span className="leader" aria-hidden />
              <dd className="font-display tnum shrink-0 whitespace-nowrap text-[1.7rem] leading-none">
                <span className="mr-1 font-sans text-[14px] font-medium">R$</span>
                {brl(r.value)}
              </dd>
            </div>
          ))}
        </dl>
        <p className={`mt-4 text-[14px] ${tone.soft}`}>
          Crianças de {PRICES.kids.range}: R$ {brl(PRICES.kids[period].base)} e R$ {brl(PRICES.kids[period].peak)}. Até 5 anos não pagam.
        </p>

        <div className={`mt-12 border-b ${tone.line}`}>
          <p className={`label mb-2 ${tone.soft}`}>O que vem na mesa</p>
          {[menu.special, ...menu.shared].map((course) => (
            <CourseRow key={course.id} course={course} open={open === course.id} onToggle={() => setOpen((o) => (o === course.id ? null : course.id))} tone={tone} period={period} />
          ))}
        </div>
        <p className={`mt-4 text-[14px] ${tone.soft}`}>Amostra do que passou pelo buffet na primeira semana. As variedades mudam todo dia.</p>

        <div className="mt-auto pt-10">
          <a href="#reservar" onClick={() => window.dispatchEvent(new CustomEvent(PERIOD_EVENT, { detail: period }))} className={`btn ${tone.btn}`}>
            Reservar para o {night ? "jantar" : "almoço"}
          </a>
        </div>
      </div>
    </article>
  );
}

function CourseRow({
  course,
  open,
  onToggle,
  tone,
  period,
}: {
  course: Course;
  open: boolean;
  onToggle: () => void;
  tone: { soft: string; line: string };
  period: Period;
}) {
  const panelId = `${period}-${course.id}`;
  return (
    <div className={`border-t ${tone.line}`}>
      <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={panelId} className="group flex w-full items-start justify-between gap-6 py-5 text-left">
        <span className="min-w-0">
          <span className="font-display block text-[1.55rem] leading-tight">{course.title}</span>
          <span className={`mt-1 block text-[15px] leading-snug ${tone.soft}`}>{course.desc}</span>
        </span>
        <span className="mt-2 flex shrink-0 items-center gap-2.5">
          <span className={`hidden text-[13px] font-medium sm:inline ${tone.soft}`}>{open ? "Fechar" : `${course.items.length} variedades`}</span>
          <span className="relative h-3.5 w-3.5" aria-hidden>
            <span className="absolute left-0 top-1/2 h-px w-full bg-current" />
            <span className={`absolute left-1/2 top-0 h-full w-px bg-current transition-transform duration-300 ${open ? "scale-y-0" : ""}`} />
          </span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-[minmax(0,1fr)] gap-5 pb-7 sm:grid-cols-[200px_minmax(0,1fr)]">
              <img src={assetUrl(course.image)} alt={course.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" style={{ objectPosition: course.position }} />
              <ul className="grid content-start gap-x-6 gap-y-2 text-[15px] leading-snug sm:grid-cols-2">
                {course.items.map((it) => (
                  <li key={it} className="flex gap-2.5">
                    <span className="mt-[0.6em] h-px w-3 shrink-0 bg-current opacity-50" aria-hidden />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────── Seção ───────────── */

export function DayNight() {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(saoPauloNow().dow), []);

  return (
    <section id="cardapio" className="bg-cal">
      <div className="gutter mx-auto max-w-page pb-14 pt-20 sm:pb-16 sm:pt-28">
        <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-x-10 gap-y-6 lg:grid-cols-12">
          <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.98] text-tinta lg:col-span-7">De dia, carne na chapa. De noite, pizza no forno.</h2>
          <p className="max-w-md text-[1.05rem] leading-relaxed text-tinta-soft lg:col-span-5">
            Pratos quentes, saladas e sobremesas estão nos dois períodos. O que muda é o que acompanha e o valor por pessoa. Toque num item para ver as variedades.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2">
        <Panel period="almoco" today={today} />
        <Panel period="jantar" today={today} />
      </div>

      <div className="gutter mx-auto max-w-page py-10 text-[14px] leading-relaxed text-tinta-mute">
        Valores por pessoa, divulgados na inauguração (novembro de 2026). A casa aceita vale-refeição (VR); outras formas de pagamento, confirme no WhatsApp.
      </div>
    </section>
  );
}
