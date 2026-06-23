import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/auth.store';
import { SplashScreen } from '../src/components/feedback';

export default function IndexScreen() {
  const token = useAuthStore(s => s.token);
  const status = useAuthStore(s => s.status);
  const initializeAuth = useAuthStore(s => s.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (status === 'loading') {
    return <SplashScreen />;
  }

  if (token) {
    return <Redirect href='/(app)/groups' />;
  }

  return <Redirect href='/(auth)/welcome' />;
}
