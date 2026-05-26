import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        sakura: {
          50:  '#FDF6F9',
          100: '#FAE8F1',
          200: '#F2C4D8',
          400: '#D4748D',
          600: '#A0384F',
        },
        'deep-rose':    '#6B1F35',
        'gold-primary': '#B8860B',
        'gold-light':   '#F5ECD4',
        cream:          '#FEFAF5',
        ink:            '#2D1B22',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        bengali: ['var(--font-bengali)', 'sans-serif'],
        'serif-it': ['var(--font-serif)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
