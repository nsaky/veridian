/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#051108',
        'bg-card': '#0A1F12',
        'bg-input': '#132E1D',
        'text-head': '#E8F5E9',
        'text-body': '#A5D6A7',
        'veridian-neon': '#00FF85',
        'signal-danger': '#FF4444',
        'signal-warning': '#FFD700',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
