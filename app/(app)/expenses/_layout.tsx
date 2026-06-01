import { Stack } from 'expo-router';
import { colors } from '../../../src/theme/tokens';

export default function ExpensesLayout() {
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
