/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // 'media' (the tailwind default) crashes on web: react-native-css-interop's colorScheme.set
  // throws "Cannot manually set color scheme, as dark mode is type 'media'" on page load, which
  // pops the full-screen dev error overlay. The app doesn't use dark: variants, so 'class' is
  // behavior-neutral.
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
}
