import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Home, Receipt, Activity, User, Plus } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from '../ui/Typography';

type TabIcon = React.ComponentType<{ size?: number; color?: string }>;

/**
 * Minimal shape of the props the Tabs navigator hands to `tabBar`.
 * (Avoids a hard dependency on @react-navigation types.)
 */
export interface TabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: {
    navigate: (name: string) => void;
    emit: (event: {
      type: 'tabPress';
      target: string;
      canPreventDefault: boolean;
    }) => { defaultPrevented: boolean };
  };
}

const ICONS: Record<string, TabIcon> = {
  groups: Home,
  expenses: Receipt,
  activity: Activity,
  account: User,
  'expenses/index': Receipt,
  'activity/index': Activity,
  'account/index': User,
};

const LABELS: Record<string, string> = {
  groups: 'Home',
  expenses: 'Expenses',
  activity: 'Activity',
  account: 'Account',
  'expenses/index': 'Expenses',
  'activity/index': 'Activity',
  'account/index': 'Account',
};

/** Action triggered by the central FAB. */
const FAB_HREF = '/(app)/groups/new';

export const CustomTabBar: React.FC<TabBarProps> = ({ state, navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const renderTab = (routeKey: string, routeName: string, index: number) => {
    const isFocused = state.index === index;
    const IconComponent = ICONS[routeName] ?? Home;
    const color = isFocused
      ? theme.colors.brand[400]
      : theme.colors.text.muted;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: routeKey,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(routeName);
      }
    };

    return (
      <TouchableOpacity
        key={routeKey}
        accessibilityRole='button'
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          paddingVertical: theme.spacing.sm,
        }}
      >
        <IconComponent size={22} color={color} />
        <Typography
          variant='label'
          weight={isFocused ? 'semibold' : 'medium'}
          style={{ color }}
        >
          {LABELS[routeName] ?? routeName}
        </Typography>
      </TouchableOpacity>
    );
  };

  type TabRoute = { key: string; name: string };
  const routes = state.routes as TabRoute[];
  const mid = Math.ceil(routes.length / 2);
  const leftRoutes = routes.slice(0, mid);
  const rightRoutes = routes.slice(mid);

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface.secondary,
        borderTopWidth: 1,
        borderTopColor: theme.colors.surface.border,
        paddingBottom: insets.bottom,
        ...theme.shadow.lg,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: theme.components.tabBar.height,
          paddingHorizontal: theme.spacing.sm,
        }}
      >
        {leftRoutes.map((route: TabRoute, i: number) =>
          renderTab(route.key, route.name, i),
        )}

        <View style={{ width: theme.components.tabBar.fab + theme.spacing.lg }}>
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              top: -theme.components.tabBar.fab / 2,
            }}
          >
            <TouchableOpacity
              accessibilityRole='button'
              accessibilityLabel='Create'
              activeOpacity={0.85}
              onPress={() => router.push(FAB_HREF)}
              style={{
                width: theme.components.tabBar.fab,
                height: theme.components.tabBar.fab,
                borderRadius: theme.components.tabBar.fab / 2,
                backgroundColor: theme.colors.brand[500],
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 4,
                borderColor: theme.colors.surface.primary,
                ...theme.shadow.lg,
              }}
            >
              <Plus size={26} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {rightRoutes.map((route: TabRoute, i: number) =>
          renderTab(route.key, route.name, mid + i),
        )}
      </View>
    </View>
  );
};
