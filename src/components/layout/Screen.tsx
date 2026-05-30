import React from 'react';
import {
  View,
  ViewStyle,
  ScrollView,
  ScrollViewProps,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

type ScreenVariant = 'scroll' | 'fixed';
type ScreenPadding = 'none' | 'sm' | 'md' | 'lg';

interface ScreenProps {
  variant?: ScreenVariant;
  padding?: ScreenPadding;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  showStatusBar?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
  children: React.ReactNode;
  scrollViewProps?: Omit<
    ScrollViewProps,
    'children' | 'style' | 'contentContainerStyle'
  >;
}

export const Screen: React.FC<ScreenProps> = ({
  variant = 'scroll',
  padding = 'lg',
  style,
  contentContainerStyle,
  showStatusBar = true,
  statusBarStyle = 'light-content', // For dark theme
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

  const baseStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.surface.primary,
  };

  const containerStyle: ViewStyle = {
    ...baseStyle,
    ...style,
  };

  const contentStyle: ViewStyle = {
    ...getPaddingStyle(),
    ...contentContainerStyle,
  };

  const renderContent = () => {
    if (variant === 'scroll') {
      return (
        <ScrollView
          style={containerStyle}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={containerStyle}>
        <View style={contentStyle}>{children}</View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.surface.primary }}
    >
      {showStatusBar && (
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={theme.colors.surface.primary}
          translucent={false}
        />
      )}
      {renderContent()}
    </SafeAreaView>
  );
};
