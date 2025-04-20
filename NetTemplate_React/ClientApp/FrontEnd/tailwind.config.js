const { heroui } = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  darkMode: ['class'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(drawer|dropdown|modal|menu|divider|popover|button|ripple|spinner).js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter var"',
          ...defaultTheme.fontFamily.sans
        ],
        serif: [
          'Merriweather"',
          ...defaultTheme.fontFamily.serif
        ],
        mono: [
          'JetBrains Mono"',
          ...defaultTheme.fontFamily.mono
        ]
      },
      colors: {
        'main': '#00595C',
      }
    }
  },
  plugins: [require("tailwindcss-animate"), heroui()]
}
