import React from 'react';
import { Switch as RNSwitch, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled,
}) => {
  const theme = useTheme();

  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: theme.colors.surface.border,
        true: theme.colors.brand[500],
      }}
      thumbColor={
        Platform.OS === 'android'
          ? value
            ? theme.colors.text.primary
            : theme.colors.text.secondary
          : undefined
      }
      ios_backgroundColor={theme.colors.surface.border}
    />
  );
};
