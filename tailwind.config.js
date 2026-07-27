/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      colors: {
        ink: {
          50: '#F5F7FB',
          100: '#E9EEF6',
          200: '#CBD6E6',
          300: '#9FB1CC',
          400: '#6C82A6',
          500: '#465A7D',
          600: '#324567',
          700: '#223252',
          800: '#141F36',
          900: '#0A1224',
          950: '#050A16'
        },
        royal: {
          50: '#EEF3FF',
          100: '#DCE6FF',
          200: '#B3C9FF',
          300: '#7FA3FF',
          400: '#4677F5',
          500: '#2454E0',
          600: '#1B3FBD',
          700: '#183399',
          800: '#152C7A',
          900: '#132663'
        },
        jade: {
          50: '#E9FBF3',
          100: '#CDF5E2',
          200: '#9CEAC7',
          300: '#65D9A9',
          400: '#34C48D',
          500: '#17A876',
          600: '#0F8A61',
          700: '#0C6D4E',
          800: '#0A5540',
          900: '#084535'
        }
      },
      backgroundImage: {
        'grid-glow': 'radial-gradient(circle at 20% 20%, rgba(36,84,224,0.18), transparent 45%), radial-gradient(circle at 80% 0%, rgba(23,168,118,0.16), transparent 40%)',
        'cta-gradient': 'linear-gradient(115deg, #2454E0 0%, #17A876 100%)'
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(10, 18, 36, 0.28)',
        'glass-sm': '0 4px 16px 0 rgba(10, 18, 36, 0.16)',
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px -15px rgba(36,84,224,0.45)'
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        tick: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        tick: 'tick 0.4s ease-out'
      }
    }
  },
  plugins: []
}
