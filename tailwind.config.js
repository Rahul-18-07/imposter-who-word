/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        bg: '#14141A',
        surface: '#1A1A22',
        card: '#1E1E28',
        border: '#2a2a38',
        lemon: '#F5D547',
        'lemon-deep': '#C9AB22',
        ink: '#F5F2E8',
        'ink-dim': '#A09A88',
        'ink-fade': '#5C5848',
        'purple-dark': '#5b21b6',
        'purple-mid': '#7c3aed',
        'purple-base': '#9333ea',
        'purple-light': '#a855f7',
        'purple-pale': '#c084fc',
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #7c3aed, #a855f7)',
        'card-gradient': 'linear-gradient(135deg, #1e1e40, #141428)',
        'hero-gradient': 'radial-gradient(ellipse at 50% 0%, #1a1a22 0%, #0a0a10 70%)',
        'lemon-gradient': 'linear-gradient(135deg, #F5D547, #C9AB22)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
