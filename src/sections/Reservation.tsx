import { useEffect, useMemo, useState } from "react";
import { PERIOD_LABEL, buildWhatsAppUrl, hoursFor, trackLead, type Period } from "../data/site";
import { WhatsGlyph } from "../components/cta";

const OCCASIONS = ["Almoço ou jantar em família", "Aniversário", "Confraternização", "Outra"];

/* O cardápio dispara este evento em "Reservar para o almoço/jantar" para já trazer o período marcado. */
export const PERIOD_EVENT = "roca:periodo";

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
export function ReservationForm() {
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
    const onPeriod = (e: Event) => setPeriod((e as CustomEvent<Period>).detail);
    window.addEventListener(PERIOD_EVENT, onPeriod);
    return () => window.removeEventListener(PERIOD_EVENT, onPeriod);
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

  const field =
    "h-12 w-full rounded-none border-0 border-b border-tinta/25 bg-transparent px-0 text-[16px] font-medium text-tinta outline-none transition-colors placeholder:font-normal placeholder:text-tinta-mute/70 focus:border-vinho";
  const label = "label block text-tinta-mute";
  const square = "grid h-12 w-12 place-items-center border border-tinta/25 text-tinta transition-colors hover:bg-tinta hover:text-cal-hi";

  return (
    <form
      id="reservar"
      className="scroll-mt-24 border border-tinta/15 bg-cal-hi p-6 sm:p-9"
      onSubmit={(e) => {
        e.preventDefault();
        trackLead("form", "reservas");
        window.open(buildWhatsAppUrl(message), "_blank", "noopener");
      }}
    >
      <h3 className="font-display text-[2rem] leading-tight text-tinta">Pedido de reserva</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-tinta-soft">Preencha e o pedido chega pronto no WhatsApp da casa. A reserva vale depois que a equipe confirmar.</p>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-7 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="res-nome" className={label}>
            Seu nome
          </label>
          <input id="res-nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como a casa pode te chamar" autoComplete="given-name" className={field} />
        </div>

        <div>
          <label htmlFor="res-data" className={label}>
            Dia
          </label>
          <input id="res-data" type="date" value={date} min={minDate} onChange={(e) => setDate(e.target.value)} required className={field} />
        </div>

        <fieldset>
          <legend className={label}>Período</legend>
          <div className="mt-2 grid grid-cols-2">
            {(["almoco", "jantar"] as Period[]).map((p, i) => {
              const active = p === period;
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPeriod(p)}
                  className={`h-11 border text-[15px] font-semibold transition-colors ${i ? "-ml-px" : ""} ${active ? "relative border-tinta bg-tinta text-cal-hi" : "border-tinta/25 text-tinta-soft hover:text-tinta"}`}
                >
                  {PERIOD_LABEL[p]}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="res-hora" className={label}>
            Chegada
          </label>
          <select id="res-hora" value={time} onChange={(e) => setTime(e.target.value)} className={`${field} cursor-pointer`}>
            {slots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className={label} id="res-pessoas-label">
            Pessoas
          </span>
          <div className="mt-1 flex items-center" role="group" aria-labelledby="res-pessoas-label">
            <button type="button" onClick={() => setPeople((n) => Math.max(1, n - 1))} aria-label="Menos uma pessoa" className={square}>
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8h12" />
              </svg>
            </button>
            <span className="tnum font-display w-16 text-center text-[1.8rem] leading-none text-tinta" aria-live="polite">
              {people}
            </span>
            <button type="button" onClick={() => setPeople((n) => Math.min(80, n + 1))} aria-label="Mais uma pessoa" className={square}>
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8h12M8 2v12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="res-ocasiao" className={label}>
            Ocasião
          </label>
          <select id="res-ocasiao" value={occasion} onChange={(e) => setOccasion(e.target.value)} className={`${field} cursor-pointer`}>
            {OCCASIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-vinho mt-9 w-full">
        <WhatsGlyph />
        Enviar pedido pelo WhatsApp
      </button>
    </form>
  );
}
