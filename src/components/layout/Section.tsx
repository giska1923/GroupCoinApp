import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from '../ui/Typography';
import { ChevronRight } from 'lucide-react-native';

interface SectionProps {
  title?: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  action,
  showSeeAll = false,
  onSeeAllPress,
  spacing = 'lg',
  style,
  children,
}) => {
  const theme = useTheme();

  const getSpacing = () => {
    switch (spacing) {
      case 'sm':
        return theme.spacing.sm;
      case 'md':
        return theme.spacing.md;
      case 'lg':
        return theme.spacing.lg;
      case 'xl':
        return theme.spacing.xl;
    }
  };

  const hasHeader = title || subtitle || action || showSeeAll;

  return (
    <View style={[{ gap: getSpacing() }, style]}>
      {hasHeader && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme.spacing.sm,
          }}
        >
          <View style={{ flex: 1 }}>
            {title && (
              <Typography variant='heading' color='primary' weight='semibold'>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant='caption'
                color='secondary'
                style={{ marginTop: 2 }}
              >
                {subtitle}
              </Typography>
            )}
          </View>

          {(action || showSeeAll) && (
            <TouchableOpacity
              onPress={action?.onPress || onSeeAllPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.xs,
                paddingVertical: theme.spacing.xs,
                paddingLeft: theme.spacing.sm,
              }}
              activeOpacity={0.7}
            >
              <Typography variant='caption' color='accent' weight='medium'>
                {action?.label || 'See All'}
              </Typography>
              <ChevronRight size={16} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View>{children}</View>
    </View>
  );
};
