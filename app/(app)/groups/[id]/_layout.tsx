import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function GroupLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Groups',
        presentation: 'card',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Group Details',
        }}
      />
      <Stack.Screen
        name="balances"
        options={{
          title: 'Balances',
        }}
      />
      <Stack.Screen
        name="activity"
        options={{
          title: 'Activity',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="add-expense"
        options={{
          title: 'Add Expense',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="add-settlement"
        options={{
          title: 'Add Settlement',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="members"
        options={{
          title: 'Members',
        }}
      />
    </Stack>
  );
}