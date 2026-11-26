# Casa da Roça — site institucional (prévia)

Site do restaurante Casa da Roça (Av. Guarapiranga, 143, Socorro, São Paulo/SP), feito como proposta. Mesma base dos outros sites: **Vite + React + TypeScript + Tailwind + framer-motion + Lenis + Phosphor**, com HTML pré-renderizado no build (SEO).

**Estado:** prévia local. Ainda não publicado, sem domínio, sem GTM. O `index.html` e o `robots.txt` estão com `noindex` de propósito.

## Comandos

```bash
npm install
npm run dev          # http://localhost:5181
npm run build        # dist/ com HTML pré-renderizado + JSON-LD (Restaurant, FAQPage, WebSite)
npm run deploy:gh    # publica a prévia no GitHub Pages (precisa do repositório criado)
```

## Estrutura

```
src/data/site.ts          todo o conteúdo: contatos, horários, valores, buffet, FAQ e a lógica de "aberto agora"
src/sections/Hero.tsx     topo: status ao vivo, selo de preço girando, fotos em arco, brasas
src/sections/House.tsx    faixa do cardápio + "A casa"
src/sections/Buffet.tsx   estações do buffet + chave almoço/jantar (começa no período atual)
src/sections/Prices.tsx   tabela de valores com destaque automático para o dia de hoje
src/sections/Gallery.tsx  fotos do salão passando + Google + reels de quem visitou
src/sections/Reservation.tsx  pedido de reserva que monta a mensagem e abre o WhatsApp
src/sections/Location.tsx mapa, horários (dia de hoje marcado), dúvidas e rodapé
src/components            motion (animações), chrome (menu, abertura, cookies), cta (links com medição)
```

## De onde veio o conteúdo (25/11/2026)

- **Endereço, WhatsApp, horário geral, textos:** bio e legendas do Instagram oficial `@restaurante.casadaroca`.
- **Nota 4,4 (36 avaliações), telefone, coordenadas:** ficha "Restaurante casa da roça" no Google Maps. A ficha **não está reivindicada** e está **sem site**.
- **Tabela de valores, horários por período, infantil, VR:** reel do `@achadoszonasulsp` (19/11/2026). Bate com o "R$ 44,90" e os dias da promoção publicados pela casa, mas é fonte de terceiro.
- **Fotos:** quadros do reel oficial de inauguração (`DgImFdhS8I9`, 24/11/2026), recortados acima das legendas, 720 px de largura. A pizza vem da arte oficial "Buffet completo + rodízio de pizzas".
- **Logo:** recortado do quadro final do mesmo reel (fundo branco transformado em transparente). Não foi redesenhado.

## A confirmar com o restaurante

- [ ] Tabela de valores e horários por período (fonte de terceiro) e se feriado segue mesmo o horário de fim de semana.
- [ ] Se a casa aceita reserva e como quer receber os pedidos (o site só envia um pedido pelo WhatsApp).
- [ ] Uso das fotos do reel no site (aparecem clientes no salão e funcionários) e envio das fotos originais em alta.
- [ ] Logo original em vetor (o atual vem de vídeo, 560 px de largura na origem).
- [ ] Formas de pagamento além do VR.
- [ ] Razão social, CNPJ e contato para a política de privacidade (está como rascunho).

## Antes de publicar

- [ ] Domínio: trocar `SITE` em `src/entry-server.tsx`, liberar `robots.txt`, trocar o `noindex` do `index.html` e criar `sitemap.xml`.
- [ ] GTM/GA4/Google Ads/Pixel: preencher `VITE_GTM_ID` no `.env`. Os eventos já saem no dataLayer (`generate_lead` com `method` whatsapp/phone/form e `link_location`). O aviso de cookies só aparece com GTM configurado.
- [ ] Reivindicar a ficha do Google e colocar o site nela.
