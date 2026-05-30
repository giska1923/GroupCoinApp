import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.colors.financialNegative
    : focused
      ? theme.colors.brand[500]
      : theme.colors.surface.border;

  return (
    <View style={[{ gap: theme.spacing.sm }, containerStyle]}>
      {label && (
        <Typography variant='caption' color='secondary' weight='medium'>
          {label}
        </Typography>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: theme.components.input.height,
          paddingHorizontal: theme.spacing.lg,
          gap: theme.spacing.md,
          backgroundColor: theme.colors.surface.secondary,
          borderRadius: theme.components.input.radius,
          borderWidth: 1,
          borderColor,
        }}
      >
        {leftIcon}
        <TextInput
          style={{
            flex: 1,
            color: theme.colors.text.primary,
            fontSize: theme.fontSize.md,
            paddingVertical: 0,
          }}
          placeholderTextColor={theme.colors.text.muted}
          selectionColor={theme.colors.brand[400]}
          onFocus={e => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon &&
          (onRightIconPress ? (
            <TouchableOpacity onPress={onRightIconPress} hitSlop={8}>
              {rightIcon}
            </TouchableOpacity>
          ) : (
            rightIcon
          ))}
      </View>

      {(error || hint) && (
        <Typography
          variant='label'
          color={error ? 'negative' : 'muted'}
          style={{ paddingHorizontal: theme.spacing.xs }}
        >
          {error || hint}
        </Typography>
      )}
    </View>
  );
};
