import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Avatar } from './Avatar';
import { Typography } from './Typography';

interface GroupAvatarProps {
  name: string;
  image?: string;
  memberCount?: number;
  status?: 'active' | 'inactive' | 'pending';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: ViewStyle;
}

export const GroupAvatar: React.FC<GroupAvatarProps> = ({
  name,
  image,
  memberCount,
  status = 'active',
  size = 'lg',
  onPress,
  style,
}) => {
  const theme = useTheme();

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'positive' as const;
      case 'inactive':
        return 'neutral' as const;
      case 'pending':
        return 'warning' as const;
    }
  };

  const getRandomColor = (name: string): string => {
    // Generate consistent color based on name
    const colors = [
      theme.colors.brand[400],
      theme.colors.financialPositive,
      theme.colors.financialWarning,
      '#8b5cf6', // purple
      '#06b6d4', // cyan
      '#10b981', // emerald
      '#f59e0b', // amber
      '#ef4444', // red
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const content = (
    <View style={[{ alignItems: 'center', gap: theme.spacing.sm }, style]}>
      <Avatar
        size={size}
        source={image ? { uri: image } : undefined}
        initials={getInitials(name)}
        backgroundColor={getRandomColor(name)}
        showStatusRing={true}
        statusRingColor={getStatusColor()}
      />

      <View style={{ alignItems: 'center', maxWidth: 80 }}>
        <Typography
          variant='caption'
          color='primary'
          weight='medium'
          style={{
            textAlign: 'center',
            lineHeight: theme.fontSize.sm * 1.2,
          }}
          numberOfLines={2}
        >
          {name}
        </Typography>

        {memberCount && (
          <Typography variant='label' color='muted' style={{ marginTop: 2 }}>
            {memberCount} member{memberCount !== 1 ? 's' : ''}
          </Typography>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          alignItems: 'center',
        }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};
