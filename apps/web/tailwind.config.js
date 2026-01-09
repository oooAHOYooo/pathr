/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Liquid Glass colors from @pathr/ui tokens
        base: {
          light: '#FFFFFF',
          dark: '#000000',
        },
        surface: {
          light: '#F5F5F7',
          dark: '#1C1C1E',
        },
        primary: {
          light: '#007AFF',
          dark: '#0A84FF',
        },
      },
    },
  },
  plugins: [],
};

