import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function RegisterScreen() {
  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <Text className="text-2xl font-bold text-text-primary mb-8">
        Create Account
      </Text>
      
      <View className="w-full space-y-4">
        <Text className="text-text-secondary text-center">
          Registration form will go here
        </Text>
        
        <Link href="/(auth)/welcome" className="mt-8">
          <Text className="text-brand-500 text-center">
            ← Back to Welcome
          </Text>
        </Link>
      </View>
    </View>
  );
}