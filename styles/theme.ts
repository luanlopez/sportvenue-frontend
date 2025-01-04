export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#00CCFF',
    600: '#0284c7',
    700: '#0369a1',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    700: '#15803d',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    700: '#b91c1c',
  },
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
  }
} as const;

export const fontFamily = {
  sans: 'var(--font-roboto)',
  mono: 'var(--font-roboto-mono)',
} as const;

export default {
  colors,
  fontFamily,
}; 