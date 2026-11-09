/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './entrypoints/**/*.{html,ts,tsx}',
    './src/**/*.{html,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        webmate: {
          primary: '#3B82F6',
          secondary: '#F59E0B',
          accent: '#EF4444',
          dark: '#1E293B',
          light: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
};
