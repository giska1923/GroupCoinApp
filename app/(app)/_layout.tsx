import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Users, FileText, User } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function AppLayout() {
  const theme = useTheme();
  // Auth guard - redirect to welcome if no token
  const token = true;

  if (!token) {
    return <Redirect href='/(auth)/welcome' />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand[500],
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface.secondary,
          borderTopColor: theme.colors.surface.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.medium,
        },
      }}
    >
      <Tabs.Screen
        name='groups'
        options={{
          title: 'Groups',
          tabBarIcon: ({ color, size }) => <Users size={size} />,
        }}
      />
      <Tabs.Screen
        name='expenses'
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color, size }) => <FileText size={size} />,
        }}
      />
      <Tabs.Screen
        name='account'
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <User size={size} />,
        }}
      />
    </Tabs>
  );
}
