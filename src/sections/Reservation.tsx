import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarBlank, ChatCircleDots, Minus, Moon, Plus, Sun, UsersThree, WhatsappLogo } from "@phosphor-icons/react";
import { PERIOD_LABEL, buildWhatsAppUrl, hoursFor, trackLead, type Period } from "../data/site";
import { EASE_OUT, Reveal, SectionLabel, SplitWords } from "../components/motion";

const OCCASIONS = ["Almoço ou jantar em família", "Aniversário", "Confraternização", "Outro"];

const STEPS = [
  { icon: CalendarBlank, title: "Escolha o dia e o período", desc: "Almoço ou jantar, qualquer dia da semana." },
  { icon: UsersThree, title: "Diga quantas pessoas vêm", desc: "De uma mesa para dois a um grupo grande." },
  { icon: ChatCircleDots, title: "A equipe confirma no WhatsApp", desc: "O pedido chega pronto na conversa e a casa responde com a disponibilidade." },
];

function isoToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* "2026-11-28" -> { label: "sábado, 28/11", dow: 6 } sem depender do fuso do navegador. */
function describeDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const dow = date.getDay();
  const names = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  return { dow, label: `${names[dow]}, ${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}` };
}

/*
 * Pedido de reserva: monta a mensagem e abre o WhatsApp da casa. Não grava nada em servidor
 * nem manda dado pessoal para a medição (só o evento "generate_lead" com o canal).
 */
export function Reservation() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [period, setPeriod] = useState<Period>("almoco");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(4);
  const [occasion, setOccasion] = useState(OCCASIONS[0]);

  useEffect(() => {
    const t = isoToday();
    setMinDate(t);
    setDate(t);
  }, []);

  /* Horários de chegada a cada 30 min, dentro do período do dia escolhido. */
  const slots = useMemo(() => {
    const dow = date ? describeDate(date).dow : 1;
    const [from, to] = hoursFor(dow)[period];
    const out: string[] = [];
    for (let h = from; h < to; h++) out.push(`${h}h`, `${h}h30`);
    return out.slice(0, -1);
  }, [date, period]);

  useEffect(() => {
    if (!slots.includes(time)) setTime(slots[Math.min(2, slots.length - 1)] ?? "");
  }, [slots, time]);

  const message = useMemo(() => {
    const when = date ? describeDate(date).label : "";
    return [
      "Olá! Vim pelo site da Casa da Roça e gostaria de reservar uma mesa.",
      "",
      name.trim() ? `Nome: ${name.trim()}` : null,
      when ? `Dia: ${when}` : null,
      `Período: ${PERIOD_LABEL[period]}${time ? `, chegada por volta das ${time}` : ""}`,
      `Pessoas: ${people}`,
      `Ocasião: ${occasion}`,
    ]
      .filter((l) => l !== null)
      .join("\n");
  }, [name, date, period, time, people, occasion]);

  const field = "h-[52px] w-full rounded-2xl border border-wine-600/15 bg-white px-4 text-[15px] font-medium text-wine-900 outline-none transition-[border-color,box-shadow] placeholder:text-wine-900/35 focus:border-ember-500 focus:shadow-[0_0_0_4px_rgba(240,137,15,0.16)]";
  const label = "mb-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-wine-700/80";

  return (
    <section id="reservas" className="relative overflow-hidden bg-cream-100 py-24 sm:py-32">
      <div aria-hidden className="bg-gingham pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-5">
          <SectionLabel index="06">Reservas e grupos</SectionLabel>
          <h2 className="font-display mt-6 text-[clamp(2.3rem,5vw,4.3rem)] font-medium leading-[1.03] tracking-tight text-wine-800 text-balance">
            <SplitWords text="Vem com a turma? *Guarde* a sua mesa." accentClassName="italic text-ember-600" />
          </h2>
          <Reveal className="mt-6 max-w-md text-lg leading-relaxed text-wine-900/70">Aniversário, almoço de domingo ou confraternização da firma: mande o pedido e combine tudo com a equipe pelo WhatsApp.</Reveal>

          <ol className="mt-10 space-y-6">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                className="flex gap-4"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.1 }}
              >
                <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-wine-600 text-ember-200 shadow-wine">
                  <s.icon weight="duotone" className="h-6 w-6" />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ember-400 text-[11px] font-bold text-wine-950">{i + 1}</span>
                </span>
                <span>
                  <span className="font-display block text-xl font-medium text-wine-800">{s.title}</span>
                  <span className="mt-0.5 block text-[15px] leading-relaxed text-wine-900/65">{s.desc}</span>
                </span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Comanda */}
        <motion.form
          className="torn-top relative min-w-0 self-start bg-cream-50 px-5 pb-7 pt-10 shadow-lift sm:px-9 sm:pb-9 sm:pt-12 lg:col-span-7"
          style={{ borderRadius: "0 0 30px 30px" }}
          initial={{ opacity: 0, y: 50, rotate: 1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 1, ease: EASE_OUT }}
          onSubmit={(e) => {
            e.preventDefault();
            trackLead("form", "reservas");
            window.open(buildWhatsAppUrl(message), "_blank", "noopener");
          }}
        >
          <div className="flex items-center justify-between gap-4 border-b border-dashed border-wine-600/20 pb-5">
            <p className="font-display text-2xl font-medium text-wine-800 sm:text-[1.7rem]">Pedido de reserva</p>
            <p className="hidden text-right text-[11px] font-bold uppercase tracking-[0.2em] text-wine-700/55 min-[380px]:block">Casa da Roça · Socorro</p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="res-nome" className={label}>Seu nome</label>
              <input id="res-nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como a casa pode te chamar" autoComplete="given-name" className={field} />
            </div>

            <div>
              <label htmlFor="res-data" className={label}>Dia</label>
              <input id="res-data" type="date" value={date} min={minDate} onChange={(e) => setDate(e.target.value)} required className={field} />
            </div>

            <div>
              <span className={label}>Período</span>
              <div className="relative grid h-[52px] grid-cols-2 rounded-2xl border border-wine-600/15 bg-white p-1">
                {(["almoco", "jantar"] as Period[]).map((p) => {
                  const active = p === period;
                  const Ico = p === "almoco" ? Sun : Moon;
                  return (
                    <button key={p} type="button" aria-pressed={active} onClick={() => setPeriod(p)} className={`relative z-10 flex items-center justify-center gap-2 rounded-xl text-[15px] font-semibold transition-colors duration-300 ${active ? "text-cream-50" : "text-wine-800/70"}`}>
                      {active && <motion.span layoutId="res-period" className="absolute inset-0 -z-10 rounded-xl bg-wine-600" transition={{ type: "spring", stiffness: 340, damping: 30 }} />}
                      <Ico weight="fill" className="h-4 w-4" /> {PERIOD_LABEL[p]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="res-hora" className={label}>Chegada por volta das</label>
              <select id="res-hora" value={time} onChange={(e) => setTime(e.target.value)} className={`${field} appearance-none`}>
                {slots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className={label}>Pessoas</span>
              <div className="flex h-[52px] items-center justify-between rounded-2xl border border-wine-600/15 bg-white px-1.5">
                <button type="button" onClick={() => setPeople((n) => Math.max(1, n - 1))} aria-label="Menos uma pessoa" className="grid h-10 w-10 place-items-center rounded-xl text-wine-700 transition-colors hover:bg-ember-100">
                  <Minus weight="bold" className="h-4 w-4" />
                </button>
                <motion.span key={people} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25 }} className="font-display tnum text-2xl font-medium text-wine-800" aria-live="polite">
                  {people}
                </motion.span>
                <button type="button" onClick={() => setPeople((n) => Math.min(80, n + 1))} aria-label="Mais uma pessoa" className="grid h-10 w-10 place-items-center rounded-xl text-wine-700 transition-colors hover:bg-ember-100">
                  <Plus weight="bold" className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <span className={label}>Ocasião</span>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={o === occasion}
                    onClick={() => setOccasion(o)}
                    className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${o === occasion ? "border-wine-600 bg-wine-600 text-cream-50" : "border-wine-600/15 bg-white text-wine-800/75 hover:border-wine-600/40"}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="group relative mt-8 flex h-[60px] w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#1FAF57] text-base font-semibold text-white shadow-[0_16px_34px_-14px_rgba(31,175,87,0.75)]">
            <span className="absolute inset-0 origin-left scale-x-0 bg-[#178f46] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            <WhatsappLogo weight="fill" className="relative h-6 w-6" />
            <span className="relative">Enviar pedido pelo WhatsApp</span>
          </button>
          <p className="mt-4 text-center text-[13px] leading-relaxed text-wine-900/55">Abre a conversa com a mensagem pronta. A reserva só vale depois que a equipe confirmar.</p>
        </motion.form>
      </div>
    </section>
  );
}
