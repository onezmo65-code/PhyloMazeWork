/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-player': 'bounce-player 2s infinite',
        'flash-alert': 'flash-alert 1.5s infinite',
      },
      keyframes: {
        'bounce-player': {
          '0%, 100%': { transform: 'translateY(-15%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
        'flash-alert': {
          '0%, 100%': { borderColor: 'rgb(51 65 85)', boxShadow: 'none' },
          '50%': { borderColor: 'rgb(239 68 68)', boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}