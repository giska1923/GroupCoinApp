import React from 'react';
import { ViewStyle, View, TextStyle, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

import { moneyToCents, centsToMoney, normalizeAmount, currencySymbol as symbolFor } from '../../utils/money';
import { DEFAULT_CURRENCY, resolveCurrency } from '../../config/currency';

type AmountVariant =
  | 'default'
  | 'large'
  | 'small'
  | 'display'
  | 'displayLg'
  | 'hero'
  | 'detail'
  | 'detailLg';
type AmountType = 'positive' | 'negative' | 'neutral' | 'positiveMuted' | 'negativeMuted';

interface AmountProps {
  /** Decimal string (e.g. "45.00") or legacy cents number. */
  value: string | number;
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
  currency = DEFAULT_CURRENCY,
  variant = 'default',
  type,
  showSign = true,
  showCurrency = true,
  glow = false,
  style,
}) => {
  const theme = useTheme();

  const cents = typeof value === 'number'
    ? BigInt(value)
    : moneyToCents(normalizeAmount(value));
  const isPositive = cents > 0n;
  const isNegative = cents < 0n;
  const isZero = cents === 0n;
  const displayAmount = centsToMoney(cents < 0n ? -cents : cents);
  const [wholePart, fracPart] = displayAmount.split('.');

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
      case 'displayLg':
        return {
          fontSize: theme.fontSize['4xl'],
          lineHeight: theme.fontSize['4xl'] * 1.2,
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
      formatted += symbolFor(resolveCurrency(currency));
    }

    // Add amount with proper formatting
    formatted += `${Number(wholePart).toLocaleString('en-US')}.${fracPart}`;

    return formatted;
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
