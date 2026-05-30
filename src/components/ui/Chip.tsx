import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

interface ChipProps {
  label: string;
  selected?: boolean;
  leading?: React.ReactNode;
  showCheckWhenSelected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  leading,
  showCheckWhenSelected = true,
  onPress,
  style,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        height: theme.components.chip.height,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.components.chip.radius,
        borderWidth: 1,
        backgroundColor: selected
          ? theme.colors.brand[500]
          : theme.colors.surface.secondary,
        borderColor: selected
          ? theme.colors.brand[500]
          : theme.colors.surface.border,
        ...style,
      }}
    >
      {leading}
      <Typography
        variant='caption'
        weight='medium'
        style={{
          color: selected
            ? theme.colors.text.primary
            : theme.colors.text.secondary,
        }}
      >
        {label}
      </Typography>
      {selected && showCheckWhenSelected && (
        <View style={{ marginLeft: 2 }}>
          <Check size={14} color={theme.colors.text.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};
