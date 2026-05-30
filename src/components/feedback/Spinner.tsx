import React from 'react';
import { ActivityIndicator, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface SpinnerProps {
  size?: 'small' | 'large';
  fill?: boolean;
  style?: ViewStyle;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'large',
  fill = false,
  style,
}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        fill && {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing['3xl'],
        },
        style,
      ]}
    >
      <ActivityIndicator size={size} color={theme.colors.brand[400]} />
    </View>
  );
};
