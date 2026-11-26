# Casa da Roça — site institucional (prévia)

Site do restaurante Casa da Roça (Av. Guarapiranga, 143, Socorro, São Paulo/SP), feito como proposta. Mesma base dos outros sites: **Vite + React + TypeScript + Tailwind + framer-motion + Lenis + Phosphor**, com HTML pré-renderizado no build (SEO).

**Estado:** prévia publicada em https://viniciusextremxd.github.io/casa-da-roca/ (repositório `ViniciusExtremXD/casa-da-roca`). Sem domínio e sem GTM. O `index.html` e o `robots.txt` estão com `noindex` de propósito.

**Desenho (v2, 25/11/2026):** paleta tirada da casa (parede caiada, bordô do logo, ladrilho hidráulico, céu da fazenda), Gloock nos títulos e Schibsted Grotesk no texto, cantos retos, sem pílulas, sem pré-carregamento e sem rolagem suave. O movimento ficou em três lugares: abertura do topo, céu de dia e de noite no cardápio, e as aberturas das variedades.

## Comandos

```bash
npm install
npm run dev          # http://localhost:5181
npm run build        # dist/ com HTML pré-renderizado + JSON-LD (Restaurant, FAQPage, WebSite)
npm run deploy:gh    # publica a prévia no GitHub Pages (precisa do repositório criado)
```

## Estrutura

```
src/data/site.ts             conteúdo: contatos, horários, valores, cardápio por período, avaliações, FAQ e o "aberto agora"
src/sections/Hero.tsx        topo: título, WhatsApp, status de hoje, preço e nota do Google
src/sections/Reviews.tsx     avaliações públicas do Google em carrossel
src/sections/Location.tsx    onde fica (mapa, rota, horários) + pedido de reserva, dúvidas e rodapé com o ladrilho
src/sections/Reservation.tsx formulário que monta a mensagem de reserva e abre o WhatsApp
src/sections/DayNight.tsx    almoço e jantar como a fazenda de dia e de noite; cada item abre as variedades
src/sections/House.tsx       a casa: texto, fotos do salão e vídeos de quem já foi
src/components               chrome (cabeçalho, barra do celular, cookies), cta (links com medição), motion
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
