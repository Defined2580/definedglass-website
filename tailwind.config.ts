import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#3d9e96',
          light: '#a8dadc',
          dark: '#2d7870',
          50: '#f0fafa',
          100: '#d0f0ee',
          500: '#3d9e96',
          600: '#2d8880',
          700: '#1e6b65',
        },
        brand: {
          blue: '#00adef',
          dark: '#3d3d3d',
          charcoal: '#1e1e1e',
          gray: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1e2a2a 0%, #2d4a47 50%, #3d9e96 100%)',
      },
    },
  },
  plugins: [],
}

export default config
