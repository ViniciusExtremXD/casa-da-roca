import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, Moon, Sun } from "@phosphor-icons/react";
import { INCLUDED, PERIOD_LABEL, STATIONS, WEEKDAYS, assetUrl, brl, hoursFor, priceFor, saoPauloNow, type Period } from "../data/site";
import { ClipReveal, EASE_OUT, Reveal, SectionLabel, SplitWords, TiltCard } from "../components/motion";
import { PrimaryCta } from "../components/cta";
import { Wheat } from "./House";

/* As quatro estações do buffet, em cartões que inclinam com o mouse. */
export function Buffet() {
  return (
    <section id="buffet" className="relative isolate overflow-hidden bg-wine-900 py-24 text-cream-50 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grain absolute inset-0 opacity-60" />
        <div className="glow absolute -left-52 top-10 h-[700px] w-[700px] [--glow-a:0.22] [--glow:240_137_15]" />
        <div className="glow absolute -right-40 bottom-0 h-[620px] w-[620px] [--glow-a:0.5] [--glow:83_16_13]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="02" tone="dark">O buffet</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(2.4rem,5.4vw,4.8rem)] font-medium leading-[1.02] tracking-tight text-balance">
              <SplitWords text="Monte o prato, repita, e *repita* de novo." accentClassName="italic text-ember-400" />
            </h2>
          </div>
          <Reveal className="text-lg leading-relaxed text-cream-100/75 lg:col-span-5">
            Aqui é tudo à vontade. Você se serve quantas vezes quiser em cada estação do buffet e ainda fecha com a sobremesa, que já está no preço.
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATIONS.map((s, i) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.95, ease: EASE_OUT, delay: (i % 4) * 0.09 }}
              className={i % 2 ? "lg:mt-12" : ""}
            >
              <TiltCard max={5} className="group relative h-full overflow-hidden rounded-[30px] bg-wine-800 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
                <ClipReveal radius={30} delay={0.1 + (i % 4) * 0.09} className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={assetUrl(s.image)}
                    alt={s.alt}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: s.position }}
                    className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.08]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-wine-950/25 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-cream-50/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-wine-700">{s.when}</span>
                </ClipReveal>
                <div className="relative -mt-16 px-6 pb-7">
                  <p className="font-display text-sm italic text-ember-300">0{i + 1}</p>
                  <h3 className="font-display mt-1 text-[1.7rem] font-medium leading-tight">{s.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-cream-100/70">{s.desc}</p>
                </div>
              </TiltCard>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/*
 * Almoço x jantar: o que muda de um para o outro. A chave começa no período atual
 * (pelo relógio de São Paulo) e mostra o preço e o horário de hoje.
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
    <section id="pizzas" className={`relative isolate overflow-hidden py-24 transition-colors duration-700 sm:py-32 ${night ? "bg-wine-950 text-cream-50" : "bg-ember-100 text-wine-900"}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className={`absolute inset-0 transition-opacity duration-700 ${night ? "bg-grain opacity-60" : "bg-gingham opacity-100"}`} />
        <div className={`glow absolute -top-40 left-1/2 h-[720px] w-[1000px] -translate-x-1/2 transition-opacity duration-700 [--glow:240_137_15] ${night ? "[--glow-a:0.2]" : "[--glow-a:0.45]"}`} />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <SectionLabel index="03" tone={night ? "dark" : "light"}>Almoço e jantar</SectionLabel>
          </div>
          <h2 className="font-display mt-6 text-[clamp(2.3rem,5.2vw,4.6rem)] font-medium leading-[1.03] tracking-tight text-balance">
            <SplitWords text="De dia, carne na chapa." />{" "}
            <SplitWords text="*De* *noite,* *rodízio* *de* *pizzas.*" delay={0.3} accentClassName={`italic ${night ? "text-ember-400" : "text-ember-600"}`} />
          </h2>

          {/* Chave almoço / jantar */}
          <div role="tablist" aria-label="Período" className={`relative mx-auto mt-10 inline-grid grid-cols-2 rounded-full p-1.5 ring-1 transition-colors duration-700 ${night ? "bg-white/[0.07] ring-white/15" : "bg-white ring-wine-600/10 shadow-soft"}`}>
            {(["almoco", "jantar"] as Period[]).map((p) => {
              const active = p === period;
              const Ico = p === "almoco" ? Sun : Moon;
              return (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPeriod(p)}
                  className={`relative z-10 flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-colors duration-500 sm:px-9 ${
                    active ? (p === "jantar" ? "text-wine-950" : "text-cream-50") : night ? "text-cream-100/70 hover:text-cream-50" : "text-wine-800/70 hover:text-wine-800"
                  }`}
                >
                  {active && <motion.span layoutId="period-pill" className={`absolute inset-0 -z-10 rounded-full ${p === "jantar" ? "bg-ember-400" : "bg-wine-600"}`} transition={{ type: "spring", stiffness: 320, damping: 30 }} />}
                  <Ico weight="fill" className="h-4 w-4" /> {PERIOD_LABEL[p]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="relative lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={period}
                className="relative overflow-hidden rounded-[34px] shadow-[0_40px_80px_-36px_rgba(0,0,0,0.7)]"
                initial={{ clipPath: "inset(0% 100% 0% 0% round 34px)", opacity: 0.6 }}
                animate={{ clipPath: "inset(0% 0% 0% 0% round 34px)", opacity: 1 }}
                exit={{ clipPath: "inset(0% 0% 0% 100% round 34px)", opacity: 0.4 }}
                transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
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
