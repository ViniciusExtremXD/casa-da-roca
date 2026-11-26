/** @type {import('tailwindcss').Config} */

/*
 * Paleta tirada da própria casa: parede caiada, bordô do logo, telha, ladrilho hidráulico do buffet
 * e o céu da fazenda de dia e de noite. Um acento só (bordô); o resto é chão para as fotos.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cal: { DEFAULT: "#F1EEE8", hi: "#F9F7F3", lo: "#E6E1D7" },
        tinta: { DEFAULT: "#1E1613", soft: "#4A3F3A", mute: "#7A6E67" },
        vinho: { DEFAULT: "#5B1913", hi: "#7A261D", lo: "#3D0F0B" },
        telha: "#A9502C",
        azulejo: { DEFAULT: "#5E7684", lo: "#3F5462" },
        dia: { ceu: "#C8DAE0", horizonte: "#EFE5D0", chao: "#F3ECDF", morro: "#93A274", serra: "#B7C09D" },
        noite: { DEFAULT: "#0F1527", ceu: "#0B1020", horizonte: "#1E2945", morro: "#18203A", serra: "#232D49", texto: "#EDE8DE" },
        lamparina: "#E9A646",
      },
      fontFamily: {
        display: ['"Gloock"', "Georgia", '"Times New Roman"', "serif"],
        sans: ['"Schibsted Grotesk Variable"', "system-ui", "-apple-system", '"Segoe UI"', "sans-serif"],
      },
      fontSize: {
        label: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.16em", fontWeight: "600" }],
      },
      maxWidth: { page: "1320px" },
      transitionTimingFunction: { out: "cubic-bezier(0.16, 1, 0.3, 1)" },
      keyframes: {
        twinkle: { "0%, 100%": { opacity: "0.25" }, "50%": { opacity: "1" } },
        flicker: { "0%, 100%": { opacity: "0.9" }, "45%": { opacity: "0.75" }, "55%": { opacity: "1" } },
      },
      animation: {
        twinkle: "twinkle 5s ease-in-out infinite",
        flicker: "flicker 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
