import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../src/theme/ThemeProvider';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style='light' />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='(auth)' />
        <Stack.Screen name='(app)' />
        <Stack.Screen name='+not-found' />
      </Stack>
    </ThemeProvider>
  );
}
