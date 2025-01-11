import type { Config } from "tailwindcss";
import { colors } from "./styles/theme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors,
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)'],
      },
      animation: {
        'float-0': 'float1 30s ease-in-out infinite',
        'float-1': 'float2 34s ease-in-out infinite',
        'float-2': 'float3 38s ease-in-out infinite',
        enter: 'enter 200ms ease-out',
        leave: 'leave 150ms ease-in forwards',
      },
      keyframes: {
        float1: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30%, -30%) scale(1.1)' },
          '66%': { transform: 'translate(-20%, 20%) scale(0.9)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        float2: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-25%, -25%) scale(0.9)' },
          '66%': { transform: 'translate(25%, 25%) scale(1.1)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        float3: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(25%, -15%) scale(1.1)' },
          '66%': { transform: 'translate(-25%, 15%) scale(0.9)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        enter: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        leave: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
