import React from 'react';
import { ViewStyle, View, TextStyle, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

type AmountVariant =
  | 'default'
  | 'large'
  | 'small'
  | 'display'
  | 'hero'
  | 'detail'
  | 'detailLg';
type AmountType = 'positive' | 'negative' | 'neutral' | 'positiveMuted' | 'negativeMuted';

interface AmountProps {
  value: number; // Amount in cents
  currency?: string;
  variant?: AmountVariant;
  type?: AmountType;
  showSign?: boolean;
  showCurrency?: boolean;
  /** Soft outer glow on hero amounts (Net Flow). */
  glow?: boolean;
  style?: ViewStyle;
}

export const Amount: React.FC<AmountProps> = ({
  value,
  currency = 'USD',
  variant = 'default',
  type,
  showSign = true,
  showCurrency = true,
  glow = false,
  style,
}) => {
  const theme = useTheme();

  // Convert cents to dollars
  const dollars = Math.abs(value) / 100;
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isZero = value === 0;

  // Auto-determine type if not provided
  const finalType =
    type || (isPositive ? 'positive' : isNegative ? 'negative' : 'neutral');

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'small':
        return {
          fontSize: theme.fontSize.sm,
          lineHeight: theme.fontSize.sm * 1.4,
          fontWeight: theme.fontWeight.medium,
        };
      case 'default':
        return {
          fontSize: theme.fontSize.base,
          lineHeight: theme.fontSize.base * 1.4,
          fontWeight: theme.fontWeight.semibold,
        };
      case 'large':
        return {
          fontSize: theme.fontSize.lg,
          lineHeight: theme.fontSize.lg * 1.35,
          fontWeight: theme.fontWeight.semibold,
        };
      case 'display':
        return {
          fontSize: theme.fontSize['2xl'],
          lineHeight: theme.fontSize['2xl'] * 1.25,
          fontWeight: theme.fontWeight.bold,
        };
      case 'hero':
        return {
          fontSize: theme.fontSize['6xl'],
          lineHeight: theme.fontSize['6xl'] * 1.2,
          fontWeight: theme.fontWeight.bold,
          letterSpacing: -0.5,
          ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
        };
      case 'detail':
        return {
          fontSize: theme.fontSize.md,
          lineHeight: theme.fontSize.md * 1.4,
          fontWeight: theme.fontWeight.semibold,
        };
      case 'detailLg':
        return {
          fontSize: theme.fontSize.lg,
          lineHeight: theme.fontSize.lg * 1.35,
          fontWeight: theme.fontWeight.semibold,
        };
    }
  };

  const getColor = () => {
    switch (finalType) {
      case 'positive':
        return theme.colors.financialPositive;
      case 'positiveMuted':
        return theme.colors.financialPositiveMuted;
      case 'negative':
        return theme.colors.financialNegative;
      case 'negativeMuted':
        return theme.colors.financialNegativeMuted;
      case 'neutral':
        return theme.colors.text.primary;
    }
  };

  const getGlowStyle = (): TextStyle => {
    if (!glow || variant !== 'hero') return {};
    const color = getColor();
    return {
      textShadowColor: color,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 14,
    };
  };

  const formatAmount = (): string => {
    let formatted = '';

    // Add sign
    if (showSign && !isZero) {
      formatted += isPositive ? '+' : '-';
    }

    // Add currency symbol
    if (showCurrency) {
      const currencySymbol = getCurrencySymbol(currency);
      formatted += currencySymbol;
    }

    // Add amount with proper formatting
    formatted += dollars.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatted;
  };

  const getCurrencySymbol = (currencyCode: string): string => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'CA$',
      AUD: 'AU$',
    };
    return symbols[currencyCode] || currencyCode;
  };

  const textStyle = getVariantStyle();

  return (
    <View
      style={[
        style,
        variant === 'hero' && { overflow: 'visible' },
      ]}
    >
      <Typography
        variant='body'
        weight='normal'
        style={{
          ...textStyle,
          color: getColor(),
          ...getGlowStyle(),
        }}
      >
        {formatAmount()}
      </Typography>
    </View>
  );
};

// Helper function to convert dollar amounts to cents for consistent storage
export const toCents = (dollars: number): number => {
  return Math.round(dollars * 100);
};

// Helper function to convert cents to dollars for display
export const fromCents = (cents: number): number => {
  return cents / 100;
};
