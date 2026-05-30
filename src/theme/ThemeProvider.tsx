import React, { createContext, useContext, ReactNode } from 'react';
import { colors, spacing, radius, fontSize, fontWeight, shadow, components } from './tokens';

export interface Theme {
  colors: typeof colors;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  shadow: typeof shadow;
  components: typeof components;
  isDark: boolean;
}

const theme: Theme = {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
  shadow,
  components,
  isDark: true, // Dark theme from screenshot
};

const ThemeContext = createContext<Theme | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Utility function to create consistent styles
export const createStyles = <T extends Record<string, any>>(
  styleFactory: (theme: Theme) => T
) => {
  return (theme: Theme): T => styleFactory(theme);
};