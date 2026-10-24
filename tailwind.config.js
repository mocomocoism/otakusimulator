/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './app.js'],
  // app.js creates some class names dynamically, so retain both possible sizes.
  safelist: ['text-[10px]', 'text-[11px]'],
  theme: { extend: {} },
  plugins: [],
};
