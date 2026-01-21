/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ngo-primary': '#2563eb',
        'ngo-secondary': '#059669',
        'ngo-accent': '#dc2626',
      },
    },
  },
  plugins: [],
}
