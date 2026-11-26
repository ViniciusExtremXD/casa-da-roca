import { useEffect, useState } from "react";
import { COMPANY, FAQ, NAV_LINKS, assetUrl, hoursFor, pushEvent, saoPauloNow } from "../data/site";
import { Arrow, PhoneLink, RESERVA_MSG, WhatsAppLink } from "../components/cta";
import { ReservationForm } from "./Reservation";

/* ───────────── Onde fica e como reservar (logo depois das avaliações) ───────────── */

const HOURS = [
  { days: "Segunda a sexta", match: (d: number) => d >= 1 && d <= 5, h: hoursFor(1) },
  { days: "Sábado, domingo e feriado", match: (d: number) => d === 0 || d === 6, h: hoursFor(6) },
];

export function Visit() {
  const [today, setToday] = useState<number | null>(null);
  const [mapActive, setMapActive] = useState(false);
  useEffect(() => setToday(saoPauloNow().dow), []);

  return (
    <section id="visita" className="bg-cal">
      <div className="gutter mx-auto max-w-page py-20 sm:py-28">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-14 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <p className="label text-tinta-mute">Onde fica</p>
            <h2 className="font-display mt-5 text-[clamp(2.6rem,6vw,5rem)] leading-[0.98] text-tinta">{COMPANY.address.street}</h2>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-tinta-soft">
              {COMPANY.address.district}, {COMPANY.address.region} de São Paulo, CEP {COMPANY.address.cep}. Estacionamento grátis no pátio da frente.
            </p>
            <p className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-[15px] font-semibold text-tinta">
              <a href={COMPANY.mapsUrl} target="_blank" rel="noopener noreferrer" onClick={() => pushEvent("directions_click", { method: "google_maps", link_location: "visita" })} className="link inline-flex items-center gap-1.5">
                Traçar rota no Google Maps <Arrow dir="out" className="h-3.5 w-3.5" />
              </a>
              <a href={COMPANY.wazeUrl} target="_blank" rel="noopener noreferrer" onClick={() => pushEvent("directions_click", { method: "waze", link_location: "visita" })} className="link inline-flex items-center gap-1.5">
                Ir com o Waze <Arrow dir="out" className="h-3.5 w-3.5" />
              </a>
            </p>

            <div
              className="map-frame relative mt-10 aspect-square overflow-hidden border border-tinta/15 bg-cal-lo sm:aspect-[4/3]"
              data-active={mapActive}
              onPointerDown={() => setMapActive(true)}
            >
              <iframe
                title="Mapa: Casa da Roça na Av. Guarapiranga, 143, Socorro"
                src={COMPANY.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>

            <div className="mt-10">
              <p className="label text-tinta-mute">Horários</p>
              <table className="mt-3 w-full border-collapse text-left text-[15px]">
                <thead>
                  <tr className="border-b border-tinta/15 text-tinta-mute">
                    <th className="sr-only">Dias</th>
                    <th className="pb-2 pr-4 text-[13px] font-medium sm:sr-only">Almoço</th>
                    <th className="pb-2 text-right text-[13px] font-medium sm:sr-only sm:text-left">Jantar</th>
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map((row) => {
                    const isToday = today !== null && row.match(today);
                    return (
                      <tr key={row.days} className="border-b border-tinta/15">
                        <th scope="row" className={`py-3.5 pr-4 font-medium ${isToday ? "text-vinho" : "text-tinta"}`}>
                          {row.days}
                          {isToday && <span className="label ml-2 align-middle text-vinho">hoje</span>}
                        </th>
                        <td className="tnum whitespace-nowrap py-3.5 pr-4 text-tinta-soft">
                          <span className="hidden sm:inline">Almoço, </span>
                          {row.h.almoco[0]}h às {row.h.almoco[1]}h
                        </td>
                        <td className="tnum whitespace-nowrap py-3.5 text-right text-tinta-soft sm:text-left">
                          <span className="hidden sm:inline">jantar, </span>
                          {row.h.jantar[0]}h às {row.h.jantar[1]}h
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5 lg:pt-[7.5rem]">
            <ReservationForm />
            <p className="mt-6 text-[15px] leading-relaxed text-tinta-soft">
              Prefere falar direto?{" "}
              <WhatsAppLink location="visita" message={RESERVA_MSG} className="link tnum font-semibold text-tinta">
                WhatsApp {COMPANY.whatsappDisplay}
              </WhatsAppLink>{" "}
              ou{" "}
              <PhoneLink location="visita" className="link font-semibold text-tinta">
                ligue
              </PhoneLink>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Dúvidas ───────────── */

export function Faq() {
  return (
    <section id="duvidas" className="bg-cal">
      <div className="gutter mx-auto max-w-page">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 border-t border-tinta/15 py-20 sm:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-none text-tinta">Dúvidas</h2>
            <p className="mt-5 max-w-sm text-[1.05rem] leading-relaxed text-tinta-soft">O que mais perguntam no WhatsApp. Não achou a sua? A equipe responde por lá.</p>
            <WhatsAppLink location="duvidas" message="Olá! Vim pelo site da Casa da Roça e tenho uma dúvida." className="link mt-5 inline-block text-[15px] font-semibold text-tinta">
              Perguntar no WhatsApp
            </WhatsAppLink>
          </div>
          <div className="border-t border-tinta/15 lg:col-span-8">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-tinta/15">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[1.08rem] font-medium text-tinta [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="relative mt-1.5 h-3.5 w-3.5 shrink-0" aria-hidden>
                    <span className="absolute left-0 top-1/2 h-px w-full bg-current" />
                    <span className="absolute left-1/2 top-0 h-full w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-tinta-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Rodapé ───────────── */

/* Faixa de ladrilho hidráulico, no azul-acinzentado da parede atrás do buffet. */
function Ladrilho() {
  return (
    <svg className="block h-14 w-full" aria-hidden>
      <defs>
        <pattern id="ladrilho" width="56" height="56" patternUnits="userSpaceOnUse">
          <rect width="56" height="56" fill="#E6E1D7" />
          <g fill="#5E7684">
            <circle cx="0" cy="0" r="10" />
            <circle cx="56" cy="0" r="10" />
            <circle cx="0" cy="56" r="10" />
            <circle cx="56" cy="56" r="10" />
            {[0, 90, 180, 270].map((a) => (
              <ellipse key={a} cx="28" cy="17" rx="4.2" ry="8.5" transform={`rotate(${a} 28 28)`} />
            ))}
          </g>
          <circle cx="28" cy="28" r="2.6" fill="#E6E1D7" />
          <path d="M28 5 51 28 28 51 5 28Z" fill="none" stroke="#5E7684" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ladrilho)" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-tinta text-cal-hi">
      <Ladrilho />
      <div className="gutter mx-auto max-w-page pb-[calc(6rem+env(safe-area-inset-bottom,0px))] pt-16 md:pb-12">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <img src={assetUrl("logo-casa-da-roca-light.webp")} alt="Casa da Roça Restaurante e Pizzaria" width={1196} height={1006} loading="lazy" className="h-28 w-auto" />
            <p className="font-display mt-6 text-[1.6rem] leading-snug">{COMPANY.tagline}.</p>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)] gap-10 text-[15px] leading-relaxed text-cal-hi/75 sm:grid-cols-3 md:col-span-8">
            <div>
              <p className="label text-cal-hi/50">Endereço</p>
              <p className="mt-3">
                {COMPANY.address.street}
                <br />
                {COMPANY.address.district}, São Paulo/SP
                <br />
                CEP {COMPANY.address.cep}
              </p>
            </div>
            <div>
              <p className="label text-cal-hi/50">Contato</p>
              <p className="mt-3 flex flex-col items-start gap-1">
                <WhatsAppLink location="rodape" className="link tnum text-cal-hi">
                  WhatsApp {COMPANY.whatsappDisplay}
                </WhatsAppLink>
                <PhoneLink location="rodape" className="link tnum text-cal-hi">
                  Telefone {COMPANY.phoneDisplay}
                </PhoneLink>
                <a href={COMPANY.instagramUrl} target="_blank" rel="noopener noreferrer" onClick={() => pushEvent("instagram_click", { link_location: "rodape" })} className="link text-cal-hi">
                  Instagram @{COMPANY.instagramHandle}
                </a>
              </p>
            </div>
            <div>
              <p className="label text-cal-hi/50">No site</p>
              <ul className="mt-3 flex flex-col items-start gap-1">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="link text-cal-hi">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-cal-hi/15 pt-6 text-[13px] text-cal-hi/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {COMPANY.full}. Valores e horários sujeitos a alteração.</p>
          <p className="flex gap-5">
            <a href={assetUrl("politica-de-privacidade.html")} className="link">
              Política de privacidade
            </a>
            <button type="button" onClick={() => window.dispatchEvent(new Event("roca:cookies"))} className="link">
              Cookies
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
