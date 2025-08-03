import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Most customization now done via CSS @theme directive in globals.css
  theme: {
    extend: {
      fontFamily: {
        // Literary font for book content, titles, elegant sections
        serif: ['Crimson Pro', 'Georgia', 'serif'],
        // Interface font for navigation, buttons, modern UI
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        // Keep legacy support
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
