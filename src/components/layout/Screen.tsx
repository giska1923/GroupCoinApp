import React from 'react';
import {
  View,
  ViewStyle,
  ScrollView,
  ScrollViewProps,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';

type ScreenVariant = 'scroll' | 'fixed';
type ScreenPadding = 'none' | 'sm' | 'md' | 'lg';

interface ScreenProps {
  variant?: ScreenVariant;
  padding?: ScreenPadding;
  /** Safe-area edges to inset. Bottom is usually owned by the tab bar. */
  edges?: Edge[];
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
  scrollViewProps?: Omit<
    ScrollViewProps,
    'children' | 'style' | 'contentContainerStyle' | 'refreshControl'
  >;
}

export const Screen: React.FC<ScreenProps> = ({
  variant = 'scroll',
  padding = 'lg',
  edges = ['top', 'left', 'right'],
  style,
  contentContainerStyle,
  refreshing,
  onRefresh,
  children,
  scrollViewProps,
}) => {
  const theme = useTheme();

  const getPaddingStyle = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return {};
      case 'sm':
        return { padding: theme.spacing.sm };
      case 'md':
        return { padding: theme.spacing.md };
      case 'lg':
        return { padding: theme.spacing.lg };
    }
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.surface.primary,
    ...style,
  };

  const contentStyle: ViewStyle = {
    ...getPaddingStyle(),
    ...contentContainerStyle,
  };

  return (
    <SafeAreaView
      edges={edges}
      style={{ flex: 1, backgroundColor: theme.colors.surface.primary }}
    >
      {variant === 'scroll' ? (
        <ScrollView
          style={containerStyle}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={!!refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.brand[400]}
                colors={[theme.colors.brand[500]]}
              />
            ) : undefined
          }
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={containerStyle}>
          <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
        </View>
      )}
    </SafeAreaView>
  );
};
