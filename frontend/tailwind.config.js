/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // mono: ['JetBrains Mono', 'monospace'],
        // sans: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'Noto Sans', 'Helvetica Neue', 'Arial', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
} 