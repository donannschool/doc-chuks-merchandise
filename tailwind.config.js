/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B365D',
          dark: '#132846',
          light: '#2A4A7A',
        },
        amber: {
          DEFAULT: '#D97706',
          light: '#F59E0B',
        },
        earth: '#78350F',
        wa: '#25D366',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
