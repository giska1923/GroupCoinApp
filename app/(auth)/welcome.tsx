import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <View className="items-center mb-12">
        <Text className="text-4xl font-bold text-brand-500 mb-4">
          GroupCoin
        </Text>
        <Text className="text-lg text-text-secondary text-center">
          Split expenses with friends and family
        </Text>
      </View>
      
      <View className="w-full space-y-4">
        <Link 
          href="/(auth)/login" 
          className="bg-brand-500 py-4 px-8 rounded-lg"
        >
          <Text className="text-white text-lg font-semibold text-center">
            Sign In
          </Text>
        </Link>
        
        <Link 
          href="/(auth)/register"
          className="border border-brand-500 py-4 px-8 rounded-lg"
        >
          <Text className="text-brand-500 text-lg font-semibold text-center">
            Create Account
          </Text>
        </Link>
      </View>
    </View>
  );
}