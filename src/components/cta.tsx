import React from "react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { COMPANY, buildWhatsAppUrl, trackLead } from "../data/site";

/*
 * Todo contato é um <a href="https://wa.me/..."> ou <a href="tel:..."> de verdade, para que os
 * gatilhos de clique em link do GTM funcionem. Cada clique também envia `lead_click` + `generate_lead`.
 */

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
type TrackProps = { location: string; detail?: string };

export const RESERVA_MSG = "Olá! Vim pelo site da Casa da Roça e gostaria de reservar uma mesa.";

export function WhatsAppLink({ message, location, detail, children, onClick, ...rest }: AnchorProps & TrackProps & { message?: string }) {
  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      data-lead-channel="whatsapp"
      data-lead-location={location}
      onClick={(e) => {
        // Recalcula na hora do clique para incluir a origem do anúncio (utm), que só existe no navegador.
        e.currentTarget.href = buildWhatsAppUrl(message);
        trackLead("whatsapp", location, detail);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function PhoneLink({ location, detail, children, onClick, ...rest }: AnchorProps & TrackProps) {
  return (
    <a
      href={COMPANY.phoneTel}
      data-lead-channel="phone"
      data-lead-location={location}
      onClick={(e) => {
        trackLead("phone", location, detail);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/* Ícone do WhatsApp em traço fino, no mesmo peso do texto do botão. */
export function WhatsGlyph({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return <WhatsappLogo aria-hidden className={className} />;
}

export function Arrow({ className = "h-4 w-4", dir = "right" }: { className?: string; dir?: "right" | "left" | "down" | "out" }) {
  const rotate = { right: 0, left: 180, down: 90, out: -45 }[dir];
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className} style={{ transform: `rotate(${rotate}deg)` }} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M1.5 8h12.5M9 3l5 5-5 5" />
    </svg>
  );
}
