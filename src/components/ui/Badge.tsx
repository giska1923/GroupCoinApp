import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

type BadgeTone = 'brand' | 'positive' | 'negative' | 'warning' | 'neutral';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  tone = 'neutral',
  style,
}) => {
  const theme = useTheme();

  const palette: Record<BadgeTone, { bg: string; fg: string }> = {
    brand: { bg: theme.colors.brand[950], fg: theme.colors.brand[300] },
    positive: {
      bg: theme.colors.success.bg,
      fg: theme.colors.financialPositive,
    },
    negative: { bg: theme.colors.error.bg, fg: theme.colors.financialNegative },
    warning: { bg: theme.colors.warning.bg, fg: theme.colors.financialWarning },
    neutral: {
      bg: theme.colors.surface.tertiary,
      fg: theme.colors.text.secondary,
    },
  };

  const { bg, fg } = palette[tone];

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: bg,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.radius.full,
        ...style,
      }}
    >
      <Typography variant='label' weight='semibold' style={{ color: fg }}>
        {label}
      </Typography>
    </View>
  );
};
