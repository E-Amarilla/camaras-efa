import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|date-picker|dropdown|skeleton|table|ripple|spinner|calendar|date-input|form|popover|menu|divider|checkbox|spacer|pagination).js",
    "./node_modules/@heroui/theme/dist/components/spinner.js",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        1365: "1365px",
        1050: "1050px",
        545: "545px",
      },
      colors: {
        orange: "#EF8225",
        oranget: "#F826",
        blue: "#30A0F0",
        bluet: "#06E5",
        water: "#33A7FD",
        red: "#F00",
        red2: "#dd1e1eff",
        green: "#54C42D",
        lightgrey: "#8C8C8C",
        grey: "#1F1F1F",
        black: "#131313",
        footerbg: "#2C2C2C",
        datorRed: "#581420",
        datosgrey: "#5a5a5a",
        cerrarsesion: "#f15b5f",
      },
      spacing: {
        4: "0px 0px 0px 0px",
        1: "133px 20px 20px 20px",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            backgroundoscuro: "#EDEDED",
            background: "#FDFDFD",
            background2: "#EDEDED",
            background3: "#E0E0E0",
            background4: "#D8D8D8",
            background5: "#D3D3D3",
            background6: "#CECECE",
            headerbg: "#a4deffff",
            texto: "#222",
            texto2: "#555",
            textoheader: "#111",
            textohover: "#333",
            textodesac: "#929292ff",

            datosblueback: "#a4deffff",
            datosbluebackhover: "#93d2f7ff",
          },
        },

        dark: {
          colors: {
            backgroundoscuro: "#111",
            background: "#1B1B1B",
            background2: "#222",
            background3: "#292929",
            background4: "#333",
            background5: "#393939",
            background6: "#3E3E3E",
            headerbg: "#111",
            texto: "#EEE",
            texto2: "#AAA",
            textoheader: "#FFF",
            textohover: "#DDD",
            textodesac: "#585858",

            datosblueback: "#073753ff",
            datosbluebackhover: "#0c4566ff",
          },
        },
      },
    }),
  ],
};

module.exports = config;
