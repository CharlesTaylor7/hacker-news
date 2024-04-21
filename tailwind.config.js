/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/components/**/*.jsx'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
}


