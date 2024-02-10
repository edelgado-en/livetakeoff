module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
        screens: {
            '3xl': '2000px',
          },
    },
  },
  plugins: [
    require('@tailwindcss/forms') //this is needed for input fields to be styled correctly
  ],
}
