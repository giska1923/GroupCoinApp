import { Stack } from 'expo-router';
import { colors } from '../../../src/theme/tokens';

export default function GroupsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface.primary },
      }}
    >
      <Stack.Screen name='index' />
      <Stack.Screen
        name='new'
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name='[id]' />
    </Stack>
  );
}
