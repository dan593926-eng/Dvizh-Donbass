/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // Mobile-first custom breakpoints, checked against the brief's device list
    screens: {
      xs: "375px",
      sm: "600px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1800px",
    },
    extend: {
      colors: {
        black: "#0A0908",
        graphite: "#17140F",
        steel: "#322D26",
        smoke: "#5C564D",
        fog: "#8B847A",
        bone: "#F3EFE7",
        gold: {
          DEFAULT: "#FFD800",
          bright: "#FFE666",
          dim: "#8C7000",
        },
        ember: {
          DEFAULT: "#C1441E",
          dim: "#7A2C14",
        },
      },
      fontFamily: {
        display: ["'Oswald'", "'Arial Narrow'", "sans-serif"],
        body: ["'Manrope'", "system-ui", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(3.5rem, 14vw, 11rem)", { lineHeight: "0.88", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(2.5rem, 8vw, 6rem)", { lineHeight: "0.92", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.9rem, 5vw, 3.4rem)", { lineHeight: "0.98", letterSpacing: "-0.005em" }],
      },
      letterSpacing: {
        tightest: "-0.03em",
        widish: "0.08em",
      },
      backgroundImage: {
        "vignette": "radial-gradient(120% 120% at 50% 30%, transparent 40%, rgba(0,0,0,0.75) 100%)",
        "fade-top": "linear-gradient(to bottom, #0A0908, transparent)",
        "fade-bottom": "linear-gradient(to top, #0A0908, transparent)",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "grain": "grain 8s steps(10) infinite",
        "marquee": "marquee 32s linear infinite",
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-1%, -2%)" },
          "20%": { transform: "translate(-3%, 1%)" },
          "30%": { transform: "translate(2%, -3%)" },
          "40%": { transform: "translate(-2%, 3%)" },
          "50%": { transform: "translate(3%, 1%)" },
          "60%": { transform: "translate(-1%, 2%)" },
          "70%": { transform: "translate(1%, -1%)" },
          "80%": { transform: "translate(-3%, 2%)" },
          "90%": { transform: "translate(2%, -2%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
