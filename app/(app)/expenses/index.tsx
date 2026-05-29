import { View, Text } from 'react-native';

export default function ExpensesScreen() {
  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      <Text className="text-2xl font-bold text-text-primary mb-4">
        Expenses
      </Text>
      <Text className="text-text-secondary text-center">
        Recent expenses across all groups will appear here
      </Text>
    </View>
  );
}