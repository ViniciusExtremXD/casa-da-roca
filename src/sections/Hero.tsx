import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { COMPANY, PRICES, assetUrl, brl, openStatus, type OpenStatus } from "../data/site";
import { EASE_OUT, Lines } from "../components/motion";
import { RESERVA_MSG, WhatsAppLink, WhatsGlyph } from "../components/cta";

/* "Aberto agora": só no navegador, atualizado a cada minuto. No HTML pré-renderizado fica o horário geral. */
export function useOpenStatus(): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const tick = () => setStatus(openStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}

export function Hero() {
  const status = useOpenStatus();
  const today = status ? (status.open ? `Aberto, ${status.detail}` : `${status.label}, ${status.detail}`) : "Das 11h às 23h";

  return (
    <section id="topo" className="gutter mx-auto max-w-page pb-16 pt-[calc(72px+2.5rem+env(safe-area-inset-top,0px))] sm:pb-24 lg:pt-[calc(72px+4.5rem)]">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-12 lg:gap-x-10">
        <div className="flex min-w-0 flex-col lg:col-span-7">
          <p className="label text-tinta-mute">Restaurante e pizzaria · Socorro, Zona Sul de São Paulo</p>

          <h1 className="font-display mt-6 text-[clamp(3.1rem,8.6vw,8.4rem)] leading-[0.94] text-tinta">
            <Lines lines={["Comida de roça,", "à vontade."]} delay={0.15} />
          </h1>

          <p className="mt-8 max-w-[34rem] text-[1.15rem] leading-relaxed text-tinta-soft text-pretty">
            Buffet caipira com carnes grelhadas no almoço e rodízio de pizzas no jantar. A sobremesa já vem incluída, todos os dias, das 11h às 23h.
          </p>

          <div className="mt-9 grid grid-cols-[minmax(0,1fr)] gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <WhatsAppLink location="hero" message={RESERVA_MSG} className="btn btn-vinho">
              <WhatsGlyph />
              Reservar pelo WhatsApp
            </WhatsAppLink>
            <a href="#visita" className="btn btn-linha text-tinta">
              Como chegar
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-[minmax(0,1fr)] border-t border-tinta/15 sm:grid-cols-3 lg:mt-auto lg:pt-0">
            <Fact label="Hoje" value={today} live />
            <Fact label="Por pessoa" value={`a partir de R$ ${brl(PRICES.from)}`} />
            <Fact label="No Google" value={`${String(COMPANY.googleRating).replace(".", ",")} de 5 · ${COMPANY.googleReviews} avaliações`} href="#avaliacoes" />
          </dl>
        </div>

        <figure className="min-w-0 lg:col-span-5">
          <motion.div
            className="relative aspect-[4/5] overflow-hidden bg-cal-lo"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.1 }}
          >
            <motion.img
              src={assetUrl("images/buffet-farofa.webp")}
              alt="Farofa com tomate e arroz temperado nas travessas de barro do buffet da Casa da Roça"
              width={719}
              height={1258}
              className="h-full w-full object-cover"
              style={{ objectPosition: "50% 64%" }}
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: EASE_OUT, delay: 0.1 }}
            />
          </motion.div>
          <figcaption className="mt-3 text-[14px] text-tinta-mute">Farofa e arroz temperado nas travessas de barro do buffet.</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Fact({ label, value, href, live }: { label: string; value: string; href?: string; live?: boolean }) {
  const body = (
    <>
      <dt className="label text-tinta-mute">{label}</dt>
      <dd className="mt-1.5 text-[16px] font-medium leading-snug text-tinta" aria-live={live ? "polite" : undefined}>
        {value}
      </dd>
    </>
  );
  return (
    <div className="border-b border-tinta/15 py-4 sm:border-b-0 sm:border-l sm:py-5 sm:pl-5 sm:first:border-l-0 sm:first:pl-0">
      {href ? (
        <a href={href} className="group block">
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  );
}
