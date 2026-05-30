import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: ViewStyle;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.surface.secondary,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        borderColor: theme.colors.surface.border,
        padding: theme.spacing.xs,
        gap: theme.spacing.xs,
        ...style,
      }}
    >
      {options.map(option => {
        const active = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.7}
            onPress={() => onChange(option.value)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.radius.full,
              backgroundColor: active
                ? theme.colors.brand[500]
                : 'transparent',
            }}
          >
            <Typography
              variant='caption'
              weight={active ? 'semibold' : 'medium'}
              style={{
                color: active
                  ? theme.colors.text.primary
                  : theme.colors.text.secondary,
              }}
            >
              {option.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
