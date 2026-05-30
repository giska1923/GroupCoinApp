import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/auth.store';

export default function IndexScreen() {
  const { token, status, initializeAuth } = useAuthStore();

  // Initialize auth on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  // Show loading state while checking auth
  if (status === 'loading') {
    return null; // You could show a splash screen here
  }

  // Redirect based on authentication status
  if (token && status === 'authenticated') {
    return <Redirect href="/(app)/groups" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}