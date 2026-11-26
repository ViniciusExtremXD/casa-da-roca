import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "@phosphor-icons/react";
import { PRICES, WEEKDAYS, brl, saoPauloNow, type Period } from "../data/site";
import { EASE_OUT, Reveal, SectionLabel, SplitWords } from "../components/motion";
import { PrimaryCta } from "../components/cta";

/* Qual linha da tabela vale hoje (0 = domingo). */
function isBaseDay(dow: number, period: Period) {
  return period === "almoco" ? dow >= 1 && dow <= 5 : dow <= 4;
}

export function Prices() {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(saoPauloNow().dow), []);

  return (
    <section id="valores" className="relative overflow-hidden bg-cream-50 py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel>Valores</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(2.4rem,5.4vw,4.8rem)] font-medium leading-[1.02] tracking-tight text-wine-800 text-balance">
              <SplitWords text="Preço de roça, fartura de *festa.*" accentClassName="italic text-ember-600" />
            </h2>
          </div>
          <Reveal className="text-lg leading-relaxed text-wine-900/70 lg:col-span-5">
            Um valor por pessoa e pronto: buffet, sobremesa e, conforme o período, carnes grelhadas ou rodízio de pizzas. Tudo à vontade.
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
          <PriceCard period="almoco" today={today} />
          <PriceCard period="jantar" today={today} />
        </div>

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-12">
          <Reveal className="rounded-[30px] bg-white p-6 shadow-soft ring-1 ring-wine-600/[0.07] sm:p-9 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-display text-[1.7rem] font-medium text-wine-800">Crianças de {PRICES.kids.range}</h3>
              <p className="rounded-full bg-leaf/10 px-4 py-2 text-sm font-semibold text-leaf">{PRICES.kids.free}</p>
            </div>
            <dl className="mt-7 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              <KidsRow label="Almoço, segunda a sexta" value={PRICES.kids.almoco.base} />
              <KidsRow label="Almoço, sábados, domingos e feriados" value={PRICES.kids.almoco.peak} />
              <KidsRow label="Jantar, domingo a quinta" value={PRICES.kids.jantar.base} />
              <KidsRow label="Jantar, sextas e sábados" value={PRICES.kids.jantar.peak} />
            </dl>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col justify-between rounded-[30px] bg-wine-700 p-6 text-cream-50 shadow-wine sm:p-9 lg:col-span-4">
            <div>
              <p className="font-display text-2xl font-medium leading-snug">Aceitamos vale-refeição (VR).</p>
              <p className="mt-2 text-[15px] leading-relaxed text-cream-100/70">Para outras bandeiras e formas de pagamento, é só perguntar no WhatsApp.</p>
            </div>
            <div className="mt-7">
              <PrimaryCta location="valores" size="md" tone="cream" message="Olá! Vim pelo site da Casa da Roça e gostaria de confirmar os valores e as formas de pagamento.">
                Confirmar no WhatsApp
              </PrimaryCta>
            </div>
          </Reveal>
        </div>

        <p className="mt-7 text-center text-sm text-wine-900/55">Valores por pessoa, divulgados na inauguração (novembro de 2026) e sujeitos a alteração sem aviso prévio.</p>
      </div>
    </section>
  );
}

function PriceCard({ period, today }: { period: Period; today: number | null }) {
  const p = PRICES[period];
  const night = period === "jantar";
  const Ico = night ? Moon : Sun;
  const rows = [
    { label: p.baseLabel, note: p.baseNote, value: p.base, active: today !== null && isBaseDay(today, period) },
    { label: p.peakLabel, note: "", value: p.peak, active: today !== null && !isBaseDay(today, period) },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: night ? 0.1 : 0 }}
      className={`relative overflow-hidden rounded-[30px] p-5 min-[380px]:p-7 sm:p-9 ${night ? "bg-wine-900 text-cream-50 shadow-lift" : "bg-white text-wine-900 shadow-soft ring-1 ring-wine-600/10"}`}
    >
      {night && <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 opacity-60" />}
      <div className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
        <h3 className="font-display flex items-center gap-3 text-[2rem] font-medium">
          <Ico weight="fill" className={`h-7 w-7 ${night ? "text-ember-400" : "text-ember-600"}`} />
          {night ? "Jantar" : "Almoço"}
        </h3>
        <p className={`text-[13px] font-medium leading-snug sm:text-right ${night ? "text-cream-100/65" : "text-wine-900/65"}`}>{night ? "Buffet + rodízio de pizzas + sobremesas" : "Buffet + carnes grelhadas + sobremesas"}</p>
      </div>

      <ul className="relative mt-7 space-y-3">
        {rows.map((r) => (
          <li
            key={r.label}
            className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-4 transition-colors duration-500 sm:gap-4 sm:px-5 ${
              r.active ? (night ? "bg-ember-400 text-wine-950" : "bg-wine-600 text-cream-50") : night ? "bg-white/[0.06]" : "bg-cream-100"
            }`}
          >
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold leading-snug sm:text-base">
                {r.label}
                {r.active && today !== null && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${night ? "bg-wine-950 text-ember-300" : "bg-ember-400 text-wine-950"}`}>hoje, {WEEKDAYS[today]}</span>
                )}
              </p>
              {r.note && <p className={`mt-0.5 text-[13px] ${r.active ? "opacity-80" : night ? "text-cream-100/55" : "text-wine-900/55"}`}>{r.note}</p>}
            </div>
            <p className="font-display tnum shrink-0 whitespace-nowrap text-[1.7rem] font-medium leading-none tracking-tight min-[380px]:text-[2.1rem] sm:text-[2.6rem]">
              <span className="mr-1 text-sm sm:text-base">R$</span>
              {brl(r.value)}
            </p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function KidsRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-wine-600/15 pb-3">
      <dt className="text-[15px] leading-snug text-wine-900/75">{label}</dt>
      <dd className="font-display tnum shrink-0 text-2xl font-medium text-wine-800">
        <span className="mr-1 text-sm">R$</span>
        {brl(value)}
      </dd>
    </div>
  );
}
