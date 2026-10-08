/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wine: { 50: '#fef2f2', 100: '#fee2e2', 500: '#b91c1c', 600: '#991b1b', 700: '#7f1d1d', 900: '#450a0a' },
        cream: '#fdfcfb',
      },
      fontFamily: { sans: ['Segoe UI', 'system-ui', 'sans-serif'] },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shine: 'shine 3s linear infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        shine: { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
      },
    },
  },
  plugins: [],
};
