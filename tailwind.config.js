/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
  'drop-shadow-[0_0_6px_rgba(255,0,0,0.5)]',
  'drop-shadow-[0_0_6px_rgba(0,255,0,0.5)]',
  'drop-shadow-[0_0_6px_rgba(0,0,255,0.5)]',
  'drop-shadow-[0_0_6px_rgba(59,130,246,1)]',    // azul
  'drop-shadow-[0_0_6px_rgba(234,179,8,1)]',     // amarillo
  'drop-shadow-[0_0_6px_rgba(251,146,60,1)]',   // naranja
  'drop-shadow-[0_0_6px_rgba(239,68,68,1)]'      // rojo
],
  theme: {
    extend: {
      fontFamily: {
        fantasy: ['"Uncial Antiqua"', 'cursive'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
