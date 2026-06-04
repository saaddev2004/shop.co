/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          light: '#333333',
        },
        secondary: {
          DEFAULT: '#F0F0F0',
          dark: '#E0E0E0',
        },
        accent: {
          DEFAULT: '#FF3333',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'glass': 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5))',
      }
    },
  },
  plugins: [],
}
