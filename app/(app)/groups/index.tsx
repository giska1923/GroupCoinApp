import { View, Text } from 'react-native';

export default function GroupsScreen() {
  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      <Text className="text-2xl font-bold text-text-primary mb-4">
        Groups
      </Text>
      <Text className="text-text-secondary text-center">
        Your groups will appear here. Create your first group to get started!
      </Text>
    </View>
  );
}