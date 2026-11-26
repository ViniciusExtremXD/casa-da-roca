import { motion } from "framer-motion";
import { Grains } from "@phosphor-icons/react";
import { COMPANY, HOUSE_FEATURES, assetUrl } from "../data/site";
import { ClipReveal, EASE_OUT, ParallaxImage, Reveal, ScrollLitText, SectionLabel, SplitWords, VelocityMarquee } from "../components/motion";

/* Faixa que corre logo abaixo do topo: o cardápio em uma linha. */
export function Strip() {
  const items = ["Buffet caipira", "Carnes grelhadas", "Saladas fresquinhas", "Mesa de sobremesas", "Rodízio de pizzas no jantar", "Estacionamento grátis"];
  return (
    <div className="relative z-10 -mt-px bg-ember-500 py-4 text-wine-950">
      <VelocityMarquee baseVelocity={-1.6}>
        {items.map((t) => (
          <span key={t} className="font-display flex items-center whitespace-nowrap text-2xl font-medium italic sm:text-3xl">
            <span className="px-6 sm:px-8">{t}</span>
            <Wheat className="h-7 w-7 shrink-0 text-wine-800" />
          </span>
        ))}
      </VelocityMarquee>
    </div>
  );
}

/* Espiga de trigo (a do logo), usada como separador. */
export function Wheat({ className }: { className?: string }) {
  return <Grains weight="fill" className={className} aria-hidden />;
}

export function House() {
  return (
    <section id="a-casa" className="relative overflow-hidden bg-cream-50 py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-6">
            <SectionLabel>A casa</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(2.3rem,5vw,4.4rem)] font-medium leading-[1.03] tracking-tight text-wine-800 text-balance">
              <SplitWords text="A tradição da roça agora tem *endereço* no Socorro." accentClassName="italic text-ember-600" />
            </h2>
            <ScrollLitText
              className="font-display mt-8 text-[clamp(1.35rem,2.3vw,1.9rem)] font-normal leading-[1.4] text-wine-900"
              text="Abrimos as portas em novembro de 2026, na Avenida Guarapiranga, para servir comida de verdade: tempero caseiro, panela de barro e muita *fartura.* Um salão amplo, climatizado e decorado como casa do interior, feito para reunir a família inteira em volta da mesa."
            />
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:col-span-6 lg:max-w-none lg:pl-8">
            <ClipReveal radius={36} className="overflow-hidden rounded-[36px] shadow-lift">
              <ParallaxImage
                src={assetUrl("images/letreiro.webp")}
                alt="Letreiro iluminado Casa da Roça Restaurante e Pizzaria sobre a parede de madeira do salão"
                amount={7}
                className="aspect-[4/5] w-full sm:aspect-[5/5.4]"
              />
            </ClipReveal>
            <motion.figure
              className="absolute -bottom-8 -left-2 w-[44%] rotate-[-5deg] rounded-[20px] bg-white p-1.5 shadow-float sm:-left-6 lg:left-0"
              initial={{ opacity: 0, y: 50, rotate: -14 }}
              whileInView={{ opacity: 1, y: 0, rotate: -5 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.3 }}
            >
              <img src={assetUrl("images/fachada.webp")} alt="Fachada da Casa da Roça com o estacionamento na frente" width={719} height={930} loading="lazy" decoding="async" className="aspect-[4/3.4] w-full rounded-[15px] object-cover object-[35%_55%]" />
              <figcaption className="font-display px-1 pb-1 pt-1.5 text-center text-sm italic text-wine-700">Av. Guarapiranga, 143</figcaption>
            </motion.figure>
            <motion.div
              className="absolute -right-1 top-8 rounded-2xl bg-wine-700 px-4 py-3 text-cream-50 shadow-wine sm:-right-4"
              initial={{ opacity: 0, scale: 0.6, rotate: 12 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 4 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ember-300">Inaugurada em</p>
              <p className="font-display text-xl font-medium">{COMPANY.opened}</p>
            </motion.div>
          </div>
        </div>

        <ul className="mt-24 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {HOUSE_FEATURES.map((f, i) => (
            <Reveal as="li" key={f.title} delay={i * 0.07} className="border-t border-wine-600/20 pt-6">
              <h3 className="font-display text-[1.45rem] font-medium leading-tight text-wine-800">{f.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-wine-900/65">{f.desc}</p>
            </Reveal>
          ))}
        </ul>

      </div>
    </section>
  );
}
