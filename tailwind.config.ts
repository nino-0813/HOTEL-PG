import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', 'sans-serif'],
        serif: ['var(--font-shippori-mincho)', 'serif'],
        display: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-figtree)', 'sans-serif'],
      },
      colors: {
        background: '#fafafa',
        textMain: '#1c1c1c',
        textLight: '#666666',
        accent: '#8c8c8c',
        divider: '#e0e0e0',
      },
      letterSpacing: {
        tighter: '-0.02em',
        widest: '.2em',
        ultra: '.3em',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'expo-in-out': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
