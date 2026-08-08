/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        champagne: {
          bg: '#FAF5EF',
          light: '#FFFDF9',
          card: '#FAF6F0',
          border: '#EBDCCF',
          input: '#F5ECE3',
          subtle: '#F2E8DC'
        },
        bronze: {
          50: '#FDF7F0',
          100: '#F7E8D5',
          200: '#EDD1B0',
          300: '#DDAF7D',
          400: '#CA8B4B',
          500: '#8C5D33',
          600: '#754B26',
          700: '#5F3A1D',
          800: '#4A2B15',
          900: '#2C1F18'
        },
        espresso: {
          DEFAULT: '#2C1F18',
          text: '#38281F',
          dark: '#1C130E'
        },
        taupe: {
          muted: '#7D6B5D',
          light: '#A39284'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'card-glow': '0 20px 50px -15px rgba(140, 93, 51, 0.08), 0 10px 25px -5px rgba(44, 31, 24, 0.04)',
        'emblem-glow': '0 10px 30px rgba(140, 93, 51, 0.25)',
        'input-focus': '0 0 0 3px rgba(140, 93, 51, 0.15)'
      }
    },
  },
  plugins: [],
}
