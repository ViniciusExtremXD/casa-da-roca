import { COMPANY, HOUSE_PHOTOS, REELS, assetUrl, pushEvent } from "../data/site";
import { Arrow } from "../components/cta";

/* A casa: texto curto à esquerda, fotos do salão em duas colunas desencontradas à direita. */
export function House() {
  const [a, b, c, d] = HOUSE_PHOTOS;
  return (
    <section id="a-casa" className="bg-cal">
      <div className="gutter mx-auto max-w-page">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-14 border-t border-tinta/15 py-20 sm:py-28 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="label text-tinta-mute">A casa</p>
              <h2 className="font-display mt-5 text-[clamp(2.5rem,5.2vw,4.4rem)] leading-[1] text-tinta">Uma casa de fazenda na Avenida Guarapiranga.</h2>
              <div className="mt-7 max-w-md space-y-4 text-[1.05rem] leading-relaxed text-tinta-soft">
                <p>
                  A Casa da Roça abriu em 18 de novembro de 2026, no Socorro. O salão é grande, com vigas de madeira, ladrilho hidráulico, rodas de carroça e a comida servida em travessas de barro.
                </p>
                <p>Abre todos os dias, do almoço ao jantar, e tem estacionamento grátis no pátio da frente.</p>
              </div>

              <div className="mt-12">
                <p className="label text-tinta-mute">Quem já passou por aqui</p>
                <ul className="mt-3 border-t border-tinta/15 text-[15px]">
                  {REELS.map((r) => (
                    <li key={r.handle} className="border-b border-tinta/15">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => pushEvent("reel_click", { link_location: "a_casa", reel: r.handle })}
                        className="group flex items-center justify-between gap-4 py-3 text-tinta"
                      >
                        <span className="font-medium">@{r.handle}</span>
                        <span className="flex items-center gap-2 text-tinta-mute transition-colors group-hover:text-vinho">
                          {r.likes || "ver vídeo"}
                          <Arrow dir="out" className="h-3.5 w-3.5" />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href={COMPANY.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => pushEvent("instagram_click", { link_location: "a_casa" })}
                  className="link mt-5 inline-block text-[15px] font-semibold text-tinta"
                >
                  Seguir @{COMPANY.instagramHandle} no Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:col-span-7">
            <div className="space-y-10">
              <Photo p={a} ratio="aspect-[4/5]" />
              <Photo p={d} ratio="aspect-[4/3]" position="50% 60%" />
            </div>
            <div className="space-y-10 pt-16 sm:pt-28">
              <Photo p={b} ratio="aspect-[4/5]" />
              <Photo p={c} ratio="aspect-[4/3]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Photo({ p, ratio, position = "50% 50%" }: { p: (typeof HOUSE_PHOTOS)[number]; ratio: string; position?: string }) {
  return (
    <figure>
      <div className={`overflow-hidden bg-cal-lo ${ratio}`}>
        <img
          src={assetUrl(p.src)}
          alt={p.alt}
          width={p.w}
          height={p.h}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.04]"
          style={{ objectPosition: position }}
        />
      </div>
      <figcaption className="mt-2.5 text-[13px] leading-snug text-tinta-mute sm:text-[14px]">{p.caption}</figcaption>
    </figure>
  );
}
