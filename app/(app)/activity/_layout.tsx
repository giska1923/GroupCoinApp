import { Stack } from 'expo-router';
import { colors } from '../../../src/theme/tokens';

export default function ActivityLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface.primary },
      }}
    >
      <Stack.Screen name='index' />
    </Stack>
  );
}
