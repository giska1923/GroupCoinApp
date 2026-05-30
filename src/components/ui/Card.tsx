import React from 'react';
import { View, ViewStyle, ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface CardProps extends Omit<ViewProps, 'style'> {
  variant?: CardVariant;
  padding?: CardPadding;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'lg',
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const getVariantStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.radius.lg,
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surface.secondary,
          borderWidth: 1,
          borderColor: theme.colors.surface.border,
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surface.secondary,
          ...theme.shadow.md,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.surface.border,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surface.tertiary,
        };
    }
  };

  const getPaddingStyle = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return {};
      case 'sm':
        return { padding: theme.spacing.sm };
      case 'md':
        return { padding: theme.spacing.md };
      case 'lg':
        return { padding: theme.spacing.lg };
      case 'xl':
        return { padding: theme.spacing.xl };
    }
  };

  const finalStyle: ViewStyle = {
    ...getVariantStyle(),
    ...getPaddingStyle(),
    ...style,
  };

  return (
    <View style={finalStyle} {...props}>
      {children}
    </View>
  );
};
