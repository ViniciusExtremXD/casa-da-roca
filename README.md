# Casa da Roça — site institucional (prévia)

Site do restaurante Casa da Roça (Av. Guarapiranga, 143, Socorro, São Paulo/SP), feito como proposta. Mesma base dos outros sites: **Vite + React + TypeScript + Tailwind + framer-motion + Lenis + Phosphor**, com HTML pré-renderizado no build (SEO).

**Estado:** prévia publicada em https://viniciusextremxd.github.io/casa-da-roca/ (repositório `ViniciusExtremXD/casa-da-roca`). Sem domínio e sem GTM. O `index.html` e o `robots.txt` estão com `noindex` de propósito.

**Desenho (v4, 26/11/2026):** v3 com fundos mais brancos, sem ícones em quadradinho nem cartões de destaque, avaliações e mapa lado a lado, e a fazenda embaixo do almoço/jantar com bichos animados. **Antes (v3):** é o visual da primeira versão (bordô e laranja, Fraunces, animações) com quatro ajustes pedidos: avaliações do Google em carrossel e "como chegar e reservar" logo depois do topo, estações do buffet que abrem para mostrar as variedades, e almoço/jantar como a mesma fazenda de dia e de noite. A v2 (redesenho claro, sem pílulas) foi recusada pelo usuário e está só no histórico do git (3f6f223).

## Comandos

```bash
npm install
npm run dev          # http://localhost:5181
npm run build        # dist/ com HTML pré-renderizado + JSON-LD (Restaurant, FAQPage, WebSite)
npm run deploy:gh    # publica a prévia no GitHub Pages (precisa do repositório criado)
```

## Estrutura

```
src/data/site.ts             conteúdo: contatos, horários, valores, estações do buffet (com variedades), avaliações, FAQ e o "aberto agora"
src/sections/Hero.tsx        topo: status ao vivo, selo de preço girando, fotos em arco, brasas
src/sections/Visit.tsx       avaliações do Google em carrossel (com foto da casa) ao lado do mapa, horários e atalho de reserva
src/sections/Location.tsx    dúvidas e rodapé
src/sections/House.tsx       faixa do cardápio + "A casa"
src/sections/Buffet.tsx      estações do buffet: clicar abre as variedades (painéis no computador, sanfona no celular)
src/sections/DayNight.tsx    chave almoço/jantar; a fazenda fica embaixo como cenário (vacas e ovelhas de dia, corujas e lobos-guarás de noite)
src/sections/Prices.tsx      tabela de valores com destaque automático para o dia de hoje
src/sections/Gallery.tsx     fotos do salão passando + Instagram + vídeos de quem visitou
src/sections/Reservation.tsx pedido de reserva que monta a mensagem e abre o WhatsApp
src/components               motion (animações), chrome (menu, abertura, cookies), cta (links com medição)
```

## De onde veio o conteúdo (25/11/2026)

- **Endereço, WhatsApp, horário geral, textos:** bio e legendas do Instagram oficial `@restaurante.casadaroca`.
- **Nota 4,4 (36 avaliações), telefone, coordenadas:** ficha "Restaurante casa da roça" no Google Maps. A ficha **não está reivindicada** e está **sem site**.
- **Tabela de valores, horários por período, infantil, VR:** reel do `@achadoszonasulsp` (19/11/2026). Bate com o "R$ 44,90" e os dias da promoção publicados pela casa, mas é fonte de terceiro.
- **Avaliações:** trechos de 8 avaliações públicas da ficha do Google (lidas em 25/11/2026), com nome abreviado e texto sem correção. Há também avaliações negativas recentes (fila no sol, banheiro, atendimento); a ficha não reivindicada não deixa a casa responder.
- **Variedades do buffet:** o que aparece nos vídeos e fotos da primeira semana; o site chama de "amostra".
- **Fotos:** quadros do reel oficial de inauguração (`DgImFdhS8I9`, 24/11/2026), recortados acima das legendas, 720 px de largura. A pizza vem da arte oficial "Buffet completo + rodízio de pizzas".
- **Logo:** recortado do quadro final do mesmo reel (fundo branco transformado em transparente). Não foi redesenhado.

## A confirmar com o restaurante

- [ ] Tabela de valores e horários por período (fonte de terceiro) e se feriado segue mesmo o horário de fim de semana.
- [ ] Se a casa aceita reserva e como quer receber os pedidos (o site só envia um pedido pelo WhatsApp).
- [ ] Uso das fotos do reel no site (aparecem clientes no salão e funcionários) e envio das fotos originais em alta.
- [ ] Logo original em vetor (o atual vem de vídeo, 560 px de largura na origem).
- [ ] Formas de pagamento além do VR.
- [ ] Lista oficial das variedades do buffet e das pizzas.
- [ ] Uso dos trechos de avaliação do Google: no go-live, trocar por widget oficial (API do Google Places) ou pedir autorização.
- [ ] Razão social, CNPJ e contato para a política de privacidade (está como rascunho).

## Antes de publicar

- [ ] Domínio: trocar `SITE` em `src/entry-server.tsx`, liberar `robots.txt`, trocar o `noindex` do `index.html` e criar `sitemap.xml`.
- [ ] GTM/GA4/Google Ads/Pixel: preencher `VITE_GTM_ID` no `.env`. Os eventos já saem no dataLayer (`generate_lead` com `method` whatsapp/phone/form e `link_location`). O aviso de cookies só aparece com GTM configurado.
- [ ] Reivindicar a ficha do Google e colocar o site nela.
