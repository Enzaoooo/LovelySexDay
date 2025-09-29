/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#9d1919',
        'primary-dark': '#7d1414',
        'primary-light': '#b04646',
        secondary: '#a62f2f',
        accent: '#c47575',
      },
    },
  },
  plugins: [],
};
