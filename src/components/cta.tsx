import React from "react";
import { ArrowUpRight, Phone, WhatsappLogo } from "@phosphor-icons/react";
import { COMPANY, buildWhatsAppUrl, trackLead } from "../data/site";
import { Magnetic } from "./motion";

/*
 * Todo CTA de contato é um <a href="https://wa.me/..."> ou <a href="tel:..."> de verdade,
 * para que gatilhos de clique em link do GTM funcionem. Cada clique também envia
 * `lead_click` + `generate_lead` ao dataLayer (ver TRACKING.md).
 */

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
type TrackProps = { location: string; detail?: string };

export function WhatsAppLink({ message, location, detail, children, onClick, ...rest }: AnchorProps & TrackProps & { message?: string }) {
  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      data-lead-channel="whatsapp"
      data-lead-location={location}
      onClick={(e) => {
        // Recalcula na hora do clique para incluir a origem do anúncio (utm) que só existe no navegador.
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

/* Pílula principal: preenchimento que varre da esquerda e seta que troca de lugar. */
export function PrimaryCta({
  message,
  location,
  detail,
  children,
  size = "lg",
  tone = "wine",
  className,
}: TrackProps & {
  message?: string;
  children: React.ReactNode;
  size?: "md" | "lg";
  tone?: "wine" | "ember" | "cream";
  className?: string;
}) {
  /* Abaixo de 380 px a bolinha da seta some e o botão encolhe, para caber em telas de 320 px. */
  const pad = size === "lg" ? "h-14 pl-5 pr-5 text-[15px] min-[380px]:pl-6 min-[380px]:pr-2" : "h-12 pl-4 pr-4 text-sm min-[380px]:pl-5 min-[380px]:pr-1.5";
  const dot = size === "lg" ? "h-10 w-10" : "h-9 w-9";
  const colors = {
    wine: { base: "bg-wine-600 text-white shadow-wine", sweep: "bg-wine-800", dot: "bg-cream-50 text-wine-700" },
    ember: { base: "bg-ember-500 text-wine-950 shadow-ember", sweep: "bg-ember-400", dot: "bg-wine-950 text-ember-300" },
    cream: { base: "bg-cream-50 text-wine-800 shadow-float", sweep: "bg-white", dot: "bg-wine-600 text-white" },
  }[tone];
  return (
    <Magnetic strength={0.22}>
      <WhatsAppLink
        message={message}
        location={location}
        detail={detail}
        className={`group relative inline-flex max-w-full items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full font-semibold min-[380px]:gap-4 ${colors.base} ${pad} ${className ?? ""}`}
      >
        <span className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 ${colors.sweep}`} />
        <WhatsappLogo weight="fill" className="relative h-5 w-5 shrink-0" />
        <span className="relative">{children}</span>
        <span className={`relative hidden place-items-center overflow-hidden rounded-full min-[380px]:grid ${colors.dot} ${dot}`}>
          <ArrowUpRight weight="bold" className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-6 group-hover:translate-x-6" />
          <ArrowUpRight weight="bold" className="absolute h-4 w-4 -translate-x-6 translate-y-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      </WhatsAppLink>
    </Magnetic>
  );
}

export function PhoneCta({ location, tone = "light", className }: { location: string; tone?: "dark" | "light"; className?: string }) {
  const colors =
    tone === "dark"
      ? "border-white/20 text-cream-50 hover:border-white/50 hover:bg-white/5"
      : "border-wine-600/20 text-wine-800 hover:border-wine-600/50 hover:bg-wine-600/5";
  return (
    <Magnetic strength={0.18}>
      <PhoneLink location={location} className={`group inline-flex h-14 items-center gap-3 rounded-full border px-6 text-[15px] font-semibold transition-colors ${colors} ${className ?? ""}`}>
        <Phone weight="fill" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        {COMPANY.phoneDisplay}
      </PhoneLink>
    </Magnetic>
  );
}
