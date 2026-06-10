import React from 'react';
import { View } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { useAuthStore } from '../../src/stores/auth.store';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Spinner } from '../../src/components/feedback';
import { useInvitationsRealtime } from '../../src/hooks';
import {
  CustomTabBar,
  type TabBarProps,
} from '../../src/components/navigation/CustomTabBar';

export default function AppLayout() {
  const theme = useTheme();
  const token = useAuthStore(s => s.token);
  const status = useAuthStore(s => s.status);

  useInvitationsRealtime();

  // Still reading the persisted session — hold before deciding.
  if (status === 'loading') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.surface.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spinner />
      </View>
    );
  }

  if (!token) {
    return <Redirect href='/(auth)/welcome' />;
  }

  return (
    <Tabs
      tabBar={props => (
        <CustomTabBar {...(props as unknown as TabBarProps)} />
      )}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name='groups' options={{ title: 'Home' }} />
      <Tabs.Screen name='expenses' options={{ title: 'Expenses' }} />
      <Tabs.Screen name='activity' options={{ title: 'Activity' }} />
      <Tabs.Screen name='account' options={{ title: 'Account' }} />
    </Tabs>
  );
}
