import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from '../ui/Typography';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  /** `brand` = large lavender app title (Equinox Flow style). */
  titleTone?: 'default' | 'brand';
  /** Show a leading nav button. `back` = chevron, `close` = X, `none` = nothing. */
  leading?: 'back' | 'close' | 'none';
  onLeadingPress?: () => void;
  right?: React.ReactNode;
  align?: 'left' | 'center';
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  titleTone = 'default',
  leading = 'back',
  onLeadingPress,
  right,
  align = 'center',
  style,
}) => {
  const theme = useTheme();

  const handleLeading = () => {
    if (onLeadingPress) return onLeadingPress();
    if (router.canGoBack()) router.back();
  };

  const LeadingIcon = leading === 'close' ? X : ChevronLeft;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        ...style,
      }}
    >
      <View
        style={{
          width: leading === 'none' ? 0 : 40,
          alignItems: 'flex-start',
        }}
      >
        {leading !== 'none' && (
          <TouchableOpacity
            onPress={handleLeading}
            hitSlop={8}
            style={{
              width: 40,
              height: 40,
              borderRadius: theme.radius.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.surface.secondary,
            }}
          >
            <LeadingIcon size={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flex: 1, alignItems: align === 'center' ? 'center' : 'flex-start' }}>
        {title && (
          <Typography
            variant={titleTone === 'brand' ? 'title' : 'subheading'}
            color={titleTone === 'brand' ? 'accent' : 'primary'}
            weight={titleTone === 'brand' ? 'bold' : 'semibold'}
            numberOfLines={1}
          >
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant='caption' color='secondary' numberOfLines={1}>
            {subtitle}
          </Typography>
        )}
      </View>

      <View style={{ minWidth: 40, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
};
