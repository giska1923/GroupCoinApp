import { View, Text } from 'react-native';

export default function AccountScreen() {
  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      <Text className="text-2xl font-bold text-text-primary mb-4">
        Account
      </Text>
      <Text className="text-text-secondary text-center">
        Account settings and profile management
      </Text>
    </View>
  );
}