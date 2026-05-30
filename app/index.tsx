import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/auth.store';

export default function IndexScreen() {
  // TODO: FIX THIS LATER, FOR NOW IT'S ALWAYS AUTHENTICATED
  // const { token, status, initializeAuth } = useAuthStore();

  // Initialize auth on app start
  // useEffect(() => {
  //   initializeAuth();
  // }, []);

  // Show loading state while checking auth
  // if (status === 'loading') {
  //   return null; // You could show a splash screen here
  // }

  const status = 'authenticated';
  const token = '123';

  // Redirect based on authentication status
  if (token && status === 'authenticated') {
    return <Redirect href='/(app)/groups' />;
  }

  return <Redirect href='/(auth)/welcome' />;
}
