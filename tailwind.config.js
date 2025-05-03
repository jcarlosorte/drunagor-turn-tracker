/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  extend: {
    fontFamily: {
      fantasy: ['"Uncial Antiqua"', 'cursive'],
    },
  },
  plugins: [],
  extend: {
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
}
