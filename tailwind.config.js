/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'DarkPurple':'#2a255f',
        'DarkerPurple':'#160020',
        'LightPurple':'#8080d7',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'], // Adding Roboto font
        'outfit': ['Outfit', 'sans-serif'], // Adding Outfit font
        'p2p': ['"Press Start 2P"', 'sans-seri'],
        // You can also set default font families if needed
      },
    },
  },
  plugins: [],
}

