import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Car, CaretDown, Clock, InstagramLogo, MapPin, NavigationArrow, Phone, WhatsappLogo } from "@phosphor-icons/react";
import { COMPANY, FAQ, NAV_LINKS, assetUrl, hoursFor, pushEvent, saoPauloNow } from "../data/site";
import { EASE_OUT, Reveal, SectionLabel, SplitWords } from "../components/motion";
import { PhoneLink, PrimaryCta, WhatsAppLink } from "../components/cta";
import { useOpenStatus } from "./Hero";

/* Dois grupos de dias, como a casa anuncia. */
const HOURS = [
  { days: "Segunda a sexta", match: (d: number) => d >= 1 && d <= 5, h: hoursFor(1) },
  { days: "Sábado e domingo", match: (d: number) => d === 0 || d === 6, h: hoursFor(6) },
];

export function Location() {
  const status = useOpenStatus();
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(saoPauloNow().dow), []);

  /* O mapa só carrega quando a seção está chegando: o iframe do Google pesa. */
  const mapRef = useRef<HTMLDivElement>(null);
  const [showMap, setShowMap] = useState(false);
  useEffect(() => {
    const el = mapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShowMap(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShowMap(true);
          io.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="como-chegar" className="relative overflow-hidden bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-8">
            <SectionLabel index="02">Como chegar e reservar</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(2.3rem,5vw,4.4rem)] font-medium leading-[1.03] tracking-tight text-wine-800 text-balance">
              <SplitWords text="Na Avenida Guarapiranga, com *vaga* na porta." accentClassName="italic text-ember-600" />
            </h2>
          </div>
          <Reveal className="text-lg leading-relaxed text-wine-900/70 lg:col-span-4">No Socorro, Zona Sul de São Paulo. A casa abre todos os dias, do almoço ao jantar.</Reveal>
        </div>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-12">
          {/* Mapa */}
          <Reveal className="relative min-w-0 overflow-hidden rounded-[32px] bg-cream-200 shadow-card ring-1 ring-wine-600/10 lg:col-span-7">
            <div ref={mapRef} className="relative h-[380px] w-full sm:h-[520px] lg:h-full lg:min-h-[560px]">
              {showMap ? (
                <iframe title="Mapa: Casa da Roça, Av. Guarapiranga, 143, Socorro, São Paulo" src={COMPANY.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0 [filter:sepia(0.18)_saturate(1.05)]" allowFullScreen />
              ) : (
                <div className="bg-gingham absolute inset-0" />
              )}
            </div>
            <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-cream-50/95 p-4 shadow-float backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:p-5">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ember-700">
                  <MapPin weight="fill" className="h-4 w-4" /> {COMPANY.address.region} de São Paulo
                </p>
                <p className="font-display mt-1 text-xl font-medium leading-tight text-wine-800 sm:text-2xl">{COMPANY.address.street}</p>
                <p className="text-sm text-wine-900/65">
                  {COMPANY.address.district} · {COMPANY.address.city} · CEP {COMPANY.address.cep}
                </p>
              </div>
              <div className="pointer-events-auto flex gap-2">
                <a href={COMPANY.mapsUrl} target="_blank" rel="noopener noreferrer" onClick={() => pushEvent("maps_click", { link_location: "mapa" })} className="inline-flex h-11 items-center gap-2 rounded-full bg-wine-600 px-5 text-sm font-semibold text-cream-50 transition-colors hover:bg-wine-800">
                  <NavigationArrow weight="fill" className="h-4 w-4" /> Traçar rota
                </a>
                <a href={COMPANY.wazeUrl} target="_blank" rel="noopener noreferrer" onClick={() => pushEvent("maps_click", { link_location: "waze" })} className="inline-flex h-11 items-center rounded-full border border-wine-600/20 px-5 text-sm font-semibold text-wine-800 transition-colors hover:bg-wine-600/5">
                  Waze
                </a>
              </div>
            </div>
          </Reveal>

          {/* Horários */}
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 lg:col-span-5">
            <Reveal delay={0.08} className="rounded-[32px] bg-wine-900 p-5 text-cream-50 shadow-lift min-[380px]:p-7 sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <h3 className="font-display flex items-center gap-3 text-[1.7rem] font-medium">
                  <Clock weight="duotone" className="h-7 w-7 text-ember-400" /> Horários
                </h3>
                {status && (
                  <span className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] ${status.open ? "bg-ember-400 text-wine-950" : "bg-white/10 text-cream-100"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.open ? "bg-wine-950" : "bg-cream-100"}`} /> {status.open ? "Aberto agora" : "Fechado agora"}
                  </span>
                )}
              </div>
              <table className="mt-6 w-full text-[14px] min-[380px]:text-[15px]">
                <thead className="text-left text-[11px] font-bold uppercase tracking-[0.16em] text-cream-100/50">
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
                      <tr key={row.days} className={`border-t border-white/10 ${active ? "text-ember-300" : "text-cream-100/85"}`}>
                        <td className="py-3.5 pr-2 font-semibold leading-snug">
                          {row.days}
                          {active && <span className="ml-2 inline-block rounded-full bg-ember-400 px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-wine-950">hoje</span>}
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
              <p className="mt-3 text-[13px] leading-relaxed text-cream-100/50">Em feriados, o almoço segue o horário de fim de semana.</p>
              <p className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5 text-[15px] leading-snug text-cream-100/85">
                <Car weight="duotone" className="h-6 w-6 shrink-0 text-ember-400" />
                Estacionamento grátis no pátio da frente da casa.
              </p>
            </Reveal>

            {/* Como reservar */}
            <Reveal delay={0.14} className="min-w-0 rounded-[32px] bg-ember-100 p-5 ring-1 ring-ember-300/50 min-[380px]:p-7 sm:p-9">
              <h3 className="font-display text-[1.7rem] font-medium leading-tight text-wine-800">Quer garantir a mesa?</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-wine-900/70">Mande o dia, o horário e quantas pessoas vêm. A equipe responde pelo WhatsApp com a disponibilidade.</p>
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
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" className="relative overflow-hidden bg-cream-50 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionLabel index="09">Dúvidas</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(2.2rem,4.6vw,3.8rem)] font-medium leading-[1.04] tracking-tight text-wine-800 text-balance">
              <SplitWords text="Antes de vir, *vale* saber." accentClassName="italic text-ember-600" />
            </h2>
            <Reveal className="mt-5 text-lg leading-relaxed text-wine-900/70">Não achou a resposta? A equipe atende no WhatsApp.</Reveal>
            <Reveal className="mt-7">
              <PrimaryCta location="faq" size="md" message="Olá! Vim pelo site da Casa da Roça e tenho uma dúvida.">
                Perguntar no WhatsApp
              </PrimaryCta>
            </Reveal>
          </div>
        </div>

        <ul className="lg:col-span-8">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="li" key={f.q} delay={Math.min(i, 5) * 0.05} className="border-b border-wine-600/12">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => {
                    setOpen(isOpen ? null : i);
                    if (!isOpen) pushEvent("faq_open", { faq_index: i + 1 });
                  }}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className={`font-display text-[1.35rem] font-medium leading-snug transition-colors duration-300 sm:text-[1.6rem] ${isOpen ? "text-ember-700" : "text-wine-800 group-hover:text-ember-700"}`}>{f.q}</span>
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ${isOpen ? "rotate-180 border-wine-600 bg-wine-600 text-cream-50" : "border-wine-600/20 text-wine-700"}`}>
                    <CaretDown weight="bold" className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE_OUT }} className="overflow-hidden">
                      <p className="max-w-2xl pb-7 text-[17px] leading-relaxed text-wine-900/75">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-wine-950 pb-28 pt-20 text-cream-100 md:pb-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grain absolute inset-0 opacity-60" />
        <div className="glow absolute left-1/2 top-[-260px] h-[620px] w-[1100px] -translate-x-1/2 [--glow-a:0.22] [--glow:240_137_15]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Chamada final */}
        <div className="flex flex-col items-center text-center">
          <motion.img
            src={assetUrl("logo-casa-da-roca-light.webp")}
            alt="Casa da Roça Restaurante e Pizzaria"
            width={1196}
            height={1006}
            loading="lazy"
            className="h-40 w-auto sm:h-48"
            initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 140, damping: 14 }}
          />
          <h2 className="font-display mt-8 max-w-3xl text-[clamp(2.3rem,6vw,5rem)] font-medium leading-[1.02] tracking-tight text-cream-50 text-balance">
            <SplitWords text="A mesa está posta. *Só* *falta* *você.*" accentClassName="italic text-ember-400" />
          </h2>
          <Reveal className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <PrimaryCta location="rodape" tone="ember" message="Olá! Vim pelo site da Casa da Roça e gostaria de reservar uma mesa.">
              Reservar pelo WhatsApp
            </PrimaryCta>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-display text-2xl font-medium text-cream-50">{COMPANY.full}</p>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-cream-100/60">Buffet caipira à vontade, carnes grelhadas, sobremesas e rodízio de pizzas no Socorro, Zona Sul de São Paulo.</p>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember-300">Onde</p>
            <p className="mt-4 text-[15px] leading-relaxed text-cream-100/80">
              {COMPANY.address.street}
              <br />
              {COMPANY.address.district} · {COMPANY.address.city}
              <br />
              CEP {COMPANY.address.cep}
            </p>
            <p className="mt-3 text-[15px] text-cream-100/80">Aberto {COMPANY.hoursShort}</p>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember-300">Fale com a casa</p>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li>
                <WhatsAppLink location="rodape" className="inline-flex items-center gap-2.5 text-cream-100/85 transition-colors hover:text-ember-300">
                  <WhatsappLogo weight="fill" className="h-5 w-5 text-ember-400" /> {COMPANY.whatsappDisplay}
                </WhatsAppLink>
              </li>
              <li>
                <PhoneLink location="rodape" className="inline-flex items-center gap-2.5 text-cream-100/85 transition-colors hover:text-ember-300">
                  <Phone weight="fill" className="h-5 w-5 text-ember-400" /> Ligar para a casa
                </PhoneLink>
              </li>
              <li>
                <a href={COMPANY.instagramUrl} target="_blank" rel="noopener noreferrer" onClick={() => pushEvent("instagram_click", { link_location: "rodape" })} className="inline-flex items-center gap-2.5 text-cream-100/85 transition-colors hover:text-ember-300">
                  <InstagramLogo weight="fill" className="h-5 w-5 text-ember-400" /> @{COMPANY.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember-300">No site</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-cream-100/80 transition-colors hover:text-ember-300">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-7 text-[13px] text-cream-100/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Casa da Roça. Valores e horários sujeitos a alteração.</p>
          <a href={assetUrl("politica-de-privacidade.html")} className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-cream-100">
            Política de Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}
