export const colors = {
  primary: {
    50: '#F4F0F7',
    100: '#E9E0F0',
    200: '#D3C1E1',
    300: '#BDA2D2',
    400: '#8B5BAB',
    500: '#562981',
    600: '#4D2574',
    700: '#442067',
    800: '#3B1C5A',
    900: '#32174D',
  },
  secondary: {
    50: '#FFFCF5',
    100: '#FFF9EB',
    200: '#FEF3D7',
    300: '#FEECC3',
    400: '#FED782',
    500: '#FEC341',
    600: '#E5B03B',
    700: '#CC9C34',
    800: '#B2882E',
    900: '#997427',
  },
  tertiary: {
    50: '#FFFEFB',
    100: '#FFFDF7',
    200: '#FFFBEF',
    300: '#FEF9E7',
    400: '#FEF8E3',
    500: '#FEF7DF',
    600: '#E5DEC9',
    700: '#CCC6B3',
    800: '#B2AD9C',
    900: '#999485',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    700: '#15803d',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
  },
  text: {
    primary: '#1F1F1F',
    secondary: '#666666',
  }
} as const;

export const fontFamily = {
  sans: 'var(--font-montserrat)',
  mono: 'var(--font-roboto-mono)',
} as const;