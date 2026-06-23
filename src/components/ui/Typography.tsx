import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

type TypographyVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'caption'
  | 'label';

type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'accent'
  | 'positive'
  | 'positiveMuted'
  | 'negative'
  | 'negativeMuted'
  | 'warning';

interface TypographyProps extends Omit<TextProps, 'style'> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: keyof typeof import('../../theme/tokens').fontWeight;
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'primary',
  weight = 'normal',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'display':
        return {
          fontSize: theme.fontSize['4xl'],
          lineHeight: theme.fontSize['4xl'] * 1.2,
          fontWeight: theme.fontWeight.bold,
        };
      case 'title':
        return {
          fontSize: theme.fontSize['3xl'],
          lineHeight: theme.fontSize['3xl'] * 1.2,
          fontWeight: theme.fontWeight.semibold,
        };
      case 'heading':
        return {
          fontSize: theme.fontSize['2xl'],
          lineHeight: theme.fontSize['2xl'] * 1.3,
          fontWeight: theme.fontWeight.semibold,
        };
      case 'subheading':
        return {
          fontSize: theme.fontSize.lg,
          lineHeight: theme.fontSize.lg * 1.4,
          fontWeight: theme.fontWeight.medium,
        };
      case 'body':
        return {
          fontSize: theme.fontSize.base,
          lineHeight: theme.fontSize.base * 1.5,
          fontWeight: theme.fontWeight.normal,
        };
      case 'caption':
        return {
          fontSize: theme.fontSize.sm,
          lineHeight: theme.fontSize.sm * 1.4,
          fontWeight: theme.fontWeight.normal,
        };
      case 'label':
        return {
          fontSize: theme.fontSize.xs,
          lineHeight: theme.fontSize.xs * 1.3,
          fontWeight: theme.fontWeight.medium,
        };
    }
  };

  const getColorStyle = (): TextStyle => {
    switch (color) {
      case 'primary':
        return { color: theme.colors.text.primary };
      case 'secondary':
        return { color: theme.colors.text.secondary };
      case 'muted':
        return { color: theme.colors.text.muted };
      case 'accent':
        return { color: theme.colors.text.accent };
      case 'positive':
        return { color: theme.colors.financialPositive };
      case 'positiveMuted':
        return { color: theme.colors.financialPositiveMuted };
      case 'negative':
        return { color: theme.colors.financialNegative };
      case 'negativeMuted':
        return { color: theme.colors.financialNegativeMuted };
      case 'warning':
        return { color: theme.colors.financialWarning };
      default:
        return { color: theme.colors.text.primary };
    }
  };

  const getWeightStyle = (): TextStyle => {
    return { fontWeight: theme.fontWeight[weight] };
  };

  const finalStyle: TextStyle = {
    ...getVariantStyle(),
    ...getColorStyle(),
    ...getWeightStyle(),
    textAlign: align,
    ...style,
  };

  return (
    // Lock font scaling so the layout stays identical regardless of each
    // device's system font-size setting. Callers can still override via props.
    <Text allowFontScaling={false} style={finalStyle} {...props}>
      {children}
    </Text>
  );
};
