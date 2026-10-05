/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        panel: '#101010',
        neon: '#00ff88',
        aqua: '#00ccff',
        magenta: '#ff00aa',
        blood: '#ff3b30',
        ember: '#ff5e4d',
      },
    },
  },
  plugins: [],
};
