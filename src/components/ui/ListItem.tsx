import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

interface ListItemProps {
  title: string;
  subtitle?: string;
  /** Leading element, typically an icon or avatar. */
  leading?: React.ReactNode;
  /** Trailing element. Defaults to a chevron when `onPress` is set. */
  trailing?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  /** Render as the only/first/last/middle item to control divider + radius. */
  divider?: boolean;
  style?: ViewStyle;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leading,
  trailing,
  showChevron,
  onPress,
  divider = false,
  style,
}) => {
  const theme = useTheme();

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        minHeight: theme.components.listItem.minHeight,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: divider ? 1 : 0,
        borderBottomColor: theme.colors.surface.border,
        ...style,
      }}
    >
      {leading && (
        <View
          style={{
            width: theme.components.avatar.md,
            height: theme.components.avatar.md,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.surface.tertiary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {leading}
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Typography variant='body' color='primary' weight='medium'>
          {title}
        </Typography>
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

      {trailing}
      {!trailing && (showChevron ?? !!onPress) && (
        <ChevronRight size={20} color={theme.colors.text.muted} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};
