import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/auth.store';
import { useTheme } from '../src/theme/ThemeProvider';
import { Spinner } from '../src/components/feedback';

export default function IndexScreen() {
  const theme = useTheme();
  const token = useAuthStore(s => s.token);
  const status = useAuthStore(s => s.status);
  const initializeAuth = useAuthStore(s => s.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

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

  if (token) {
    return <Redirect href='/(app)/groups' />;
  }

  return <Redirect href='/(auth)/welcome' />;
}
