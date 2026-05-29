/**
 * Design tokens for GroupCoin mobile app
 * These tokens are used by Tailwind config and can be referenced directly in components
 */

export const colors = {
  brand: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Primary brand color (sky-500)
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  positive: '#16a34a', // Money owed to you (green-600)
  negative: '#dc2626', // Money you owe (red-600)
  surface: {
    light: '#ffffff',
    dark: '#0b1220',
  },
  text: {
    primary: '#0f172a',    // slate-900
    secondary: '#475569',  // slate-600
    muted: '#64748b',      // slate-500
    inverse: '#f8fafc',    // slate-50
  },
  border: {
    light: '#e2e8f0',     // slate-200
    dark: '#334155',      // slate-700
  },
  background: {
    light: '#f8fafc',     // slate-50
    dark: '#0f172a',      // slate-900
  },
} as const;

export const spacing = {
  xs: 4,   // 1
  sm: 8,   // 2
  md: 16,  // 4
  lg: 24,  // 6
  xl: 32,  // 8
  xxl: 48, // 12
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const lineHeight = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 28,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const zIndex = {
  backdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
} as const;