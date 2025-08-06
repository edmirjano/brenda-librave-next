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
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      animation: {
        'liquid-morph': 'liquidMorph 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        liquidMorph: {
          '0%': { 
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            transform: 'rotate(0deg)',
          },
          '25%': { 
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
            transform: 'rotate(2deg)',
          },
          '50%': { 
            borderRadius: '50% 50% 80% 20% / 40% 70% 60% 30%',
            transform: 'rotate(0deg)',
          },
          '75%': { 
            borderRadius: '70% 30% 40% 60% / 60% 40% 80% 20%',
            transform: 'rotate(-1deg)',
          },
          '100%': { 
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            transform: 'rotate(0deg)',
          },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
          },
          '33%': { 
            transform: 'translateY(-10px) rotate(1deg)',
          },
          '66%': { 
            transform: 'translateY(5px) rotate(-0.5deg)',
          },
        },
        pulseSoft: {
          '0%, 100%': { 
            opacity: '0.8',
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: '1',
            transform: 'scale(1.02)',
          },
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
          },
          '100%': { 
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
