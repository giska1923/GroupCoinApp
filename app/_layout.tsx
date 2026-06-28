import { View } from 'react-native';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {
  useFonts,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { colors } from '../src/theme/tokens';
import { queryClient } from '../src/api/queryClient';
import { configureForegroundNotificationHandler } from '../src/notifications';
import { configureGoogleSignin } from '../src/auth/google';

export default function RootLayout() {
  useEffect(() => {
    void configureForegroundNotificationHandler();
    configureGoogleSignin();
  }, []);

  // Outfit is used only for the brand logo wordmark; the rest of the app keeps
  // the system font. Hold the first render until the font is ready so the logo
  // doesn't flash in a fallback face.
  const [fontsLoaded] = useFonts({
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  if (!fontsLoaded) {
    // Match the native splash / JS SplashScreen black so startup doesn't flash.
    return <View style={{ flex: 1, backgroundColor: '#000000' }} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider>
          <StatusBar style='light' />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.surface.primary },
            }}
          >
            <Stack.Screen name='index' />
            <Stack.Screen name='(auth)' />
            <Stack.Screen name='(app)' />
            <Stack.Screen name='+not-found' />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
