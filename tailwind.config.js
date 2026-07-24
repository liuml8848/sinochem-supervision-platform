/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          bg: '#0B1D4A',
          text: 'rgba(255,255,255,0.8)',
          active: '#38BDF8',
          hover: 'rgba(56,189,248,0.08)',
        },
        risk: {
          red: '#EF4444',
          orange: '#F97316',
          yellow: '#F59E0B',
          blue: '#38BDF8',
          green: '#2DD4BF',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Microsoft YaHei"',
          '"PingFang SC"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        number: ['"DIN"', '"DIN Alternate"', 'monospace'],
      },
      fontSize: {
        'page-title': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'section-title': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'data-large': ['1.75rem', { lineHeight: '2rem', fontWeight: '700' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(15,34,69,0.08)',
        'card-hover': '0 4px 12px rgba(15,34,69,0.12)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
