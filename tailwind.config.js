/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode (uses .dark class)
  safelist: [
    // Ensure brand color classes are always generated
    'bg-brand-primary',
    'bg-brand-primary-dark',
    'bg-brand-primary-light',
    'bg-brand-primary-lighter',
    'bg-brand-primary-lightest',
    'text-brand-primary',
    'text-brand-primary-dark',
    'border-brand-primary',
    'border-brand-primary-dark',
    'hover:bg-brand-primary',
    'hover:bg-brand-primary-dark',
    'hover:bg-brand-primary-lightest',
    'hover:text-brand-primary',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - centralized color system (change #1812AE in index.css to update globally)
        // Use these classes: bg-brand-primary, text-brand-primary, border-brand-primary, etc.
        'brand-primary': '#1812AE',
        'brand-primary-dark': '#141098',
        'brand-primary-light': '#2d26c2',
        'brand-primary-lighter': 'rgba(24, 18, 174, 0.1)',
        'brand-primary-lightest': 'rgba(24, 18, 174, 0.05)',
        // Custom theme colors to match CSS variables
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-card': 'var(--bg-card)',
        'bg-hover': 'var(--bg-hover)',
        'bg-input': 'var(--bg-input)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-muted': 'var(--text-muted)',
        'border-color': 'var(--border-color)',
        'border-hover': 'var(--border-hover)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        'accent-hover': 'var(--accent-hover)',
        'success': 'var(--success)',
        'warning': 'var(--warning)',
        'error': 'var(--error)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'draw-curve': 'drawCurve 1.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        drawCurve: {
          '0%': { strokeDashoffset: '300' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
