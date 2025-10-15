/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef7f0",
          100: "#feecd8",
          500: "#8B4513",
          600: "#723a10",
          700: "#5a2e0c",
        },
        gold: "#D1BC2E",
        gray: "#808080",
      },
    },
  },
};
