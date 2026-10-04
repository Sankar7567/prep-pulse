/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { colors: { ink: '#182230', muted: '#667085', brand: '#635bff', mint: '#20c997', canvas: '#f7f8fc' }, boxShadow: { soft: '0 12px 40px rgba(27, 36, 66, .08)' } } },
  plugins: []
};
