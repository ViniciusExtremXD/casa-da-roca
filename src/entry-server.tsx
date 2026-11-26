import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { COMPANY, FAQ, hoursFor } from "./data/site";

/* Só no build: scripts/prerender.mjs injeta este HTML e o JSON-LD em dist/index.html. */

export function render() {
  return renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

/* Trocar pelo domínio definitivo no go-live (também em robots.txt e sitemap.xml). */
const SITE = import.meta.env.VITE_SITE_URL || "https://casadarocarestaurante.com.br/";
const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;

export function structuredData() {
  const restaurant = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE}#restaurante`,
    name: COMPANY.full,
    alternateName: COMPANY.name,
    description: "Restaurante de comida caipira com buffet à vontade, carnes grelhadas, sobremesas e rodízio de pizzas no jantar, no Socorro, Zona Sul de São Paulo.",
    url: SITE,
    image: [`${SITE}og-image.jpg`, `${SITE}images/buffet-farofa.webp`, `${SITE}images/salao-b.webp`],
    logo: `${SITE}logo-casa-da-roca.png`,
    telephone: "+55-11-93082-2554",
    servesCuisine: ["Brasileira", "Caipira", "Pizza"],
    priceRange: "R$ 44,90 a R$ 64,90",
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address.street,
      addressLocality: "São Paulo",
      addressRegion: "SP",
      postalCode: COMPANY.address.cep,
      addressCountry: "BR",
    },
    geo: { "@type": "GeoCoordinates", latitude: COMPANY.geo.lat, longitude: COMPANY.geo.lng },
    hasMap: COMPANY.googleUrl,
    openingHoursSpecification: DAY.flatMap((dayOfWeek, dow) => {
      const h = hoursFor(dow);
      const spans = h.almoco[1] === h.jantar[0] ? [[h.almoco[0], h.jantar[1]]] : [h.almoco, h.jantar];
      return spans.map(([opens, closes]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek, opens: hh(opens), closes: hh(closes) }));
    }),
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Estacionamento grátis", value: true },
      { "@type": "LocationFeatureSpecification", name: "Ambiente climatizado", value: true },
    ],
    sameAs: [COMPANY.instagramUrl],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const website = { "@context": "https://schema.org", "@type": "WebSite", name: COMPANY.name, url: SITE, inLanguage: "pt-BR", publisher: { "@id": `${SITE}#restaurante` } };

  return [restaurant, faq, website];
}
