/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#181611',
        concrete: '#F6F3EC',
        panel: '#FFFFFF',
        hazard: '#FF6A2B',
        hazardDark: '#E0501A',
        dispatch: '#1F3A5F',
        signal: '#2E8B57',
        alert: '#D6455A',
        steel: '#8B8478',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"Work Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        blueprint:
          'linear-gradient(rgba(31,58,95,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(31,58,95,0.06) 1px, transparent 1px)',
        'hazard-stripe':
          'repeating-linear-gradient(45deg, #FF6A2B, #FF6A2B 12px, #181611 12px, #181611 24px)',
      },
      backgroundSize: {
        blueprint: '32px 32px',
      },
      boxShadow: {
        ticket: '0 20px 60px -20px rgba(24,22,17,0.35)',
        card: '0 10px 30px -12px rgba(24,22,17,0.18)',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(1.3)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(var(--r,0deg))' },
          '50%': { transform: 'translateY(-10px) rotate(var(--r,0deg))' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.6s ease-in-out infinite',
        marquee: 'marquee 26s linear infinite',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
