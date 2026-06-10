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
  /** Stretch to fill an equal share of the parent row. */
  equalWidth?: boolean;
  /** `split` uses outlined chips for expense participant pickers. */
  variant?: 'default' | 'split';
  onPress?: () => void;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  leading,
  showCheckWhenSelected = true,
  equalWidth = false,
  variant = 'default',
  onPress,
  style,
}) => {
  const theme = useTheme();

  const isSplit = variant === 'split';

  const backgroundColor = isSplit
    ? selected
      ? theme.colors.brand[900]
      : 'rgba(34, 34, 43, 0.55)'
    : selected
      ? theme.colors.brand[500]
      : theme.colors.surface.secondary;

  const borderColor = isSplit
    ? selected
      ? theme.colors.brand[500]
      : theme.colors.surface.border
    : selected
      ? theme.colors.brand[500]
      : theme.colors.surface.border;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: equalWidth ? 'center' : 'flex-start',
        gap: theme.spacing.xs,
        height: theme.components.chip.height,
        paddingHorizontal: equalWidth ? theme.spacing.sm : theme.spacing.lg,
        borderRadius: theme.components.chip.radius,
        borderWidth: 1,
        backgroundColor,
        borderColor,
        overflow: 'hidden',
        ...(equalWidth ? { flex: 1, minWidth: 0 } : { maxWidth: '100%' }),
        ...style,
      }}
    >
      {leading}
      <View
        style={{
          flexShrink: 1,
          minWidth: 0,
          ...(equalWidth ? { flex: 1 } : null),
        }}
      >
        <Typography
          variant={equalWidth ? 'body' : 'caption'}
          weight='semibold'
          numberOfLines={1}
          ellipsizeMode='tail'
          style={{
            color: selected
              ? theme.colors.text.primary
              : theme.colors.text.secondary,
          }}
        >
          {label}
        </Typography>
      </View>
      {selected && showCheckWhenSelected && (
        <View style={{ flexShrink: 0 }}>
          <Check size={14} color={theme.colors.text.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};
