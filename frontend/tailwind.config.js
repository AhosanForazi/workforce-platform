/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        fiverr: '#1dbf73',
        fiverrDark: '#19a463',
        fiverrHover: '#10a360',
        fiverrLight: '#eefaf4',
        fiverrBg: '#f7f7f7',
        fiverrDarkBg: '#013914',
        fiverrText: '#222325',
        fiverrMuted: '#62646a',
        fiverrLightText: '#74767e',
        fiverrBorder: '#e4e5e7',
        fiverrBorderLight: '#efeff0',
        fiverrStar: '#ffb33e',
        // Backward-compatible color aliases so old components map cleanly to Fiverr palette
        hazard: '#1dbf73',
        hazardDark: '#19a463',
        ink: '#222325',
        concrete: '#f7f7f7',
        panel: '#FFFFFF',
        dispatch: '#1F3A5F',
        signal: '#1dbf73',
        alert: '#F74040',
        steel: '#74767e',
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        fiverr: '0 0.14px 2.29px rgba(0,0,0,0.032), 0 0.37px 4.43px rgba(0,0,0,0.048), 0 3px 14px rgba(0,0,0,0.08)',
        fiverrHover: '0 8px 24px rgba(0,0,0,0.12)',
        ticket: '0 8px 30px rgba(0,0,0,0.08)',
        card: '0 2px 12px rgba(0,0,0,0.06)',
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
