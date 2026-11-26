import { motion } from "framer-motion";

/*
 * Movimento com parcimônia: a abertura do topo, o céu da fazenda e as aberturas do cardápio.
 * O resto da página fica parado e já visível, sem esperar rolagem.
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/* Título que entra linha por linha, de baixo para cima, dentro de uma máscara. Só na carga da página. */
export function Lines({ lines, delay = 0, className }: { lines: string[]; delay?: number; className?: string }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: delay + i * 0.12 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
