/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
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
        text: {
          light: '#000000',
          dark: '#FFFFFF',
        },
        'text-secondary': {
          light: '#6E6E73',
          dark: '#98989D',
        },
        accent: {
          from: '#667EEA',
          to: '#764BA2',
        },
        border: {
          light: 'rgba(0, 0, 0, 0.1)',
          dark: 'rgba(255, 255, 255, 0.1)',
        },
      },
      borderRadius: {
        'glass-sm': '12px',
        'glass-md': '20px',
        'glass-lg': '32px',
      },
      backdropBlur: {
        'glass-light': '20px',
        'glass-medium': '40px',
        'glass-heavy': '60px',
      },
      boxShadow: {
        'glass': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'glass-medium': '0 8px 30px rgba(0, 0, 0, 0.15)',
        'glass-large': '0 12px 40px rgba(0, 0, 0, 0.2)',
        'glow-primary': '0 0 20px rgba(0, 122, 255, 0.3)',
        'glow-accent': '0 0 30px rgba(102, 126, 234, 0.4)',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '14px' }],
        'sm': ['14px', { lineHeight: '16px' }],
        'base': ['16px', { lineHeight: '20px' }],
        'lg': ['18px', { lineHeight: '22px' }],
        'xl': ['24px', { lineHeight: '28px' }],
        '2xl': ['32px', { lineHeight: '36px' }],
        '3xl': ['48px', { lineHeight: '52px' }],
      },
    },
  },
  plugins: [],
};

