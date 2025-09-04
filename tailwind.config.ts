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
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        error: 'var(--error)',
        blue: {
          50: 'var(--color-blue-50)',
          100: 'var(--color-blue-100)',
          500: 'var(--color-blue-500)',
          600: 'var(--color-blue-600)',
          700: 'var(--color-blue-700)',
        },
        gray: {
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          500: 'var(--color-gray-500)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
        },
        red: {
          100: 'var(--color-red-100)',
          500: 'var(--color-red-500)',
          600: 'var(--color-red-600)',
        },
        green: {
          100: 'var(--color-green-100)',
          500: 'var(--color-green-500)',
          600: 'var(--color-green-600)',
        },
        yellow: {
          100: 'var(--color-yellow-100)',
          500: 'var(--color-yellow-500)',
        },
        white: 'var(--color-white)',
        'gray-50': 'var(--color-gray-50)',
      },
    },
  },
  plugins: [],
};

export default config;