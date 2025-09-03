import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        blue: {
          50: 'var(--color-blue-50)',
          500: 'var(--color-blue-500)',
          600: 'var(--color-blue-600)',
        },
        gray: {
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
        },
        red: {
          500: 'var(--color-red-500)',
          600: 'var(--color-red-600)',
        },
        white: 'var(--color-white)',
      },
    },
  },
  plugins: [],
};

export default config;