import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { CustomTabBar } from '../../src/components/navigation/CustomTabBar';

export default function AppLayout() {
  // Auth guard - redirect to welcome if no token.
  // TODO: wire to useAuthStore once the auth flow is connected to the backend.
  const token = true;

  if (!token) {
    return <Redirect href='/(auth)/welcome' />;
  }

  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name='groups' options={{ title: 'Home' }} />
      <Tabs.Screen name='expenses' options={{ title: 'Expenses' }} />
      <Tabs.Screen name='activity' options={{ title: 'Activity' }} />
      <Tabs.Screen name='account' options={{ title: 'Account' }} />
    </Tabs>
  );
}
