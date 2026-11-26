import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretDown, InstagramLogo, Phone, WhatsappLogo } from "@phosphor-icons/react";
import { COMPANY, FAQ, NAV_LINKS, assetUrl, pushEvent } from "../data/site";
import { EASE_OUT, Reveal, SectionLabel, SplitWords } from "../components/motion";
import { PhoneLink, PrimaryCta, WhatsAppLink } from "../components/cta";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" className="relative overflow-hidden bg-cream-50 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionLabel>Dúvidas</SectionLabel>
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
