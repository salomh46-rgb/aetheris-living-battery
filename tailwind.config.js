/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#080a0f',
        cosmic: {
          surface: '#0d111a',
          card: 'rgba(18, 24, 38, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: '#10b981',
          accent: '#06b6d4',
          warning: '#f59e0b',
          danger: '#ef4444'
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
