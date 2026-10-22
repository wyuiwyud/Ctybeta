/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        accent: {
          DEFAULT: '#d7ff00',
          lime: '#d7ff00',
          hover: '#c3eb00',
          glow: 'rgba(215, 255, 0, 0.25)',
        },
        dark: {
          bg: '#000000',
          card: '#0a0a0a',
          surface: '#121212',
          border: '#1f1f1f',
          muted: '#808080',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Geist', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
