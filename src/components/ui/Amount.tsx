import React from 'react';
import { ViewStyle, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

type AmountVariant = 'default' | 'large' | 'small' | 'display';
type AmountType = 'positive' | 'negative' | 'neutral';

interface AmountProps {
  value: number; // Amount in cents
  currency?: string;
  variant?: AmountVariant;
  type?: AmountType;
  showSign?: boolean;
  showCurrency?: boolean;
  style?: ViewStyle;
}

export const Amount: React.FC<AmountProps> = ({
  value,
  currency = 'USD',
  variant = 'default',
  type,
  showSign = true,
  showCurrency = true,
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

  const getVariantStyle = () => {
    switch (variant) {
      case 'small':
        return {
          fontSize: theme.fontSize.sm,
          fontWeight: theme.fontWeight.medium,
        };
      case 'default':
        return {
          fontSize: theme.fontSize.base,
          fontWeight: theme.fontWeight.semibold,
        };
      case 'large':
        return {
          fontSize: theme.fontSize.lg,
          fontWeight: theme.fontWeight.semibold,
        };
      case 'display':
        return {
          fontSize: theme.fontSize['2xl'],
          fontWeight: theme.fontWeight.bold,
        };
    }
  };

  const getColor = () => {
    switch (finalType) {
      case 'positive':
        return theme.colors.financialPositive;
      case 'negative':
        return theme.colors.financialNegative;
      case 'neutral':
        return theme.colors.text.primary;
    }
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

  return (
    <View style={style}>
      <Typography
        variant='body'
        style={{
          ...getVariantStyle(),
          color: getColor(),
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
