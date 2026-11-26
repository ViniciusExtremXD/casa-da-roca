/*
 * Conteúdo do site. Fontes (conferidas em 25/11/2026):
 * - Instagram oficial @restaurante.casadaroca (bio, legendas dos posts e reel de inauguração de 24/11/2026);
 * - Ficha do Google Maps "Restaurante casa da roça" (nota, telefone, endereço);
 * - Tabela de valores e horários por período: reel do @achadoszonasulsp (19/11/2026), que bate com o
 *   "R$ 44,90" e os dias da promoção publicados pelo restaurante. A CONFIRMAR com a casa (ver README).
 */

import { originTag } from "../lib/attribution";

export const COMPANY = {
  name: "Casa da Roça",
  full: "Casa da Roça Restaurante e Pizzaria",
  tagline: "O melhor da culinária raiz",
  phoneDisplay: "(11) 93082-2554",
  phoneTel: "tel:+5511930822554",
  whatsappDisplay: "(11) 93082-2554",
  whatsappNumber: "5511930822554",
  instagramHandle: "restaurante.casadaroca",
  instagramUrl: "https://www.instagram.com/restaurante.casadaroca/",
  instagramFollowers: 31.1,
  googleRating: 4.4,
  googleReviews: 38,
  googleUrl: "https://www.google.com/maps?cid=10882283889158635785",
  opened: "18/11/2026",
  address: {
    street: "Av. Guarapiranga, 143",
    district: "Socorro",
    city: "São Paulo/SP",
    region: "Zona Sul",
    cep: "04762-000",
  },
  geo: { lat: -23.6660643, lng: -46.7135449 },
  mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Restaurante+Casa+da+Ro%C3%A7a%2C+Av.+Guarapiranga%2C+143+-+Socorro%2C+S%C3%A3o+Paulo",
  wazeUrl: "https://waze.com/ul?ll=-23.6660643,-46.7135449&navigate=yes",
  mapsEmbed: "https://www.google.com/maps?q=Restaurante+Casa+da+Ro%C3%A7a,+Av.+Guarapiranga,+143+-+Socorro,+S%C3%A3o+Paulo+-+SP&hl=pt-BR&z=16&output=embed",
  hoursShort: "todos os dias, das 11h às 23h",
};

export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.endsWith("/") ? base : `${base}/`}${path.replace(/^\//, "")}`;
}

export const DEFAULT_WA_MESSAGE = "Olá! Vim pelo site da Casa da Roça e gostaria de mais informações.";

export function buildWhatsAppUrl(message: string = DEFAULT_WA_MESSAGE): string {
  return `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(withOrigin(message))}`;
}

/* Leva a origem do anúncio (utm_source / utm_campaign ou gclid) para a conversa, para a casa saber de onde veio o contato. */
function withOrigin(message: string): string {
  const tag = originTag();
  return tag ? `${message}\n\n${tag}` : message;
}

/* ───────────────────────── Medição (dataLayer pronto para o GTM) ───────────────────────── */

export type LeadChannel = "whatsapp" | "phone" | "form";

export function pushEvent(event: string, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}

const lastLead: Partial<Record<LeadChannel, number>> = {};

function newLeadId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Clique em WhatsApp/telefone ou envio do pedido de reserva. `generate_lead` é a conversão.
 * `lead_id` é único por conversão e o toque duplo (mesmo canal em menos de 2 s) conta uma vez só.
 */
export function trackLead(channel: LeadChannel, location: string, detail?: string) {
  const now = Date.now();
  if (now - (lastLead[channel] ?? 0) < 2000) return;
  lastLead[channel] = now;
  const lead_id = newLeadId();
  pushEvent("lead_click", { lead_channel: channel, lead_location: location, lead_detail: detail, lead_id });
  pushEvent("generate_lead", { method: channel, link_location: location, lead_id });
}

/* ───────────────────────── Navegação ───────────────────────── */

/* Na ordem em que as seções aparecem na página. */
export const NAV_LINKS = [
  { href: "#como-chegar", label: "Como chegar" },
  { href: "#a-casa", label: "A casa" },
  { href: "#buffet", label: "O buffet" },
  { href: "#pizzas", label: "Almoço e jantar" },
  { href: "#valores", label: "Valores" },
  { href: "#reservas", label: "Reservas" },
];

/* ───────────────────────── Horários e valores ───────────────────────── */

export type Period = "almoco" | "jantar";
export const PERIOD_LABEL: Record<Period, string> = { almoco: "Almoço", jantar: "Jantar" };
export const WEEKDAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

/* Horas cheias, no fuso de São Paulo. Fim de semana (e feriado) o almoço emenda no jantar. */
export function hoursFor(dow: number): Record<Period, [number, number]> {
  const weekend = dow === 0 || dow === 6;
  return { almoco: [11, weekend ? 18 : 15], jantar: [18, 23] };
}

export const PRICES = {
  almoco: { base: 44.9, peak: 64.9, baseLabel: "Segunda a sexta", baseNote: "exceto feriados", peakLabel: "Sábados, domingos e feriados" },
  jantar: { base: 44.9, peak: 59.9, baseLabel: "Domingo a quinta", baseNote: "", peakLabel: "Sextas e sábados" },
  kids: {
    range: "6 a 10 anos",
    almoco: { base: 30, peak: 40 },
    jantar: { base: 30, peak: 35 },
    free: "Crianças de até 5 anos não pagam",
  },
  from: 44.9,
};

/* Preço de adulto num dia da semana (0 = domingo). Feriado não entra na conta: a tabela avisa. */
export function priceFor(dow: number, period: Period): number {
  if (period === "almoco") return dow >= 1 && dow <= 5 ? PRICES.almoco.base : PRICES.almoco.peak;
  return dow <= 4 ? PRICES.jantar.base : PRICES.jantar.peak;
}

export function brl(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* Dia da semana e minuto do dia em São Paulo, qualquer que seja o fuso do visitante. */
export function saoPauloNow(date: Date = new Date()): { dow: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { dow: dow < 0 ? 0 : dow, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export interface OpenStatus {
  open: boolean;
  period: Period;
  label: string;
  detail: string;
  price: number;
  dow: number;
}

/* "Aberto agora · almoço até as 15h" ou "Abre às 18h para o jantar". */
export function openStatus(date: Date = new Date()): OpenStatus {
  const { dow, minutes } = saoPauloNow(date);
  const h = hoursFor(dow);
  const inRange = ([a, b]: [number, number]) => minutes >= a * 60 && minutes < b * 60;
  if (inRange(h.almoco)) return { open: true, period: "almoco", label: "Aberto agora", detail: `almoço até as ${h.almoco[1]}h`, price: priceFor(dow, "almoco"), dow };
  if (inRange(h.jantar)) return { open: true, period: "jantar", label: "Aberto agora", detail: `jantar até as ${h.jantar[1]}h`, price: priceFor(dow, "jantar"), dow };
  if (minutes < h.almoco[0] * 60) return { open: false, period: "almoco", label: "Abre hoje às 11h", detail: "para o almoço", price: priceFor(dow, "almoco"), dow };
  if (minutes < h.jantar[0] * 60) return { open: false, period: "jantar", label: "Abre às 18h", detail: "para o jantar", price: priceFor(dow, "jantar"), dow };
  const next = (dow + 1) % 7;
  return { open: false, period: "almoco", label: "Abre amanhã às 11h", detail: "para o almoço", price: priceFor(next, "almoco"), dow: next };
}

/* ───────────────────────── O buffet ───────────────────────── */

/*
 * `items`: variedades vistas nos vídeos e fotos da primeira semana (18 a 25/11/2026). O buffet muda
 * todo dia, por isso o site chama de "amostra". Trocar pela lista oficial quando a casa mandar.
 */
export interface Station {
  id: string;
  title: string;
  /* Nome curto, para o painel fechado. */
  short: string;
  when: string;
  desc: string;
  items: string[];
  image: string;
  alt: string;
  position?: string;
}

export const STATIONS: Station[] = [
  {
    id: "pratos-quentes",
    title: "Pratos quentes",
    short: "Pratos quentes",
    when: "Almoço e jantar",
    desc: "Comida caseira servida na panela de barro: gratinados, farofa, arroz bem temperado e assados saindo o tempo todo.",
    items: [
      "Farofa da casa",
      "Arroz temperado com legumes",
      "Feijão",
      "Enroladinhos de presunto e queijo",
      "Massas gratinadas",
      "Batata assada",
      "Bolinhas de queijo",
      "Frango assado",
      "Pão de alho",
    ],
    image: "images/buffet-farofa.webp",
    alt: "Travessas de barro com farofa, arroz temperado e enrolados no buffet da Casa da Roça",
    position: "50% 70%",
  },
  {
    id: "saladas",
    title: "Saladas fresquinhas",
    short: "Saladas",
    when: "Almoço e jantar",
    desc: "Uma ilha inteira de saladas montadas no dia, para abrir o apetite ou equilibrar o prato.",
    items: ["Folhas verdes", "Vagem", "Salada de batata com tomate", "Legumes", "Frutas fatiadas", "Saladas montadas da casa"],
    image: "images/saladas.webp",
    alt: "Ilha de saladas com folhas, legumes e frutas no buffet",
    position: "50% 60%",
  },
  {
    id: "carnes",
    title: "Carnes grelhadas",
    short: "Carnes grelhadas",
    when: "Só no almoço",
    desc: "Carne passada na chapa e cortada na hora, linguiça e assados. É a estrela do almoço.",
    items: ["Carne na chapa, cortada na hora", "Carne assada", "Linguiça", "Frango"],
    image: "images/carne-chapa.webp",
    alt: "Carne grelhada sendo cortada na chapa",
    position: "50% 45%",
  },
  {
    id: "sobremesas",
    title: "Mesa de sobremesas",
    short: "Sobremesas",
    when: "Já incluída",
    desc: "Tortas, bolos e docinhos para escolher à vontade. A sobremesa faz parte do buffet, sem pagar a mais.",
    items: [
      "Brigadeiros e trufas",
      "Bolo de morango com chantili",
      "Torta de chocolate",
      "Torta de bolacha",
      "Mousse de maracujá no copinho de chocolate",
      "Copinhos de doce",
    ],
    image: "images/doces-brigadeiro.webp",
    alt: "Mesa de sobremesas com docinhos, tortas e bolos",
    position: "50% 35%",
  },
];

export const INCLUDED: Record<Period, { title: string; items: string[]; note: string; image: string; alt: string }> = {
  almoco: {
    title: "No almoço",
    items: ["Buffet de pratos quentes", "Saladas fresquinhas", "Carnes grelhadas", "Mesa de sobremesas"],
    note: "Carnes grelhadas na hora, só no almoço.",
    image: "images/carnes-linguica.webp",
    alt: "Travessas com linguiça e carnes assadas no buffet do almoço",
  },
  jantar: {
    title: "No jantar",
    items: ["Buffet de pratos quentes", "Saladas fresquinhas", "Rodízio de pizzas salgadas e doces", "Mesa de sobremesas"],
    note: "No jantar entra o rodízio de pizzas no lugar das carnes grelhadas.",
    image: "images/pizza-marguerita.webp",
    alt: "Fatia de pizza marguerita sendo servida, com o queijo puxando",
  },
};

/* ───────────────────────── A casa ───────────────────────── */

export const HOUSE_FEATURES = [
  { title: "Salão amplo e climatizado", desc: "Espaço de sobra para a família inteira, do almoço de domingo ao jantar no meio da semana." },
  { title: "Decoração de roça", desc: "Madeira, barris, rodas de carroça e flores: a casa foi montada para lembrar o interior." },
  { title: "Estacionamento grátis", desc: "Pátio próprio na frente do restaurante, na Avenida Guarapiranga." },
  { title: "Aberto todos os dias", desc: "Almoço e jantar de segunda a segunda, das 11h às 23h." },
];

export const HOUSE_PHOTOS = [
  { src: "images/salao-b.webp", w: 719, h: 900, alt: "Ilha do buffet no salão, com vigas de madeira e flores" },
  { src: "images/letreiro.webp", w: 717, h: 900, alt: "Letreiro iluminado Casa da Roça Restaurante e Pizzaria sobre parede de madeira" },
  { src: "images/salao-cheio-b.webp", w: 718, h: 1258, alt: "Salão da Casa da Roça cheio de famílias almoçando" },
  { src: "images/fachada.webp", w: 719, h: 930, alt: "Fachada da Casa da Roça com estacionamento na frente" },
  { src: "images/salao-a.webp", w: 719, h: 900, alt: "Vista do salão com o buffet ao fundo" },
  { src: "images/forno-pizza.webp", w: 717, h: 890, alt: "Forno de pizza e balcão de carnes da Casa da Roça" },
  { src: "images/doces-bolos.webp", w: 719, h: 890, alt: "Bolos e doces da mesa de sobremesas" },
  { src: "images/buffet-massas.webp", w: 719, h: 1278, alt: "Travessas de massas gratinadas e salgados no buffet" },
];

/* ───────────────────────── Quem já veio ───────────────────────── */

/* Vídeos publicados por perfis de gastronomia de São Paulo. Curtidas lidas em 25/11/2026. */
export const REELS = [
  { handle: "achadoszonasulsp", likes: "12 mil curtidas", title: "Novo restaurante na Zona Sul de SP", url: "https://www.instagram.com/reel/Df6_YLFgRnk/" },
  { handle: "dedeporsp", likes: "2,9 mil curtidas", title: "R$ 44,90 pra comer à vontade", url: "https://www.instagram.com/reel/DgFcLxwBev4/" },
  { handle: "penoasfaltosp", likes: "1,4 mil curtidas", title: "Comida de roça e muita fartura", url: "https://www.instagram.com/reel/DgFaRxygOyl/" },
  { handle: "bendito.review", likes: "", title: "Almoçando no buffet à vontade", url: "https://www.instagram.com/reel/Df8K_WLOb7p/" },
];

/*
 * Trechos de avaliações públicas da ficha do Google (lidas em 25/11/2026), todas de 5 estrelas,
 * com o nome abreviado e o texto como foi escrito, só cortado com "[…]". Antes do go-live, trocar
 * por um widget oficial ou pedir autorização (ver README).
 */
export interface Review {
  name: string;
  guide?: boolean;
  text: string;
  when: string;
  /* Foto da própria casa ligada ao que a pessoa comenta (não é foto enviada por ela). */
  photo: string;
  photoAlt: string;
  photoPosition?: string;
}

export const REVIEWS: Review[] = [
  {
    name: "Caroline C.",
    photo: "images/saladas.webp",
    photoAlt: "Ilha de saladas do buffet",
    photoPosition: "50% 58%",
    text: "Amei o sabor da comida, a variedade de coisas do buffet, muita comida, muita salada e no buffet está incluso a sobremesa. Fomos bem atendidos, o ambiente é lindo, espaçoso, aconchegante e bem clean.",
    when: "jantar de domingo, 22/11",
  },
  {
    name: "Marcos D.",
    photo: "images/buffet-massas.webp",
    photoAlt: "Travessas de barro com massas gratinadas e salgados",
    photoPosition: "50% 60%",
    guide: true,
    text: "Muitas variedades, para todos os gostos, comidas saborosas, ambiente gostoso, queria comer mais, experimentar mais coisas mas a barriga já estava cheia terei que voltar kkk parabéns",
    when: "novembro de 2026",
  },
  {
    name: "Nicolle S.",
    photo: "images/salao-b.webp",
    photoAlt: "Salão da Casa da Roça com vigas de madeira e flores",
    photoPosition: "50% 55%",
    text: "Experiência excelente! A comida estava muito boa, o espaço é agradável, aconchegante e muito bem organizado. O atendimento também foi impecável, com muita atenção e cordialidade.",
    when: "novembro de 2026",
  },
  {
    name: "Antonio D.",
    photo: "images/doces-bolos.webp",
    photoAlt: "Bolos e doces da mesa de sobremesas",
    photoPosition: "50% 45%",
    guide: true,
    text: "Diversas opções de saladas e uma mesa farta com bastante sobremesas. […] Sem contar no rodízio de pizza que também estava um delícia com muitas opções entre pizzas doces e salgadas. Super recomendo pelo excelente custo benefício nota 1000.",
    when: "jantar de inauguração, 18/11",
  },
  {
    name: "Marcia O.",
    photo: "images/salao-cheio-a.webp",
    photoAlt: "Salão cheio de famílias na semana de inauguração",
    photoPosition: "50% 50%",
    guide: true,
    text: "Atendimento incrível, ambiente agradável, comida maravilhosa. Perfeito para reunir família, amigos.",
    when: "novembro de 2026",
  },
  {
    name: "LuckS",
    photo: "images/pratos-quentes.webp",
    photoAlt: "Buffet de pratos quentes em travessas de barro",
    photoPosition: "50% 55%",
    text: "Pela quantidade de comidas diferentes que servem e por ser self-service coma a vontade achei bem barato. A mesa de sobremesas era bem farta.",
    when: "novembro de 2026",
  },
  {
    name: "Gabriella C.",
    photo: "images/forno-pizza.webp",
    photoAlt: "Funcionário servindo no balcão em frente ao forno de pizza",
    photoPosition: "50% 40%",
    text: "Atendimento perfeito, atendentes muitos simpáticos e atenciosos, comidas maravilhosas e sempre servindo até que esteja satisfeito. Excelente restaurante.",
    when: "novembro de 2026",
  },
  {
    name: "Gabriela O.",
    photo: "images/salao-cheio-b.webp",
    photoAlt: "Famílias jantando no salão",
    photoPosition: "50% 45%",
    guide: true,
    text: "Fomos em família, na noite de sábado, funcionários educados, variedade de comidas.",
    when: "novembro de 2026",
  },
];

/* ───────────────────────── Dúvidas ───────────────────────── */

export const FAQ = [
  {
    q: "Quanto custa comer na Casa da Roça?",
    a: "O buffet à vontade sai a partir de R$ 44,90 por pessoa. No almoço: R$ 44,90 de segunda a sexta (exceto feriados) e R$ 64,90 aos sábados, domingos e feriados. No jantar: R$ 44,90 de domingo a quinta e R$ 59,90 às sextas e sábados. Os valores podem mudar sem aviso; confirme pelo WhatsApp.",
  },
  {
    q: "O que está incluso no valor?",
    a: "Tudo o que está no buffet, à vontade: pratos quentes, saladas e a mesa de sobremesas. No almoço entram as carnes grelhadas; no jantar, o rodízio de pizzas salgadas e doces.",
  },
  {
    q: "Tem rodízio de pizza no almoço?",
    a: "Não. O rodízio de pizzas é servido no jantar, das 18h às 23h. No almoço o destaque são as carnes grelhadas, que não são servidas à noite.",
  },
  {
    q: "Criança paga?",
    a: "Crianças de até 5 anos não pagam. De 6 a 10 anos, o almoço custa R$ 30,00 de segunda a sexta e R$ 40,00 aos sábados, domingos e feriados; o jantar custa R$ 30,00 de domingo a quinta e R$ 35,00 às sextas e sábados.",
  },
  {
    q: "Qual é o horário de funcionamento?",
    a: "A casa abre todos os dias. De segunda a sexta, o almoço vai das 11h às 15h e o jantar das 18h às 23h. Aos sábados, domingos e feriados, o almoço vai das 11h às 18h e o jantar das 18h às 23h.",
  },
  {
    q: "Tem estacionamento?",
    a: "Sim, grátis, em pátio próprio na frente do restaurante, na Av. Guarapiranga, 143, no Socorro.",
  },
  {
    q: "Aceita vale-refeição?",
    a: "Sim, a casa aceita VR. Para outras bandeiras e formas de pagamento, consulte pelo WhatsApp.",
  },
  {
    q: "Dá para reservar mesa ou levar um grupo grande?",
    a: "Mande o dia, o horário e o número de pessoas pelo formulário de reservas ou direto no WhatsApp (11) 93082-2554. A equipe responde confirmando a disponibilidade.",
  },
];
