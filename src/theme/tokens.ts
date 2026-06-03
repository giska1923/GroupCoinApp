/**
 * Design tokens for GroupCoin mobile app - Dark Theme
 * Based on the Equinox Flow design system
 */

export const colors = {
  // Brand colors - Purple/Blue theme from screenshot
  brand: {
    50: '#f0f4ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Primary brand color
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },

  // Financial colors (Equinox Flow — neon hero + muted breakdown)
  financialPositive: '#3dff8a', // Hero net-flow green
  financialPositiveMuted: '#5dba82', // "You are owed" line
  financialNegative: '#ff5c6c', // Hero negative balance
  financialNegativeMuted: '#c96b73', // "You owe" line
  financialWarning: '#f59e0b', // Amber for pending

  // Dark theme surfaces (Equinox Flow — muted charcoal, not pure black)
  surface: {
    primary: '#121217', // Main background
    secondary: '#22222b', // Card backgrounds
    tertiary: '#2a2a34', // Elevated surfaces
    border: 'rgba(255, 255, 255, 0.08)', // Subtle dividers
    tabBar: 'rgba(18, 18, 23, 0.88)', // Floating tab bar
    tabBarBorder: 'rgba(255, 255, 255, 0.06)', // Hairline along the tab bar's top edge
  },

  // Text colors for dark theme
  text: {
    primary: '#ffffff', // Primary white text
    secondary: '#a1a1aa', // Secondary gray text
    muted: '#71717a', // Muted gray text
    inverse: '#0f172a', // Dark text (for light surfaces)
    accent: '#8a89ff', // Brand lavender (app title, links)
  },

  // Status colors with dark theme variants
  success: {
    DEFAULT: '#10b981',
    bg: '#064e3b',
    border: '#065f46',
  },
  error: {
    DEFAULT: '#ef4444',
    bg: '#7f1d1d',
    border: '#991b1b',
  },
  warning: {
    DEFAULT: '#f59e0b',
    bg: '#78350f',
    border: '#92400e',
  },
  info: {
    DEFAULT: '#3b82f6',
    bg: '#1e3a8a',
    border: '#1d4ed8',
  },
} as const;

// Spacing scale - generous spacing from screenshot
export const spacing = {
  xs: 4, // 1 - Tight spacing
  sm: 8, // 2 - Small spacing
  md: 12, // 3 - Medium spacing
  lg: 16, // 4 - Large spacing
  xl: 20, // 5 - Extra large
  '2xl': 24, // 6 - 2X large
  '3xl': 32, // 8 - 3X large
  '4xl': 40, // 10 - 4X large
  '5xl': 48, // 12 - 5X large
  '6xl': 64, // 16 - 6X large
} as const;

// Border radius - rounded corners from screenshot
export const radius = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12, // Cards and buttons
  xl: 16, // Large cards
  '2xl': 20, // Modal corners
  '3xl': 24, // Large components
  full: 9999, // Pills and circular elements
} as const;

// Typography scale matching the screenshot hierarchy
export const fontSize = {
  xs: 11, // Very small text
  sm: 12, // Small labels
  base: 14, // Body text
  md: 16, // Medium text
  lg: 18, // Large text
  xl: 20, // Extra large
  '2xl': 24, // Headings
  '3xl': 28, // Large headings
  '4xl': 32, // Hero text
  '5xl': 36, // Display text
  '6xl': 42, // Net flow balance
} as const;

export const lineHeight = {
  tight: 1.1,
  snug: 1.2,
  normal: 1.4,
  relaxed: 1.5,
  loose: 1.6,
} as const;

export const fontWeight = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

// Soft shadows for elevated cards (no heavy borders)
export const shadow = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
} as const;

// Animation and transitions
export const animation = {
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
} as const;

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Component-specific tokens
export const components = {
  card: {
    padding: spacing.lg,
    radius: radius['2xl'],
    shadow: shadow.md,
  },
  button: {
    height: 48,
    radius: radius.lg,
    padding: spacing.lg,
  },
  input: {
    height: 52,
    radius: radius.lg,
    padding: spacing.lg,
  },
  avatar: {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    '2xl': 96,
  },
  tabBar: {
    height: 64,
    radius: radius['3xl'],
    fab: 56,
    notchRadius: 38, // Radius of the concave cradle that hugs the FAB
    notchDepth: 28, // How far the cradle dips below the bar's top edge
  },
  sheet: {
    radius: radius['2xl'],
    handleWidth: 40,
    handleHeight: 4,
  },
  chip: {
    height: 36,
    radius: radius.full,
  },
  listItem: {
    minHeight: 56,
    radius: radius.lg,
  },
} as const;
