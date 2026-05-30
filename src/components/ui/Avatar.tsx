import React from 'react';
import { View, ViewStyle, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
type StatusRingColor =
  | 'positive'
  | 'negative'
  | 'warning'
  | 'neutral'
  | 'accent';

interface AvatarProps {
  size?: AvatarSize;
  source?: ImageSourcePropType;
  initials?: string;
  backgroundColor?: string;
  showStatusRing?: boolean;
  statusRingColor?: StatusRingColor;
  statusRingProgress?: number; // 0-1 for partial rings
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  source,
  initials,
  backgroundColor,
  showStatusRing = false,
  statusRingColor = 'accent',
  statusRingProgress = 1,
  style,
}) => {
  const theme = useTheme();

  const getSizeValue = (): number => {
    switch (size) {
      case 'sm':
        return theme.components.avatar.sm;
      case 'md':
        return theme.components.avatar.md;
      case 'lg':
        return theme.components.avatar.lg;
      case 'xl':
        return theme.components.avatar.xl;
    }
  };

  const getInitialsFontSize = (): number => {
    const sizeValue = getSizeValue();
    return sizeValue * 0.4; // 40% of avatar size
  };

  const getStatusRingColor = (): string => {
    switch (statusRingColor) {
      case 'positive':
        return theme.colors.financialPositive;
      case 'negative':
        return theme.colors.financialNegative;
      case 'warning':
        return theme.colors.financialWarning;
      case 'neutral':
        return theme.colors.text.muted;
      case 'accent':
        return theme.colors.brand[500];
    }
  };

  const avatarSize = getSizeValue();
  const ringThickness = 3;
  const ringSize = avatarSize + ringThickness * 4;

  const avatarStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: backgroundColor || theme.colors.surface.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const containerStyle: ViewStyle = {
    width: showStatusRing ? ringSize : avatarSize,
    height: showStatusRing ? ringSize : avatarSize,
    justifyContent: 'center',
    alignItems: 'center',
    ...style,
  };

  const StatusRing = () => {
    if (!showStatusRing) return null;

    return (
      <View
        style={{
          position: 'absolute',
          width: ringSize,
          height: ringSize,
          borderRadius: ringSize / 2,
          borderWidth: ringThickness,
          borderColor: getStatusRingColor(),
          opacity: 0.8,
        }}
      />
    );
  };

  const renderContent = () => {
    if (source) {
      return (
        <Image
          source={source}
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          }}
          resizeMode='cover'
        />
      );
    }

    if (initials) {
      return (
        <Typography
          variant='body'
          color='primary'
          weight='semibold'
          style={{
            fontSize: getInitialsFontSize(),
          }}
        >
          {initials.slice(0, 2).toUpperCase()}
        </Typography>
      );
    }

    // Default placeholder
    return (
      <View
        style={{
          width: avatarSize * 0.6,
          height: avatarSize * 0.6,
          backgroundColor: theme.colors.text.muted,
          borderRadius: (avatarSize * 0.6) / 2,
        }}
      />
    );
  };

  return (
    <View style={containerStyle}>
      <StatusRing />
      <View style={avatarStyle}>{renderContent()}</View>
    </View>
  );
};
