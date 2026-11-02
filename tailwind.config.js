/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          canvas: '#0D0E12',
          surface: '#16171D',
          raised: '#1D1F27',
          border: '#242631',
        },
        accent: {
          DEFAULT: '#4F46E5',
          hover: '#6366F1',
          light: '#A5B4FC',
        },
        success: {
          DEFAULT: '#22C55E',
          hover: '#4ADE80',
        },
        warning: '#F59E0B',
        danger: '#F87171',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255, 255, 255, 0.03) inset, 0 16px 40px -20px rgba(0, 0, 0, 0.8)',
        glow: '0 0 0 4px rgba(79, 70, 229, 0.3)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-2deg)' },
          '50%': { transform: 'scale(1.07) rotate(2deg)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0.3' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        flicker: 'flicker 1.8s ease-in-out infinite',
        'pop-in': 'pop-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        'fade-up': 'fade-up 0.5s ease-out backwards',
      },
    },
  },
  plugins: [],
};
