import { Stack } from 'expo-router';
import { colors } from '../../../../src/theme/tokens';

export default function GroupDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface.primary },
      }}
    >
      <Stack.Screen name='index' />
      <Stack.Screen
        name='add-expense'
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name='edit'
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack>
  );
}
