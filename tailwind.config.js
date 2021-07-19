module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primaryDark: 'var(--bg-dark-mode-color)',
        primaryDarkContrast: 'var(--bg-dark-mode-contrast)',

      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
