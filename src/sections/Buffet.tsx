import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "@phosphor-icons/react";
import { STATIONS, assetUrl, pushEvent, type Station } from "../data/site";
import { EASE_OUT, Reveal, SectionLabel, SplitWords } from "../components/motion";
import { Wheat } from "./House";

const SAMPLE_NOTE = "Amostra do que passou pelo buffet na primeira semana. As variedades mudam todo dia.";

function Varieties({ station, className }: { station: Station; className?: string }) {
  return (
    <ul className={className}>
      {station.items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 leading-snug">
          <Wheat className="mt-[3px] h-3.5 w-3.5 shrink-0 text-ember-400" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/*
 * As quatro estações do buffet. Clicar numa estação abre as variedades dela:
 * no computador os painéis ficam lado a lado e o escolhido alarga; no celular cada uma abre para baixo.
 */
export function Buffet() {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<string[]>([STATIONS[0].id]);

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    pushEvent("buffet_station_open", { station: STATIONS[i].id });
  };
  const toggle = (id: string) => {
    setOpenMobile((list) => {
      if (list.includes(id)) return list.filter((x) => x !== id);
      pushEvent("buffet_station_open", { station: id });
      return [...list, id];
    });
  };

  return (
    <section id="buffet" className="relative isolate overflow-clip bg-wine-900 py-24 text-cream-50 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grain absolute inset-0 opacity-60" />
        <div className="glow absolute -left-52 top-10 h-[700px] w-[700px] [--glow-a:0.22] [--glow:240_137_15]" />
        <div className="glow absolute -right-40 bottom-0 h-[620px] w-[620px] [--glow-a:0.5] [--glow:83_16_13]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="04" tone="dark">O buffet</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(2.4rem,5.4vw,4.8rem)] font-medium leading-[1.02] tracking-tight text-balance">
              <SplitWords text="Monte o prato, repita, e *repita* de novo." accentClassName="italic text-ember-400" />
            </h2>
          </div>
          <Reveal className="text-lg leading-relaxed text-cream-100/75 lg:col-span-5">
            Aqui é tudo à vontade: você se serve quantas vezes quiser e ainda fecha com a sobremesa, que já está no preço. <span className="text-cream-50">Escolha uma estação para ver o que tem nela.</span>
          </Reveal>
        </div>

        {/* Computador: painéis lado a lado */}
        <motion.ul
          className="mt-14 hidden h-[620px] gap-4 lg:flex"
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.95, ease: EASE_OUT }}
        >
          {STATIONS.map((s, i) => {
            const on = i === active;
            return (
              <li
                key={s.id}
                className="relative min-w-0 basis-0 overflow-hidden rounded-[30px] bg-wine-800 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ flexGrow: on ? 3.4 : 1 }}
              >
                <button type="button" onClick={() => select(i)} aria-expanded={on} aria-controls={`estacao-${s.id}`} className={`group absolute inset-0 block w-full text-left ${on ? "cursor-default" : "cursor-pointer"}`}>
                  <img
                    src={assetUrl(s.image)}
                    alt={s.alt}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: s.position }}
                    className={`h-full w-full object-cover transition-transform duration-[1.6s] ease-out ${on ? "scale-100" : "scale-[1.04] group-hover:scale-[1.1]"}`}
                  />
                  <span className="absolute -inset-px bg-gradient-to-t from-wine-950 via-wine-950/30 to-transparent" />
                  <span className={`absolute -inset-x-px -bottom-px h-[82%] bg-gradient-to-t from-wine-950 from-40% via-wine-950/80 via-70% to-transparent transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"}`} />
                  <span className="absolute left-4 top-4 rounded-full bg-cream-50/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-wine-700">{s.when}</span>

                  {/* Fechado: nome curto e o convite para abrir */}
                  <span className={`absolute inset-x-4 bottom-5 block transition-opacity duration-300 ${on ? "opacity-0" : "opacity-100 delay-300"}`}>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-ember-400 text-wine-950 transition-transform duration-500 group-hover:rotate-90">
                      <Plus weight="bold" className="h-4 w-4" />
                    </span>
                    <span className="font-display mt-3.5 block text-[1.2rem] font-medium leading-tight xl:text-[1.45rem]">{s.short}</span>
                    <span className="mt-1 block text-[13px] text-cream-100/65">{s.items.length} variedades</span>
                  </span>
                </button>

                {/* Aberto: descrição e variedades. Largura fixa para o texto não requebrar enquanto o painel alarga. */}
                <div
                  id={`estacao-${s.id}`}
                  aria-hidden={!on}
                  className={`pointer-events-none absolute bottom-0 left-0 w-[436px] p-7 transition-[opacity,transform] duration-500 xl:w-[580px] xl:p-9 ${on ? "translate-y-0 opacity-100 delay-300" : "translate-y-4 opacity-0"}`}
                >
                  <p className="font-display text-sm italic text-ember-300">0{i + 1}</p>
                  <h3 className="font-display mt-1 text-[2.2rem] font-medium leading-tight">{s.title}</h3>
                  <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-cream-100/75">{s.desc}</p>
                  <Varieties station={s} className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[15px] text-cream-50" />
                </div>
              </li>
            );
          })}
        </motion.ul>

        {/* Celular e tablet: cada estação abre para baixo */}
        <ul className="mt-10 space-y-3 lg:hidden">
          {STATIONS.map((s, i) => {
            const on = openMobile.includes(s.id);
            return (
              <Reveal as="li" key={s.id} delay={i * 0.06} className="overflow-hidden rounded-[26px] bg-wine-800 ring-1 ring-white/10">
                <button type="button" onClick={() => toggle(s.id)} aria-expanded={on} aria-controls={`estacao-m-${s.id}`} className="flex w-full items-center p-3 pr-4 text-left">
                  <span className={`shrink-0 overflow-hidden rounded-[18px] transition-[width,margin,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "mr-1 w-0 opacity-0" : "mr-4 w-[72px] opacity-100"}`}>
                    <img src={assetUrl(s.image)} alt="" loading="lazy" decoding="async" style={{ objectPosition: s.position }} className="h-[72px] w-[72px] max-w-none object-cover" />
                  </span>
                  <span className="min-w-0 flex-1 py-1">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-ember-300">{s.when}</span>
                    <span className="font-display mt-0.5 block text-[1.45rem] font-medium leading-tight">{s.title}</span>
                    <span className="mt-0.5 block text-[13px] text-cream-100/60">{on ? "Toque para fechar" : `Ver ${s.items.length} variedades`}</span>
                  </span>
                  <span className={`ml-3 grid h-11 w-11 shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-500 ${on ? "rotate-45 bg-cream-50/10 text-cream-50" : "bg-ember-400 text-wine-950"}`}>
                    <Plus weight="bold" className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div id={`estacao-m-${s.id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }} className="overflow-hidden">
                      <div className="px-3 pb-5">
                        <img src={assetUrl(s.image)} alt={s.alt} loading="lazy" decoding="async" style={{ objectPosition: s.position }} className="aspect-[16/11] w-full rounded-[20px] object-cover sm:aspect-[16/8]" />
                        <p className="mt-4 px-1 text-[15px] leading-relaxed text-cream-100/75">{s.desc}</p>
                        <Varieties station={s} className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-x-5 gap-y-2.5 px-1 text-[15px] text-cream-50 min-[440px]:grid-cols-2" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </ul>

        <p className="mt-6 text-sm text-cream-100/50">{SAMPLE_NOTE}</p>
      </div>
    </section>
  );
}
