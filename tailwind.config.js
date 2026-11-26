/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Bordô do logo e das artes oficiais */
        wine: {
          50: "#FBF2EF",
          100: "#F4DDD7",
          200: "#E6B5AA",
          300: "#CF8573",
          400: "#AD5140",
          500: "#8A2E22",
          600: "#6B1A14",
          700: "#53100D",
          800: "#400A0A",
          900: "#2B0707",
          950: "#1A0404",
        },
        /* Laranja "brasa" dos títulos das artes (Rodízio de pizzas, Promoção) */
        ember: {
          50: "#FFF7EB",
          100: "#FFEBCC",
          200: "#FFD699",
          300: "#FFBF61",
          400: "#FBA22E",
          500: "#F0890F",
          600: "#CF6B06",
          700: "#A4520A",
        },
        /* Creme de papel e madeira do salão */
        cream: {
          50: "#FFFDFA",
          100: "#FAF6F0",
          200: "#F2E8DA",
          300: "#EED3AE",
        },
        wood: {
          300: "#DDB98E",
          400: "#C49660",
          500: "#A87642",
          700: "#6B4423",
          900: "#2A180D",
        },
        leaf: "#5E7B3A",
        ink: "#24120C",
      },
      fontFamily: {
        display: ['"Fraunces Variable"', "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans Variable"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      /* Sombras em camadas, tingidas de bordô (nunca preto puro) */
      boxShadow: {
        /* Sombras curtas e difusas: o card "pousa" na página, sem mancha escura embaixo. */
        soft: "0 1px 2px rgba(43,7,7,0.04), 0 6px 16px -8px rgba(43,7,7,0.10)",
        card: "0 1px 2px rgba(43,7,7,0.04), 0 8px 20px -10px rgba(43,7,7,0.12), 0 24px 48px -28px rgba(43,7,7,0.18)",
        lift: "0 1px 3px rgba(43,7,7,0.05), 0 12px 28px -14px rgba(43,7,7,0.16), 0 36px 70px -40px rgba(43,7,7,0.26)",
        float: "0 2px 6px rgba(43,7,7,0.06), 0 18px 38px -18px rgba(43,7,7,0.22), 0 48px 90px -50px rgba(43,7,7,0.32)",
        ember: "0 8px 20px -10px rgba(240,137,15,0.42)",
        wine: "0 8px 20px -10px rgba(107,26,20,0.45)",
        "inner-line": "inset 0 0 0 1px rgba(107,26,20,0.08)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(3deg)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(6deg)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        flutter: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(0deg)" },
          "25%": { transform: "translate3d(10px, -18px, 0) rotate(-8deg)" },
          "50%": { transform: "translate3d(18px, 0, 0) rotate(4deg)" },
          "75%": { transform: "translate3d(6px, 10px, 0) rotate(-4deg)" },
        },
        rise: {
          "0%": { transform: "translate3d(0, 0, 0) scale(1)", opacity: "0" },
          "12%": { opacity: "0.9" },
          "100%": { transform: "translate3d(var(--dx, 20px), -72vh, 0) scale(0.3)", opacity: "0" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
        drift: {
          from: { transform: "translate3d(-18px, 0, 0)" },
          to: { transform: "translate3d(18px, 0, 0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-rev": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        marquee: "marquee 60s linear infinite",
        "marquee-rev": "marquee-rev 64s linear infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.2, 0.6, 0.3, 1) infinite",
        float: "float 7s ease-in-out infinite",
        sway: "sway 5s ease-in-out infinite",
        flutter: "flutter 9s ease-in-out infinite",
        "spin-slow": "spin-slow 24s linear infinite",
        rise: "rise 9s linear infinite",
        twinkle: "twinkle 4.5s ease-in-out infinite",
        drift: "drift 16s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
