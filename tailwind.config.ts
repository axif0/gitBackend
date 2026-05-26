import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#B8860B',
          50: '#FDF8E8',
          100: '#F5ECD4',
          200: '#E8D5A0',
          300: '#D4B86C',
          400: '#C9A84E',
          500: '#B8860B',
          600: '#9A7009',
          700: '#7C5A07',
          800: '#5E4405',
          900: '#402E03',
        },
        rose: {
          DEFAULT: '#6B1F35',
          50: '#FDF6F9',
          100: '#FAE8F1',
          200: '#F2C4D8',
          300: '#E8A0BF',
          400: '#D4748D',
          500: '#A0384F',
          600: '#6B1F35',
          700: '#5A1A2D',
          800: '#4A1525',
          900: '#3A101D',
        },
        sakura: {
          DEFAULT: '#D4748D',
          50: '#FDF6F9',
          100: '#FAE8F1',
          200: '#F2C4D8',
          300: '#E8A0BF',
          400: '#D4748D',
          500: '#A0384F',
          600: '#6B1F35',
        },
        cream: '#FEFAF5',
        ink: '#2D1B22',
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
