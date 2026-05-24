/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // iOS system colors
        'system-pink':   '#FF375F',
        'system-green':  '#30D158',
        'system-blue':   '#0A84FF',
        'system-orange': '#FF9500',
        'system-purple': '#BF5AF2',
        'system-teal':   '#5AC8FA',
        'system-yellow': '#FFD60A',
        'system-red':    '#FF453A',
        'system-indigo': '#5E5CE6',
        // iOS dark backgrounds
        'dark-900': '#000000',
        'dark-800': '#1C1C1E',
        'dark-700': '#2C2C2E',
        'dark-600': '#3A3A3C',
        // iOS text / separator
        'gray-ios':      '#8E8E93',
        'separator-ios': '#38383A',
      },
      borderRadius: {
        squircle: '22px',
        '2xl':    '14px',
        '3xl':    '20px',
        '4xl':    '28px',
      },
      minHeight: {
        11: '44px',
      },
      minWidth: {
        11: '44px',
      },
      spacing: {
        'safe-top':    'env(safe-area-inset-top, 0px)',
        'safe-right':  'env(safe-area-inset-right, 0px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 16px)',
        'safe-left':   'env(safe-area-inset-left, 0px)',
      },
      backdropBlur: {
        glass: '25px',
      },
      backdropSaturate: {
        glass: '200%',
      },
      keyframes: {
        'mesh-shift': {
          '0%':   { backgroundPosition: '20% 20%, 80% 80%, 50% 50%' },
          '100%': { backgroundPosition: '40% 60%, 60% 20%, 30% 70%' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'carrot-float': {
          '0%':   { transform: 'translateY(0) scale(0.5)', opacity: '1' },
          '100%': { transform: 'translateY(-220px) scale(1)', opacity: '0' },
        },
        'page-enter': {
          from: { opacity: '0', transform: 'translateY(6px) scale(0.99)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-from-right': {
          from: { opacity: '0', transform: 'translateX(48px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-from-left': {
          from: { opacity: '0', transform: 'translateX(-48px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'tab-bounce': {
          '0%, 100%': { transform: 'scale(1) translateY(0)' },
          '40%':      { transform: 'scale(1.3) translateY(-3px)' },
          '70%':      { transform: 'scale(0.95) translateY(1px)' },
        },
        'indicator-grow': {
          from: { transform: 'scaleX(0)', opacity: '0' },
          to:   { transform: 'scaleX(1)', opacity: '1' },
        },
        'reward-pop': {
          '0%':   { transform: 'scale(0.4) rotate(-8deg)', opacity: '0' },
          '60%':  { transform: 'scale(1.15) rotate(3deg)', opacity: '1' },
          '80%':  { transform: 'scale(0.93) rotate(-1deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
      animation: {
        'mesh-shift':     'mesh-shift 10s ease-in-out infinite alternate',
        'slide-up':       'slide-up 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'carrot-float':   'carrot-float 900ms ease-out forwards',
        'page-enter':        'page-enter 280ms ease-out both',
        'slide-from-right':  'slide-from-right 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-from-left':   'slide-from-left 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'tab-bounce':        'tab-bounce 380ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'indicator-grow': 'indicator-grow 220ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'reward-pop':     'reward-pop 450ms cubic-bezier(0.34, 1.56, 0.64, 1) 150ms both',
      },
    },
  },
  safelist: [
    'active:scale-95',
    'active:scale-[0.98]',
    'scale-[0.95]',
    'liquid-glass',
    'mesh-bg',
    'ios-safe-bottom',
    'pt-safe-top',
    'animate-page-enter',
    'animate-slide-from-right',
    'animate-slide-from-left',
    'animate-tab-bounce',
    'animate-indicator-grow',
    'animate-reward-pop',
    'shimmer-box',
  ],
  plugins: [require('tailwindcss-animate')],
}
