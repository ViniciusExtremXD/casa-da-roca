import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COMPANY, NAV_LINKS, assetUrl, pushEvent } from "../data/site";
import { EASE_OUT } from "./motion";
import { PhoneLink, RESERVA_MSG, WhatsAppLink, WhatsGlyph } from "./cta";

function useScrolledPast(y: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const on = () => setPast(window.scrollY > y);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [y]);
  return past;
}

/* ───────────── Cabeçalho ───────────── */

export function Header() {
  const scrolled = useScrolledPast(24);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-cal transition-[box-shadow] duration-500 ${scrolled ? "shadow-[0_1px_0_rgba(30,22,19,0.12)]" : ""}`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <nav className="gutter mx-auto flex h-[72px] max-w-page items-center justify-between gap-6" aria-label="Principal">
          <a href="#topo" className="shrink-0" aria-label="Casa da Roça, voltar ao início">
            <img src={assetUrl("logo-casa-da-roca.webp")} alt="Casa da Roça Restaurante e Pizzaria" width={1156} height={966} className="h-[50px] w-auto" />
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-[15px] font-medium text-tinta-soft transition-colors hover:text-vinho">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <PhoneLink location="nav" className="tnum hidden text-[15px] font-medium text-tinta-soft transition-colors hover:text-vinho xl:inline">
              {COMPANY.phoneDisplay}
            </PhoneLink>
            <a href="#reservar" className="btn btn-vinho !min-h-[2.75rem] !px-4 text-[14px]">
              Reservar mesa
            </a>
            <button type="button" onClick={() => setOpen(true)} className="label -mr-2 p-2 text-tinta lg:hidden" aria-expanded={open} aria-controls="menu-celular">
              Menu
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-celular"
            className="gutter fixed inset-0 z-[80] flex flex-col bg-cal pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top,0px)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex h-[72px] items-center justify-between">
              <img src={assetUrl("logo-casa-da-roca.webp")} alt="Casa da Roça Restaurante e Pizzaria" width={1156} height={966} className="h-[50px] w-auto" />
              <button type="button" onClick={() => setOpen(false)} className="label -mr-2 p-2 text-tinta">
                Fechar
              </button>
            </div>
            <ul className="mt-10 border-t border-tinta/15">
              {NAV_LINKS.concat([{ href: "#reservar", label: "Reservar mesa" }]).map((l, i) => (
                <motion.li
                  key={l.href}
                  className="border-b border-tinta/15"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.05 + i * 0.05 }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="font-display block py-4 text-[2.1rem] leading-tight text-tinta">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto space-y-1 text-[15px] text-tinta-soft">
              <p>{COMPANY.address.street}, {COMPANY.address.district}</p>
              <p>Todos os dias, das 11h às 23h</p>
              <p className="pt-3">
                <WhatsAppLink location="menu_mobile" message={RESERVA_MSG} className="link tnum font-semibold text-vinho">
                  WhatsApp {COMPANY.whatsappDisplay}
                </WhatsAppLink>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────────── Barra fixa no celular: reservar e WhatsApp sempre à mão ───────────── */

export function MobileBar() {
  const visible = useScrolledPast(640);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto] gap-2 border-t border-tinta/10 bg-cal-hi px-3 pt-3 md:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
        >
          <a href="#reservar" className="btn btn-vinho w-full">
            Reservar mesa
          </a>
          <WhatsAppLink location="barra_mobile" message={RESERVA_MSG} className="btn btn-linha !px-4 text-vinho" aria-label={`WhatsApp ${COMPANY.whatsappDisplay}`}>
            <WhatsGlyph className="h-5 w-5" />
          </WhatsAppLink>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────── Cookies (LGPD) com Consent Mode v2 ───────────── */

const CONSENT_KEY = "roca-consent";
/* Sem GTM configurado não há cookie de medição, então o aviso nem aparece. */
const HAS_GTM = /^GTM-(?!X+$)[A-Z0-9]+$/.test(import.meta.env.VITE_GTM_ID ?? "");

function applyConsent(granted: boolean) {
  const v = granted ? "granted" : "denied";
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("consent", "update", { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v, personalization_storage: v });
  pushEvent("consent_update", { consent_state: v });
}

export function CookieNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen: string | null = null;
    try {
      seen = localStorage.getItem(CONSENT_KEY);
    } catch {
      seen = null;
    }
    if (seen || !HAS_GTM) return;
    const timer = window.setTimeout(() => setOpen(true), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener("roca:cookies", reopen);
    return () => window.removeEventListener("roca:cookies", reopen);
  }, []);

  const choose = (granted: boolean) => {
    try {
      localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
    } catch {
      /* modo privado: só fecha */
    }
    applyConsent(granted);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="region"
          aria-label="Aviso de cookies"
          className="fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-[45] border border-tinta/15 bg-cal-hi p-4 text-[14px] text-tinta md:inset-x-auto md:bottom-6 md:left-6 md:max-w-sm"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <p className="leading-relaxed text-tinta-soft">
            Usamos cookies para entender o uso do site e melhorar nossos anúncios. Você escolhe. Saiba mais na{" "}
            <a href={assetUrl("politica-de-privacidade.html")} className="link text-tinta">
              Política de Privacidade
            </a>
            .
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => choose(false)} className="btn btn-linha !min-h-[2.5rem]">
              Recusar
            </button>
            <button type="button" onClick={() => choose(true)} className="btn btn-vinho !min-h-[2.5rem]">
              Aceitar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
