import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg' | 'fab'; // fab = floating action button

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  /** Pill-shaped fully rounded button (e.g. "Settle up"). */
  rounded?: boolean;
  fullWidth?: boolean;
  /** Overrides the variant's default label/icon color. */
  textColor?: string;
  /** Overrides the label font weight (defaults to 'medium'). */
  textWeight?: React.ComponentProps<typeof Typography>['weight'];
  /** Extra style merged into the label (e.g. fontSize overrides). */
  textStyle?: TextStyle;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  rounded = false,
  fullWidth = false,
  textColor,
  textWeight = 'medium',
  textStyle,
  style,
  disabled,
  children,
  ...props
}) => {
  const theme = useTheme();

  const getVariantStyle = (): ViewStyle => {
    const isDisabled = disabled || loading;

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isDisabled
            ? theme.colors.text.muted
            : theme.colors.brand[500],
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: isDisabled
            ? theme.colors.surface.border
            : theme.colors.surface.tertiary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: isDisabled
            ? theme.colors.text.muted
            : theme.colors.brand[500],
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'destructive':
        return {
          backgroundColor: isDisabled
            ? theme.colors.text.muted
            : theme.colors.financialNegative,
          borderWidth: 0,
        };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          height: 36,
          paddingHorizontal: theme.spacing.md,
          borderRadius: theme.radius.md,
        };
      case 'md':
        return {
          height: 44,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.radius.lg,
        };
      case 'lg':
        return {
          height: 52,
          paddingHorizontal: theme.spacing.xl,
          borderRadius: theme.radius.lg,
        };
      case 'fab':
        return {
          width: 56,
          height: 56,
          borderRadius: 28, // Perfect circle
          paddingHorizontal: 0,
          ...theme.shadow.lg,
        };
    }
  };

  const getTextColor = () => {
    if (disabled || loading) return theme.colors.text.muted;
    if (textColor) return textColor;

    switch (variant) {
      case 'primary':
      case 'destructive':
        return theme.colors.text.primary;
      case 'secondary':
        return theme.colors.text.primary;
      case 'outline':
        return theme.colors.brand[500];
      case 'ghost':
        return theme.colors.text.secondary;
    }
  };

  const finalStyle: ViewStyle = {
    ...getVariantStyle(),
    ...getSizeStyle(),
    ...(rounded && size !== 'fab' ? { borderRadius: theme.radius.full } : {}),
    ...(fullWidth ? { alignSelf: 'stretch' } : {}),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled && !loading ? 0.6 : 1,
    ...style,
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size='small' color={getTextColor()} />;
    }

    if (size === 'fab') {
      return icon;
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
        }}
      >
        {icon && iconPosition === 'left' && icon}
        {children && (
          <Typography
            variant='body'
            weight={textWeight}
            style={{ color: getTextColor(), ...textStyle }}
          >
            {children}
          </Typography>
        )}
        {icon && iconPosition === 'right' && icon}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={finalStyle}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
