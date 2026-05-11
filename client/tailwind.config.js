/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#3626cc",
        "secondary": "#9d4300",
        "background": "#f8f9fa",
        "surface": "#ffffff",
        "on-surface": "#191c1d",
        "on-background": "#191c1d"
      },
      fontFamily: {
        "headline": ["Epilogue"],
        "body": ["Manrope"],
        "label": ["Space Grotesk"]
      }
    },
  },
  plugins: [],
}
